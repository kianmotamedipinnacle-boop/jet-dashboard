# Jet Dashboard

A modern Kanban + Second Brain web application built with Next.js, SQLite, and Tailwind CSS.

## Features

### 🎯 Kanban Board
- **Four columns**: Backlog, In Progress, Review, Done
- **Drag and drop**: Move cards between columns effortlessly
- **Rich cards**: Title, description, tags, status, and creation date
- **Real-time updates**: Changes reflect immediately

### 🧠 Second Brain
- **Idea management**: Capture thoughts, notes, and ideas
- **Categories**: Organize by business, product, marketing, personal, etc.
- **Tags**: Add custom tags for better organization
- **Search functionality**: Find ideas quickly with full-text search
- **Filter by category**: Focus on specific types of content

### 🔒 Security
- **Password protection**: Simple authentication using environment variables
- **Session management**: Secure login/logout functionality

### 🎨 Modern UI
- **Dark theme**: Easy on the eyes with a sleek design
- **Responsive**: Works perfectly on desktop and mobile
- **Smooth animations**: Polished user experience

### 🚀 API-First
- **REST endpoints**: Programmatically manage tasks and ideas
- **Bot-friendly**: Perfect for automation and integrations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Quick Start

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd jet-dashboard
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env and set your AUTH_PASSWORD
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Visit**: http://localhost:3000

## Environment Variables

- `AUTH_PASSWORD`: Password for accessing the dashboard (required)

## API Endpoints

### Kanban Cards
- `GET /api/kanban` - List all kanban cards
- `POST /api/kanban` - Create new kanban card
- `PUT /api/kanban/[id]` - Update kanban card
- `DELETE /api/kanban/[id]` - Delete kanban card

### Brain Cards
- `GET /api/brain` - List brain cards (with optional search and category filters)
- `POST /api/brain` - Create new brain card
- `PUT /api/brain/[id]` - Update brain card
- `DELETE /api/brain/[id]` - Delete brain card

### Authentication
- `POST /api/auth` - Login
- `DELETE /api/auth` - Logout

## API Usage Examples

### Create a new task:
```bash
curl -X POST http://localhost:3000/api/kanban \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix login bug",
    "description": "Users cannot login with special characters",
    "tags": "bug,urgent",
    "status": "backlog",
    "password": "your-password"
  }'
```

### Create a new idea:
```bash
curl -X POST http://localhost:3000/api/brain \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New feature idea",
    "content": "Add dark mode toggle for better UX",
    "category": "product",
    "tags": "ui,ux,feature",
    "password": "your-password"
  }'
```

## Railway Deployment

This project is configured for easy deployment on Railway:

1. **Connect your repository** to Railway
2. **Set environment variables**:
   - `AUTH_PASSWORD`: Your secure password
3. **Deploy**: Railway will automatically build and deploy

The app uses SQLite with automatic database initialization, so no additional database setup is required.

## Development

- **Database**: SQLite file created automatically on first run
- **Hot reload**: Changes reflect immediately during development
- **TypeScript**: Full type checking and IntelliSense

## License

MIT License - feel free to use this project for any purpose.

---

Built with ❤️ for productivity enthusiasts.