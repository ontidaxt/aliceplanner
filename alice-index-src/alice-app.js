

//var search = function() {


	var xhr = new XMLHttpRequest();

	xhr.open('GET',"/api/", true);

	xhr.onload = function(){	
	  if(xhr.status === 200){
	    selected(xhr.responseText);
	  } else {
		alert("The alice-app.js request failed. Return the status of "+ xhr.resposeText);
		return;
	  }

	};

	xhr.send();

//};