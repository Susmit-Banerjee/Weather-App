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

app.get("/", function(req, res){
  firstTime=true;
  res.render("info",{firstTime:firstTime});   
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

       let weatherData=JSON.parse(data);
        
       let temp= weatherData.main.temp;
       let tempFeelsLike= weatherData.main.feels_like;
       let humidity= weatherData.main.humidity;
       let weatherDescription= weatherData.weather[0].description;
       let iconId= weatherData.weather[0].icon;
       let isDay=iconId.includes('d');
       let iconUrl= "http://openweathermap.org/img/wn/"+iconId+"@2x.png";
        
        firstTime=false;
  
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
        
      });
    }

  });
  
});


app.post("/error", function(req, res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000 , function(){
  console.log("Server is running on port 3000.");
});
