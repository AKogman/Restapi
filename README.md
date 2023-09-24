# RESTful API for User and Card Management

## Overview

This API is designed to manage users and cards. It's built on an environment that considers specific variables for the smooth functionality and security of the API.

## Environment Variables

- `PORT`: Specifies the port where the API will run.
- `DB_MONGO`: The connection string for MongoDB, Can be Atlas or Local.
- `TOKEN_SECRET`: Secret key for JWT tokens.

## 🚀 Endpoints

### User Endpoints

1. **Add a New User**
   - **Method**: `POST`
   - **Endpoint**: `/users/`
   - **Description**: Register a new user.

2. **User Login**
   - **Method**: `POST`
   - **Endpoint**: `/users/login`
   - **Input**: Email & Password
   - **Response**: JWT token

3. **Get All Users**
   - **Method**: `GET`
   - **Endpoint**: `/users/`
   - **Access**: Admin only

4. **Get Specific User**
   - **Method**: `GET`
   - **Endpoint**: `/users/:id`
   - **Access**: Logged-in users & Admins

5. **Change User Settings**
   - **Method**: `PUT`
   - **Endpoint**: `/users/:id`
   - **Access**: Logged-in user

6. **Toggle User Business Setting**
   - **Method**: `PATCH`
   - **Endpoint**: `/users/:id`

7. **Delete User**
   - **Method**: `DELETE`
   - **Endpoint**: `/users/:id`

### Card Endpoints

1. **Add a New Card**
   - **Method**: `POST`
   - **Endpoint**: `/cards/`
   - **Access**: Business users only

2. **Get All Cards**
   - **Method**: `GET`
   - **Endpoint**: `/cards/`

3. **Get User's Cards**
   - **Method**: `GET`
   - **Endpoint**: `/cards/my-cards`
   - **Access**: Logged-in user

4. **Get Specific Card**
   - **Method**: `GET`
   - **Endpoint**: `/cards/:id`

5. **Update Card**
   - **Method**: `PUT`
   - **Endpoint**: `/cards/:id`
   - **Access**: User (all except `bizNumber`); Admin (`bizNumber` only)

6. **Like a Card**
   - **Method**: `PATCH`
   - **Endpoint**: `/cards/:id`
   - **Access**: Logged-in users

7. **Delete Card**
   - **Method**: `DELETE`
   - **Endpoint**: `/cards/:id`

## Extras

- **Logging**: Activity is logged to `logs/<current date>.log`.
- **Security**: Users locked for 24 hours after 3 consecutive incorrect logins.
- **CORS**: Enabled for cross-domain access.

## Getting Started

*Details about installation, setup, and usage should ideally go here.*

