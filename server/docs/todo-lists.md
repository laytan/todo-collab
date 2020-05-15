# Todo Lists API

All endpoints require authorization with a bearer token and will return a 401 UNAUTHORIZED otherwise.

* [Create a list](#create)

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
