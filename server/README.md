# todo-collab server

Every POST and PATCH request can return a badrequest when required data is not given, the body is empty or when the given data is invalid.

**EXAMPLE BAD REQUEST RESPONSE**:

This is the response you get on POST: /users when the password is not valid.

```json
{
  "name": "BadRequest",
  "message": "Request failed validation.",
  "code": 400,
  "className": "bad-request",
  "data": {},
  "errors": [
    {
      "password": "\"password\" length must be at least 6 characters long"
    }
  ]
}
```

## Create an account

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
