# Todo Lists API

All endpoints require authorization with a bearer token and will return a 401 UNAUTHORIZED otherwise.

* [Create a list](#create)
* [Search lists](#find)
* [Get the full info on a list](#get)
* [Remove a list](#remove)
* [Update a list](#patch)

## <a name="create"></a>Create a list

**URL**: `/todo-lists`

**METHOD**: `POST`

**DATA CONSTRAINTS**

Returns a 400 response when validation fails as mentioned in the beginning of this documentation.

All fields are **required**

```json
{
    "name": "[between 2 and 100 characters]",
    "description": "[can be empty, max 500 characters]",
}
```

**DATA EXAMPLE**

```json
{
	"name": "groceries",
	"description": "",
}
```

### SUCCESS RESPONSE

**CODE**: `201 CREATED`

```json
{
  "name": "groceries",
  "description": "",
  "id": 1,
  "created_at": "2020-05-01T13:11:13.000Z",
  "updated_at": "2020-05-01T13:11:13.000Z",
  "status": 1,
  "owner_id": 1
}
```

### ERROR RESPONSE

No specific error responses

## <a name="find"></a>Search lists

**URL**: `/todo-lists`

**METHOD**: `GET`

Look at [KnexJS docs](https://github.com/feathersjs-ecosystem/feathers-knex#querying) for the possible queries.

**NOTE:** All queries are scoped to the lists the authorized user has access to.

### SUCCESS RESPONSE

The data array will be empty when there are no results, it will still be status `200 OK`.

**CODE**: `200 OK`

```json
[
  {
    "name": "Groceries",
    "description": "Groceries for September",
    "id": 1,
    "created_at": "2020-05-20T18:44:19.000Z",
    "updated_at": "2020-05-20T18:44:19.000Z",
    "status": 1,
    "owner_id": 1
  }
]
```

### ERROR RESPONSE

No specific error responses

## <a name="get"></a>Get the full info on a list

**URL**: `/todo-lists/[id]`

**METHOD**: `GET`

### SUCCESS RESPONSE

**CODE**: `200 OK`

```json
{
  "name": "Groceries",
  "description": "Groceries for September",
  "id": 1,
  "created_at": "2020-05-20T18:44:19.000Z",
  "updated_at": "2020-05-20T18:44:19.000Z",
  "status": 1,
  "owner_id": 1,
}
```

### ERROR RESPONSE

When there is no list with that id

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

When the user does not own the list

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

## <a name="remove"></a>Remove a list

**URL**: `/todo-lists/[id]`

**METHOD**: `DELETE`

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

## <a name="patch"></a>Update a list

**URL**: `/todo-lists/[id]`

**METHOD**: `PATCH`

**DATA CONSTRAINTS**

Returns a 400 response when validation fails as mentioned in the beginning of this documentation.

All fields are **optional**

```json
{
  "name": "[between 2 and 100 characters]",
  "description": "[can be empty, max 500 characters]"
}
```

**DATA EXAMPLE**

Changing the description to be nothing

```json
{
    "description": "",
}
```

### SUCCESS RESPONSE

**CODE**: `200 OK`

```json
{
  "name": "Groceries",
  "description": "",
  "id": 1,
  "created_at": "2020-05-20T21:05:50.000Z",
  "updated_at": "2020-05-20T21:05:50.000Z",
  "status": 1,
  "owner_id": 1
}
```

### ERROR RESPONSE

When the user does not own the list

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
