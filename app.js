let searchLocationName;
let date = new Date();
let imperialUnit = "";
let index;
let unitIcon = document.getElementById("unitIcon");
let tempUnit = document.getElementById("tempUnit");
let searchInput = document.getElementById("search");
let currentTime = date.getTime();
const apiKey = "5a8794e0f4384d31a9985717240709";
let yesterdayTime = currentTime - (24 * 60 * 60 * 1000);
date.setTime(yesterdayTime);
date = date.toLocaleDateString();
document.getElementById("date").placeholder = `${date}`;

unitIcon.innerHTML = `<img  src="https://img.icons8.com/?size=100&id=0SIMPAbeFahi&format=png&color=000000"
    alt="mdo" width="32" height="32" class="rounded-circle">`;

unitSelected = (indexSelected) => {
    if (indexSelected === 1) {
        unitIcon.innerHTML = `<img  src="https://img.icons8.com/?size=100&id=0SIMPAbeFahi&format=png&color=000000"
        alt="mdo" width="32" height="32" class="rounded-circle">`;
        index = indexSelected;
        getLocation();

    } else if (indexSelected === 2) {
        unitIcon.innerHTML = `<img  src="https://img.icons8.com/?size=100&id=wBbFCxtvnYHT&format=png&color=000000"
        alt="mdo" width="32" height="32" class="rounded-circle">`;
        index = indexSelected;
        getLocation()
    }
}

setInterval(() => {
    let d = new Date();
    document.getElementById("locationTime").innerHTML = `${d.toDateString()} ${d.toLocaleTimeString()}`;
}, 1000)

setInterval(() => {
    fetchAPIs();
}, 900000)


getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

setMapLocation = (latitude, longitude) => {
    document.getElementById("map").innerHTML = `<iframe src="https://mapa.tutiempo.net/en/#${latitude};${longitude};9"
    scrolling="no" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"
    style="width:100%; height:332px; border-radius:18px; overflow:hidden;"></iframe>`
}

let locationCoord = "";
showPosition = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    locationCoord = latitude + "," + longitude;
    handleSearch();
    setMapLocation(latitude, longitude);
}
showError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchBtn").click();
    }
});

handleSearch = () => {
    searchLocationName = searchInput.value != "" ? searchInput.value : locationCoord;
    date = document.getElementById("date").value != "" ? document.getElementById("date").value : date;
    fetchAPIs();
}

fetchAPIs = () => {
    let result1;
    let result2;
    let result3;

    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchLocationName}&aqi=no`)
        .then(response => response.json())
        .then(result => {
            result1 = result;
            setupCurrentWeather(result1);
            setMapLocation(result1.location.lat, result.location.lon);
        })

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchLocationName}&days=3&aqi=no&alerts=yes`)
        .then(response => response.json())
        .then(result => {
            result2 = result;
            setupUpcomingForecast(result2);
        })

    fetch(`https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${searchLocationName}&dt=${date}`)
        .then(response => response.json())
        .then(result => {
            result3 = result;
            setupWeatherHistory(result3);

        })

}

refreshPage = () => {
    location.reload();
}

unitRequested = (object, unitIndex) => {
    if (index === 1) {
        imperialUnit = "km/h";
        if (unitIndex === 1) {
            return object.day.mintemp_c;
        } else if (unitIndex === 2) {
            return object.day.maxtemp_c;
        } else if (unitIndex === 3) {
            return object.feelslike_c;
        } else if (unitIndex === 4) {
            return object.current.wind_kph;
        } else if (unitIndex === 5) {
            return object.day.maxwind_kph;
        } else if (unitIndex === 6) {
            imperialUnit = "mm";
            return object.current.precip_mm;
        } else if (unitIndex === 7) {
            imperialUnit = "mm";
            return object.day.totalprecip_mm;
        }
        return object.temp_c;

    } else if (index === 2) {
        imperialUnit = "mph";
        if (unitIndex === 1) {
            return object.day.mintemp_f;
        } else if (unitIndex === 2) {
            return object.day.maxtemp_f;
        } else if (unitIndex === 3) {
            return object.feelslike_f;
        } else if (unitIndex === 4) {
            return object.current.wind_mph;
        } else if (unitIndex === 5) {
            return object.day.maxwind_mph;
        } else if (unitIndex === 6) {
            imperialUnit = "in";
            return object.current.precip_in;
        } else if (unitIndex === 7) {
            imperialUnit = "in";
            return object.day.totalprecip_in;
        }
        return object.temp_f;
    }
}

const dp = document.getElementById('date').setAttribute('max', date);
let searchBtn = document.getElementById('searchBtn').innerText = "Search";

