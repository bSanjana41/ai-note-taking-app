# AI Note-Taking App - Backend

Backend API built with Hono.js, TypeScript, and MongoDB.

## Setup

1. Install dependencies:
```sh
npm install
```

2. Create a `.env` file in the Backend directory:
```
PORT=3500
MONGO_URI=mongodb://localhost:27017/ai-notes
JWT_SECRET=your-secret-key-change-this-in-production
AIML_API_KEY=your-aiml-api-key
AIML_API_URL=https://api.aimlapi.com/v1/chat/completions
AIML_MODEL=gpt-3.5-turbo
```

3. Make sure MongoDB is running locally, or update `MONGO_URI` to your MongoDB connection string.

4. Run the development server:
```sh
npm run dev
```

The server will start on `http://localhost:3500`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Notes
- `POST /api/notes` - Create a new note (protected)
- `GET /api/notes` - Get all user notes (protected)
- `GET /api/notes/:id` - Get a specific note (protected)
- `PUT /api/notes/:id` - Update a note (protected)
- `DELETE /api/notes/:id` - Delete a note (protected)

### AI Features
- `POST /api/ai/notes/:id/summary` - Generate summary for a note (protected)
- `POST /api/ai/notes/:id/improve` - Improve note content (protected)
- `POST /api/ai/notes/:id/tags` - Generate tags for a note (protected)

## Technologies

- Hono.js - Fast web framework
- TypeScript - Type safety
- MongoDB/Mongoose - Database
- Zod - Validation
- bcryptjs - Password hashing
- AI/ML API (aimlapi.com) - AI features
