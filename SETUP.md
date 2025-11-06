# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running (local or cloud)
- OpenAI API key

## Step 1: Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file:
```
PORT=3500
MONGO_URI=mongodb://localhost:27017/ai-notes
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key
```

Start backend:
```bash
npm run dev
```

Backend runs on: http://localhost:3500

## Step 2: Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3500/api
```

Start frontend:
```bash
npm run dev
```

Frontend runs on: http://localhost:5000

## Step 3: Test the Application

1. Open http://localhost:5000
2. Register a new account
3. Create your first note
4. Try the AI features (Summary, Improve, Tags)

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 3500 is available

### Frontend can't connect to backend
- Verify backend is running on port 3500
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### AI features not working
- Verify `GEMINI_API_KEY` is set correctly in backend `.env`
- Check Gemini API key is valid and has credits
- Check backend console for error messages

## Notes

- Make sure both servers are running simultaneously
- MongoDB must be running before starting the backend
- Google Gemini API key is required for AI features (but app works without it for basic features)


