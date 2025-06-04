# WishMinder 🎉 – Contact-Based Reminder App

**WishMinder** is a full-stack web app that reminds users of their contacts’ **birthdays** and **namedays**, helping them stay organized and thoughtful by suggesting wish messages.

## 📑 Table of Contents
- [Description](#description)
  - [Built with](#1-built-with)
  - [Motivation and takeaways](#2-motivation-and-takeaways)
- [Live Demo & API Docs](#live-demo--api-docs)
  - [Using Swagger to test API calls](#1-using-swagger-to-test-api-calls)
  - [Deployment Overview](#2-deployment-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Environment Variables](#3-environment-variables)
  - [Database Setup](#4-database-setup)
- [Running the Server](#running-the-server)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
- [Project Structure](#project-structure)
- [Author's Note](#authors-note)
- [Contact](#contact)


## 📌 Description

The app supports uploading contacts via `.vcf` files, which are then parsed and validated server-side. A **daily cron job** checks for celebrants and sends **push notifications**. Users can respond by choosing to **call** or **message** the contact directly, with native apps opening pre-filled with relevant details.

The interface is fully **responsive**, working seamlessly across smartphones and desktops. Although the full stack is deployed, the project emphasizes a **robust, well-tested backend**, featuring:

- **JWT-based authentication** with refresh tokens and secure cookie storage for session management.
- **Push notification system**, including web subscription endpoints and message delivery when a contact celebrates.
- **Daily cron jobs** for scanning upcoming birthdays and namedays and triggering notifications.
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
      <a href="https://chakra-ui.com" target="_blank">
        <img src="https://img.shields.io/badge/Chakra%20UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white" width="100" height="22" alt="Chakra UI Badge"/>
        <br/>Chakra UI
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

---

### 🚀 Deployment Overview

- **Frontend**: [Netlify](https://www.netlify.com/) — Used for easy and responsive deployment of the React-based interface.
- **Backend**: [Render](https://render.com/) — Handles server-side logic, API routes. Includes a lightweight CI/CD configuration via render.yaml for automatic deployment from the main branch.
- **Database**: [Supabase](https://supabase.com/)  — Used purely as a hosted PostgreSQL service. All authentication and authorization are handled server-side via custom logic in the backend.
- **Cron Jobs**: [GitHub Actions](https://github.com/features/actions) — Automates the daily notification task using scheduled workflows.

> 🛠️ In a production environment, you'd typically consolidate services on a single platform, but this setup uses free-tier providers to maintain zero hosting cost.

---

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
  Built with **React** and **Chakra UI**, following component-based architecture.  
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