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
	
	xhr.open('GET',"http://localhost:3030/api/businessinfo?hours=" + value.place);

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
	xhr.open('GET',"http://localhost:3030/api/location?address=" + value.addressParam);
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
    console.log(responseObj.businesses);	
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

var imgHyperLink = function(id, image, hyperlink){

	var child = document.createElement("img");
	child.id = "image";
	child.setAttribute('src', image);

	if(arguments.length === 2){
	  return document.getElementById(id).appendChild(child);

	} else {

	  var parent = document.createElement("a");
	  parent.setAttribute('href', hyperlink);
	  parent.appendChild(child);
	  return document.getElementById(id).appendChild(parent);
	}

};

var displaySpace = function(id){
	var space = document.createElement("br");
	return document.getElementById(id).appendChild(space);
};


var displayResult = function(){

	
	each(stores, function(value, key){

		var resultBox = document.createElement("div");
		resultBox.id = "result-1";
		document.getElementById("results-box").appendChild(resultBox);

		var myAPI = "AIzaSyCpom91tWpzix_pgvqn33vw3Z2k3hSU53M";
		var googleMapStreetView = "https://maps.googleapis.com/maps/api/streetview?size=375x175&location="+ value.addressParam + "&key=" + myAPI;

		var testSection = document.createElement("section");
		testSection.id = "business-description";
		document.getElementById("result-1").appendChild(testSection);

		var testAside = document.createElement("aside");
		testAside.id = "business-streetview-image";
		document.getElementById("result-1").appendChild(testAside);

		console.log(value.categories);

////// refactor this////////////////////////////////////////////////////////////////

		//textResults("business-description", "h3", value.name);
		//imgHyperLink("business-description", value.ratingImg, value.yelpURL);

		var yelpRating = document.createElement("img");
		yelpRating.id = "image";
		yelpRating.setAttribute('src', value.ratingImg);
		var yelpLink = document.createElement("a");
	  	yelpLink.setAttribute('href', value.yelpURL);
	  	yelpLink.appendChild(yelpRating);
	  	
	  	var business = document.createElement("h3");
	    var businessName = document.createTextNode(value.name + " ");
	    business.appendChild(businessName);
	    business.appendChild(yelpLink);
	    document.getElementById("business-description").appendChild(business);

///////////////////////////////////////////////////////////////////////////////////////

		textResults("business-description", "p", value.categories);
		//textResults("business-description", "p", value.address);

		var direction = document.createElement("img");
		direction.id = "direction";
		direction.setAttribute('src', "direction.png");
		var googleLink = document.createElement("a");
	  	googleLink.setAttribute('href', value.googleURL);
	  	googleLink.appendChild(direction);

	  	var address = document.createElement("p");
	  	address.id = "address";
	    var businessAddress = document.createTextNode(value.address + " ");
	    address.appendChild(businessAddress);
	    address.appendChild(googleLink);
	    document.getElementById("business-description").appendChild(address);

///////////////////////////////////////////////////////////////////////////////////////


		imgHyperLink("business-streetview-image", googleMapStreetView);
		displaySpace("business-description");
		displaySpace("business-streetview-image");
		displaySpace("business-streetview-image");
		
		

	});
	
	displaySpace("result-1");
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

