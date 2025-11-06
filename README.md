# AI Note-Taking App

A full-stack note-taking application with AI-powered features built for an interview task.

## Features

### Core Features
- ✅ User authentication (Registration & Login with JWT)
- ✅ Protected routes with token verification
- ✅ User profile management
- ✅ Create, read, update, and delete notes
- ✅ Search notes by title (with debounce)
- ✅ AI Summary - Generate summaries of long notes
- ✅ AI Improve - Improve note content (grammar, clarity)
- ✅ AI Tags - Auto-generate relevant tags for notes
- ✅ Clean UI with custom components (shadcn/ui style)
- ✅ Responsive design
- ✅ Dark/light theme toggle
- ✅ Token verification endpoint
- ✅ Auto-logout on token expiration

## Tech Stack

### Frontend
- Next.js 16 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- React Hook Form
- next-themes
- Axios with interceptors
- Lucide React (icons)

### Backend
- Hono.js
- TypeScript
- MongoDB with Mongoose
- Zod for validation
- JWT authentication
- bcryptjs for password hashing
- AI/ML API integration (aimlapi.com)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- AI/ML API key from [aimlapi.com](https://aimlapi.com)

### Backend Setup

1. Navigate to the Backend directory:
```sh
cd Backend
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file:
```
PORT=3500
MONGO_URI=mongodb://localhost:27017/ai-notes
JWT_SECRET=your-secret-key-change-this-in-production
AIML_API_KEY=your-aiml-api-key
AIML_API_URL=https://api.aimlapi.com/v1/chat/completions
AIML_MODEL=deepseek-chat
```

4. Start the backend server:
```sh
npm run dev
```

The backend will run on `http://localhost:3500`

### Frontend Setup

1. Navigate to the Frontend directory:
```sh
cd Frontend
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3500/api
```

4. Start the frontend server:
```sh
npm run dev
```

The frontend will run on `http://localhost:5000`

## Project Structure

```
ai-notetaking-app/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controller/     # Request handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions (JWT)
│   │   ├── validation/     # Zod schemas
│   │   └── index.ts        # Server entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── notes/      # Note-related components
│   │   │   └── ui/         # Reusable UI components
│   │   └── lib/            # Utility functions
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/verify` - Verify token validity (protected)

### Notes
- `POST /api/notes` - Create note (protected)
- `GET /api/notes` - Get all notes (protected)
- `GET /api/notes/:id` - Get note by ID (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)

### AI Features
- `POST /api/ai/notes/:id/summary` - Generate summary (protected)
- `POST /api/ai/notes/:id/improve` - Improve content (protected)
- `POST /api/ai/notes/:id/tags` - Generate tags (protected)

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3500)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `AIML_API_KEY` - AI/ML API key from aimlapi.com
- `AIML_API_URL` - AI/ML API endpoint (default: https://api.aimlapi.com/v1/chat/completions)
- `AIML_MODEL` - AI model to use (default: deepseek-chat)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., http://localhost:3500/api)

## Deployment

### Backend
The backend can be deployed to any Node.js hosting service (Railway, Render, etc.). Make sure to set environment variables.

### Frontend
The frontend can be deployed to Vercel:
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

## Key Implementation Details

### Authentication Flow
- JWT tokens are generated on login/register
- Tokens are stored in localStorage
- All protected routes verify tokens via middleware
- Token verification endpoint (`/api/auth/verify`) checks token validity
- Auto-logout on 401 errors

### Search Implementation
- Debounce implemented (300ms delay) to reduce API calls
- Searches notes by title in real-time
- Optimized for performance

### AI Features
- Integrated with AI/ML API (aimlapi.com)
- Supports multiple AI models
- Error handling for API failures
- Uses OpenAI-compatible API format

## Notes

- Make sure MongoDB is running before starting the backend (or use MongoDB Atlas)
- You need a valid AI/ML API key from aimlapi.com for AI features to work
- Basic models (like `deepseek-chat`) work without account verification
- Premium models (like `gpt-3.5-turbo`) require account verification
- The app uses JWT tokens stored in localStorage for authentication
- All API endpoints except register/login require authentication
- Backend runs on port 3500, Frontend runs on port 5000

## Development

### Running the Application

1. **Start Backend:**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```
   Backend will run on `http://localhost:3500`

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:5000`

3. **Access the app:**
   - Open `http://localhost:5000` in your browser
   - Register a new account or login
   - Start creating notes!

## Troubleshooting

### Backend Issues
- **Port already in use**: Kill the process using the port or change PORT in .env
- **MongoDB connection failed**: Check MONGO_URI in .env and ensure MongoDB is running
- **AI features not working**: Verify AIML_API_KEY is set correctly in .env

### Frontend Issues
- **CORS errors**: Ensure backend CORS allows `http://localhost:5000`
- **API connection failed**: Check NEXT_PUBLIC_API_URL in .env.local
- **Token verification fails**: Clear localStorage and login again

## License

This project was built for an interview task.


