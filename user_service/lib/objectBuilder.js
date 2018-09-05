
let NOTIFY_URL = process.env.NOTIFY_URL;

exports.registerContext = function (obj, username, password, url) {

    let attribs = obj.attributes.map((e) => {
        return {
            name: e.name,
            isDomain: false,
            type: e.type
        };
    })


    return {
        contextRegistrations: [
            {
                entities: [
                    {
                        "type": obj.type,
                        "isPattern": "false",
                        "id": obj.id
                    }
                ],
                attributes: attribs,
                credential: {
                    username: username,
                    password: password
                },
                providingApplication: url
            }
        ],
        duration: "P1M"
    }

}

exports.updateContext = function (obj, username) {

    //let username = "testing"

    obj.contextElements[0].attributes.forEach((e) => {
        if (e.name === 'owner') {
            e.value = username;
        }
    })

    if (obj.provApp) {
        delete obj.provApp
    }

    return obj
}

exports.subscriptionContext = function (obj) {


    let attribs = obj.contextElements[0].attributes.map((e) => {
        return e.name
    })


    //// V1
    //return {
    //    entities: [
    //        {
    //            type: "test",
    //            isPattern: false,
    //            id: obj.id
    //        }
    //    ],
    //    attributes: attribs,
    //    reference: "URL to notify",
    //    duration: "P1M",
    //    notifyConditions: [
    //        {
    //            type: "ONCHANGE"
    //        }
    //    ],
    //    throttling: "PT5S"
    //}


    // V2
    return {

        description: "A subscription for " + obj.contextElements[0].id,
            subject: {
            entities: [
                {
                    id: obj.contextElements[0].id,
                    type: obj.contextElements[0].type
                }
            ],
                condition: {
                attrs: [

                ]
            }
        },
        notification: {
            http: {
                url: NOTIFY_URL + "/update"
            }
        },
  
        throttling: 5
    
    }
}

exports.customNotificationObject = function (obj) {

    let str = "";
    obj.rules.forEach((e) => {
        if (e === true) {

        } else {
            str += e + ";"
        }
        
    });
    str = str.substring(0, str.length - 1)
    

    return {
        description: "A subscription for " + obj.id,
        subject: {
            entities: [
                {
                    idPattern: obj.id,
                    type: obj.type
                }
            ],
            condition: {
                attrs: obj.attributesToMonitor
                ,
                expression: {
                    q: str
                }
            }
        },
        notification: {
            httpCustom: {
                url: "URL HERE /orion/notification",
                qs: {email: obj.email}
            },
            attrs: obj.attributesInNotification
        },

        throttling: 5
    }
}