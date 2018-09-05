var subscriptions = [];
var entities = [];
var entity;
// var baseUrl = "http://krjo16lse.cartesia.se:1026/fiware/";
var hideDetails = true;
var propertiyIDs = [];




/**
* Elements that make up the popup.
*/
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');



function getEntities() {
    console.log("wanna get entities")
    var request = new XMLHttpRequest();

    //request.open('GET', 'http://localhost:8050/simulate/getEntities', true);
    request.open('GET', 'http://localhost:8050/publicEntities', true);
    //request.addEventListener('load', showResponse);

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status == 200) {
                console.log(responseText)
                var responseText = this.responseText;
                var result = JSON.parse(responseText);
                entities = result;
                console.log(entities);
                var entitiesOptions = document.getElementById("entitiesSelect");
                while (entitiesOptions.firstChild) {
                    entitiesOptions.removeChild(entitiesOptions.firstChild);
                }
            }
            for (var i = 0; i < entities.length; i++) {
                var opt = document.createElement("option");
                opt["value"] = entities[i].id;
                opt.innerHTML = entities[i].id;
                entitiesOptions.append(opt);
            }
        }
    };


    request.send();
}
function showResponse(e) {
    console.log(e.target.response)
}


function getEntityInfo() {
    var select = document.getElementById("entitiesSelect");
    var entityId = select.options[select.selectedIndex].value;
    console.log(entityId);
    getEntityDetails(entityId);
}

function getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
}

var newTemp = 0;
function updateValues() {
    console.log("uppdaterar värde");

    var select = document.getElementById("entitiesSelect");
    var entityId = select.options[select.selectedIndex].value;
    var entity = this.entities.filter(e => e.id == entityId);
    var newData = {};
    if (entity.length > 0) {
        //// for(var p in entity[0]){
        //// var element = document.getElementById(p);
        //// if(element){
        //// newData[p] = { "value": element.value }
        //// }
        //// }
        //newTemp = Math.round((27 * Math.random() - 5));
        //newData["Temperature"] = { "value": newTemp };
        //newData["id"] = { "id": entityId };
        //var data = JSON.stringify(newData);



    }
    // var xhr = new XMLHttpRequest();
    var xhr = createCORSRequest("PATCH",
        'http://10.3.63.46:1026' + "v2/entities/" + entityId + "/attrs")

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var infoDiv = document.getElementById("entityDetailsDiv");
            infoDiv.innerHTML = "Nuvarande temp = " + newTemp.toString();
            //backToIndex();
        }
    });


    // xhr.open("POST", "http://krjo16lse.cartesia.se:1026/fiware/v2/entities/Frasses/attrs");
    xhr.setRequestHeader("content-type", "application/json");

    console.log(data)
   // xhr.send(data);

}

function updateAllValues() {

   

    for (var i = 0; i < this.entities.length; i++) {

        setTimeout(function (x) {
            return function () {
                

                var entity = this.entities[x];
                var newData = {};

                if (entity) {

                    //console.log(Object.keys(entity))

                    let attrs = Object.keys(entity);

                    attrs.forEach((e) => {
                        if (e === 'temperature') {
                            var setTemp = Math.round((32 * Math.random() - 10));

                            newData["temperature"] = { "value": setTemp };
                            
                        } else if (e === 'humidity') {
                            var setHumid = Math.floor((Math.random() * 100) + 40);

                            newData["humidity"] = { "value": setHumid };
                        }
                    })

                   
                    //newData["id"] = { "id": this.entities[x].id };

                    console.log(newData)
                    var data = JSON.stringify(newData);

                    // var xhr = new XMLHttpRequest();
                    var xhr = createCORSRequest("PATCH",
                        'http://localhost:8050/simupdate?id=' + entity.id)


                    xhr.setRequestHeader("content-type", "application/json");

                    xhr.send(data);

                };

               
                
            };
        }(i), 8000 * i);
        // 1 2 3 4 5
    }

}



var running = false;
function startSimulate() {
    if (running) {
        window.clearTimeout(timer);
    }
    running = true;

    simulate();
}

function stopSimulate() {
    window.clearTimeout(timer);
    running = false;
    var infoDiv = document.getElementById("entityDetailsDiv");
    infoDiv.innerHTML = "Avslutat uppdatering";
}


function startSimulateAll() {
    if (running) {
        window.clearTimeout(timer);
    }
    running = true;
    var infoDiv = document.getElementById("entityDetailsDiv");
    infoDiv.innerHTML = "Uppdaterar temperaturer";
    simulateAll();
}

function stopSimulateAll() {
    window.clearTimeout(timer);
    running = false;
    var infoDiv = document.getElementById("entityDetailsDiv");
    infoDiv.innerHTML = "Avslutat uppdatering";
}


function reloadInfo() {
    // getSubscripotions();
    getEntities();
}


var timer;
function simulate() {

    if (running) {
        updateValues();
        timer = window.setTimeout(function () {
            simulate();
        }, 3000);
    }
}


function simulateAll() {
    if (running) {
        updateAllValues();
        timer = window.setTimeout(function () {
            simulateAll();
        }, 300000);
    }
}


reloadInfo();