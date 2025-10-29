# Exam Portal Full Stack Application / Spring Boot & Angular

A comprehensive **full stack web application** built with **Spring Boot (backend)** and **Angular (frontend)**, designed to manage online exams with distinct roles for **Administrators** and **Regular Users**.  
The project implements complete **CRUD operations**, **role-based access**, **data visualization with Chart.js**, **automated question generation using Gemini API**, and a fully **responsive design** with **Bootstrap** and **Angular Material**.

This application simulates a real-world exam management system, featuring secure user interaction, timed quizzes, performance tracking, and administrative dashboards with insightful analytics.

Key highlights:
- 🔐 Role-based functionality (Admin & User)
- ⚙️ Full CRUD for categories, quizzes, and questions
- 🤖 Integration with **Gemini API** for automatic question generation
- 📊 Interactive dashboards with **Chart.js**
- 🌍 Internationalization (i18n) support
- 🧪 Comprehensive testing with **JUnit**, **Jasmine**, and **Karma**
- ☁️ Backend deployed on **AWS EC2**
- 🧱 Fully documented with **OpenAPI**, **Javadoc**, and coverage reports

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

#### 📝 Quiz Management (CRUD)
- Create and edit quizzes with complete metadata
- Configure duration, difficulty, and category
- Status management (active/inactive)

#### ❓ Question Management (CRUD)
- Add, edit, or remove questions from any quiz
- Complete question bank management

#### ⚡ Mass Question Generation (Gemini API)
Automatic generation of up to 20 quiz questions in two steps:

1. **Connect with Google Gemini API** to generate content---
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

#### 🧾 Attempt History
- Review detailed results from past attempts
- Printable report of the latest attempt

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

---

#### 📱 Responsive Design
- Full compatibility across all devices:
- Built with Bootstrap + Angular Material
- Optimized user experience on any screen size

## ⚙️ Technologies

### Backend (Spring Boot 3.4.0 / Java 17)


---

## Frontend (Angular 16)


---


## Interfaces 🖥️

### Login
![login](img/login.png)



---
