## Intro
This is a simple webappliation based on node.js. Built by Sokigo AB as part of the project Sense Smart Region.
The main goal was to build a platform to make the administration of entites connected to a fiware platform easier.
This is a proof on concept and may still contain some bugs and flaws. It is a good starting point to see how one
can visualize senors on a map in real time and how one can work with fiware and an ows service.  

The general use case has been that:
 * A user will use the platform to register a sensor or entity in orion context broker.
 * He/she will use the platform to monitor its values and see the updates in real time.
 * The user can change the entity attributes and create custom notifications based on simple logical rules.

We have added some more features that makes the app a little more user firendly.
See the file SSR_features for a full feature list.

## Installation

#### Fiware
* This will assume that you have a working fiware instance running.
* If not you can read about it [here](https://fiware-orion.readthedocs.io/en/master/). The documentation
 for the orion broker is also available there.
* Change the .env file to match your fiware instance.

#### Keyrock
* This service uses keyrock for authenticating. Either set up yout own or you can use a 
  public one [Public keyrock](https://account.lab.fiware.org/).
* By using this you will authenticate via OAuth2 and authorize a user with an application.
 [Link to the keyrock github](https://github.com/ging/fiware-idm).
* Change the .env file to set the callback uri of you application. And also to set the uri och the keyrock instance.

#### OWS
* The app supports some basic ows features. Such as:
  * Getting available layers from ows service.
  * Switching the layers on and off.
  * When and entity gets and update it will generate a WFS-T request to the ows service and update the 
  feature in that db. 
  * When and enity is added, deleted or changed the changes are reflected in the ows.
* The app will run just fine without the ows. The only thing in the front end that uses it visually is 
the layer control button in the toolbar. One could also comment out the uses in the backend to avoid getting alot
of errors.
* I have used Mapserver for windows when I tested it. [ms4w Page](https://ms4w.com/)
* The configuration for the ows is out of scope for this readme but in general terms it needs to be:
  * Installed. 
  * Use Mapfile apache environment variable.
  * Make sure tinyows is activated (for WFS-T).
* Uri for the ows is changed in the .env file.

_The mapfile I used for testing is in the sample folder. It features basic vector layers and some
heatmap layers for insipration_

#### Front end
_This app has been developed and mostly tested locally. More testing and some configuration will have to be made
to make it secure when publishing. Tha app is built on polymer 2. Framework for maphandling is
openlayers_

* Change the url in public/src/socketConnection/socketConnection.html - ```this.socket = io('http://localhost:8050');``` to the correct uri for your app.
* Clone the repo/folder and unpack it. 
* ```cd ``` into the app folder.
* Run ```npm install``` inside the app folder.
* Change the file .env to your needs.
* Run ```npm start``` to start the application.

###### Attributes
The attributes that can be selected from needs to be put in a db for easier control/handling.
* To add attributes to the application:
  * You need a mongodb instance. When I did it I used mongolab.
  * Create the intance, set the connection string in config/config.js and uncomment the code in 
  lib/dBHelper.js to populate the mongo with attributes.
###### Mail notification
A user can create custom notications that will generate an email to the specified recipient.
The configs for the mail is in the .env file. You need to specify an account that sends the mails. I have 
only tested it with a gmail account so I don´t know have it will behave with other providers.

###### Map markers
I have drawn markers for the attributes that comes with this package but if the user whishes to add more 
attributed then you have to add more markers. I used InkScape and will send a base file in the samples folder
if anyone wishes to use the same base img.

###### Build
Since polymer is used the default building tools have been used. 
 * Have polymer installed globally
 * Run ```polymer build --js-minify --css-minify --html-minify --bundle```
 in the same folder as your index.html. This will generate the same output as the one that exists in the build dir.


Another option would be to create a polymer.json to specify how you want to build the application. [Polymer build docs](https://www.polymer-project.org/2.0/toolbox/build-for-production)
 ## Suggestions for future implementation
* Some form of view to visualize historical data. WMS-T maybe? Graphs?
* Add Attributes in the view and configure them there instead of against the db.
* Save lists of entites. That can be named/managed.
* Expand custom notification capabilities. Create accumulator server that can make calculations based on other
entites. Maybe send to SMS?
* Make the app mobile friendly.
* Manage subscriptions in the web.
* Filter the ows features on private attribute.