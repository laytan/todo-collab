# todo-collab server

Every POST and PATCH request can return a badrequest when required data is not given, the body is empty or when the given data is invalid.

Every authorized request returns a 401 UNAUTHORIZED when the bearer token is invalid.

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

## API

* [Users](docs/users.md)
* [Todo Lists](docs/todo-lists.md)
