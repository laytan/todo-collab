# List Access API

All endpoints require authorization with a bearer token and will return a 401 UNAUTHORIZED otherwise.

All requests to a list must be done by the user that owns that list.

* [Give a user access to a list](#create)
* [Revoke a user's access to a list](#remove)

## <a name="create"></a>Give a user access to a list

**URL**: `/user-has-access`

**METHOD**: `POST`

**DATA CONSTRAINTS**

Returns a 400 response when validation fails as mentioned in the beginning of this documentation.

All fields are **required**

```json
{
    "user_id": "[a valid user id of the user to give access]",
    "list_id": "[a valid list id (that is owned by the user requesting)]",
}
```

**DATA EXAMPLE**

If user with id 4 needs to have access to the list with id 3

```json
{
  "user_id": 4,
  "list_id": 3
}
```

### SUCCESS RESPONSE

**CODE**: `201 CREATED`

```json
{
  "id": 1,
  "created_at": "2020-05-20T21:22:22.000Z",
  "updated_at": "2020-05-20T21:22:22.000Z",
  "status": 1,
  "user_id": 4,
  "list_id": 3
}
```

### ERROR RESPONSE

If the authenticated user does not own the list

**CODE**: `403 FORBIDDEN`

```json
{
  "name": "Forbidden",
  "message": "You are not the list owner.",
  "code": 403,
  "className": "forbidden",
  "errors": {}
}
```

## <a name="remove"></a>Revoke a user's access to a list

**URL**: `/user-has-access/[list_id]?user_id=[user_id]`

**METHOD**: `DELETE`

**DATA CONTSTRAINTS**

Returns a `400 BAD REQUEST` when there is no user_id given.

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

When the authenticated user does not own the list.

**CODE**: `403 FORBIDDEN`

```json
{
  "name": "Forbidden",
  "message": "You do not have access to this list.",
  "code": 403,
  "className": "forbidden",
  "errors": {}
}
```

When there is no existing access given to this user for this list.

**CODE**: `404 NOT FOUND`

```json
{
  "name": "NotFound",
  "message": "No access found for user: [user_id] on list: [list_id]",
  "code": 404,
  "className": "not-found",
  "errors": {}
}
```

When the authorized user did not grant the access.

**CODE**: `403 FORBIDDEN`

```json
{
  "name": "Forbidden",
  "message": "You did not grant access so you can\'t revoke it.",
  "code": 403,
  "className": "forbidden",
  "errors": {}
}
```
