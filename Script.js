function CreateGraph() {
    fetch('./include/SearchCities.php').then(function (response) {
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
            if (obj.citites.filter((citites) => { return citites.city == data[index].City }).length > 0) {
                let tempCityIndex = obj.citites.findIndex(function (citites) { return citites.city == data[index].City })
                obj.citites[tempCityIndex].data.push({ date: data[index].CurrentTime, temperature: data[index].Temperature })
            }
            else {
                obj.citites.push({ city: data[index].City })
                obj.citites[index].data = [];
                obj.citites[index].data.push({ date: data[index].CurrentTime, temperature: data[index].Temperature })
            }
        }
        //splitting temperatures apart
        for (let i = 0; i < obj.citites.length; i++) {
            const tempArr = []
            for (let index = 0; index < obj.citites[i].data.length; index++) {
                const element = obj.citites[i].data[index];
                tempArr.push(`${element.temperature}`)
            }
            temperatures.push(tempArr);
        }
        for (let index = 0; index < obj.citites[0].data.length; index++) {
            const element = obj.citites[0].data[index];
            const tempDate = new Date(element.date)
            labels.push(`${tempDate.getHours()}:${tempDate.getMinutes()}`)
        }
        const chart = {
            labels: labels,
            datasets: [
                {
                    label: obj.citites[0].city,
                    data: temperatures[0],
                    backgroundColor: 'rgb(255,105,180)',
                    borderColor: 'rgb(255,105,180)',
                },
                {
                    label: obj.citites[1].city,
                    data: temperatures[1],
                    backgroundColor: 'rgb(0,0,139)',
                    borderColor: 'rgb(0,0,139)',
                },
                {
                    label: obj.citites[2].city,
                    data: temperatures[2],
                    backgroundColor: 'rgb(128, 29, 215)',
                    borderColor: 'rgb(128, 29, 215)',
                },
                {
                    label: obj.citites[3].city,
                    data: temperatures[3],
                    backgroundColor: 'rgb(0,0,0)',
                    borderColor: 'rgb(0,0,0)',
                },
                {
                    label: obj.citites[4].city,
                    data: temperatures[4],
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                }
            ]
        };
        const config = {
            type: 'line',
            data: chart,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `temperatures in big cities the last 24 hours, ${new Date().toLocaleDateString('en-US')}`
                    }
                }
            },
        };
        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    })
}

CreateGraph();

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
                console.log(sendingData);
                fetch(`./include/Create.php?temp=${sendingData.temp}&city=${sendingData.city}`).then(res => {
                    CreateGraph();
                    console.log("Request complete! response:", res);
                });
            })
    }
    //set to 1 minute for testing
}, 60000);