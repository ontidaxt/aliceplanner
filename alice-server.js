
var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var fs = require('fs');

var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var qs = require('querystring');
var _ = require('lodash');

var apiKey = "AIzaSyCU1JuxIAEoYuRs2BY7ez4-tC-PIuVyiTQ";

app.use(express.static(path.join(__dirname, 'alice-index-src')));

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/businessinfo', function(req, res){
	var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+ req.query.hours+"&key=" + apiKey;
	request(url, function(error, response, body){
		res.send(body);
	})
})

app.get('/api/location',function(req, res){
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + req.query.address + "&key=" + apiKey;
	request(url, function(error, response, body){
		res.send(body);
	})
})

app.get('/api/search', function(req, res){
	var app_req = req.query.zip;
	
	var request_yelp = function(set_parameters, callback){
		var httpMethod = 'GET';
		var url = 'http://api.yelp.com/v2/search';

		var default_parameters = {
			term: 'good for working, free wifi',
			sort: '2',
			limit: '5'
		};

		var required_parameters = {
			oauth_consumer_key: 'NLoE5kwR2mlJx0Yf5D2-Kg',
			oauth_token: 'bzEPwTqVjDhneE9l6Eej1OpoSBDFazIk',
			oauth_nonce: n(),
			oauth_timestamp: n().toString().substr(0,10),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version: '1.0'
		};

		var parameters = _.assign(default_parameters, set_parameters, required_parameters);

		var consumerSecret = 'dTrLfn2pUGyYF6_YCLYXtBqh-0c';

		var tokenSecret = 'u0Ol2U38ZAS1Ze0lBtALkw518dE';

		var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret,{encodeSignature: false});

		parameters.oauth_signature = signature;

		var paramURL = qs.stringify(parameters);
		var apiURL = url + '?' + paramURL;

		request(apiURL, function(error, response, body){
			return callback(error, response, body);
		});

	};

	var params = {
		location: app_req	
	};

	request_yelp(params, function(){
	  var results = JSON.parse(arguments[2]);
	  res.send(results);
	});

});

var server = app.listen(3030, function(){
	console.log('Server running at http://localhost:' + server.address().port);
});
