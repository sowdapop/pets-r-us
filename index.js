//route to landing and grooming pages

var express = require('express');
var app = express();

app.get ("/index.html", function(request, response){
    response.send("Welcome to Pets-R-Us!");
});

app.get ("/grooming.html", function(request, response){
    response.send("Let us brush your dog!");
});

app.use (function(request, response){
    response.status(404) .send("Page not found!");
});
