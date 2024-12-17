# MeGuie

<p align="center"><img src="https://meguie.netlify.app/favicon.ico" alt="MeGuie Logo" width="150"></p>

## Table of Contents

1. [Introduction](#introduction)  
2. [Requirements](#requirements)  
3. [Installation](#installation)  
4. [How to Use](#how-to-use)  
5. [Project Variants](#project-variants)  
6. [Environment Variables](#environment-variables)  

## Introduction

**MeGuie** is an innovative platform that helps organize and structure study plans based on roadmaps for middle and high school subjects. By curating quality content, MeGuie provides a clear and practical guide to optimize study time and improve outcomes for students preparing for college entrance exams.

## Requirements

To run the project locally, you will need:

- [**Node.js** (v20 or higher)](https://nodejs.org/)  
- [**MongoDB Atlas** (Cloud Database)](https://www.mongodb.com/cloud/atlas)  

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/lfelipediniz/MeGuie.git
```

Navigate to the project folder:

```bash
cd MeGuie
```

### 2. Install Dependencies

```bash
npm install --force
```

### 3. Start the Development Server

```bash
npm run dev
```

By default, the server will run at `http://localhost:3000`.

## How to Use

1. **Access the Application**:  
   Open `http://localhost:3000` or use the hosted versions:

   - **Full Project (APOO Version)**: [https://meguie.netlify.app](https://meguie.netlify.app)  
   - **IHC Prototype**: [https://meguie.vercel.app](https://meguie.vercel.app)  

2. **Log in with Test Accounts (APOO Version Only)**:  
   These credentials are valid only for the **APOO Version** hosted at [https://meguie.netlify.app](https://meguie.netlify.app).

   - **Admin Account**  
     - **Email**: `adminteste@gmail.com`  
     - **Password**: `123456`  

   - **User Account**  
     - **Email**: `usuarioteste@gmail.com`  
     - **Password**: `123456`  

3. **Explore the Features**:  
   - Browse study roadmaps.  
   - Organize study plans.  
   - Manage user settings.

## Project Variants

### 1. APOO Version (Object-Oriented Analysis and Design)

Developed for the **Object-Oriented Analysis and Design** course, this version includes:

- Full backend integration with **MongoDB Atlas**.  
- User authentication with **JWT tokens**.  
- Complete study roadmap functionality.  

**Live Site**: [https://meguie.netlify.app](https://meguie.netlify.app)

### 2. IHC Version (Human-Computer Interaction)

Developed for the **Human-Computer Interaction** course, this prototype focuses on:

- Basic frontend features.  
- Accessibility-centered design.  

**Live Prototype**: [https://meguie.vercel.app](https://meguie.vercel.app)

## Environment Variables

To run the project locally, create a `.env` file in the root directory and add the following variables:

```plaintext
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/meguie
JWT_SECRET=your_jwt_secret_key
```

- **`MONGODB_URI`**: The connection string for your MongoDB Atlas database. Ensure your credentials are correct.  
- **`JWT_SECRET`**: A secret key for signing and verifying JWT tokens for authentication.

## About the Project

This project was developed as part of the **Human-Computer Interaction** and **Object-Oriented Analysis and Design** courses at **USP**.

For more information about these courses, visit:

- [SCC0260 - Human-Computer Interaction](https://uspdigital.usp.br/jupiterweb/obterDisciplina?sgldis=SCC0260&codcur=55041&codhab=0)  
- [SSC0124 - Object-Oriented Analysis and Design](https://uspdigital.usp.br/jupiterweb/obterDisciplina?sgldis=SSC0124&codcur=55041&codhab=0)  

**Happy Learning! 📚🚀**
