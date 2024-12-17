# MeGuie  
<p align="center"> <img src="https://meguie.netlify.app/favicon.ico" alt="MeGuie Logo" width="150"> </p>  

## Table of Contents  

- [MeGuie](#meguie)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Requirements](#requirements)
  - [Installation](#installation)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Start the Development Server](#start-the-development-server)
  - [How to Use](#how-to-use)
  - [Project Variants](#project-variants)
    - [APOO Version](#apoo-version)
    - [IHC Version](#ihc-version)
  - [Environment Variables](#environment-variables)
    - [Explanation](#explanation)


## Introduction  

**MeGuie** is an  platform that helps organize and structure study plans based on roadmaps designed for middle and high school subjects. By curating quality content, we provide a clear and practical guide to optimize study time and improve outcomes for students preparing for college entrance exams.  


## Requirements  

To run the project, you'll need:  

- **Node.js** (v20 or higher)  
- **MongoDB Atlas** (Cloud Database)  
- **npm** (Node Package Manager)  


## Installation  

### Clone the Repository  

```bash  
git clone https://github.com/lfelipediniz/MeGuie.git  
```  

```bash
cd MeGuie  
```
### Install Dependencies  

```bash  
npm install --force  
```  

### Start the Development Server  

```bash  
npm run dev  
```  

The server will run at `http://localhost:3000` by default.  


## How to Use  

1. **Access the Application**:  
   Open `http://localhost:3000` or the hosted versions:  
   
   - **APOO Version (Full Project)**: [https://meguie.netlify.app](https://meguie.netlify.app)  
   - **IHC Prototype**: [https://meguie.vercel.app](https://meguie.vercel.app)  

2. **Login with Test Accounts**:  

   - **Admin Account**  
     - **Email**: `adminteste@gmail.com`  
     - **Password**: `123456`  

   - **User Account**  
     - **Email**: `usuarioteste@gmail.com`  
     - **Password**: `123456`  

3. **Explore the Features**:  
   - Browse roadmaps.  
   - Organize study paths.  
   - Manage user settings.  


## Project Variants  

### APOO Version  

Developed for the **Object-Oriented Analysis and Design** course, this version includes:  

- Full backend integration with **MongoDB Atlas**.  
- User authentication with **JWT tokens**.  
- Full-featured study roadmap functionality.  

**Live Site**: [https://meguie.netlify.app](https://meguie.netlify.app)  

### IHC Version  

Developed for the **Human-Computer Interaction and User Experience** course, this prototype focuses on:  

- Basic frontend features.  
- Accessibility-focused design.  

**Live Prototype**: [https://meguie.vercel.app](https://meguie.vercel.app)  


## Environment Variables  

To replicate the project locally, create a `.env` file in the root directory and set the following variables:  

- **`MONGODB_URI`**: The connection string for your MongoDB database. Example:  
  ```plaintext  
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/meguie  
  ```  

- **`JWT_SECRET`**: Secret key for signing JWT tokens. Example:  
  ```plaintext  
  JWT_SECRET=your_jwt_secret_key  
  ```  

### Explanation  

- **MONGODB_URI**: This is the URL to connect to your MongoDB Atlas database. Ensure your credentials and cluster details are correct.  
- **JWT_SECRET**: This key is used to securely sign and verify JSON Web Tokens for authentication purposes.  


---

**Happy Learning! 📚🚀**  

This project was developed as part of the **Human-Computer Interaction and User Experience** and **Object-Oriented Analysis and Design** courses at USP. For more information about these courses, visit:  

- [SCC0260 - Human-Computer Interaction and User Experience](https://uspdigital.usp.br/jupiterweb/obterDisciplina?sgldis=SCC0260&codcur=55041&codhab=0)  
- [SSC0124 - Object-Oriented Analysis and Design](https://uspdigital.usp.br/jupiterweb/obterDisciplina?sgldis=SSC0124&codcur=55041&codhab=0)  
  
--- 
