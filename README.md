# My Resume Builder

This project is a resume builder application that allows users to create and manage their resumes. It includes a server for handling user data and resume uploads, and a client for interacting with the application.

## Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

Follow these steps to set up the project:

### Clone the Repository

```sh
git clone <repository-url>
cd my-resume-builder
```

### Install Server Dependencies

Navigate to the `Server` directory and install the dependencies:

```sh
cd Server
npm install
```

### Install Client Dependencies

Navigate to the root directory and install the dependencies:

```sh
cd ..
npm install
```

## Environment Variables

Create a `.env` file in the `Server` directory and add the following environment variables:

```
TEXTRAZOR_API_KEY=<your-textrazor-api-key>
```

## Running the Server

Navigate to the `Server` directory and start the server:

```sh
cd Server
node server.js
```

The server will run at `http://localhost:5000`.

## Running the Client

Navigate to the root directory and start the client:

```sh
npm start
```

The client will run at `http://localhost:3000`.

## API Endpoints

### User Management

- **GET /api/users**: Retrieve all users
- **POST /api/signup**: Register a new user
- **PUT /api/users/:id**: Update an entire user
- **PATCH /api/users/:id**: Update specific fields of a user
- **DELETE /api/users/:id**: Delete a user

### Resume Upload and Scoring

- **POST /upload**: Upload a resume and get a score

## License

This project is licensed under the MIT License.
