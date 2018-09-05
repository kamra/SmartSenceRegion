## Adding sensor
1. Make a registerContext call
2. Make a updateContext call to apply entity to entities collection and set the right attributes
3. Make a subscription call to be notified when a value changes

## Updating from software
We use the x-auth-token header to authenticate our requests aginst the live environment. Use the OAuth token here.

## Updating from sensor against live environment
In the updateContext payload we add a:


``
auth: {
    username: 'sensor_id',
    password: 'sensor_password'
}
``


block in the payload. This is to authenticate the request in the PE proxy. This is added last in the payload.

