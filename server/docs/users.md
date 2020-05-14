# Users API

* [Create an account](#create-an-account)
* [Log in](#log-in)

## <a name="create-an-account"></a>Create an account

Creates an account / registers / sign up

**URL**: `/users`

**METHOD**: `POST`

**AUTH REQUIRED**: NO

**DATA CONSTRAINTS**

Returns a 400 response when validation fails as mentioned in the beginning of this documentation.

All fields are **required**

```json
{
    "username": "[between 2 and 25 characters]",
    "email": "[a valid email address]",
    "password": "[non whitespace between 6 and 200 characters]"
}
```

**DATA EXAMPLE**

Register bob

```json
{
    "username": "bob",
    "email": "bob@example.com",
    "password": "bobspassword"
}
```

### SUCCESS RESPONSE

**CODE**: `201 CREATED`

**CONTENT EXAMPLE**

```json
{
  "username": "bob",
  "email": "bob@example.com",
  "isVerified": 0,
  "id": 1,
  "created_at": "2020-05-14T21:34:34.000Z",
  "updated_at": "2020-05-14T21:34:34.000Z",
  "status": 1
}
```

### ERROR RESPONSE

Returns a 409 response when the username or email is already in use.

**CODE**: `409 CONFLICT`

```json
{
  "name": "Conflict",
  "message": "[Username|email] is already in use.",
  "code": 409,
  "className": "conflict",
  "errors": {}
}
```

## <a name="log-in"></a>Log in

Authenticate with email and password and retrieve a bearer token

**URL**: `/authentication`

**METHOD**: `POST`

**AUTH REQUIRED**: NO

**DATA CONSTRAINTS**

Returns a 400 response when validation fails as mentioned in the beginning of this documentation.

All fields are **required**

```json
{
    "email": "[a signed up email address]",
    "password": "[password that belongs to the email]",
    "strategy": "local"
}
```

**DATA EXAMPLE**

Log in with bob

```json
{
    "email": "bob@example.com",
    "password": "bobspassword"
}
```

### SUCCESS RESPONSE

**CODE**: `201 CREATED`

**CONTENT EXAMPLE**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE1ODk0OTMwOTIsImV4cCI6MTU4OTU3OTQ5MiwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiNCIsImp0aSI6ImQzODg5ODU2LWYzZWQtNGU3MS1hOTcyLTIwMDg3OGMwM2M0MCJ9.qXP4ckWEvQG4NeTSpKURLq83qTirZEVzalQkFjI4sro",
  "authentication": {
    "strategy": "local"
  },
  "user": {
    "username": "bob",
    "email": "bob@example.com",
    "isVerified": 0,
    "verifyToken": "d32fdff344f9c03f4662f3664bd13c",
    "verifyShortToken": "171808",
    "verifyExpires": 1589924074721,
    "verifyChanges": "{}",
    "resetToken": null,
    "resetShortToken": null,
    "resetExpires": null,
    "id": 1,
    "created_at": "2020-05-14T21:34:34.000Z",
    "updated_at": "2020-05-14T21:34:34.000Z",
    "status": 1
  }
}
```

### ERROR RESPONSE

Returns a 401 response when the email or password is wrong.

**CODE**: `401 UNAUTHORIZED`

```json
{
  "name": "NotAuthenticated",
  "message": "Invalid login",
  "code": 401,
  "className": "not-authenticated",
  "errors": {}
}
```
