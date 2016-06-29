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

	xhr.open('GET',"http://localhost:3030/api/businessinfo?hours=" + value.place);

	xhr.onload = function(){

	  if(xhr.status === 200){	  	
		var responseObj = JSON.parse(xhr.responseText);
	    value.googleURL = responseObj.result.url;
	    googleURLLength += 1;

	      if(googleURLLength === stores.length){
	      	return displayResult();
	      }
	  	
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
	xhr.open('GET',"http://localhost:3030/api/location?address=" + value.addressParam);
	xhr.onload = function(){

	  if(xhr.status === 200){
	  	var responseObj = JSON.parse(xhr.responseText);	       
	  	value['place'] = responseObj.results[0]['place_id'];
	  	placeIDLength += 1;

	  	 if(placeIDLength === stores.length){
	      	return placeID();
	     }
	
	  } else {
		alert("googlePlaceID() request failed. Return the status of "+ xhr.resposeText);
	  }

	};

	xhr.send();

  });

};

///store important data in array and detail info in obj for quick access
var selected = function(collection) {

  var responseObj = JSON.parse(collection);	

  each(responseObj.businesses, function(value, key){
    stores.push({'name': value.name,
				  'yelpURL': value.url,
				  //'categories': value.categories,
				  'categories': value.categories.reduce(function(memo, current){ return memo + "#" + current[0] + " ";},""),
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
  
  return googlePlaceID();

};

////////////////////////////////////////////////////////////////////////
var textResults = function(id, elem, content){

	  var parent = document.createElement(elem);
	  var child = document.createTextNode(content + " ");
	  parent.appendChild(child);
	  return document.getElementById(id).appendChild(parent);

};

var imgHyperLink = function(id, image){

	var child = document.createElement("img");
	child.id = "image";
	child.setAttribute('src', image);
	return document.getElementById(id).appendChild(child);

};

var displaySpace = function(id){

	var space = document.createElement("br");
	return document.getElementById(id).appendChild(space);

};

var addElement = function(element, parent, id){

	var tag = document.createElement(element);
	tag.id = id;
	return document.getElementById(parent).appendChild(tag);

};

var displayOnTheSameLine = function(pending, imageID, image, hyperlink, textID, textContent){

			var child = document.createElement("img");
			child.id = imageID;
			child.setAttribute('src', image);
			var parent = document.createElement("a");
		  	parent.setAttribute('href', hyperlink);
		  	parent.appendChild(child);
		  	
		  	var gradparent = document.createElement("p");
		  	gradparent.id = textID;
		    var description = document.createTextNode(textContent + " ");
		    gradparent.appendChild(description);
		    gradparent.appendChild(parent);
		    document.getElementById(pending).appendChild(gradparent);

};


var displayResult = function(){

	
	each(stores, function(value, key){
		
		var myAPI = "AIzaSyCpom91tWpzix_pgvqn33vw3Z2k3hSU53M";
		var googleMapStreetView = "https://maps.googleapis.com/maps/api/streetview?size=375x175&location="+ value.addressParam + "&key=" + myAPI;
	
		addElement("div", "results-box", "result-1");
		addElement("section", "result-1", "business-description");
		addElement("aside", "result-1", "business-streetview-image");	
		displayOnTheSameLine("business-description", "image", value.ratingImg, value.yelpURL, "businessname", value.name);		
		textResults("business-description", "p", value.categories);	
		displayOnTheSameLine("business-description", "direction", "direction.png", value.googleURL, "address", value.address);
		imgHyperLink("business-streetview-image", googleMapStreetView);
		displaySpace("business-description");
		displaySpace("business-streetview-image");
		displaySpace("business-streetview-image");

	});

	imgHyperLink("credit", "poweredByYelp.png");

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

	xhr.open('GET',"http://localhost:3030/api/search?zip=" + zipcode);

	xhr.onload = function(){	
	  if(xhr.status === 200){
		selected(xhr.responseText);
	  } else {
		alert("search() request failed. Return the status of "+ xhr.resposeText);
	  }

	};

	xhr.send();

};

