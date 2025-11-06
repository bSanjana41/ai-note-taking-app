# AI Note-Taking App - Frontend

Frontend built with Next.js 16, TypeScript, and Tailwind CSS.

## Setup

1. Install dependencies:
```sh
npm install
```

2. Create a `.env.local` file in the Frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:3500/api
```

3. Run the development server:
```sh
npm run dev
```

The app will start on `http://localhost:5000`

## Features

- User authentication (Login/Register)
- Token verification on page load
- Create, read, update, and delete notes
- Search notes by title (with 300ms debounce)
- AI-powered features:
  - Generate summaries
  - Improve content
  - Auto-generate tags
- Dark/light theme toggle
- Responsive design
- Auto-logout on token expiration

## Technologies

- Next.js 16 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- React Hook Form - Form handling
- next-themes - Theme management
- Axios - HTTP client
- Lucide React - Icons
