
class manageFiware{

static get proxyLocalUrl(){
	return "http://smartregion.sokigo.com/fiwareproxy/local/"
} 

constructor(){
	
}

static createCORSRequest(method, url) {
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

static createXhrRequest(url, method, data, callback, error) 
{
	var request = manageFiware.createXhr();
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
	return request;
}

static isJson(str) {
	try {
		JSON.parse(str);
	}catch(e) {
		return  false;
	}
	return true;
}

static createXhr() {
	return manageFiware.createCORSRequest();
	
}


	static updateEntities(){
		return new Promise((resolve,reject) =>{
			var request = new XMLHttpRequest();

			
            request.open('GET', 'http://localhost:8050/publicEntities');
            request.withCredentials = true;

			request.onreadystatechange = function () {
			  if (this.readyState === 4) {
				  if(this.status==200){
					var responseText = this.responseText;
					var result = JSON.parse(responseText);
					//var entities=result;
					resolve(result);
				  } 
			  }
			};

			request.send();		
		});
	}
	
	static createSensor(sensorName, sensorType, attributes){
		return new Promise((resolve, reject)=>{
			
		
		var url = "http://smartregion.sokigo.com/fiwareproxy/local/" + "v1/updateContext/"; 
		var data = {
			contextElements: [{
				type: sensorType,
				id: sensorName,
				attributes: attributes 
			}],
			updateAction:"APPEND"
		};
		console.log(data);
		var request = manageFiware.createXhrRequest(url,"POST", data);
		
		request.onreadystatechange = function () {
				if (this.readyState === 4) {
				  if(this.status==200){
					var responseText = this.responseText;
					var result = JSON.parse(responseText);
					//var entities=result;
					resolve(result);
				  } 
			  }
			};
		});
	}
	
	static deleteSensor(s){
		if(s &&s.id){
		return new Promise((resolve,reject)=>{ 
			var request = manageFiware.createXhrRequest("http://smartregion.sokigo.com/fiwareproxy/local/"+"/v1/updateContext","POST",{
							contextElements: [{
								"id":s.id
							}],
					updateAction:"DELETE"});
			request.onreadystatechange = function () {
				if (this.readyState === 4) {
				  if(this.status==200){
					var responseText = this.responseText;
					var result = JSON.parse(responseText);
					//var entities=result;
					resolve(result);
				  } 
			  }
			};
			});
		}
	}

	static getSubscriptions(){
		var request = new XMLHttpRequest();

		request.open('GET', proxyLocalUrl+'v2/subscriptions/');

		request.onreadystatechange = function () {
		  if (this.readyState === 4) {
			  if(this.status==200){
				var responseText = this.responseText;
				var result = JSON.parse(responseText);
				subscriptions=result;
				console.log(subscriptions);
				var subscriptionDiv = document.getElementById("subscriptionsDiv");
				while(subscriptionDiv.firstChild){
					subscriptionDiv.removeChild(subscriptionDiv.firstChild);
				}
				var list = document.createElement("ul");
				for(var i=0;i<subscriptions.length;i++){
					var item = document.createElement("li");
					var details = document.createElement("details");
					var summary = document.createElement("summary");
					summary.innerHTML = subscriptions[i].subject.entities[0].id;
					var date = document.createElement("div");
					if(subscriptions[i].notification.lastNotification) {
						date.innerHTML = "Senaste uppdateringen " + subscriptions[i].notification.lastNotification;
					}
					var more = document.createElement("table");
					var tableHeader=document.createElement("tr");
					var th1 = document.createElement("th");
					th1.innerHTML="Sensor";
					tableHeader.append(th1);
					more.append(tableHeader);
					for(var cond in subscriptions[i].subject.condition.attrs){
						var row = document.createElement("tr");
						var propName = document.createElement("td");
						propName.innerHTML=subscriptions[i].subject.condition.attrs[cond];
						
						
						
						row.append(propName);
						more.append(row);
					}
					details.append(summary);
					details.append(date);
					details.append(more);
					item.append(details);
					list.append(item);
				}
				subscriptionDiv.append(list);
			  } 
		  }
		};

		request.send();		
	}

	static getTypes(){
		return new Promise((resolve,reject) =>{
			var request = new XMLHttpRequest();

			request.open('GET', "http://smartregion.sokigo.com/fiwareproxy/local/"+'v2/types/');

			request.onreadystatechange = function () {
			  if (this.readyState === 4) {
				  if(this.status==200){
					var responseText = this.responseText;
                    var result = JSON.parse(responseText);
                   
					resolve(result);
				  } 
			  }
			};

			request.send();		
		});
	}

	static getSettingUrls(entity){
		var url = this.proxyLocalUrl.indexOf("://") != -1 ? this.proxyLocalUrl.substring(this.proxyLocalUrl.indexOf("://"+3)) : this.proxyLocalUrl;
		var urls = [];
		var arrrObj = this._toArray(entity);
        for (var attribute in entity) {
            //console.log(entity);
            if (attribute != "id" && attribute != "type" && attribute != "selected") {
                var text = "(curl " + url +  "v2/" + "entities/" + entity.id + "/attrs" + " -s -S \\\n" +
					"--header 'Content-Type: application/json' --header 'Accept: application/json' \\\n" +
					"-X PATCH -d @- | python -mjson.tool) <<EOF \n" +
					"\{" + "\"" + attribute + "\"" +"{\"value\" : \" <Sensor value>\"}\n"+
                    "}" +  
                    "\n" + 
					"EOF";
				urls.push({attr: attribute, url: text});
			}
		}
		
		return urls;
	}
	
	static _toArray(obj){
            return Object.keys(obj).map(function(key) {
                return {
                    name: key,
                    value: obj[key]
                };
            });
        }
}