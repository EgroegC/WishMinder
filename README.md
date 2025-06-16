# WishMinder 🎉 – Contact-Based Reminder App

**WishMinder** is a full-stack web app that reminds users of their contacts’ **birthdays** and **namedays**, helping them stay organized and thoughtful by suggesting wish messages.

## Table of Contents

- [Description](#description)  
  - [Built With](#built-with)  
  - [Motivation and Takeaways](#motivation-and-takeaways)  

- [Live Demo and API Docs](#live-demo-and-api-docs)  
  - [Deployment Overview](#deployment-overview)  
  - [Using Swagger to Test API Calls](#using-swagger-to-test-api-calls)  

- [Features](#features)  
- [Architecture](#architecture)  

- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Clone the Repository](#clone-the-repository)  
  - [Install Dependencies](#install-dependencies)  
  - [Environment Variables](#environment-variables)  
  - [Database Setup](#database-setup)  
  - [Running the Backend and Frontend](#running-the-backend-and-frontend)
  - [API Testing with Postman](#api-testing-with-postman)

- [Testing](#testing)  
  - [Test Database Setup](#test-database-setup)  
  - [Running Tests](#running-tests)  



## 📌 Description

The app supports uploading contacts via `.vcf` files, which are then parsed and validated server-side. A **daily cron job** checks for celebrants and sends **push notifications**. Users can respond by choosing to **call** or **message** the contact directly, with native apps opening pre-filled with relevant details.

The interface is fully **responsive**, working seamlessly across smartphones and desktops. Although the full stack is deployed, the project emphasizes a **robust, well-tested backend**, featuring:

- **JWT-based authentication** with refresh tokens and secure cookie storage for session management.
- **Push notification system**, including web subscription endpoints and message delivery when a contact celebrates.
- **Daily cron jobs** for scanning upcoming birthdays and namedays and triggering notifications.
- **Encrypted storage of personal data**, such as contact emails and phone numbers, aligning with **GDPR principles** around data confidentiality and privacy.
- **Swagger API documentation** for all routes.
- **Production error monitoring** via Rollbar integration.
- **PostgreSQL database schema** Organized backend with a clear separation between database models (for data access) and service classes (for business logic).
- **Integration and unit testing** using Jest and Supertest for API and logic coverage.
- **Contact normalization and batch processing**, including Greek name handling and deduplication.

### Built with 

<table>
  <tr>
    <td align="center">
      <a href="https://nodejs.org/" target="_blank">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" height="40" alt="Node.js" />
        <br/>Node.js
      </a>
    </td>
    <td align="center">
      <a href="https://expressjs.com/" target="_blank">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="40" height="40" alt="Express" />
        <br/>Express
      </a>
    </td>
    <td align="center">
      <a href="https://www.postgresql.org/" target="_blank">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="40" height="40" alt="PostgreSQL" />
        <br/>PostgreSQL
      </a>
    </td>
    <td align="center">
      <a href="https://jwt.io/" target="_blank">
        <img src="https://jwt.io/img/pic_logo.svg" width="40" height="40" alt="JWT" />
        <br/>JWT
      </a>
    </td>
    <td align="center">
      <a href="https://rollbar.com/" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/1406601?s=200&v=4" width="40" height="40" alt="Rollbar" />
        <br/>Rollbar
      </a>
    </td>
    <td align="center">
      <a href="https://tailwindcss.com/" target="_blank">
        <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="40" height="40" alt="Tailwind CSS"/>
        <br/>Tailwind
      </a>
    </td>
  </tr>

  <tr>
    <td colspan="6" align="center"><strong>WishMinder Tools</strong></td>
  </tr>

  <tr>
    <td align="center">
      <a href="https://react.dev/" target="_blank">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React" />
        <br/>React
      </a>
    </td>
    <td align="center">
      <a href="https://vitejs.dev/" target="_blank">
        <img src="https://vitejs.dev/logo.svg" width="40" height="40" alt="Vite" />
        <br/>Vite
      </a>
    </td>
    <td align="center">
      <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" target="_blank">
        <img src="https://img.icons8.com/color/48/000000/web.png" width="40" height="40" alt="PWA" />
        <br/>PWA
      </a>
    </td>
    <td align="center">
      <a href="https://swagger.io/" target="_blank">
        <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" width="100" height="22" alt="Swagger Badge"/>
        <br/>Swagger
      </a>
    </td>
    <td align="center">
      <a href="https://ui.shadcn.com/" target="_blank">
        <img src="https://img.shields.io/badge/ShadCN%20UI-000000?style=for-the-badge&logo=vercel&logoColor=white" width="100" height="22" alt="ShadCN UI Badge"/>
        <br/>ShadCN UI
      </a>
    </td>
  </tr>
</table>

## 💭 Motivation & Takeaways

**WishMinder** began as a personal challenge to build my first 
complete **full-stack application** and to understand how the 
**frontend and backend** integrate in a real-world setup. It was 
also an opportunity to explore tools I hadn’t worked with before, 
like **React** and **Node.js**, and to get hands-on experience 
with modern web development practices.

Through this project, I gained a much deeper understanding of 
building reliable and secure backend systems — and how to tie 
everything together into a cohesive, user-centered product.

## 🌐 Live Demo & API Docs

- 🔗 **Frontend (Web App)**: [https://your-frontend-url.com](https://your-frontend-url.com)
- 🔗 **Backend Swagger Docs**: [https://your-backend-url.com/api-docs](https://your-backend-url.com/api-docs)
- 🧩 **Base API URL**: `https://your-backend-url.com/api`

The web application is fully deployed and responsive. You can explore the frontend interface or interact directly with the backend via Swagger documentation.

### 🚀 Deployment Overview

- **Frontend**: [Netlify](https://www.netlify.com/) — Used for easy and responsive deployment of the React-based interface.
- **Backend**: [Render](https://render.com/) — Handles server-side logic, API routes. Includes a lightweight CI/CD configuration via render.yaml for automatic deployment from the main branch.
- **Database**: [Supabase](https://supabase.com/)  — Used purely as a hosted PostgreSQL service. All authentication and authorization are handled server-side via custom logic in the backend.
- **Cron Jobs**: [GitHub Actions](https://github.com/features/actions) — Automates the daily notification task using scheduled workflows.

> 🛠️ In a production environment, you'd typically consolidate services on a single platform, but this setup uses free-tier providers to maintain zero hosting cost.

### 🔐 Using Swagger to test API calls

Most API routes require authentication. To test them via Swagger:

1. **Register a user**  
   Use the `POST /api/users` route with a valid payload to create a new user.

2. **Authenticate**  
   Send a POST request to `/api/auth` with your credentials to receive an `accessToken`.

3. **Authorize via Swagger**  
   - Click the **Authorize** button (🔒) in the Swagger UI.
   - Paste your token as: `Bearer <your-access-token>`.

> 💡 You are now authorized to use all protected endpoints!

## ✨ Features

- 🔐 **User Authentication**  
  Secure login & registration using JWT and refresh tokens.  
  Passwords are stored securely using hashing (bcrypt).  
  Authentication tokens handled via HTTP-only cookies.

- 🛡️ **Secure Input Validation**  
  Validates user input on the server-side to enforce constraints (e.g., password length, username format) and prevent malformed data.
  Ensures consistency and protects critical endpoints beyond client-side checks.

- 🔒 **Privacy-Conscious Contact Storage**  
  Email and phone fields of user contacts are encrypted before being saved to the database.  
  This promotes data confidentiality and aligns with **GDPR principles**.

- 📄 **Interactive API Docs**  
  Full API documentation available via Swagger UI.  
  Easily test routes (requires authentication token).

- 📊 **Robust Backend System**  
  PostgreSQL database with a well-structured relational schema.  
  Modular codebase with clearly separated Models, Services, and Routes.  
  Designed following separation of concerns and object-oriented principles.  
  Secrets and configuration stored securely using `.env` files.  
  Logging handled via Winston (with Rollbar integration for production error tracking).

- 🎨 **Responsive & Maintainable Frontend**  
  Built with **React**, **Tailwind CSS** and **shadcn/ui**, following component-based architecture.  
  Responsive layout optimized for both desktop and mobile usage.  
  Structured with reusable **custom components** and **custom hooks** for clarity and separation of concerns.  
  Integrated **Zod** for runtime schema validation and better user feedback on forms. 

- 🔔 **Web Push Notifications**  
  Sends browser push notifications when a contact is celebrating.  
  Implemented using the VAPID protocol and Web Push API for secure, real-time delivery.

- 📅 **Automated Celebrations Check**  
  Uses a scheduled GitHub Action (cron-like) to run a daily script that checks for birthdays and namedays.  

- 📨 **Smart Messaging Workflow**  
  Suggests context-aware messages for birthdays or namedays.  
  Clicking a message opens the default SMS app with prefilled content.

- 📞 **Contacting Made Easy**  
  Option to initiate a phone call with a single tap (on mobile).

- 📁 **Contact Importing**  
  Upload `.vcf` (vCard) files to bulk import contacts.  
  Normalization and validation of contact data (name, phone, email, birthdate).

## 🏗️ Architecture

![Architecture Diagram](./assets/architecture.png) 

This diagram illustrates how the frontend, backend, database, and other services like GitHub Actions interact in the WishMinder application.

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### 📦 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [Yarn](https://yarnpkg.com/) or `npm`


### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/EgroegC/WishMinder.git

cd WishMinder
```

### 2. Install Dependencies

Navigate into the backend and frontend folders and install their dependencies:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

Create a .env file in the backend folder (you can copy from backend/.env.dist) and add the necessary environment variables.

Create a .env file in the frontend folder (you can coppy from frontend/.env.dist) and add the necessary environment variables.

### 4. Database Setup

This project uses PostgreSQL as the database. Follow these steps to set up your local database:

1. **Create the database**

Open your PostgreSQL client (e.g., `psql` CLI or pgAdmin) and run:

```sql
CREATE DATABASE wish_minder;
```

2. **Create the necessary tables**

Run the provided SQL schema file (schema.sql) to create all tables and constraints:

```bash
psql -U your_username -h localhost -d wish_minder -f database/schema.sql
```

- Make sure your database connection settings in .env match the created database.

- Replace your_username with your PostgreSQL user (typically postgres).


### ⚙️ 5. Running the Backend & Frontend

With the database set up and environment variables configured, you're ready to run the full-stack application locally.

#### ▶️ Start the Backend

Navigate to the backend directory:

```bash
cd backend
node ./src/index.js
```

The backend will start on the port specified in your .env file if you specify a PORT variable. If PORT undefined, port 3000 will be used automatically (http://localhost:3000).

#### ▶️ Start the Frontend

In a new terminal, navigate to the frontend directory and start the development server:

```bash
cd ../frontend
npm run dev
```

The frontend will typically be available at http://localhost:5173.

### API Testing with Postman

A ready-to-use [Postman collection](postman/WishMinder.postman_collection.json) is included for testing core API endpoints.

> ℹ️ Some routes related to authentication (e.g., refresh, logout) or browser-only functionality (e.g., push subscription) are not included, as they rely on cookies or browser APIs and are best tested via the frontend.

#### 🛠 How to Use:

1. **Import** the collection into Postman.  
2. *(Optional)* Import the [Postman environment](postman/WishMinder.postman_environment.json) to simplify variable setup.  
3. Make sure the `base_url` variable is set correctly (e.g., `http://localhost:3000`).  
4. Start with the `/api/auth` login route to obtain a JWT and test protected routes.

## 🧪 Testing

This project includes automated tests for backend API routes and core business logic to ensure reliability and maintainability.

### 📦 Prerequisites

To run the tests, you need a separate test database. You can create it by duplicating your development database and naming it `test_wish_minder`.  

Database connection settings for tests are configured in `backend/config/tests.json`. Feel free to update the database name, user, and other credentials as needed to match your environment.

### ⚙️ Running Tests

- **Testing frameworks:** Jest and Supertest  
- **Test coverage:** Unit tests and integration tests covering API endpoints, validation, and business logic  
- **Run tests:**  
  From the `backend` directory, run:

  ```bash
  npm test
  ```





