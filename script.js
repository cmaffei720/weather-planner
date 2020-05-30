//set day variable to create dates on forecast cards
var day = moment().format('MMMM Do YYYY');

//set id for local storage
var id = localStorage.getItem("id")

//if first time loading, cycle ID up to 1
if (id === null) {
    id = 1
}


//get last searched cities from local, add to OL
for (i=0; i<id; i++) {
var oldSearch = localStorage.getItem("city"+i)
var newDiv = $("<div>").text(oldSearch)
    newDiv.attr("class", "btn-dark")
    newDiv.attr("data-name", oldSearch)
    $("#existing").prepend(newDiv)
}


//main function
function getWeather (city) {

//encode location to pass into Geocoding API (need latitude and longitude)
var encodedlocation = encodeURIComponent(city)
console.log(encodedlocation)

//pass encoded location into TrueWay Geocoding API call
var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://trueway-geocoding.p.rapidapi.com/Geocode?language=en&country=US&address="+encodedlocation,
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "trueway-geocoding.p.rapidapi.com",
		"x-rapidapi-key": "778af56556msh60df0212f929a25p1bd6fajsn95b39208364f"
	}
}
//get latitude and longitude, console log to check
$.ajax(settings).done(function (response) {
    var lat = response.results[0].location.lat
    var long = response.results[0].location.lng
    console.log(lat)
    console.log(long)

    //pass lat/long from Trueway API into Current City field
    $("#cityName").text(response.results[0].address + "; " + day)

    //api call to open weather - gets both CURRENT and FUTURE weather
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={minutely,hourly}&units=imperial&appid=9c6b950acd57094b5e66afeffa21d8c4"

    //work with open weather API response
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    console.log(response)

    //pass current weather parameters into top section for current weather
    $("#currentWeather").text("Weather: "+response.current.weather[0].main)
    $("#currentIcon").attr("src", "http://openweathermap.org/img/wn/"+response.current.weather[0].icon+"@2x.png")
    $("#currentTemp").text("Temperature: "+response.current.temp + String.fromCharCode(176)+"F")
    $("#currentHumidity").text("Humidity: "+response.current.humidity + "%")
    $("#currentWind").text("Wind Speed: "+response.current.wind_speed +" MPH")
    $("#currentUV").text("UV Index: "+response.current.uvi)

    //log to change UVI background color based on UVI
    var uvi = response.current.uvi
    if (uvi < 3) {
        $("#currentUV").attr("class", "low")
    }
    else if (uvi > 3 && uvi < 6) {
        $("#currentUV").attr("class", "moderate")
    }
    else if (uvi > 6 && uvi < 8) {
        $("#currentUV").attr("class", "high")
    }
    else if (uvi > 8 && uvi < 11) {
        $("#currentUV").attr("class", "veryhigh")
    }
    else if (uvi > 11) {
        $("#currentUV").attr("class", "extreme")
    }

    //for loop - find weather for next 5 days, pass into forms & divs with IDs 0-4 (5 days total)
    for (i = 0; i < 5; i++) {
        var a = "#date"+i
        var b = "#temp"+i
        var c = "#humid"+i
        var d = "#pic"+i
        
        //use moment to find next date, add to date Div
        var newDay = moment(day, "MMMM Do YYYY").add(i+1, "days")
        $(a).text(moment(newDay).format("MMMM Do YYYY"))

        $(b).text("Day Temp: "+response.daily[i].temp.day + String.fromCharCode(176)+"F")
        $(c).text("Humidity: "+response.daily[i].humidity + "%")

        //find icon to use based on weather
        $(d).attr("src", "http://openweathermap.org/img/wn/"+response.daily[i].weather[0].icon+"@2x.png")
    }
//ajax done
})
})

    //set city into local storage and into OL, with data attribute "data-name" equal to search
    var newDiv = $("<div>")
    newDiv.text(city)
    newDiv.attr("class", "btn-dark")
    newDiv.attr("data-name", city)
    $("#existing").prepend(newDiv)
    localStorage.setItem("city"+id, city)
    $("#city").val("")
    //cycle id up 1, add new ID to local storage (needs to be retrieved on page load)
    id++
    localStorage.setItem("id", id)
    
    //check that id properly cycled up & is accurate
    console.log("id after click" + id)

 // close getWeather function
}

//Below are the 3 situations to call the function - a refresh, a click on a past search, and a search

//if reloading the page after running, run main function with previously used city
if (id > 1) {
    var minusOne = id-1
    getWeather(localStorage.getItem("city"+minusOne))
}

//call main function on any previous search button click, city = city in data attribute "data-name"

$(document).on("click", ".btn-dark", function() {
    var cityclick = $(this).attr("data-name")
    getWeather(cityclick)
})

//trigger function on search button click, city = searched city
$("#search").on("click", function() {
    getWeather($("#city").val())
})



//UPDATE THIS SECTION IS CANCELLED BECAUSE THE ONE CALL WEATHER API WORKS WITH GEOCODED LAT/LONG

//var queryURL = "https://api.openweathermap.org/data/2.5/weather?zip="+zip+",us&units=imperial&appid=9c6b950acd57094b5e66afeffa21d8c4"
//var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?zip="+zip+",us&units=imperial&appid=9c6b950acd57094b5e66afeffa21d8c4"
//get current weather stats, push into HTML using jQUERY
// $.ajax({
//     url: queryURL,
//     method: "GET"
// })
// .then(function(response){
//     console.log(response)
//     console.log(response.weather[0].main)
//     console.log(response.main.temp)
//     $("#cityName").text(response.name)
//     $("#currentTemp").text("Temperature: "+response.main.temp + String.fromCharCode(176)+"F")
//     $("#currentHumidity").text("Humidity: "+response.main.humidity + "%")
//     $("#currentWind").text("Wind Speed: "+response.wind.speed +" MPH")
//     $("#currentUV").text("UV Index: ")
// })

//ajax and for loop - find the 12:00 weather update each day

// $.ajax({
//     url: queryURL2,
//     method: "GET"
// })
// .then(function(response) {
//     console.log(response)

//      for loop - find the 12:00 weather update each day
//     for (i=0; i < 5; i++) {
//     console.log("forecast: " + response.list[3+(i*8)].weather[0].main)
//    console.log("time: "+response.list[3+(i*8)].dt_txt)
//     }
// })