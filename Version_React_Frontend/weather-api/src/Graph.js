import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default class Graph extends PureComponent {
    state = {
        isLoaded: false,
        items: [],
        error: null,
    };
    GetData = (fetchUrl) => {
        return fetch(fetchUrl, { 'Access-Control-Allow-Origin': '*', 'origin': 'x-requested-with' })
            .then(res => res.json())
            .then(
                (result) => {
                    const obj = {
                        citites: [],
                        labels: []
                    };
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        const tempDate = new Date(element.created_at)
                        const searchTime = `${tempDate.getHours()}:${tempDate.getMinutes()}`;
                        const exits = obj.labels.filter((x) => x.created_at === searchTime);
                        const tempData = result.filter((x) => x.created_at === element.created_at);
                        if (exits.length === 0) {
                            const tempJson = {};
                            for (let index = 0; index < tempData.length; index++) {
                                const dataRow = tempData[index];
                                tempJson[dataRow.city] = dataRow.temperature;
                            }
                            tempJson.created_at = searchTime;
                            obj.citites.push(tempJson);
                            obj.labels.push({ created_at: searchTime });
                        }
                    }
                    return obj;
                }
            )
    }

    componentDidMount() {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
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
            const currTime = new Date();
            for (let index = 0; index < countries.length; index++) {
                const element = countries[index];
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${element}&units=metric&appid=77ad54dbd78f34218fa7c02a8e81fc9b`)
                    .then((response) => {
                        return response.json();
                    }).then((data) => {
                        const sendingData = { temperature: data.main.temp, city: data.name, created_at: currTime };
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", postDataUrl, true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify(sendingData));
                    })
            }
            sleep(8000).then(() => {
                this.GetData(fetchUrl).then((response) => {
                    this.setState({
                        isLoaded: true,
                        items: response
                    });
                })
            })
            //3600000 = 1 hour
            //60000 = 1 minute for testing
        }, 1800000);
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    colors = [`rgb(${this.getRandomInt(256)},${this.getRandomInt(256)},${this.getRandomInt(256)})`,
              `rgb(${this.getRandomInt(256)},${this.getRandomInt(256)},${this.getRandomInt(256)})`,
              `rgb(${this.getRandomInt(256)},${this.getRandomInt(256)},${this.getRandomInt(256)})`,
              `rgb(${this.getRandomInt(256)},${this.getRandomInt(256)},${this.getRandomInt(256)})`,
              `rgb(${this.getRandomInt(256)},${this.getRandomInt(256)},${this.getRandomInt(256)})`
            ]

    render() {
        const countries = ['London', 'Moscow', 'New York', 'Tokyo', 'Bogota'];
        const { error, isLoaded, items } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            const temperatures = [];
            for (let index = 0; index < items.citites.length; index++) {
                const city = items.citites[index];
                const cityNames = Object.keys(city);
                for (let j = 0; j < cityNames.length; j++) {
                    const element = cityNames[j];
                    if (countries.includes(element)) {
                        temperatures.push(city[element]);
                    }
                }
            }
            return (
                <div style={{ width: '100%', height: '1920' }}>
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
                            <XAxis dataKey="created_at" interval="preserveStartEnd" />
                            <YAxis domain={[Math.round(Math.min(...temperatures).toFixed(2) - 5), Math.round(Math.max(...temperatures) + 5)]} />
                            <Tooltip />
                            <Legend />
                            {countries.map((value, index) => {
                                return <Line key={index} type="monotone" dataKey={countries[index]} strokeWidth={6} stroke={this.colors[index]} />
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        }
    }
}