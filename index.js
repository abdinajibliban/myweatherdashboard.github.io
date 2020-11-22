var cityName        = "Columbus";
var apiKey          = "57c88dd4413994a790fe34debd6cfe12"
var apiURL          = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
var forecastURL     = "api.openweathermap.org/data/2.5/forecast/daily?q="+ cityName +"&cnt=5&appid="+apiKey;
var currentWeather  = $("#currentWeather");
var fiveForecast    = $("#fiveforecast");
var cityList;

function getInfo(cityName) {
    $.get(apiURL).then(function (response){
        var currentTime =  moment().format("MM/DD/YYYY");
        currentWeather.html(`<h3> ${cityName} - ${currentTime} </h1>
                            <p> Temperature: ${Math.floor(response.main.temp)}&#176;F  </p>
                            <p> Humidity:${response.main.humidity}%</p>
                            <p> Wind Speeds: ${response.wind.speed } mph</p>
                            `, createUvIndex(response.coord));
    });
}

function createUvIndex(coordinates){
    var uviURL          = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

    $.get(uviURL).then(function (response){
        var currentUVIndex = response.value;

        if (currentUVIndex >= 11) {
            uvSeverity = "purple";
        }else if (currentUVIndex <= 10 && currentUVIndex >= 8 ){
            uvSeverity = "red";
        }else if (currentUVIndex <= 7 && currentUVIndex >= 6 ){
            uvSeverity = "orange";
        }else if (currentUVIndex <= 5 && currentUVIndex >= 3 ){
            uvSeverity = "yellow";
        }else if (currentUVIndex <= 2 && currentUVIndex >= 1 ){
            uvSeverity = "green";
        }

        currentWeather.append(`<p> UV Index: <span id="uvi" style="background-Color: ${uvSeverity};"> ${currentUVIndex}</span></p>
                            `);
                        
    })
}

function getForecastInfo(cityName){
    $.get(forecastURL).then(function (response){
        var info = response.list;
        fiveForecast.empty();

        $.each(info, function(i) {
            if (!info[i].dt_txt.includes("12:00:00")) {
                return;
            }
            let Icon = `https://openweathermap.org/img/wn/${info[i].weather[0].icon}.png`;

            fiveForecast.append(`
                    <div class="col-md">
                        <div class="card text-white bg-primary">
                            <div class="card-body">
                                <h4>${moment().format("MM/DD/YYYY")}</h4>
                                <img src=${Icon} alt="Icon">
                                <p>Temp: ${info[i].main.temp} &#176;C</p>
                                <p>Humidity: ${info[i].main.humidity}%</p>
                            </div>
                        </div>
                    </div>
            `)
        })
    })
};
   
function createHistoryButton(cityName) {
    // Check if the button exists in history, and if it does, exit the function
    var citySearch = cityName.trim();
    var buttonCheck = $(`#savedCity > BUTTON[value='${citySearch}']`);
    if (buttonCheck.length == 1) {
      return;
    }
    
    if (!cityList.includes(cityName)){
        cityList.push(cityName);
        localStorage.setItem("localWeatherSearches", JSON.stringify(cityList));
    }

    $("#savedCity").prepend(`
    <button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
    `);
}

function writeSearchHistory(array) {
    $.each(array, function(i) {
        createHistoryButton(array[i]);
    })
}

$("#submit").click(function() {
    event.preventDefault();
    let cityName = $("#cityText").val();
    getInfo(cityName);
    getForecastInfo(cityName);
});

$("#savedCity").click(function() {
    let cityName = event.target.value;
    getInfo(cityName);
    getForecastInfo(cityName);
})

getInfo(cityName)
