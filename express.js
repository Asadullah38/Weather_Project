import express from "express";
var app = express();
var port = process.env.PORT || 8000;
import fs, { readFileSync } from "fs";
const homefile = fs.readFileSync("weather.html", "utf-8");
import requests from "requests";


function replaceVal(tempval, val) {
    tempval = tempval.replace("{%temp%}", val.main.temp);
    tempval = tempval.replace("{%status%}", val.weather[0].main);
    tempval = tempval.replace("{%country%}", val.sys.country);
    tempval = tempval.replaceAll("{%city%}", val.name);
    tempval = tempval.replace("{%min%}", val.main.temp_min);
    tempval = tempval.replace("{%max%}", val.main.temp_max);
    return tempval;
}
var a = 0;


var city = "Sargodha";
app.get("/", (req, res) => {
    if (city != "") {


        if (a === 0) {
            req.query.name = "Lahore";
            a++;
        }
        city = req.query.name;

        requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=09218d9fb44bd06f3210271b29385683`)
            .on('data', (chunk) => {
                const obj = JSON.parse(chunk);
                var arrdata = [obj];
                const realtimedata = arrdata.map((val) => replaceVal(homefile, val)).join('');
                res.write(realtimedata);

            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();

            });
    } else {
        alert("Enter City Name");
    }
}).listen(port);