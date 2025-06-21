# AutoBuddy - Smart Auto-Rickshaw Sharing for Students

A full-stack web app for college students to pre-book shared auto rides based on timing and location.

## Features
- User registration/login (college email/ID)
- Profile setup (name, college ID, address)
- Ride slot booking (time, pickup/drop)
- Auto-matching (group by time/location, assign when 5 match)
- Notifications (in-app, email optional)
- Admin panel (optional)

## Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB

## Project Structure
```
AutoBuddy/
  client/      # React frontend
  server/      # Node/Express backend
  README.md
```

## Setup Instructions

### 1. Clone the repository
```
git clone <repo-url>
cd AutoBuddy
```

### 2. Backend Setup
```
cd server
npm install
# Set up your MongoDB URI in .env
npm start
```

### 3. Frontend Setup
```
cd client
npm install
npm start
```

### 4. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

For any issues, contact the project maintainer. 