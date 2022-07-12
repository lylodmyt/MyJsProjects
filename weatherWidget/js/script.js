let current = document.getElementById('current')
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function loadWeather(){

    current.innerHTML = `
        <div class="w-icon">
            <div class="loader"></div>
        </div>
    `;

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPosition)
    }else{
        alert('Geolocation is not available')
    }

    async function getPosition(position){
        let lat = position.coords.latitude
        let long = position.coords.longitude

        const server = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=6b7becc65cadab69c97348b8c2f1e8a9`
        const response = await fetch(server, {
            method: 'GET',
        })

        const responseResult = await response.json()
        if (response.ok){
            getWhether(responseResult)
        }
    }

}

function getWhether(data){
    let location = data.name
    let temp = Math.round(data.main.temp)
    let icon = data.weather[0].icon
    let alt = data.weather[0].description
    const date = new Date()
    let day = weekday[date.getDay()]


    current.innerHTML = `
        <div class="w-icon">
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${alt}">
        </div>
        <ul class="weather_info">
            <li><span class="temp">${temp}&#xb0;C</span></li>
            <li id="location">Location: ${location}</li>
            <li>Day: ${day}</li>
        </ul>
    `
}
if (current){
    loadWeather()
}
let updateWeather = setInterval(loadWeather, 1000*60*60)