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

var selected = function(collection) {

	
	var stores = [];
	var responseObj = JSON.parse(collection);
	
	each(responseObj.businesses, function(value, key){
		stores.push({'name': value.name,
					'url': value.url,
					'categories': value.categories,
					'address': value.location.address[0] + ', ' +value.location.city +', ' + value.location['state_code'] + ', ' + value.location['postal_code'],
					'crossStreet': value.location['cross_streets'],
					'ratingImg': value['rating_img_url_small'],
					//'latitude': value.location.coordinate.latitude,
					//'longtitude': value.location.coordinate.longitude
		});
	});
	
	each(stores, function(value, key){
		console.log(value.categories);
		var addressArr = value.address.split(" ");
		var	addressParam = "";
		each(addressArr,function(element, key, collection){
			if(key < collection.length-1){
			  addressParam = addressParam + element + "%20"; 
			} else {
			  addressParam += element;
			}	
		});

		var resultBox = document.createElement("div");
		resultBox.id = "result-1";
		document.getElementById("results-box").appendChild(resultBox);

		var yelpLink = document.createElement("a");
		yelpLink.setAttribute('href', value.url);
		
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
		var space = document.createElement("br");
		document.getElementById("result-1").appendChild(space);

		var myAPI = "AIzaSyCpom91tWpzix_pgvqn33vw3Z2k3hSU53M";
		var googleMapStreetView = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+ addressParam + "&key=" + myAPI;
		
		var streetView = document.createElement("img");
		streetView.setAttribute('src', googleMapStreetView);
		document.getElementById("result-1").appendChild(streetView);
	});

	var credit = document.createElement("img");
	credit.setAttribute('src', "poweredByYelp.png");
	document.getElementById("result-1").appendChild(credit);
}

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
		alert("The alice-app.js request failed. Return the status of "+ xhr.resposeText);
	  }

	};

	xhr.send();

}


