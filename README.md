# TechStore E-Shop & Inventory Management System

![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-WSL2-2496ED?logo=docker)

A full-stack, portfolio-ready E-Commerce and Inventory Management platform specialized in technology products and PC hardware. Built using **ASP.NET Core Web API**, **React with TypeScript**, **Entity Framework Core**, and **MySQL**.

---

## Key Features & Business Rules

* **JWT Authentication & RBAC:** Secure user registration and login with BCrypt password hashing and role-based access control (`Admin` & `Customer`).
* **Catalog & Category Management:** Public catalog browsing with active filtering and stock availability indicators.
* **Stock Reservation:** Automated stock check and real-time inventory deduction upon successful order placement.
* **Order State Machine:** Enforced state transitions (`New` ➔ `InProgress` ➔ `Completed` / `Cancelled`) with automated inventory returns on customer cancellations.
* **Soft Delete:** Business Rule enforcement for preserving order history — products are marked `IsActive = false` instead of physical deletion.

---

## Software Stack

* **Backend:** C# ASP.NET Core Web API (N-Tier Architecture: Controllers, Services, Repositories, DTOs, Entities)
* **Frontend:** React + TypeScript (powered by Vite) + Axios
* **Database & ORM:** Entity Framework Core (Code-First Migrations) with MySQL
* **Testing:**
  * **Unit Tests:** xUnit & Moq
  * **API Integration Tests:** xUnit & Testcontainers (Docker MySQL Containers)
  * **E2E Tests:** Playwright
* **API Documentation:** Swagger UI / Scalar & `.http` files

---

## 📁 Repository Structure

```text
Techstore-eshop/
├── backend/
│   ├── TechStore.sln
│   ├── TechStore.Api/             # Web API Application
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Repositories/
│   │   ├── DTOs/
│   │   └── Entities/
│   ├── TechStore.UnitTests/       # xUnit + Moq Tests
│   └── TechStore.IntegrationTests/# xUnit + Testcontainers Tests
├── frontend/                      # React + TypeScript (Vite SPA)
├── AI_USAGE.md                    # AI Tooling Log & Reflection
└── README.md
```

---

## Getting Started

### Prerequisites

* [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
* [Node.js (v20+ LTS)](https://nodejs.org/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with WSL 2 backend)
* [XAMPP](https://www.apachefriends.org/) (for local MySQL database)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Witherman12/Techstore-eshop
   cd Techstore-eshop
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   dotnet restore
   dotnet ef database update --project TechStore.Api
   dotnet run --project TechStore.Api
   ```
   *The API will start at `https://localhost:7xxx/swagger`.*

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The React application will run at `http://localhost:5173`.*

---

## Running Automated Tests

```bash
# Run Unit Tests
dotnet test backend/TechStore.UnitTests/TechStore.UnitTests.csproj

# Run API Integration Tests (Requires Docker Desktop running)
dotnet test backend/TechStore.IntegrationTests/TechStore.IntegrationTests.csproj
```

---

## Project Management & Scrum

This project follows an Agile/Scrum framework structured in 2-week Sprints:
* **Jira Board:** Managed via Jira Scrum Board (Key: `TES`).
* **Branching Model:** Feature branching strategy (`feature/TES-X-...`) with Pull Request code reviews and mandatory CI status checks before merging into `main`.