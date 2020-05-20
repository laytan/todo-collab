# Todo Lists API

All endpoints require authorization with a bearer token and will return a 401 UNAUTHORIZED otherwise.

* [Create a list](#create)
* [Search lists](#find)
* [Get the full info on a list](#get)

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
    "password": "[non whitespace between 6 and 200 characters]"
}
```

**DATA EXAMPLE**

```json
{
	"name": "groceries",
	"description": "",
	"password": "supersecret"
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
{
  "total": 1,
  "limit": 10,
  "skip": 0,
  "data": [
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
}
```

### ERROR RESPONSE

No specific error responses

## <a name="get"></a>Get the full info on a list

**URL**: `/todo-lists/[id]`

**METHOD**: `GET`

### SUCCESS RESPONSE

This method will return all related data to the list (events and items) also.

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
  "events": [
    {
      "type": "CREATE",
      "service": "todo-lists",
      "id_in_service": 1,
      "description": null,
      "id": 1,
      "created_at": "2020-05-20T18:44:19.000Z",
      "updated_at": "2020-05-20T18:44:19.000Z",
      "status": 1,
      "emitter_id": 1
    }
  ],
  "items": [
    {
      "order": 0,
      "name": "cheese",
      "description": "",
      "label": "Refrigerated",
      "color": "#fff",
      "completed_at": null,
      "id": 1,
      "created_at": "2020-05-20T20:41:31.000Z",
      "updated_at": "2020-05-20T20:41:31.000Z",
      "status": 1,
      "done_by_user_id": null,
      "list_id": 1
    }
  ]
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
