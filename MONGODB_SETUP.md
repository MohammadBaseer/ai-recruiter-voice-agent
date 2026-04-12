# MongoDB Setup Guide

This guide explains how to set up MongoDB for the AI Recruiter Voice Agent application.

## Prerequisites

You need either:
1. **Local MongoDB** - Install MongoDB Community Edition on your machine
2. **MongoDB Atlas** - Free cloud-hosted MongoDB (recommended for production)

## Option 1: Local MongoDB Setup

### Install MongoDB

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Install as a Windows Service (recommended)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify Local MongoDB is Running

```bash
mongosh
```

If connected successfully, you'll see the MongoDB shell prompt.

## Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)

## Configuration

### Update `.env.local`

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/ai-recruiter
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-recruiter?retryWrites=true&w=majority
```

Replace `<username>` and `<password>` with your Atlas credentials.

## Testing the Connection

Start the development server:

```bash
npm run dev
```

Then test the API endpoints:

### Test Candidates API

```bash
# Get all candidates
curl http://localhost:3000/api/candidates

# Create a new candidate
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com"}'
```

### Test Jobs API

```bash
# Get all jobs
curl http://localhost:3000/api/jobs

# Create a new job
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Software Engineer","department":"Engineering","location":"Remote","description":"Build amazing products","requirements":["JavaScript","React"],"responsibilities":["Write code","Review PRs"]}'
```

### Test Interviews API

```bash
# Get all interviews
curl http://localhost:3000/api/interviews

# Create a new interview (requires existing candidate and job IDs)
curl -X POST http://localhost:3000/api/interviews \
  -H "Content-Type: application/json" \
  -d '{"candidate":"<candidate_id>","job":"<job_id>","scheduledAt":"2026-05-01T10:00:00Z"}'
```

## Data Models

### Candidate
- firstName, lastName, email (required)
- phone, resumeUrl, linkedInUrl (optional)
- status: 'new' | 'contacted' | 'interviewed' | 'hired' | 'rejected'
- notes (optional)

### Job
- title, department, location (required)
- description, requirements[], responsibilities[] (required)
- salaryRange (optional)
- employmentType: 'full-time' | 'part-time' | 'contract' | 'internship'
- status: 'open' | 'closed' | 'on-hold'

### Interview
- candidate (ref), job (ref), scheduledAt (required)
- status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
- transcript, score (0-100), feedback (optional)
- recordingUrl, duration (optional)

## Troubleshooting

### Connection Refused
- Ensure MongoDB service is running
- Check if port 27017 is available

### Authentication Failed (Atlas)
- Verify username and password in connection string
- Check IP whitelist in Atlas (add 0.0.0.0/0 for development)

### TypeScript Errors
- Run `npm run build` to verify compilation
- Ensure all dependencies are installed with `npm install`