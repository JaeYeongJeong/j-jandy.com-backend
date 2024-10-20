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
- `MODE`: 실행 환경을 설정 (로컬에서는 'development'로 설정)
- `PORT`: 서버가 실행될 포트
- `FRONTEND_URL`: 프론트엔드 URL을 지정

# MongoDB & 세션 설정

- `MONGODB_URL`: MongoDB 데이터베이스 URL
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `SESSION_SECRET`: 세션 암호화에 사용되는 비밀키
- `TEST`: 테스트 모드 설정 (true/false)

# AWS S3 설정

- `AWS_ACCESS_KEY_ID`: AWS S3 액세스 키
- `AWS_SECRET_ACCESS_KEY`: AWS S3 비밀 액세스 키
- `AWS_REGION`: AWS S3 리전
- `AWS_S3_BUCKET_NAME`: S3 버킷 이름
```

## 기술 스택

```markdown
- **Backend:** Express, Node.js, MongoDB
- **Cloud:** AWS EC2
```

## API 명세

### GET /notes

- Description: Fetch all notes.
- Response:

```json
{
  "notes": [...]
}
```

### GET /notes/search

- Description: Fetch all searched notes.
- Response:

```json
{
  "notes": [...]
}
```

### GET /notes/:id

- Description: Fetch selected note.
- Response:

```json
{
  "note": [...]
}
```

### POST /notes

- Description: Create note.
- Request Body:

```json
{
  "title": "Note title",
  "image": "Image URL",
  "description": "Note description",
  "name": "User name"
}
```

- Response:

```json
{
  "insertedId": "id"
}
```

### PATCH /notes/:id

- Description: Edit note.
- Request Body:

```json
{
  "title": "Note title",
  "image": "Image URL",
  "description": "Note description",
  "name": "User name"
}
```

- Response:

```json
{
  "editedId": "id"
}
```

### DELETE /notes/:id

- Description: Delete note.
- Response:

```json
{
  "deletedId": "id"
}
```

### GET /session

- Description: Authentication check
- Response:

```json
{
  "isAuthenticated": "true"
}
```

### POST /login

- Description: login request
- Request Body:

```json
{
  "id": "User id",
  "pw": "User password"
}
```

- Response:

```json
{
  "status": "200"
}
```

### POST /logout

- Description: logout request
- Response:

```json
{
  "status": "200"
}
```

### POST /regist

- Description: regist request
- Request Body:

```json
{
  "user_id": "User id",
  "user_pw": "User password",
  "name": "User name",
  "email": "User email"
}
```

- Response:

```json
{
  "status": "200"
}
```
