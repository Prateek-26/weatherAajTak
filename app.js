const express = require('express');
const ejs = require('ejs');
const https = require('https');
const bodyParser = require('body-parser');
/* 
The below step will tell the servrer that
anything is in a .env file to load into the environmnet variable
*/ 
require('dotenv').config( ); 
// console.log(process.env);
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("home.ejs",{});
});

app.post("/",function(req,res){
    res.redirect("/");
})

let status_Code = 200;
app.post("/weather",function(req,res){
    const image_URL =" ";

    const city = req.body.city_name;
    // const appid = process.env.API_KEY;
    const appid = "884465c1ef0bae35c5b50e87c432cf6e"
    const units = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + appid + "&units=" + units;

    https.get(url,function(response){

        if(!(response.statusCode===200))
            {
                status_Code=response.statusCode;
                console.log(status_Code);
                res.redirect("/faliure");
            }
        else{
        
        response.on("data", function(data){

        const actualData = JSON.parse(data);

        const temp = actualData.main.temp;
        const desc = actualData.weather[0].description;
        const imgNo = actualData.weather[0].icon;
        const image_URL =  "http://openweathermap.org/img/wn/" + imgNo + "@2x.png";
        
        weather_Data = {
            cityName: city,
            temperature: temp,
            description: desc,
            image: image_URL
        };


        res.render("weather",{
            c: weather_Data.cityName,
            t: weather_Data.temperature,
            d: weather_Data.description,
            i: weather_Data.image
        });
        });
       }
    });
});
app.get("/faliure",function(req,res){
    res.render("faliure.ejs",{
        statCode: status_Code 
    });
});
app.get("/about",function(req,res){
    res.render("about.ejs",{});
})
app.listen(process.env.PORT || 3000,function(){
console.log("Server is on and running");
})
