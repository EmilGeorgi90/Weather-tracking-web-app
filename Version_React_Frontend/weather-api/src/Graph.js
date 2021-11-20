import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default class Graph extends PureComponent {
    state = {
        opacity: {
            uv: 1,
            pv: 1,
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
                        const exits = obj.labels.filter((x) => x.CurrentTime === element.CurrentTime);
                        const tempData = result.filter((x) => x.CurrentTime === element.CurrentTime);
                        if (exits.length === 0) {
                            const tempJson = {};
                            for (let index = 0; index < tempData.length; index++) {
                                const dataRow = tempData[index];
                                tempJson[dataRow.City] = dataRow.Temperature
                            }
                            const tempDate = new Date(tempData[0].CurrentTime)
                            tempJson.CurrentTime = `${tempDate.getHours()}:${tempDate.getMinutes()}`
                            obj.citites.push(tempJson)
                            obj.labels.push({ CurrentTime: tempData[0].CurrentTime });
                        }
                    }
                    return obj;
                }
            )
    }
    componentDidMount() {
        const fetchUrl = "http://localhost/weatherapi/Version_plain/include/SearchCities.php";
        const postUrl = "http://localhost/weatherapi/Version_plain/include/Create.php?";
        const items = this.GetData(fetchUrl).then((response) => {
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
                        const sendingData = { temp: data.main.temp, city: data.name };
                        fetch(`${postUrl}temp=${sendingData.temp}&city=${sendingData.city}`).then(res => {
                            this.GetData(fetchUrl).then((response) => {
                                this.setState({
                                    isLoaded: true,
                                    items: response
                                });
                            });
                        });
                    })
            }
            this.setState({
                isLoaded: true,
                items
            });
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
        const { opacity, error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div style={{ width: '100%' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            width={500}
                            height={300}
                            data={items.citites}
                            margin={{
                                top: 30,
                                right: 30,
                                left: 20,
                                bottom: 100,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="CurrentTime" style={{'marginTop': '100px'}} />
                            {console.log(items.citites)}
                            <YAxis />
                            <Tooltip />
                            <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                            <Line type="monotone" dataKey={countries[0]} strokeOpacity={opacity.pv} stroke="rgb(255,105,180)" />
                            <Line type="monotone" dataKey={countries[1]} strokeOpacity={opacity.uv} stroke="rgb(0,0,139)" />
                            <Line type="monotone" dataKey={countries[2]} strokeOpacity={opacity.uv} stroke="rgb(128, 29, 215)" />
                            <Line type="monotone" dataKey={countries[3]} strokeOpacity={opacity.uv} stroke="rgb(0,0,0)" />
                            <Line type="monotone" dataKey={countries[4]} strokeOpacity={opacity.uv} stroke="rgb(255, 99, 132)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        }
    }
}