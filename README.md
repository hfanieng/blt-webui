# blt-webui

A modern web application built with Fastify (backend) and Vite + Vue (frontend).

## Project Structure

```
blt-webui/
├── backend/          # Fastify backend server
│   ├── server.js     # Main server file
│   └── package.json
├── frontend/         # Vite + Vue frontend application
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── package.json      # Root package.json with convenience scripts
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hfanieng/blt-webui.git
cd blt-webui
```

2. Install dependencies for backend:
```bash
cd backend
npm install
cd ..
```

3. Install dependencies for frontend:
```bash
cd frontend
npm install
cd ..
```

### Development

#### Run Backend Server

From the root directory:
```bash
npm run dev:backend
```

Or from the backend directory:
```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3000`

Available API endpoints:
- `GET /api/health` - Health check endpoint
- `GET /api/hello` - Simple hello world endpoint

#### Run Frontend Development Server

From the root directory:
```bash
npm run dev:frontend
```

Or from the frontend directory:
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Build

Build the frontend for production:
```bash
npm run build:frontend
```

Start the backend in production mode:
```bash
npm run start:backend
```

Preview the production build:
```bash
npm run preview:frontend
```

## Tech Stack

- **Backend**: [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- **Frontend**: [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- **Build Tool**: [Vite](https://vitejs.dev/) - Next generation frontend tooling

## License

ISC
