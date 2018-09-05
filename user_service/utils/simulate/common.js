//var baseUrl = "http://krjo16lse.cartesia.se:1026/fiware/";
var baseUrl = "http://10.3.63.46:1026/";

var localFiwareIp = "10.3.63.46:1026/";
var proxyUrl = "http://smartregion.sokigo.com/fiwareproxy/";
//var proxyLocalUrl = "http://smartregion.sokigo.com/fiwareproxy/local/"
let proxyLocalUrl = "http://localhost:8050/"
var poiUrl = "http://smart-poi-test.sokigohosting.com/poi_dp/";

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


function backToIndex(){
	location.assign("http://smartregion.sokigo.com/fiware/index.html");
}

function createXhrRequest(url, method, data, callback, error) 
{
	var request = createXhr();
	request.open(method.toUpperCase(),url);
	request.onreadystatechange = function () {
	  if (this.readyState === 4) {
		if(this.status==200){
			var responseText = this.responseText;
			var result = JSON.parse(responseText);
			callback && callback(result);		
		} else if(this.status >= 400 && this.status < 500) {
			if(isJson( this.responseText)) {
			  error && error(JSON.parse(this.responseText));
			} else {
				error && error(this.responseText);
			}
		}
	  }
	};
	
	if(method.toLowerCase() == "get" || method.toLowerCase() == "head") {
		request.send();
	} else {
		request.setRequestHeader("Content-Type", "application/json");
		request.send(JSON.stringify(data));
	}
}

function isJson(str) {
	try {
		JSON.parse(str);
	}catch(e) {
		return  false;
	}
	return true;
}

function createXhr() {
	return createCORSRequest();
	
}