setupCurrentWeather = (result) => {
    let currentLocation = document.getElementById("currentLocation");
    let raw = "";
    raw = `<img src="https://img.icons8.com/?size=100&id=BZhTcjGTwoBp&format=png&color=FFFFFF" alt="mdo" width="32" height="32" class="rounded-circle">
                <p id = "tempUnit" class="fw-bold mx-2 text-white d-flex align-items-end">${result.location.name}:<img src="${result.current.condition.icon}" alt="mdo"
                width="42" height="42" class="mx-2"> ${unitRequested(result.current, 0)}&deg</p>
                <button class="rounded-circle bg-transparent border-0" onclick="refreshPage()"><img src="https://img.icons8.com/?size=100&id=59872&format=png&color=FFFFFF" alt="mdo" width="32" height="32" class="rounded-circle "></button>`;
    currentLocation.innerHTML = raw;

    document.getElementById("weatherDisplay1").innerHTML =
        `<img src="${result.current.condition.icon}"
                    alt="mdo" width="90" height="90" class="rounded-circle">
                    <h1 class="mx-1 text-white">${unitRequested(result.current, 0)}&deg</h1>`;
    document.getElementById("weatherDisplay2").innerHTML =
        `<div id="weatherDetails">
                <h5 class="weatherDetails fw-bold row">${result.current.condition.text}</h5>
                <p class="text-white row">Feels Like ${unitRequested(result.current, 3)}&deg</p>
            </div>`
    document.getElementById("weatherInfo").innerHTML =
        `<div id="weatherDetails" class="col">
                        <p class="weatherDetails">Wind</p>
                        <p class="weatherDetails">${unitRequested(result, 4)}${imperialUnit}</p>
                    </div>
                    <div id="weatherDetails" class="col">
                        <p class="weatherDetails">Precipitation</p>
                        <p class="weatherDetails">${unitRequested(result, 6)} ${imperialUnit}</p>
                    </div>
                    <div id="weatherDetails" class="col">
                        <p class="weatherDetails">Humidity</p>
                        <p class="weatherDetails">${result.current.humidity}%</p>

                    </div>
                    <div id="weatherDetails" class="col w-100">
                        <p class="weatherDetails">UV Index</p>
                        <p class="weatherDetails">${result.current.uv}</p>
                    </div>`

}

setupUpcomingForecast = (result) => {
    let upcomingForecast = document.getElementById("upcomingForecast");
    let forecastBody = "";
    result.forecast.forecastday.forEach(element => {
        forecastBody += `
            <div class="box">
                    <p class="mx-4 mt-2 mb-0 justify-content-start text-white-50">${element.date} | ${element.day.condition.text} <img src=${element.day.condition.icon} alt="mdo"
                    width="32" height="32" class="rounded-circle"></p>
                    <table class="m-3 mt-0">
                        <tr >
                            <td class="ps-2 justify-content-end">
                                <img src=${element.day.condition.icon}
                                    alt="mdo" width="70" height="70" class="rounded-circle">
                            </td>
                            <td class="justify-content-start">
                                <h3 class="text-white-50">${unitRequested(element, 1)}&deg</h3>
                                <h3 class="text-white-50">${unitRequested(element, 2)}&deg</h3>
                            </td>
                            <td>
                                <div class="m-2">
                                    <p class="weatherDetails">Precipitation</p>
                                    <p class="weatherDetails">${unitRequested(element, 7)} ${imperialUnit}</p>
                                </div>
                            </td>
                        </tr>
                        <tr class="col">
                            <td class="col-4">
                                <div class="mx-2 col">
                                    <p class="weatherDetails">Max Wind</p>
                                    <p class="weatherDetails">${unitRequested(element, 5)} ${imperialUnit}</p>
                                </div>
                            </td>
                            <td class="col-4">
                                <div class="row">
                                    <p class="weatherDetails">Humidity</p>
                                    <p class="weatherDetails">${element.day.avghumidity}%</p>
                                </div>
                            </td>
                            <td class="col-4">
                                <div class="ms-2">
                                    <p class="weatherDetails">UV Index</p>
                                    <p class="weatherDetails">${element.day.uv}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
            </div>`
    })
    upcomingForecast.innerHTML = forecastBody;
}

setupWeatherHistory = (result) => {
    let forecastHistory = document.getElementById("forecastHistory");
    let forecastBody = `<div class = "item me-3">
            <table class="h-100">
                <th class=" px-4 text-white fw-bold">
                    Time
                </th>
                <tr>
                    <td class=" px-4 text-white fw-bold" style="height: 50%;">
                        Temp&deg
                    </td>
                </tr>
                <tr>
                    <td class=" px-4 text-white fw-bold">
                        Felt
                    </td>
                </tr>
                <tr>
                    <td class=" px-4 text-white fw-bold">
                        Like &deg
                    </td>
                </tr>
                <tr>
                    <td class="px-4 text-white fw-bold">
                        Rain%
                    </td>
                </tr>
            </table>
        </div>`;
    let time = "";
    let element = result.forecast.forecastday;
    for (let index = 0; index < 24; index++) {
        time = `${element[0].hour[index].time}`;
        forecastBody += `<div class="item box">
                                        <table class="h-100 box">
                                            <th class=" px-4 text-white">
                                                ${time.substr(11)}
                                            </th>
                                            <tr class="bottom-0">
                                                <td class=" px-4" style = "height: 50%;">
                                                ${unitRequested(element[0].hour[index], 0)}&deg
                                                </td>
                                            </tr>
                                            <tr class="">
                                                <td class=" px-4 ">
                                                ${unitRequested(element[0].hour[index], 3)}&deg
                                                </td>
                                            </tr>
                                            <tr class="">
                                                <td class=" px-4 ">
                                                <img id="refreshbtn" src="${element[0].hour[index].condition.icon}" alt="mdo" width="32" height="32" class="rounded-circle mt-2">
                                                </td>
                                            </tr>
                                            <tr class="">
                                                <td class="px-4 text-white">
                                                ${element[0].hour[index].chance_of_rain}%
                                                </td>
                                            </tr>
                                        </table>
                                </div>`
    }
    forecastHistory.innerHTML = forecastBody;
}