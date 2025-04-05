# API Test Project

## Vercel Deployment

This project is configured for deployment on Vercel with the following features:

- Express.js API endpoints
- Basic authentication
- CORS enabled
- Static file serving

### Project Structure

- `server.js` - Main API server
- `api/messages.js` - Messages API endpoints
- `app.js` - Frontend JavaScript
- `index.html` - Main HTML file
- `styles.css` - Stylesheet

### Deployment Configuration

The project uses `vercel.json` for deployment configuration:

- Node.js server for API endpoints
- Static file hosting for HTML, CSS, and client-side JavaScript
- API routes are properly mapped

### Environment Variables

Make sure to set these environment variables in your Vercel project settings:

- `VERCEL_ENV` (automatically set by Vercel)

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

### Production

The project is automatically deployed when pushing to the main branch. Vercel handles the build and deployment process based on the configuration in `vercel.json`.