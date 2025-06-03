# WishMinder 🎉 – Contact-Based Reminder App

**WishMinder** is a full-stack application that reminds users of their contacts' birthdays and Greek namedays.  
While the app includes a front end, the **focus of this project is its robust and well-tested backend**, designed for scalability, data integrity, and real-world reliability.

## 📑 Table of Contents
- [Description](#description)
- [Live API & Documentation](#live-api--documentation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Environment Variables](#3-environment-variables)
  - [Database Setup](#4-database-setup)
- [Running the Server](#running-the-server)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
- [Project Structure](#project-structure)
- [Author's Note](#authors-note)
- [Contact](#contact)

## 📌 Description

**WishMinder** is a full-stack web application designed to help users stay thoughtful and organized by reminding them of upcoming **birthdays** and **namedays** of their contacts. The system intelligently parses user-uploaded contact files, corrects and validates data (including support for Greek naming conventions), and automates notifications for meaningful dates.

While the project is fully functional on both the frontend and backend, my primary focus was on building a **robust, scalable, and well-tested backend system** that handles everything from authentication and contact normalization to scheduled nameday calculations and batch processing.

### 🎯 Why I built it

* To **deep-dive into backend systems** involving data validation, user authentication, and file-based contact imports.
* To gain hands-on experience with **PostgreSQL**, **Express**, and **RESTful API design**.
* To learn and apply **test-driven development (TDD)** principles using integration and unit tests.
* To demonstrate professional-grade **error handling**, **logging**, and **documentation** using Swagger.

### 💡 What problem does it solve?

People often forget important personal dates. WishMinder simplifies this by:

* Importing user contacts via `.vcf` files.
* Automatically recognizing and **correcting malformed or misordered contact data**.
* Notifying users of upcoming **namedays** based on a Greek calendar system.

### 🚀 What I learned

* How to structure a backend codebase in a scalable and testable way.
* Deep understanding of **token-based authentication** using JWT.
* Writing **integration and unit tests** for API endpoints and services.
* Handling **asynchronous errors**, process crashes, and unexpected data states safely.
* The importance of **developer documentation** and how to build it with Swagger.


