# HireTrack

HireTrack is a comprehensive Applicant Tracking System (ATS) that streamlines the recruitment process, making it easier for HR teams to manage job postings, track candidates, and collaborate on hiring decisions.

This project is structured as a decoupled application with a **Laravel 12** backend API and a **React 19** frontend powered by **Vite**.

## Project Structure

- `backend/`: Contains the Laravel REST API, database migrations, and business logic.
- `frontend/`: Contains the React SPA built with Vite, Tailwind CSS, and Framer Motion.

## Features

- **Job Posting Management:** Create, edit, and publish job openings.
- **Candidate Tracking:** Move applicants through customizable pipeline stages using a Kanban board interface.
- **Dashboard & Analytics:** View quick stats and applicant status distributions.
- **Authentication:** Secure API authentication utilizing Laravel Sanctum.
- **Modern UI:** Responsive, animated user interface styled with Tailwind CSS and Framer Motion.

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js & NPM
- MySQL, PostgreSQL, or SQLite

## Installation & Setup

### Backend (Laravel API)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file and generate the application key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure your database settings in the `backend/.env` file.
5. Run the database migrations (and seeders if desired):
   ```bash
   php artisan migrate --seed
   ```
6. Start the backend development server:
   ```bash
   php artisan serve
   ```
   *The API will typically be available at `http://localhost:8000`.*

### Frontend (React Application)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
   *Ensure the backend API URL is correctly configured (e.g., `VITE_API_BASE_URL=http://localhost:8000/api`).*
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will typically be available at `http://localhost:5173`.*

## License

The HireTrack application is a software licensed under the MIT license.
