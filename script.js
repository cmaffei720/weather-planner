//set day variable to create dates on forecast cards
var day = moment().format('DD-MM-YYYY');
//set id for local storage
var id = localStorage.getItem("id")

if (id === null) {
    id = 1
}

for (i = 1; i < 11; i++) {
    var search0 = "#pastSearch"+i
    $(search0).text(localStorage.getItem("city"+i))
}


//search bar function
$("#search").on("click", function() {

var city = $("#city").val()
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
    console.log(response)
    console.log(lat)
    console.log(long)

    //pass address from Trueway API call into Current City field
    $("#cityName").text(response.results[0].address)

    //api call to open weather - gets both CURRENT and FUTURE weather
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={minutely,hourly}&units=imperial&appid=9c6b950acd57094b5e66afeffa21d8c4"


    //work with open weather API call
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    console.log(response)

    //pass current weather parameters into top section for current weather

    $("#currentTemp").text("Temperature: "+response.current.temp + String.fromCharCode(176)+"F")
    $("#currentHumidity").text("Humidity: "+response.current.humidity + "%")
    $("#currentWind").text("Wind Speed: "+response.current.wind_speed +" MPH")
    $("#currentUV").text("UV Index: "+response.current.uvi)

    //for loop - find weather for next 5 days, pass into forms & divs
    for (i = 0; i < 5; i++) {
        var a = "#date"+i
        var b = "#temp"+i
        var c = "#humid"+i
        var d = "#pic"+i

        var newDay = moment(day, "DD-MM-YYYY").add(i+1, "days")
        $(a).text(moment(newDay).format("MMMM Do YYYY"))

        $(b).text("Day Temp: "+response.daily[i].temp.day + String.fromCharCode(176)+"F")
        $(c).text("Humidity: "+response.daily[i].humidity + "%")
        //$(d).attr("src", "01.png")
        $(d).attr("height", "50")
        $(d).attr("width", "50")

        var icon = response.daily[i].weather[0].icon
        //find image to use based on weather
        $(d).attr("src", "http://openweathermap.org/img/wn/"+icon+"@2x.png")
    }
//ajax done
})
})

    //set city into local storage and into OL
    // var search = "#pastSearch"+id
    // $(search).text(city)
    var newDiv = $("<div>").text(city)
    $("#searches").prepend(newDiv)
    localStorage.setItem("city"+id, city)
    //cycle id up 1, add new ID to local storage (needs to be retrieved on page load)
    id++
    localStorage.setItem("id", id)
    

    console.log("id after click" + id)

//on button function closed
})



//UPDATE THIS IS CANCELLED CAUSE I GOT THE ONE CALL WEATHER API TO WORK

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


//UPDATE THIS IS CANCELLED CAUSE I GOT THE ONE CALL WEATHER API TO WORK

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