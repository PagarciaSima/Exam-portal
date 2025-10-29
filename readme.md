# Exam Portal Full Stack Application / Spring Boot & Angular

A comprehensive **full stack web application** built with **Spring Boot (backend)** and **Angular (frontend)**, designed to manage online exams with distinct roles for **Administrators** and **Regular Users**.  
The project implements complete **CRUD operations with search and pagination**, **role-based access**, **data visualization with Chart.js**, **automated question generation using Gemini API**, and a fully **responsive design** with **Bootstrap** and **Angular Material**.

This application simulates a real-world exam management system, featuring secure user interaction, timed quizzes, performance tracking, and administrative dashboards with insightful analytics.

Key highlights:
- 🔐 Role-based functionality (Admin & User)
- ⚙️ Full CRUD with **search & pagination** for categories, quizzes, and questions
- 🤖 Integration with **Gemini API** for automatic question generation
- 📊 Interactive dashboards with **Chart.js**
- 🌍 Internationalization (i18n) support
- 🧪 Comprehensive testing with **JUnit**, **Jasmine**, and **Karma**
- ☁️ Backend deployed on **AWS EC2**
- 🧱 Fully documented with **OpenAPI**, **Javadoc**, and coverage reports

---

## 🎥 Live Demo

Watch a short demo of the app in action:

