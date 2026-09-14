# AI-Powered Smart Helpdesk & Ticket Management System

A portfolio-ready full-stack microservices project built with Java, Spring Boot, Spring Security, REST APIs, Collections, and React.js.

## Architecture
- Eureka Server: service discovery
- API Gateway: single entry point
- Auth Service: registration/login with BCrypt password hashing and JWT
- Ticket Service: create, view, update and assign support tickets
- AI Service: automatic category, priority and resolution suggestion
- React Frontend: dashboard, ticket creation, ticket list and AI insights
- H2 databases are used by default so the project runs without MySQL setup.

## Tech Stack
Backend: Java 17, Spring Boot 3.4.9, Spring Cloud 2024.0.2, Spring Security, JWT, JPA/Hibernate, REST APIs, Java Collections
Frontend: React.js, Vite, HTML5, CSS3
Microservices: Eureka, Spring Cloud Gateway
Testing: Spring Boot Test

## Run
Requirements: JDK 17+, Maven 3.9+, Node.js 18+.

Open 5 terminals.

1. `cd backend/eureka-server && mvn spring-boot:run`
2. `cd backend/auth-service && mvn spring-boot:run`
3. `cd backend/ai-service && mvn spring-boot:run`
4. `cd backend/ticket-service && mvn spring-boot:run`
5. `cd frontend && npm install && npm run dev`

Open http://localhost:5173

Gateway: http://localhost:8080
Eureka: http://localhost:8761

## Demo login
Register from the UI, then login. Demo users are stored in the auth service H2 database.

## API examples
POST `/api/auth/register`
POST `/api/auth/login`
GET `/api/tickets`
POST `/api/tickets`
PUT `/api/tickets/{id}/status`
PUT `/api/tickets/{id}/assign`

## Resume project line
AI-Powered Smart Helpdesk & Ticket Management System | Java, Spring Boot, Spring Security, REST APIs, Microservices, React.js, MySQL/H2
