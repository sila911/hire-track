# hiretrackinging Backend API

This is the Laravel-based REST API for the hiretrackinging application.

## Prerequisites
- PHP 8.2 or higher
- [Composer](https://getcomposer.org/)

## Local Installation Guide

Follow these steps to set up the backend on your local device:

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Set up Environment Variables**
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   *(By default, the `.env.example` is configured to use a local SQLite database.)*

4. **Create the SQLite Database**
   Create an empty SQLite database file:
   ```bash
   # On Windows (PowerShell)
   New-Item database/database.sqlite -ItemType File
   
   # On macOS/Linux
   touch database/database.sqlite
   ```

5. **Generate Application Key**
   Generate a unique app key for your local instance:
   ```bash
   php artisan key:generate
   ```

6. **Run Migrations and Seed Data**
   Run the database migrations and populate it with initial seed data:
   ```bash
   php artisan migrate --seed
   ```

7. **Start the Development Server**
   Start the Laravel local development server:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://localhost:8000`.

## Connecting the Frontend
Ensure that your Frontend application is configured to point its API requests to `http://localhost:8000` (this is the default in the frontend `.env.example`).
