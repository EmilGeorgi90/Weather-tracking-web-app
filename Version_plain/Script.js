let temperatureGraph;
const countries = ['London', 'Moskva', 'New York', 'Tokyo', 'Bogota'];
const postDataUrl = "http://localhost/weatherapi/Version_plain/include/Create.php";
const fetchUrl = "http://localhost/weatherapi/Version_plain/include/SearchCities.php";
// const fetchUrl = "http://127.0.0.1:8000/api/weather";
// const postDataUrl = "http://127.0.0.1:8000/api/weather";
function createGraph(fecthUrl) {
    fetch(fecthUrl).then(function (response) {
        return response.text();
    }).then(function (responseData) {
        const data = JSON.parse(responseData);
        const temperatures = [];
        const labels = [];
        const obj = {
            citites: []
        };
        //rearranging data
        for (let index = 0; index < data.length; index++) {
            if (obj.citites.filter((citites) => { return citites.city == data[index].city }).length > 0) {
                let currCityIndex = obj.citites.findIndex((citites) => citites.city === data[index].city)
                obj.citites[currCityIndex].data.push({ date: data[index].created_at, temperature: data[index].temperature })
            }
            else {
                const currCititesIndex = obj.citites.push({ city: data[index].city })
                console.log(currCititesIndex - 1)
                obj.citites[currCititesIndex - 1].data = [];
                obj.citites[currCititesIndex - 1].data.push({ date: data[index].created_at, temperature: data[index].temperature })
            }
        }
        //splitting temperatures apart
        for (let i = 0; i < obj.citites.length; i++) {
            const tempTemperaturesArr = []
            for (let index = 0; index < obj.citites[i].data.length; index++) {
                const element = obj.citites[i].data[index];
                tempTemperaturesArr.push(`${element.temperature}`)
            }
            temperatures.push(tempTemperaturesArr);
        }
        //format data for graph
        for (let index = 0; index < obj.citites[0].data.length; index++) {
            const element = obj.citites[0].data[index];
            const tempDate = new Date(element.date)
            labels.push(`${tempDate.getHours()}:${tempDate.getMinutes()}`)
        }
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        const formattedDateset = [];
        for (let index = 0; index < obj.citites.length; index++) {
            const colors = `rgb(${getRandomInt(256)},${getRandomInt(256)},${getRandomInt(256)})`;
            const element = obj.citites[index];
            formattedDateset.push({ label: element.city, data: temperatures[index], borderColor: colors, backgroundColor: colors })
        }
        const chart = {
            labels: labels,
            datasets: formattedDateset
        };
        const config = {
            type: 'line',
            data: chart,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: `temperatures in big cities the last 24 hours, ${new Date().toLocaleDateString('en-US')}`
                    }
                }
            },
        };
        if (temperatureGraph !== undefined) {
            temperatureGraph.destroy();
        }
        temperatureGraph = new Chart(
            document.getElementById('temperatureGraph'),
            config
        );
    })
}

createGraph(fetchUrl);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    console.log('data stored');
    sleep(8000).then(() => {
        createGraph(fetchUrl);
    })
    //3600000 = 1 hour
    //60000 1 minute for testing
}, 1800000);