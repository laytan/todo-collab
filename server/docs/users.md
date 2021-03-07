# Users API

**UNAUTHORIZED**

* [Create an account](#create-an-account)
* [Log in](#log-in)

**AUTHORIZED**

* [Remove your account](#remove-your-account)
* [Change your profile data](#change-profile)
* [Get a single user](#get-user)
* [Find users](#find-users)

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

## <a name="remove-your-account"></a>Remove your account

**URL**: `/users/[id]`

**METHOD**: `DELETE`

**AUTH REQUIRED**: BEARER

### SUCCESS RESPONSE

**CODE**: `404 NOT FOUND`

```json
{
  "name": "NotFound",
  "message": "No record found for id '[id]'",
  "code": 404,
  "className": "not-found",
  "errors": {}
}
```

### ERROR RESPONSE

When the authenticated user is not the user being deleted

**CODE**: `403 FORBIDDEN`

```json
{
  "name": "Forbidden",
  "message": "You can only delete your own account.",
  "code": 403,
  "className": "forbidden",
  "errors": {}
}
```

## <a name="change-profile"></a>Change your profile data

**URL**: `/users/[id]`

**METHOD**: `PATCH`

**AUTH REQUIRED**: BEARER

**DATA CONSTRAINTS**

Returns a 400 response when validation fails as mentioned in the beginning of this documentation.

All fields are **optional**

```json
{
    "username": "[between 2 and 25 characters]",
    "email": "[a valid email address]",
    "password": "[non whitespace between 6 and 200 characters]"
}
```

**DATA EXAMPLE**

Changing the username to bobby and password to password

```json
{
    "username": "bobby",
    "password": "password"
}
```

### SUCCESS RESPONSE

**CODE**: `200 OK`

```json
{
  "username": "bobby",
  "email": "someone@example.com",
  "isVerified": 0,
  "id": 1,
  "created_at": "2020-05-15T18:42:34.000Z",
  "updated_at": "2020-05-15T18:42:34.000Z",
  "status": 1
}
```

### ERROR RESPONSE

When the authenticated user is not the user being deleted

**CODE**: `403 FORBIDDEN`

```json
{
  "name": "Forbidden",
  "message": "You can only delete your own account.",
  "code": 403,
  "className": "forbidden",
  "errors": {}
}
```

## <a name="get-user"></a>Get user

**URL**: `/users/[id]`

**METHOD**: `GET`

**AUTH REQUIRED**: BEARER

### SUCCESS RESPONSE

**CODE**: `200 OK`

```json
{
  "username": "bobby",
  "email": "someone@example.com",
  "isVerified": 0,
  "id": 1,
  "created_at": "2020-05-15T18:42:34.000Z",
  "updated_at": "2020-05-15T18:42:34.000Z",
  "status": 1
}
```

### ERROR RESPONSE

When there is no user with that id

**CODE**: `404 NOT FOUND`

```json
{
  "name": "NotFound",
  "message": "No record found for id '1'",
  "code": 404,
  "className": "not-found",
  "errors": {}
}
```

## <a name="find-users"></a>Find users

**URL**: `/users/[query]`

**METHOD**: `GET`

**AUTH REQUIRED**: BEARER

Look at [KnexJS docs](https://github.com/feathersjs-ecosystem/feathers-knex#querying) for the possible queries.

### SUCCESS RESPONSE

The data array will be empty when there are no results, it will still be status `200 OK`.

**CODE**: `200 OK`

```json
[
  {
    "username": "bobs13",
    "email": "bobs13@example.com",
    "isVerified": 0,
    "id": 26,
    "created_at": "2020-05-15T18:13:26.000Z",
    "updated_at": "2020-05-15T18:13:26.000Z",
    "status": 1
  },
  {
    "username": "bobs15",
    "email": "bobs15@example.com",
    "isVerified": 0,
    "id": 28,
    "created_at": "2020-05-15T18:20:29.000Z",
    "updated_at": "2020-05-15T18:20:29.000Z",
    "status": 1
  },
  {
    "username": "bobby",
    "email": "someone@example.com",
    "isVerified": 0,
    "id": 29,
    "created_at": "2020-05-15T18:42:34.000Z",
    "updated_at": "2020-05-15T18:42:34.000Z",
    "status": 1
  },
  {
    "username": "bobs155",
    "email": "bobs155@example.com",
    "isVerified": 0,
    "id": 33,
    "created_at": "2020-05-15T19:45:27.000Z",
    "updated_at": "2020-05-15T19:45:27.000Z",
    "status": 1
  }
]
```

### ERROR RESPONSE

No specific error responses
