
var each = function(collection, callback) {
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
var myGoogleAPI = "AIzaSyCpom91tWpzix_pgvqn33vw3Z2k3hSU53M";		

//Use obtained google place ID to request detail information about the business
var googleStoreURL = function() {

  each(stores, function(value, key) {

  	var xhr = new XMLHttpRequest();

		xhr.open('GET',"http://localhost:3030/api/businessinfo?hours=" + value['place_id']);

		xhr.onload = function() {

		  if(xhr.status === 200){
		  	//only want business google url. Store url in the stores array	  	
				var responseObj = JSON.parse(xhr.responseText);
		    value.googleURL = responseObj.result.url;
		    googleURLLength += 1;

		    //only call when all business google url is obtained
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

//Use to request google Place ID.
//Google Place ID can be used to request more infomation detail on the business
var googlePlaceID = function() {
  
  each(stores, function(value, key) {
  
  	var xhr = new XMLHttpRequest();

		xhr.open('GET',"http://localhost:3030/api/location?address=" + value.addressParam);

		xhr.onload = function() {

	  	if(xhr.status === 200){
	  		var responseObj = JSON.parse(xhr.responseText);	       
	  		value['place_id'] = responseObj.results[0]['place_id'];
	  		placeIDLength += 1;

	  		//invoke placeID() only when all the businesses have place_id in their key properties
	  		if(placeIDLength === stores.length){
	  			//googleStoreURL() is on line 25.
	      	return googleStoreURL();
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

  each(responseObj.businesses, function(value, key) {
  	stores.push({'name': value.name,
				  'yelpURL': value.url,
				  //yelp response business categories in form of nested arrays.
				  //simplify into the hashtags of categories making easier to read
				  'categories': value.categories.reduce(function(memo, current){ return memo + "#" + current[0] + " ";},""),
				  'address': value.location.address[0] + ', ' +value.location.city +', ' + value.location['state_code'] + ', ' + value.location['postal_code'],
				  'ratingImg': value['rating_img_url_small'],
		});
  });

  //use to make the address parameter for request google Place IDs and google street view images
  each(stores, function(value, key) {
		var addressArr = value.address.split(" ");		
		value.addressParam = addressArr.reduce(function(memo, value) {
	  	return memo + '+' + value;
		});

		value.googleMapStreetView = "https://maps.googleapis.com/maps/api/streetview?size=375x175&location="+ value.addressParam + "&key=" + myGoogleAPI;
	
  });
  
  //googlePlaceID is on line 62
  return googlePlaceID();

};

////from line 130 - 174, function use to display the result on the page////////////////////////

//Add new element to html page
var addElement = function(element, parent, id) {
	var tag = document.createElement(element);
	tag.id = id;
	return document.getElementById(parent).appendChild(tag);
};

//Use to add text to html page
var displayText = function(id, element, content) {
	  var parent = document.createElement(element);
	  var child = document.createTextNode(content + " ");
	  parent.appendChild(child);
	  return document.getElementById(id).appendChild(parent);
};

//Use to add image to html page
var displayImage = function(id, image) {
	var child = document.createElement("img");
	child.id = "image";
	child.setAttribute('src', image);
	return document.getElementById(id).appendChild(child);
};

//Add space to html page
var displaySpace = function(id) {
	var space = document.createElement("br");
	return document.getElementById(id).appendChild(space);
};

//Use to display object on the same line or adjacent to each other.
var displayOnTheSameLine = function(pending, imageID, image, hyperlink, textID, textContent) {
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
	return document.getElementById(pending).appendChild(gradparent);

};

//Use to display the results on the html page
var displayResult = function(){
	
	each(stores, function(value, key) {
		addElement("div", "result-box", "results");
		addElement("section", "results", "business-description");
		addElement("aside", "results", "business-streetview-image");	
		displayOnTheSameLine("business-description", "image", value.ratingImg, value.yelpURL, "businessname", value.name);		
		displayText("business-description", "p", value.categories);	
		displayOnTheSameLine("business-description", "direction", "direction.png", value.googleURL, "address", value.address);
		displayImage("business-streetview-image", value.googleMapStreetView);
		displaySpace("business-description");
		displaySpace("business-streetview-image");
		displaySpace("business-streetview-image");

	});

	displayImage("business-description", "poweredByYelp.png");
	addElement("footer", "business-streetview-image", "credit");
	displayText("credit", "p", "NOTE: Streetview images may be outdated at time of search.")

};

//search() is invoked when button got click on the html page.
//it sends request for yelp business info
var search = function() {
	//line 203-207 reset results display on html page when the new zipcode is entered.
	var removePrevResults = document.getElementById("results");
	removePrevResults.remove();
	stores = [];
	googleURLLength = 0;
  placeIDLength = 0;

	var location = document.getElementById("zipcode");
	var zipcode = location.value;
	
	var xhr = new XMLHttpRequest();

	xhr.open('GET',"http://localhost:3030/api/search?zip=" + zipcode);

	xhr.onload = function() {	
	  if(xhr.status === 200){
	  //selected function is on line 95
			selected(xhr.responseText);
	  } else {
			alert("search() request failed. Return the status of "+ xhr.resposeText);
	  }
	};

	xhr.send();

};

