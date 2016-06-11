
var selected = function(collection) {
	//var category = document.getElementById('add-text'); 
	var responseObj = JSON.parse(collection);
	
	var store = responseObj.businesses[0];
	var storeName = store.name;
	var storeUrl = store.url;
	var storeCategories = store.categories;
	var storeAddress = store.location.address[0] + ', '+ store.location.city + ', ' + store.location['state_code'] + ', ' + store.location['postal_code']
	//console.log(store.location['state_code']);
	//console.log(store.location['postal_code']);
	var storeCrossStreet = store.location['cross_streets'];
	var storeRatingImg = store['rating_img_url_small'];

	var businessName = document.getElementById('business-name'); 
	businessName.innerText = storeName;
	//var category = document.getElementById('categories');
	//category.innerText = storeCategories;
	var businessRating = document.getElementById('rating-img');
	businessRating.src = storeRatingImg;
	var businessAddress = document.getElementById('address');
	businessAddress.innerText = storeAddress;
	
}

console.log("alice-app.js is connected!");

var search = function() {
	var location = document.getElementById("zipcode");
	var zipcode = location.value;
	

	//var zipcode = "94102";

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

//google.com/search?value=cats&date=4102015


