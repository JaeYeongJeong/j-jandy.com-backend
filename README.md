# j-jandy.com-backend

This project is the backend for the j-jandy.com application. It handles user authentication, note management, and provides APIs for data interaction between the frontend and backend.

## 주요 기능

- User authentication
- API for managing user data
- API for managing note data

## 설치 및 실행 방법

1. Clone the repository:

```bash
   git clone https://github.com/JaeYeongJeong/j-jandy.com-backend.git
```

2. Install dependencies:

```bash
  npm install
```

3. Start the server:

```bash
  npm run start
```

4. 환경 변수 설정.

```markdown
PROTOCAL: http 또는 https
SSL_KEY: ssl인증서 경로 (https 설정시 필수)
SSL_CERT: ssl인증서 경로 (https 설정시 필수)
PORT: 서버가 실행될 포트
FRONTEND_URL: 프론트엔드 URL을 지정

# MongoDB & 세션 설정

MONGODB_URL: MongoDB 데이터베이스 URL
DB_PASSWORD: 데이터베이스 비밀번호
SESSION_SECRET: 세션 암호화에 사용되는 비밀키

# AWS S3 설정

AWS_ACCESS_KEY_ID: AWS S3 액세스 키
AWS_SECRET_ACCESS_KEY: AWS S3 비밀 액세스 키
AWS_REGION: AWS S3 리전
AWS_S3_BUCKET_NAME: S3 버킷 이름
```

## 기술 스택

```markdown
- Backend: Express, Node.js, MongoDB
- Cloud: AWS EC2
```

## API 명세

### GET /notes

- **Description**: Fetch all notes.
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "notes": [...]
    }
    ```

### GET /notes/search

- **Description**: Fetch all searched notes based on query parameters.
- **Query Parameters**:
  - **`query`** _(optional, string)_: The search term to filter notes.
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "notes": [...]
    }
    ```

### GET /notes/:id

- **Description**: Fetch a selected note by ID.
- **URL Parameters**:
  - **`:id`** _(required, string)_: ID of the note.
- **Response**:
  - **Status Code**: 200 OK (on success), 404 Not Found (if note does not exist)
  - **Response Body**:
    ```json
    {
      "note": {
        "id": "string",
        "title": "string",
        "image": "string",
        "description": "string",
        "name": "string",
        "date": "date"
      }
    }
    ```

### POST /notes

- **Description**: Create a new note.
- **Request Body** _(JSON)_:
  - **`title`** _(required, string)_: Title of the note.
  - **`image`** _(optional, string)_: Image file for the note.
  - **`description`** _(required, string)_: Description text of the note.
  - **`name`** _(required, string)_: Name of the user.
- **Response**:
  - **Status Code**: 201 Created
  - **Response Body**:
    ```json
    {
      "insertedId": "string"
    }
    ```

### PATCH /notes/:id

- **Description**: Edit an existing note.
- **URL Parameters**:
  - **`:id`** _(required, string)_: ID of the note to edit.
- **Request Body** _(JSON)_:
  - **`title`** _(required, string)_: Updated title of the note.
  - **`image`** _(optional, string)_: Updated Image file for the note.
  - **`description`** _(required, string)_: Updated description text of the note.
  - **`name`** _(required, string)_: Updated name of the user.
- **Response**:
  - **Status Code**: 200 OK (on success), 404 Not Found (if note does not exist)
  - **Response Body**:
    ```json
    {
      "editedId": "string"
    }
    ```

### DELETE /notes/:id

- **Description**: Delete a note by ID.
- **URL Parameters**:
  - **`:id`** _(required, string)_: ID of the note to delete.
- **Response**:
  - **Status Code**: 200 OK (on success), 404 Not Found (if note does not exist)
  - **Response Body**:
    ```json
    {
      "deletedId": "string"
    }
    ```

### GET /session

- **Description**: Check if the user is authenticated.
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "isAuthenticated": true
    }
    ```

### POST /login

- **Description**: Log in the user.
- **Request Body** _(JSON)_:
  - **`id`** _(required, string)_: User's ID.
  - **`pw`** _(required, string)_: User's password.
- **Response**:
  - **Status Code**: 200 OK (on success), 401 Unauthorized (on failure)
  - **Response Body**:
    ```json
    {
      "message": "Login successful"
    }
    ```

### POST /logout

- **Description**: Log out the user.
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "message": "Logout successful"
    }
    ```

### POST /regist

- **Description**: Register a new user.
- **Request Body** _(JSON)_:
  - **`user_id`** _(required, string)_: User's ID.
  - **`user_pw`** _(required, string)_: User's password.
  - **`name`** _(required, string)_: User's name.
  - **`email`** _(required, string)_: User's email address.
- **Response**:
  - **Status Code**: 201 Created, 409 conflict (if already in use)
  - **Response Body**:
    ```json
    {
      "message": "Regist successful"
    }
    ```
