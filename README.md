# GreenArchive 🌿

A simple and efficient Botanical Specimen CRUD (Create, Read, Update, Delete) application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **CRUD Operations**: Manage botanical specimens with ease.
- **RESTful API**: Clean API endpoints for data management.
- **MongoDB Integration**: Robust data storage using Mongoose.
- **Static Frontend**: Serves a clean UI from the `public` directory.
- **Logging**: Request logging using Morgan.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: HTML/JS (Static)
- **Utilities**: Cors, Dotenv, Morgan

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally, or a MongoDB Atlas URI

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DZ1shetty/GreenArchive.git
   cd GreenArchive
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory and add your configuration:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/flora-archive
   ```

4. **Run the application**:
   - For production:
     ```bash
     npm start
     ```
   - For development (with nodemon):
     ```bash
     npm run dev
     ```

## 🌐 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/specimens` | Fetch all specimens |
| `GET` | `/api/specimens/:id` | Fetch a single specimen by ID |
| `POST` | `/api/specimens` | Create a new specimen |
| `PUT` | `/api/specimens/:id` | Update an existing specimen |
| `DELETE` | `/api/specimens/:id` | Delete a specimen |

## 📁 Project Structure

```text
├── models/         # Mongoose models
├── public/         # Static frontend files
├── .env            # Environment variables
├── .gitignore      # Git ignored files
├── package.json    # Project metadata and dependencies
├── server.js       # Main server entry point
└── README.md       # Project documentation
```

## 📄 License

This project is licensed under the MIT License.
