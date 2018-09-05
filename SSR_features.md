# Features SSR v1.0


#### Client/Webserver
* Sensors are added via web UI. The sensor request will then have to mirror this structure otherwise it might break the ows table structure.
* Sensors can be deleted via the UI.
* Sensors can be changed via the UI.
* A subscription is added when a sensor is added. Notify URL is in the code as of know. The notifyURL should be the webservice itself.
* A user can log in via fiware idm oauth.
* Using an OSM map as a base layer.
* Sensors can be selected in the menu an individually shown on the map, now that functionality only works with the temperature attribute.
* Client is connected to webserver via websockets and is notified on change, if the updated sensor is selected and visile on the map a small animation is shown.
* A cluster layer is implemented so the map features are clustered when to close. The number of features is then the value on the feature.
* Web service has basic security, a user needs to be logged in to do certain things.
* Logic regarding My List exists. However not fully implemented, it is not synced with the ows. Only with the client features.
* All attributes exists as schemas in a mongoDB. No client administration is implemented yet. They need to be put in the db manually and the client will list them.
* Simple search in the sensor list and filtering on types.
* For the client layer the sensors have different colors depending on their attribute.
* Google cluster markers are used, map is zooming to next extent when clicking a marker.
* Simple info window on sensor click.
* Custom notifications can be configured in the view.
* Custom notification can be directed to email adress.




#### Mapserver/TinyOWS
* When a sensor is created a WFS-T request creates a new feature in the corresponding layer.
* When a sensor is updated a WFS-T request updates the feature.
* The client reads all available layers via WMS and can turn them on and off (Openlayers 4).
* Every attribute has a point and heatmap layer (Only implemneted for humidity and temperature for know).
* When a sensor is deleted a WFS-T request deletes the feature.
* Triggers exists on the attribute tables so the old data is pushed to a attributename + _history table with a timestamp (Not used for anything yet).
* When a sensor attribute is changed in the web it is changed in the ows aswell.





