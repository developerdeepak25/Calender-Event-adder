# Event Scheduler with Google Calendar Integration

## Overview

This is a full-stack web application that allows users to browse a list of events and add selected events to their Google Calendar with a single click. The app uses a React frontend and an Express backend with Google Calendar API integration.

## Features

- **Event Listing**: Displays a dynamic list of events with details like name, date, and description.
- **Google Calendar Integration**: Add events to your Google Calendar directly from the app.
- **OAuth2 Authentication**: Secure Google login for calendar access.
- **Responsive Design**: Ensures a smooth experience across devices.

## Prerequisites

- A Google account
- Node.js and npm installed
- Google Cloud Console project with Calendar API enabled
- OAuth 2.0 credentials configured

## Tech Stack

### Frontend
- **Framework**: React
- **Styling**: TailwindCSS
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Environment Management**: `dotenv`
- **Session Management**: `express-session`
- **Google API Integration**: `googleapis`

## Installation

### Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>" > .env

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=3000
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
SESSION_SECRET=ITS_A_SECRET
REDIRECT_URI=http://localhost:5173
EOL

# Start development server
npm run dev
```

## Configuration

### Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Configure OAuth consent screen:
   - Add necessary scopes for calendar access
   - Add test users if in testing mode
5. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5173`
   - Note down the Client ID and Client Secret

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Browse through the available events
3. Click on any event to add it to your Google Calendar
4. First-time users will be prompted to log in with Google
5. Authorize the application to access your Google Calendar
6. Check your Google Calendar to see the added event

## Development

To start development:

1. Frontend development server:
```bash
cd frontend
npm run dev
```

2. Backend development server:
```bash
cd backend
npm run dev
```

## Screenshots

1. App Interface

   ![image](https://github.com/user-attachments/assets/62465c23-ad5a-4c12-940b-45042be9f739)

3. Event Added to Google Calendar

  ![Screenshot 2025-01-18 150238](https://github.com/user-attachments/assets/65f4f914-ce03-435d-81ea-677e4ce8f92a)
