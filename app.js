require('dotenv').config();
const express = require ("express");
const https= require("https");
const bodyParser=require("body-parser");
const ejs=require('ejs');
const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


var firstTime=true;
var weatherData="";
var temp=""; 
var tempFeelsLike=""; 
var humidity="";
var weatherDescription=""; 
var iconId=""; 
var isDay="";
var iconUrl=""; 
var query="";


app.get("/", function(req, res){
  if(firstTime){
    res.render("info",{firstTime:firstTime});
  }
  else{
    res.render("info", {
      cityName:query , 
      temp:temp , 
      weatherDescription:weatherDescription,
      iconUrl:iconUrl,
      tempFeelsLike:tempFeelsLike,
      humidity:humidity,
      isDay: isDay,
      firstTime:firstTime
    });
  }
  
});


app.post("/", function(req, res){

  query=req.body.cityName;
  // console.log(query);
  

  const url="https://openweathermap.org/data/2.5/weather?q="+query+"&appid="+process.env.API_KEY;

  https.get(url, function(response){
    console.log(response.statusCode);
    
    if(response.statusCode!=200)
    {
      res.sendFile(__dirname+"/error.html");
    }

    else{
      response.on("data", function(data){

        weatherData=JSON.parse(data);
        
        temp= weatherData.main.temp;
        tempFeelsLike= weatherData.main.feels_like;
        humidity= weatherData.main.humidity;
        weatherDescription= weatherData.weather[0].description;
        iconId= weatherData.weather[0].icon;
        isDay=iconId.includes('d');
        iconUrl= "http://openweathermap.org/img/wn/"+iconId+"@2x.png";
        
        firstTime=false;
  
        res.redirect("/");
        
      });
    }

  });
  
});


app.post("/error", function(req, res){
    firstTime=true;
    res.redirect("/");
});

app.listen(process.env.PORT || 3000 , function(){
  console.log("Server is running on port 3000.");
});
