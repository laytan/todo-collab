# Todos API

All endpoints require authorization with a bearer token and will return a `401 UNAUTHORIZED` otherwise.

All requests must be done by a user that has access to the list specified by list_id and will return a `403 FORBIDDEN` otherwise.

* [Create a todo](#create)
* [Get a todo](#get)
* [Find a todo](#find)
* [Remove a todo](#remove)
* [Change a todo(set done etc.)](#patch)

## <a name="create"></a>Create a todo

**URL**: `/todos`

**METHOD**: `POST`

**DATA CONSTRAINTS**

Returns a 400 response when validation fails as mentioned in the beginning of this documentation.

All fields are **required**

```json
{
    "order": "[A number representing the todos position in the list, starts at 0]",
    "name": "[2 to 50 characters]",
    "description": "[Max 500 characters, can be empty]",
    "label": "[Max 50 characters label used to group todos, can be empty]",
    "color": "[A hex color value used to group todos]",
    "list_id": "[ID of the list this todo belongs in]",
}
```

**DATA EXAMPLE**

```json
{
  "order": 0,
  "name": "Cheese",
  "description": "",
  "label": "refrigerated",
  "color": "#FFF",
  "list_id": 1
}
```

### SUCCESS RESPONSE

**CODE**: `201 CREATED`

```json
{
  "order": 0,
  "name": "Cheese",
  "description": "",
  "label": "Refrigerated",
  "color": "#FFF",
  "completed_at": null,
  "id": 1,
  "created_at": "2020-05-22T17:22:07.000Z",
  "updated_at": "2020-05-22T17:22:07.000Z",
  "status": 1,
  "done_by_user_id": null,
  "list_id": 1
}
```

### ERROR RESPONSE

No specific error responses

## <a name="get"></a>Get a todo

**URL**: `/todos/[id]`

**METHOD**: `GET`

### SUCCESS RESPONSE

**CODE**: `200 OK`

```json
{
  "order": 0,
  "name": "Cheese",
  "description": "",
  "label": "Refrigerated",
  "color": "#FFF",
  "completed_at": null,
  "id": 1,
  "created_at": "2020-05-22T17:22:07.000Z",
  "updated_at": "2020-05-22T17:22:07.000Z",
  "status": 1,
  "done_by_user_id": null,
  "list_id": 1
}
```

### ERROR RESPONSE

No specific error responses

## <a name="find"></a>Find Todos

**URL**: `/todos`

**METHOD**: `GET`

Look at [KnexJS docs](https://github.com/feathersjs-ecosystem/feathers-knex#querying) for the possible queries.

**NOTE:** All queries are scoped to the lists the authorized user has access to.

### SUCCESS RESPONSE

The data array will be empty when there are no results, it will still be status `200 OK`.

**Example URL**: `/todos?name[$like]=Chee%`

Above URL will return all todos the user has access to that start with Chee

**Get all todos from a list**: `/todos?list_id=1`

**CODE**: `200 OK`

```json
[
  {
    "order": 0,
    "name": "Cheese",
    "description": "",
    "label": "Refrigerated",
    "color": "#FFF",
    "completed_at": null,
    "id": 1,
    "created_at": "2020-05-22T17:22:07.000Z",
    "updated_at": "2020-05-22T17:22:07.000Z",
    "status": 1,
    "done_by_user_id": null,
    "list_id": 1
  }
]
```

### ERROR RESPONSE

No specific error responses

## <a name="remove"></a>Remove a todo

**URL**: `/todos/[id]`

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

No specific error responses

## <a name="patch"></a>Change a todo

**URL**: `/todos/[id]`

**METHOD**: `PATCH`

**DATA CONSTRAINTS**

Returns a 400 response when validation fails as mentioned in the beginning of this documentation.

All fields are **optional**

```json
{
  "order": "[A number representing the todos position in the list, starts at 0]",
  "name": "[2 to 50 characters]",
  "description": "[Max 500 characters, can be empty]",
  "label": "[Max 50 characters label used to group todos, can be empty]",
  "color": "[A hex color value used to group todos]",
  "completed": "[A boolean which will set done_by_id to the current user and completed_at to now, false will remove these]"
}
```

**DATA EXAMPLE**

Completing a todo and changing the name to Blue Cheese

```json
{
    "completed": true,
    "name": "Blue Cheese"
}
```

### SUCCESS RESPONSE

**CODE**: `200 OK`

```json
{
  "order": 0,
  "name": "Blue Cheese",
  "description": "",
  "label": "Refrigerated",
  "color": "#FFF",
  "completed_at": "2020-05-22T18:01:47.000Z",
  "id": 1,
  "created_at": "2020-05-22T18:01:07.000Z",
  "updated_at": "2020-05-22T18:01:07.000Z",
  "status": 1,
  "done_by_user_id": 1,
  "list_id": 1
}
```

### ERROR RESPONSE

No specific error responses
