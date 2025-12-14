//ეს chatGBT დავაგენერირებინე და მოვაკოპორე readme-სთვის მგონი საკამრისია და swagger არის API თუ გინდათ postman-ში დაგამატებთ 
# Media Management Microservices

A **microservices-based media management platform** built with Node.js/NestJS. This project provides APIs for managing media, processing images/videos, and user management, orchestrated via an API Gateway and Docker.

---

## 🏗 Project Structure

---

## ⚙️ Services Overview

### 1. API Gateway
- Entry point for all client requests
- Handles authentication and routing
- Aggregates responses from microservices

### 2. User Service
- User registration and login
- JWT-based authentication
- Profile management

### 3. Media Service
- Upload, update, read media
- Store metadata (name, type, organization)
- Search and filter media
- Generates signed URLs for media access

### 4. Processing Service
- Image/video processing jobs
- Generates thumbnails or derived media
- Handles background processing via queue

---

## 🛠 Technology Stack

- **Node.js & NestJS** – Backend framework
- **PostgreSQL / Redis** – Data persistence & caching
- **RabbitMQ** – Event-driven communication between services
- **MinIO / S3** – Media storage
- **Docker & Docker Compose** – Containerization
- **Swagger** – API documentation

---

Follow these steps to run the project locally using Docker or Node.js.

### 1️⃣ Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)  
- [Node.js (v20+)](https://nodejs.org/) for local development  
- [npm](https://www.npmjs.com/) (comes with Node.js)  

Optional tools for testing:  
- [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for API testing  
- [Swagger UI](http://localhost:<gateway-port>/api) (built into API Gateway)

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/MYNAME132/mediaRepo.git
cd mediaRepo
docker-compose up -d
