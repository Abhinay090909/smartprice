# SmartPrice 📱

A web-based smartphone price comparison application built with Node.js, Express, and PostgreSQL.

## Features

- Browse 1,800+ real smartphones from 37 brands
- Filter by brand, RAM, storage, and price range
- Save favorites per user
- View detailed specs for each phone
- Admin panel to add, edit, and delete smartphones

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/Abhinay090909/smartprice.git
cd smartprice

### 2. Install dependencies

npm install

### 3. Setup PostgreSQL

- Install PostgreSQL if not already installed
- Create a database called `smartprice`
- Restore the database dump:
  psql -U postgres smartprice < smartprice_dump.sql

### 4. Configure environment variables

- Copy `.env.example` to `.env`
  cp .env.example .env
- Open `.env` and fill in your PostgreSQL password

### 5. Run the application

node server.js

### 6. Open in browser

http://localhost:3000

## Database Schema

- `brands` — 37 smartphone brands
- `smartphones` — 1,816 smartphone records
- `users` — sample users
- `admins` — admin users (ISA relationship with users)
- `favorites` — many-to-many relationship between users and smartphones

## Project Structure

smartprice/
├── public/
│ ├── index.html # Browse page
│ ├── detail.html # Phone detail page
│ ├── favorites.html # User favorites
│ ├── admin.html # Admin panel
│ ├── style.css # Styles
│ └── app.js # Frontend logic
├── routes/
│ ├── smartphones.js # Smartphone API routes
│ ├── brands.js # Brands API routes
│ ├── users.js # Users API routes
│ └── favorites.js # Favorites API routes
├── db.js # Database connection
├── server.js # Express server
├── smartprice_dump.sql # PostgreSQL database dump
├── .env.example # Environment variables template
└── README.md

## CSE 412 — Arizona State University

SmartPrice was built as a final project for CSE 412 (Database Management) at ASU.

**Team:** Abhinay Gorla, Navigna Reddy Gangumalla, Lahari Popuri
