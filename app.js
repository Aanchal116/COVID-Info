const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// Getting request for home page

app.get("/", function (req, res) {

    const urlHome = "https://corona.lmao.ninja/v2/countries/";

    https.get(urlHome, "JSON", function (response){

        console.log(response.statusCode);

        // Gathering all data on API url

        var data;
        response.on("data", function (chunk) {
            if (!data) {
                data = chunk;
            } else {
                data += chunk;
            }
        });

        response.on("end", function (){
            const covidHome = JSON.parse(data);

            var countries = Object.keys(covidHome);
            const countryLength = countries.length;
            var countryName = [];

            for( let index = 0; index < countryLength; index++ ) {
                countryName[index] = covidHome[index].country;
            }
            
            var activeCases = [];

            for( let index = 0; index < countryLength; index++ ) {
                activeCases[index] = covidHome[index].active;
            }

            res.render("home", {
                countryLength :countryLength,
                countryName : countryName,
                activeCases : activeCases
            }
            );
        })

        
    })



})

// Variable to set Country Name 

let query;


// Post request for home page

app.post("/", function(req, res){

    // Receiving the country name from html form
    query = req.body.countryName;
    const url = "https://corona.lmao.ninja/v2/countries/" + query;
    

    https.get(url, "JSON", function (response) {

        console.log(response.statusCode);

        var data;
        response.on("data", function (chunk) {
            if (!data) {
                data = chunk;
            } else {
                data += chunk;
            }
        });

        // Assigning Values from response

        response.on("end", function () {
            const covidData = JSON.parse(data);

            const country = covidData.country;
            const flagUrl = covidData.countryInfo.flag;
            const totalCases = covidData.cases;
            const todayCases = covidData.todayCases;
            const deaths = covidData.deaths;
            const todayDeaths = covidData.todayDeaths;
            const recovered = covidData.recovered;
            const todayRecovered = covidData.todayRecovered;
            const active = covidData.active;
            const critical = covidData.critical;
            const casesPerOneMillion = covidData.casesPerOneMillion;
            const deathsPerOneMillion = covidData.deathsPerOneMillion;
            const tests = covidData.tests;
            const testsPerOneMillion = covidData.testsPerOneMillion;
            const oneDeathPerPeople = covidData.oneDeathPerPeople;
            const oneTestPerPeople = covidData.oneTestPerPeople;
            const activePerOneMillion = covidData.activePerOneMillion;
            const recoveredPerOneMillion = covidData.recoveredPerOneMillion;
            const criticalPerOneMillion = covidData.criticalPerOneMillion;

            // Sending data from api to countryInfo page

            res.render("countryInfo.ejs", {
                country: country , 
                flagUrl : flagUrl,
                totalCases: totalCases,
                todayCases: todayCases, 
                deaths: deaths, 
                todayDeaths: todayDeaths,
                recovered: recovered,
                todayRecovered: todayRecovered,
                active: active,
                critical: critical,
                casesPerOneMillion : casesPerOneMillion,
                deathsPerOneMillion: deathsPerOneMillion,
                tests: tests,
                testsPerOneMillion: testsPerOneMillion,
                oneDeathPerPeople: oneDeathPerPeople,
                oneTestPerPeople: oneTestPerPeople,
                activePerOneMillion: activePerOneMillion,
                recoveredPerOneMillion : recoveredPerOneMillion,
                criticalPerOneMillion: criticalPerOneMillion
            })

            
        });

    });

})


// Post request for history page

app.post("/history", function(req, res){
    const urlHistory = "https://corona.lmao.ninja/v2/historical/" + query;

    https.get(urlHistory, "JSON", function (response){

        console.log(response.statusCode);

        var data;
        response.on("data", function (chunk) {
            if (!data) {
                data = chunk;
            } else {
                data += chunk;
            }
        });

        response.on("end", function (){
            const covidHistory = JSON.parse(data);

            const country = covidHistory.country;
            var casesKey = Object.keys(covidHistory.timeline.cases);
            var cases = Object.values(covidHistory.timeline.cases);
            var casesLength = casesKey.length;

            var deathsKey = Object.keys(covidHistory.timeline.deaths);
            var deaths = Object.values(covidHistory.timeline.deaths);
            var deathsLength = deathsKey.length;

            var recoveredKey = Object.keys(covidHistory.timeline.recovered);
            var recovered = Object.values(covidHistory.timeline.recovered);
            var recoveredLength = recoveredKey.length;

            
            res.render("history.ejs", {
                country : country ,
                casesKey: casesKey,
                cases : cases,
                casesLength : casesLength,
                deathsKey : deathsKey,
                deaths : deaths,
                deathsLength : deathsLength,
                recoveredKey : recoveredKey,
                recovered : recovered ,
                recoveredLength: recoveredLength
            });
        })

        
    })

})



app.listen(3000, function () {
    console.log("Server is running on port 3000");
})

           





    