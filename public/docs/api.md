# Saltium API Documentation

This project contains backend APIs used for managing authentication and file services in **Saltium**.

## Base URL

The base URL for all API endpoints is:
```
localhost:8080/api/v1
```

---

## Authentication APIs

### 1. **User Registration**

- **Endpoint**: `/private/auth/register`
- **Method**: `POST`
- **Request Body** (JSON):
    ```json
    {
        "username": "parth@gmail.com",
        "password": "helloworld"
    }
    ```
- **Description**: Registers a new user by accepting a username and password.

---

### 2. **User Login**

- **Endpoint**: `/private/auth/login`
- **Method**: `POST`
- **Request Body** (JSON):
    ```json
    {
        "username": "parth@gmail.com",
        "password": "helloworld"
    }
    ```
- **Description**: Authenticates a user and returns a JWT token for further authentication.

---

### 3. **Update User Credentials**

- **Endpoint**: `/private/auth/update`
- **Method**: `PUT`
- **Headers**:
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Request Body** (JSON):
    ```json
    {
        "username": "parthsolanke@gmail.com",
        "password": "helloworld"
    }
    ```
- **Description**: Updates the user's username and/or password.

---

## File APIs

### 4. **File Upload**

- **Endpoint**: `/private/files/upload`
- **Method**: `POST`
- **Headers**:
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Request Body (Form-Data)**:
    - `files`: Upload one or more files.
- **Description**: Uploads files to the server.

---

### 5. **Generate Download Link**

- **Endpoint**: `/private/files/generate-link`
- **Method**: `POST`
- **Headers**:
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Request Body** (JSON):
    ```json
    {
        "fileIds": ["66e18cf95126b7af818bf59f", "66e18cf95126b7af818bf59c"]
    }
    ```
- **Description**: Generates a secure download link for the specified file IDs.

---

### 6. **Download File**

- **Endpoint**: `/private/files/download`
- **Method**: `GET`
- **Headers**:
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Query Parameters**:
    - `token`: A JWT token containing the file IDs and user credentials for download.
- **Description**: Downloads the requested files using the provided token.

---

## Authentication Header

For protected routes, include the following header:
```
Authorization: Bearer <JWT_TOKEN>
```

Replace `<JWT_TOKEN>` with the token obtained during user login.

