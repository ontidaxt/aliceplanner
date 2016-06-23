var each = function(collection, callback){
  if(typeof collection !== 'object'){
	console.log(collection + ' is not an object!')
	  return;
  }

  if(Array.isArray(collection)){
	for(var i = 0; i < collection.length; i++){
	  callback(collection[i], i, collection);
	}	
  } else {
	for(var key in collection){
	  callback(collection[key], key, collection);
	}
  }
  return;
};
///////////////////////////////////////////////////

var stores = [];
var googleURLLength = 0;
var placeIDLength = 0;

var placeID = function(){

  each(stores, function(value, key){

  	var xhr = new XMLHttpRequest();
  	 //console.log(value.place);
	
	xhr.open('GET',"/api/businessinfo?hours=" + value.place);

	xhr.onload = function(){

	  if(xhr.status === 200){
	  	//console.log(xhr.responseText);
	
		var responseObj = JSON.parse(xhr.responseText);
		//console.log("url: " + responseObj.result.url);
	    value.googleURL = responseObj.result.url;
	    //console.log(value.googleURL);
	    googleURLLength += 1;
	    //if(stores[stores.length-1]['googleURL'] !== undefined){
	      if(googleURLLength === stores.length){
	      	//displayResultAlreadyBeenCall = true;
	      	return displayResult();
	      }
	  	  
	  	//}

	  } else {
		alert("The alice-app.js request failed. Return the status of "+ xhr.resposeText);
	  }

	};

	xhr.send();

  });

};

var googlePlaceID = function(){

  each(stores, function(value, key){

  	var xhr = new XMLHttpRequest();
	xhr.open('GET',"/api/location?address=" + value.addressParam);
	xhr.onload = function(){

	  if(xhr.status === 200){
	  	var responseObj = JSON.parse(xhr.responseText);	       
	  	value['place'] = responseObj.results[0]['place_id'];
	  	placeIDLength += 1;

	  	//if(stores[stores.length-1]['place'] !== undefined){
	  	 if(placeIDLength === stores.length){
	       //placeIDLength = true;
	      	return placeID();
	     }
	  	//}
	
	  } else {
		alert("googlePlaceID() request failed. Return the status of "+ xhr.resposeText);
	  }

	};

	xhr.send();

  });

};

///store important data in array and detail info in obj for quick access
var selected = function(collection) {
	//console.log(stores);
  var responseObj = JSON.parse(collection);
    //console.log(responseObj.businesses);	
  each(responseObj.businesses, function(value, key){
    stores.push({'name': value.name,
				  'yelpURL': value.url,
				  'categories': value.categories,
				  'address': value.location.address[0] + ', ' +value.location.city +', ' + value.location['state_code'] + ', ' + value.location['postal_code'],
				  'crossStreet': value.location['cross_streets'],
				  'ratingImg': value['rating_img_url_small'],
	});
  });

  each(stores, function(value, key){
	var addressArr = value.address.split(" ");		
	value.addressParam = addressArr.reduce(function(memo, value){
	  return memo + '+' + value;
	});

  });
  //console.log(stores);
  return googlePlaceID();
//
};
////////////////////////////////////////////////////////////////////////
var textResults = function(id, elem, content){
	  var parent = document.createElement(elem);
	  var child = document.createTextNode(content + " ");
	  parent.appendChild(child);
	  //gradparent.appendChild(parent);
	  return document.getElementById(id).appendChild(parent);

};

var imgHyperLink = function(id, hyperlink, image){
	var parent = document.createElement("a");
	parent.setAttribute('href', hyperlink);
	var child = document.createElement("img");
	child.setAttribute('src', image);
	parent.appendChild(child);
	return document.getElementById(id).appendChild(parent);
};



var displayResult = function(){

	
	each(stores, function(value, key){

		var resultBox = document.createElement("div");
		resultBox.id = "result-1";
		document.getElementById("results-box").appendChild(resultBox);

		var myAPI = "AIzaSyCpom91tWpzix_pgvqn33vw3Z2k3hSU53M";
		var googleMapStreetView = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+ value.addressParam + "&key=" + myAPI;
		
		textResults("result-1", "h3", value.name);
		imgHyperLink("result-1", value.yelpURL, value.ratingImg);
		textResults("result-1", "p", value.address);
		imgHyperLink("result-1", value.googleURL, googleMapStreetView);
		
	});
	
	var space = document.createElement("br");
	document.getElementById("result-1").appendChild(space);

	var credit = document.createElement("img");
	credit.setAttribute('src', "poweredByYelp.png");
	document.getElementById("result-1").appendChild(credit);

};

//search() is invoked when button got click on the html page
//it sends request for yelp business info
var search = function() {
	var removePrevResults = document.getElementById("result-1");
	removePrevResults.remove();
	stores = [];
	googleURLLength = 0;
    placeIDLength = 0;


	var location = document.getElementById("zipcode");
	var zipcode = location.value;

	var xhr = new XMLHttpRequest();

	xhr.open('GET',"/api/search?zip=" + zipcode);

	xhr.onload = function(){	
	  if(xhr.status === 200){
		selected(xhr.responseText);
	  } else {
		alert("search() request failed. Return the status of "+ xhr.resposeText);
	  }

	};

	xhr.send();

};