[![Exam Portal Demo](./img/demo_thumbnail.png)](https://www.youtube.com/watch?v=TU_VIDEO_ID)

> 🔗 Click the image or the link to view on YouTube.

---

## 📘 Documentation

### 🔹 Backend (Spring Boot)
- **OpenAPI (Swagger UI):** auto-generated REST API documentation.
- **Javadoc:** available in the `/examserver/doc` directory — open the [index.html](./examserver/doc/index.html) file for the full API reference.
- **ER Diagram:** entity-relationship model illustrating the database schema and relationships.  
  ![ER Diagram](./img/ER.png)

### 🔹 Frontend (Angular)
- **Component & Service Architecture Overview**
- **TypeDoc Documentation:** generated automatically from TypeScript sources.  
  Open the [index.html](./examfront/documentation/index.html) file for the complete component, service, and module reference.

#### 📄 Visual Samples
- **OpenAPI Docs:**
  
  ![Open API Docs](./img/OpenAPiDoc.png)
- **JavaDocs:**
  
  ![JavaDocs](./img/JavaDocs.png)
- **TS Docs:**
  
  ![TS docs](./img/TsDocs.png)

---

## 🧪 Testing & Coverage Reports

### 🔹 Backend
- **JUnit 5** for service and controller tests.
- **Surefire Plugin** generates detailed execution reports:  
  [`/examserver/target/site/surefire-report.html`](./examserver/target/site/surefire-report.html)
  ![Surefire report](./img/surefire.png)

### 🔹 Frontend
- **Unit testing:** with **Jasmine** & **Karma**.
  ![Karma report](./img/karma.png)

---

## 🛠️ Features

### 👑 Administrator Role

Comprehensive management of the platform's exam ecosystem, including:

#### 👤 Profile Management
- Edit personal information
- Update profile photo

#### 🧩 Category Management (CRUD)
- Create, update, and delete question categories
- Thematic organization of quizzes
- **Advanced search and pagination** in category listings

#### 📝 Quiz Management (CRUD)
- Create and edit quizzes with complete metadata
- Configure duration, difficulty, and category
- Status management (active/inactive)
- **Searchable and paginated** quiz listings

#### ❓ Question Management (CRUD)
- Add, edit, or remove questions from any quiz
- Complete question bank management
- **Enhanced search functionality** with pagination

#### ⚡ Mass Question Generation (Gemini API)
Automatic generation of up to 20 quiz questions in two steps:

1. **Connect with Google Gemini API** to generate content
2. **Import questions** via:
   - Direct JSON paste
   - File upload directly to the platform

#### 📊 Analytics Dashboard (Chart.js)
Visual analytics dashboard with key metrics:
- **Quizzes by category** - Thematic distribution
- **Active vs. inactive quizzes** - Platform status
- **Most attempted quizzes** - Popularity and engagement

### 🙋‍♂️ User Role

Focused on the exam-taking experience and performance tracking:

#### 🏁 Quiz Execution
- Start and complete quizzes with timer functionality
- Real-time scoring during attempts

#### 📈 Home Dashboard (Chart.js)
- Visual summary of personal quiz performance
- Overview of available categories and quizzes

#### 📚 Quiz Discovery
- Browse quizzes by category
- Filter based on topic or difficulty level
- **Search and pagination** for efficient quiz discovery

#### 🧾 Attempt History
- Review detailed results from past attempts
- Printable report of the latest attempt
- **Paginated history** with search capabilities

#### ⏱️ Automated Timing
- Quiz timer with countdown display
- Automatic submission when time expires

## 🌍 Additional Features

#### 🌐 Internationalization
- i18n support for multilingual UI
- Multi-language capability for global accessibility

#### 🔒 Security & Access Control
- Role-based routing and guards for secure access control
- Token-based authentication (JWT)
- Protected routes and API endpoints

#### 🚀 Deployment & Infrastructure
- Full-stack deployment-ready architecture
- Backend successfully deployed to AWS EC2
- Scalable cloud infrastructure

#### 📚 Automated Documentation
- Comprehensive API documentation via OpenAPI/Swagger
- Backend code documentation with Javadoc
- Frontend documentation with TypeDoc

#### 🧪 Testing Suite
- **Backend**: JUnit for comprehensive unit testing
- **Frontend**: Jasmine & Karma for Angular testing
- End-to-end testing coverage

#### 📱 Responsive Design
- Full compatibility across all devices:
- Built with Bootstrap + Angular Material
- Optimized user experience on any screen size

---

## ⚙️ Technologies

### 🔙 Backend (Spring Boot 3.4.1 / Java 17)

#### 🏗️ Core Framework
- **Spring Boot 3.4.1** - Main application framework
- **Java 17** - Programming language
- **Spring Data JPA** - Database abstraction and repository layer
- **Spring Web** - RESTful web services and MVC

#### 🗄️ Database & Persistence
- **MySQL** - Primary relational database
- **Hibernate** - JPA implementation for ORM

#### 🔐 Security
- **Spring Security** - Authentication and authorization
- **JWT (JJWT)** - JSON Web Tokens for secure API communication
- **JAXB API** - XML binding for security configurations

#### 📚 Documentation & Testing
- **SpringDoc OpenAPI 2.7.0** - API documentation (Swagger UI)
- **JUnit** - Unit testing framework
- **Maven Surefire** - Test execution and reporting

#### 🛠️ Development Tools
- **Spring Boot DevTools** - Hot reload and development utilities
- **Maven** - Dependency management and build automation

### 🔜 Frontend (Angular 16)

#### 🅰️ Core Framework
- **Angular 16** - Main frontend framework
- **TypeScript** - Primary programming language
- **RxJS** - Reactive programming library

#### 🎨 UI Components & Styling
- **Angular Material** - Material Design component library
- **Bootstrap 5** - Responsive CSS framework
- **Angular CDK** - Component development kit

#### 📊 Data Visualization & UI Enhancements
- **Chart.js** - Interactive charts and graphs
- **ng2-charts** - Angular wrapper for Chart.js
- **CKEditor 5** - Rich text editor component
- **SweetAlert2** - Beautiful modal dialogs and notifications

#### 🌐 Internationalization & UX
- **ngx-translate** - Multi-language support (i18n)
- **ngx-loading** - Loading indicators and spinners

#### 🧪 Testing & Documentation
- **Jasmine & Karma** - Unit testing framework and test runner
- **TypeDoc** - TypeScript documentation generator
- **Compodoc** - Angular application documentation

#### 🔧 Development Tools
- **Angular CLI** - Development and build tools
- **ESLint** - Code linting and quality
- **TypeScript 5.1** - Enhanced type safety and features

---

## 🚀 Deployment

### ☁️ AWS Infrastructure

#### Backend Deployment
- **AWS EC2** - Successfully deployed Spring Boot application
- **RDS MySQL** - Configured and connected remote database instance
- **Security Groups** - Implemented proper network security configurations

--- 

## Interfaces 🖥️

### 🔐 Authentication
- **Login**  
  ![login](img/login.png)

- **Signup**  
  ![signup](img/signup.png)

### 👑 Admin Dashboard & Profile
- **Admin Home**  
  ![admin_home](img/admin_home.png)

- **Admin Profile**  
  ![admin_profile](img/admin_profile.png)

- **Update Profile**  
  ![admin_profile_update_profile](img/admin_profile_update_profile.png)

- **Change Profile Photo**  
  ![admin_profile_photo](img/admin_profile_photo.png)

### 🧩 Category Management
- **Categories List**  
  ![admin_categories_list](img/admin_categories_list.png)

- **Add Category**  
  ![admin_category_add](img/admin_category_add.png)

- **Edit Category**  
  ![admin_category_edit](img/admin_category_edit.png)

- **Delete Category**  
  ![admin_category_delete](img/admin_category_delete.png)

### 📝 Quiz Management
- **Quizzes List**  
  ![admin_quiz_list](img/admin_quiz_list.png)

- **Add Quiz**  
  ![admin_quiz_add](img/admin_quiz_add.png)

- **Edit Quiz with AI Generation**  
  ![admin_quiz_edit_ia_gen](img/admin_quiz_edit_ia_gen.png)

### ❓ Question Management
- **Questions List**  
  ![admin_question_list](img/admin_question_list.png)

- **Edit Question**  
  ![admin_question_edit](img/admin_question_edit.png)

### 🙋‍♂️ User Experience
- **User Home Dashboard**  
  ![user_home](img/user_home.png)

- **Available Quizzes**  
  ![user_available_quizzes](img/user_available_quizzes.png)

- **Quiz Instructions**  
  ![user_quiz_instructions](img/user_quiz_instructions.png)

- **Active Quiz Session**  
  ![user_quiz](img/user_quiz.png)

- **Quiz Results**  
  ![user_quiz_result](img/user_quiz_result.png)

- **Printable Result Report**  
  ![user_quiz_result_print](img/user_quiz_result_print.png)

- **Review Quiz Attempt**  
  ![user_review_quiz](img/user_review_quiz.png)