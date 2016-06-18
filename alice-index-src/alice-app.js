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

var placeID = function(){

  each(stores, function(value, key){

  	var xhr = new XMLHttpRequest();
	
	xhr.open('GET',"/api/businessinfo?hours=" + value.place);

	xhr.onload = function(){

	  if(xhr.status === 200){
	
		var responseObj = JSON.parse(xhr.responseText);
	    value['googleURL'] = responseObj.result.url;

	    if(stores[stores.length-1]['googleURL'] !== undefined){
	  	  displayResult();
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
	xhr.open('GET',"/api/location?address=" + value.addressParam);
	xhr.onload = function(){

	  if(xhr.status === 200){
	  	var responseObj = JSON.parse(xhr.responseText);	       
	  	value['place'] = responseObj.results[0]['place_id'];
	  	if(stores[stores.length-1]['place'] !== undefined){
	  	  placeID();
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
  // console.log(responseObj.businesses);	
  each(responseObj.businesses, function(value, key){
    stores.push({'name': value.name,
				  'yelpURL': value.url,
				  //'categories': value.categories,
				  'address': value.location.address[0] + ', ' +value.location.city +', ' + value.location['state_code'] + ', ' + value.location['postal_code'],
				  //'crossStreet': value.location['cross_streets'],
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
//
};
////////////////////////////////////////////////////////////////////////

var displayResult = function(){
	each(stores, function(value, key){

		var resultBox = document.createElement("div");
		resultBox.id = "result-1";
		document.getElementById("results-box").appendChild(resultBox);

		var yelpLink = document.createElement("a");
		yelpLink.setAttribute('href', value.yelpURL);
		
		var business = document.createElement("h3");
		var	storeName = document.createTextNode(value.name + " ");
		business.appendChild(storeName);

		var storeRatingImg = document.createElement("img");
		storeRatingImg.setAttribute('src', value.ratingImg);

		yelpLink.appendChild(storeRatingImg);
		business.appendChild(yelpLink);		
		document.getElementById("result-1").appendChild(business);

		var storeAddress = document.createElement("p");
		var actulAddress = document.createTextNode(value.address);
		storeAddress.appendChild(actulAddress);
		document.getElementById("result-1").appendChild(storeAddress);
		
		var myAPI = "AIzaSyCpom91tWpzix_pgvqn33vw3Z2k3hSU53M";
		var googleMapStreetView = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+ value.addressParam + "&key=" + myAPI;
		

		var streetView = document.createElement("img");
		streetView.setAttribute('id', "street-view");
		streetView.setAttribute('src', googleMapStreetView);
		document.getElementById("result-1").appendChild(streetView);

		//console.log(stores);

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

