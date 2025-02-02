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
### 2. Google OAuth Setup
Ensure you have registered your application with Google OAuth and obtained your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.

## Google OAuth Configuration Steps:

* Go to the Google Developer Console.
* Navigate to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials).
* Create a new project if you don't have any projects yet or select an existing project.
* After creating a project, create credentials located near the lower part of the search bar
* Create OAuth 2.0 Client IDs in the with the following settings:
  * Application Type: Web Application 
  * Authorized Redirect URIs: http://localhost:3200/auth/google/callback
  * Authorized JavaScript origins: http://localhost:3200
* Copy the Client-Id and Client-Secret, this will be needed for the .env file


### 3. JWT_SECRET
To generate a JWT_SECRET, run this in your terminal
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Configuration
Create a .env file in the root of the project with the following content:

```env
MONGO_URI=mongodb://root:example@localhost:27017/note-taker?authSource=admin
PORT=3200
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

### 5. Docker Setup
* First ensure that docker desktop is running
* Run in your terminal:
 ```bash
 docker-compose up --build
 ```
 This command will start both the MongoDB container and the application container. Wait for the LOG 🚀 note-taker-app is running on: http://0.0.0.0:3200 in the terminal.


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
* Example URL:
  * http://localhost:3200/api/notes
# Retrieve All Notes:

* Method: GET
* Endpoint: GET /api/notes
* Headers:
  * Authorization: Bearer <JWT_TOKEN>
* Query Parameters:
  * user=<USER_ID>
  * page=< PAGE >
  * limit=< LIMIT >
* Example URL:
  * http://localhost:3200/api/notes?page=1&limit=10

# Retrieve a Specific Note:

* Method: GET
* Endpoint: GET /api/notes/:noteId
* Headers:
  * Authorization: Bearer <JWT_TOKEN>
* Example URL:
  * http://localhost:3200/api/notes/66b108d6233895184c5729c2
  
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
* Example URL:
  * http://localhost:3200/api/notes/66b108d6233895184c5729c2

# Delete a Note:

* Method: DELETE
* Endpoint: DELETE /api/notes/:noteId
* Headers:
  * Authorization: Bearer <JWT_TOKEN>
* Example URL:
  * http://localhost:3200/api/notes/66b108d6233895184c5729c2

# Categorize by tag

* Method: GET
* Endpoint: GET /api/notes/tags
* Headers:
  * Authorization: Bearer <JWT_TOKEN>
* Query Parameters:
  * tags=<tags *multiple tags separated by comma*>
* Example URL:
  * http://localhost:3200/api/notes/tags?tags='tag1,tag2'

### Contact
For any issues or questions, please contact [ericson.sacdalan.4@gmail.com](ericson.sacdalan.4@gmail.com).
