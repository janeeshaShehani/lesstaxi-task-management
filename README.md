# Lesstaxi Task Management System

## Project Overview

## Features

### User Features
- User registration and login
- Create tasks
- View own tasks
- Assign unassigned tasks to self
- Drag and drop tasks between columns
- Task status persistence

### Administrator Features
- Administrator login
- View all registered users
- View all tasks
- Create tasks
- Assign/reassign tasks to users
- Manage task statuses

## Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Axios
- dnd-kit
- Lucide React
- Sonner

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- Zod
- JWT
- bcrypt

### Database
- PostgreSQL
- Neon

### Deployment
- Vercel – Frontend
- Railway – Backend

## System Architecture

Frontend → REST API → Backend → Prisma ORM → PostgreSQL

## Database Design

### User
- id
- name
- email
- password
- role
- createdAt
- updatedAt

### Task
- id
- title
- description
- status
- createdById
- assignedToId
- createdAt
- updatedAt

## Authentication & Security

- JWT-based authentication
- bcrypt password hashing
- Role-based access control
- Protected API routes
- Environment variables for secrets
- CORS configuration
- Input validation using Zod

## API Endpoints

### Authentication
POST /api/auth/register
POST /api/auth/login

### Tasks
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

### Users
GET /api/users

## Environment Variables

### Backend

DATABASE_URL=...
JWT_SECRET=...
ADMIN_PASSWORD=...

### Frontend

NEXT_PUBLIC_API_URL=...

Do not include actual production secret values.

## Local Setup

### Backend

cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

### Frontend

cd frontend
npm install
npm run dev

## Deployment

Frontend:
https://lesstaxi-task-management.vercel.app

Backend:
https://lesstaxi-task-management-production.up.railway.app

## Application Screenshots

### Landing Page
[image]

### Login
[image]

### User Dashboard
[image]

### Task Creation
[image]

### Drag and Drop
[image]

### Admin Dashboard
[image]

### Admin Task Assignment
[image]

## GitHub Repository

https://github.com/janeeshaShehani/lesstaxi-task-management
