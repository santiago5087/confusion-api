var express = require('express');
var cors = require('cors');

var whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200', 'https://www.facebook.com, https://resto-confusion.herokuapp.com'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('origin'));
    if (whitelist.indexOf(req.header('origin')) !== -1) {
        corsOptions = {origin: true}
    } else {
        corsOptions = {origin: false}
    }

    callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);