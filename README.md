# Note-Taker App Documentation

## Overview

This Note-Taker application allows users to create, read, update, and delete notes. It supports Google OAuth authentication and runs in Docker containers.

## Prerequisites

- Docker
- Docker Compose
- Postman (for testing)

## Setup

### 1. Clone the Repository

Start by cloning the repository:

```bash
git clone https://github.com/your-repo/note-taker-app.git
cd note-taker-app
```

### 2. Configuration
Create a .env file in the root of the project with the following content:

```env
MONGO_URI=mongodb://root:example@localhost:27017/note-taker?authSource=admin
PORT=3200
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

### 3. Google OAuth Setup
Ensure you have registered your application with Google OAuth and obtained your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.

## Google OAuth Configuration Steps:

* Go to the Google Developer Console.
* Navigate to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials).
* Create a new project if you don't have any projects yet or select an existing project.
* After creating a project, create credentials located near the lower part of the search bar
* Create OAuth 2.0 Client IDs in the with the following settings:
 * Authorized Redirect URIs: http://localhost:3200/auth/google/callback for local testing.

### 4. Docker Setup
Build and run the Docker containers:
```bash
docker-compose up -d
npm run start:dev
```
This command will start both the MongoDB container and the application container.


### Testing Endpoints with Postman

### 1. Authentication
To get <JWT_TOKEN> go to http://localhost:3200/auth/google and sign in with your google account. This will redirect you to your test token.

### 2. CRUD Endpoints for Notes
# Create a New Note:

* Endpoint: http://localhost:3200/api/notes
* Headers: 
  * Authorization: Bearer <JWT_TOKEN>
* Body
  ```json
  {
  "title": "Note Title",
  "content": "Note Content",
  "tags": ["tag1", "tag2"]
  }
  ```
# Retrieve All Notes:

* Method: GET
* Endpoint: GET /api/notes
* Headers:
  * Authorization: Bearer <JWT_TOKEN>
* Query Parameters:
  * user=<USER_ID>
  * page=<PAGE>
  * limit=<LIMIT>

# Retrieve a Specific Note:

* Method: GET
* Endpoint: GET /api/notes/:noteId
* Headers:
  * Authorization: Bearer <JWT_TOKEN>
  
# Update an Existing Note:

* Method: PUT
* Endpoint: PUT /api/notes/:noteId
* Headers:
  * Authorization: Bearer <JWT_TOKEN>
* Body:
  ```json
  {
  "title": "Updated Title",
  "content": "Updated Content",
  "tags": ["newTag"]
  }
  ```

# Delete a Note:

* Method: DELETE
* Endpoint: DELETE /api/notes/:noteId
* Headers:
  * Authorization: Bearer <JWT_TOKEN>

# Categorize by tag

* Method: GET
* Endpoint: GET /api/notes/tags
* Headers:
  * Authorization: Bearer <JWT_TOKEN>
* Query Parameters:
  * tags=<tags *multiple tags separated by comma*>

### Contact
For any issues or questions, please contact [ericson.sacdalan.4@gmail.com](ericson.sacdalan.4@gmail.com).
