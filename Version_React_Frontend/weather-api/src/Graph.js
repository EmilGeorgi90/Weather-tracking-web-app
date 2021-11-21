import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default class Graph extends PureComponent {
    state = {
        opacity: {
            Moskva: 1,
            NewYork: 1,
            london: 1,
            Tokyo: 1,
            Bogota: 1
        },
        isLoaded: false,
        items: [],
        error: null,
    };
    GetData = (fetchUrl) => {
        return fetch(fetchUrl, { 'Access-Control-Allow-Origin': '*' })
            .then(res => res.json())
            .then(
                (result) => {
                    const obj = {
                        citites: [],
                        labels: []
                    };
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        const exits = obj.labels.filter((x) => x.created_at === element.created_at);
                        const tempData = result.filter((x) => x.created_at === element.created_at);
                        if (exits.length === 0) {
                            const tempJson = {};
                            for (let index = 0; index < tempData.length; index++) {
                                const dataRow = tempData[index];
                                tempJson[dataRow.city] = dataRow.temperature
                            }
                            const tempDate = new Date(tempData[0].created_at)
                            tempJson.created_at = `${tempDate.getHours()}:${tempDate.getMinutes()}`
                            obj.citites.push(tempJson)
                            obj.labels.push({ created_at: tempData[0].created_at });
                        }
                    }
                    return obj;
                }
            )
    }

    componentDidMount() {
        const fetchUrl = "http://127.0.0.1:8000/api/weather";
        const postDataUrl = "http://127.0.0.1:8000/api/weather";
        // const fetchUrl = "http://localhost/weatherapi/Version_plain/include/SearchCities.php";
        // const postDataUrl = "http://localhost/weatherapi/Version_plain/include/Create.php?";
        this.GetData(fetchUrl).then((response) => {
            this.setState({
                isLoaded: true,
                items: response
            });
        });
        const countries = ['London', 'Moskva', 'New York', 'Tokyo', 'Bogota'];
        //Insert temperatures data from weather api in a set interval
        setInterval(() => {
            for (let index = 0; index < countries.length; index++) {
                const element = countries[index];
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${element}&units=metric&appid=77ad54dbd78f34218fa7c02a8e81fc9b`)
                    .then((response) => {
                        return response.json();
                    }).then((data) => {
                        const sendingData = { Temperature: data.main.temp, City: data.name };
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", postDataUrl, true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({
                            temperature: sendingData.Temperature, city: sendingData.City
                        }));
                    })
            }
            this.GetData(fetchUrl).then((response) => {
                this.setState({
                    isLoaded: true,
                    items: response
                });
            })
            //3600000 = 1 hour
            //set to 1 minute for testing
        }, 60000);
    }
    handleMouseEnter = (o) => {
        const { dataKey } = o;
        const { opacity } = this.state;

        this.setState({
            opacity: { ...opacity, [dataKey]: 0.5 },
        });
    };

    handleMouseLeave = (o) => {
        const { dataKey } = o;
        const { opacity } = this.state;

        this.setState({
            opacity: { ...opacity, [dataKey]: 1 },
        });
    };

    render() {
        const countries = ['London', 'Moscow', 'New York', 'Tokyo', 'Bogota'];
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div style={{ width: '100%' }}>
                    <ResponsiveContainer width="100%" height={700}>
                        <LineChart
                            width={500}
                            height={300}
                            data={items.citites}
                            margin={{
                                top: 70,
                                right: 70,
                                left: 70,
                                bottom: 100,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="created_at" style={{ 'marginTop': '100px' }} />
                            <YAxis />
                            <Tooltip />
                            <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                            <Line type="monotone" dataKey={countries[0]} strokeWidth={8} stroke="rgb(255,105,180)" />
                            <Line type="monotone" dataKey={countries[1]} strokeWidth={8} stroke="rgb(0,0,139)" />
                            <Line type="monotone" dataKey={countries[2]} strokeWidth={8} stroke="rgb(128, 29, 215)" />
                            <Line type="monotone" dataKey={countries[3]} strokeWidth={8} stroke="rgb(0,0,0)" />
                            <Line type="monotone" dataKey={countries[4]} strokeWidth={8} stroke="rgb(255, 99, 132)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        }
    }
}