$(document).ready(function () {
    //search button
    $("#submit").on("click", function () {
        var searchTerm = $("#cityText").val();//gets value in input searchvvalue
        $("#cityText").val("");//empties the input field
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
    });

    $("#submit").keypress(function (event) { //search button
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
            weatherFunction(searchTerm);
            weatherForecast(searchTerm);
        }
    });

    //get item from local storage
    var history = JSON.parse(localStorage.getItem("history")) ; 
    //history array search is made into correct length
    if (history.length > 0) { 
        weatherFunction(history[history.length - 1]);
    }
    //rows for history array elements
    for (var i = 0; i < history.length; i++) { 
        createRow(history[i]);
    }

    function createRow(text) {
        var listItem = $("<li>").addClass("cityHistory").text(text);
        $("#savedCity").append(listItem);
    }
    //click functionality for list item
    $("#savedCity").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });

    function weatherFunction(searchTerm) {

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&units=imperial",


        }).then(function (data) {
            //used when there's no index of search value
            if (history.indexOf(searchTerm) === -1) { 
                //push search into history array
                history.push(searchTerm); 
                //for items pushed into local storage
                localStorage.setItem("history", JSON.stringify(history)); 
                createRow(searchTerm);
            }
            // old content emptied
            $("#currentWeather").empty();

            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");

            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&lat=" + lat + "&lon=" + lon,


            }).then(function (response) {
                console.log(response);

                var uvColor;
                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);


                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }

                cardBody.append(uvIndex);
                $("#currentWeather .card-body").append(uvIndex.append(btn));

            });

            // add to page
            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#currentWeather").append(card);
            console.log(data);
        });
    }

    //function and loop to create daily cards with images and relevant info
    function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&units=imperial",

        }).then(function (data) {
            console.log(data);
            $("#fiveForecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

            for (var i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

                    var colFive = $("<div>").addClass("col-md-2");
                    var cardFive = $("<div>").addClass("card bg-primary text-white");
                    var cardBodyFive = $("<div>").addClass("card-body p-2");
                    var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

                    colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive))); //merged and added on page
                    $("#fiveForecast .row").append(colFive); //appends relevant colum card elements and body


                }
            }
        });
    }

});
