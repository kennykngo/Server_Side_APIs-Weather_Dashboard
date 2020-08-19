$("#search").on("click", function(){
    var city = $("#city").val()
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=20ed5bf3a661e75c3c3a58633f8f0a0a";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var h3 = $("<h3>")
        var cityName = response.name
        var currentDate = moment(response.dt, "X").format(" (MM/DD/YYYY)")
        var iconurl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        var img = $("<img>").attr("src", iconurl)
        
        h3.append(cityName, currentDate, img)

        var p = $("<p>")
        var cityTemp = "Temperature: " + response.main.temp + "°F" + "<br>"
        var cityHum = "Humidity: " + response.main.humidity + "%" + "<br>"
        var cityWind = "Wind Speed: " + response.wind.speed + " MPH"
        p.append(cityTemp, cityHum, cityWind)

        var queryUvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=20ed5bf3a661e75c3c3a58633f8f0a0a&lat="+response.coord.lat+"&lon="+response.coord.lon+"&units=imperial"

        $.ajax({
            url: queryUvURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var uvDiv = $("<div>")
            var uv = "UV Index: " + response.value;
            var uvNum = parseInt(response.value)
            if(uvNum >= 6){
                uvDiv.css("background-color", "red");
            }else if(uvNum < 6 && uvNum >= 3) {
                uvDiv.css("background-color", "yellow");
            }else{
                uvDiv.css("background-color", "green");
            }
            uvDiv.append(uv)

            $(".currentWeather").append(h3,p,uvDiv)
        })
    })

    var city = $("#city").val()
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid=20ed5bf3a661e75c3c3a58633f8f0a0a";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        for (var i=0; i<5; i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconUrl = "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
            var img = $("<img>").attr("src", iconUrl);
            var forecastTemp = response.list[((i+1)*8)-1].main.temp + "°F";
            var forecastHum = response.list[((i+1)*8)-1].main.humidity + "%";

            $("#fDate"+i).html(date);
            $("#fImg"+i).html(img);
            $("#fTemp"+i).html(forecastTemp);
            $("#fHumidity"+i).html(forecastHum);
        }

        p.append(forecastDate, img, forecastTemp, forecastHum)
        $(".fiveDay").append(p)

    })

})
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}

function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}

function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);
