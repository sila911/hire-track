# HireTrack Frontend

This is the React and Vite-based user interface for the HireTrack application.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

## Local Installation Guide

Follow these steps to set up the frontend on your local device:

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   Install all required Node packages:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Copy the example environment file to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   *Make sure `VITE_API_BASE_URL` (or the equivalent variable in your `.env`) points to your local Laravel backend (usually `http://localhost:8000`).*

4. **Start the Development Server**
   Run the Vite development server with Hot Module Replacement (HMR):
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## Notes
- Ensure the **HireTrack Backend API** is running simultaneously to authenticate users and fetch data.
- The default setup utilizes Tailwind CSS for styling and React Router for navigation.
