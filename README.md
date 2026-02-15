<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
  
##

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# NestJS Production-Ready Template

A starter backend template built with NestJS, Prisma, and JWT Authentication. This template is designed to be cloned and used as a base for new projects, providing a solid foundation with best practices.

## 🚀 Features

- **Framework**: [NestJS](https://nestjs.com/) (stable version)
- **Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL support
- **Authentication**:
  - JWT-managed Access and Refresh tokens
  - Cookie-based refresh tokens for enhanced security
- **Security**:
  - **Public-by-Default**: All routes are public unless explicitly secured
  - **Explicit Protection**: Use the `@Auth()` decorator to secure routes
  - **RBAC**: Role-Based Access Control integrated into the `@Auth()` decorator
- **API Response**: Global interceptor for standardized API response structures
- **Validation**: Integrated `class-validator` and `class-transformer`
- **Error Handling**: Global exception filter for consistent error formatting
- **Environment Management**: Configured with `@nestjs/config`

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd nestjs-template
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the variables in `.env` (especially `DATABASE_URL` and JWT secrets).

4. **Database Setup**:
   - Generate Prisma Client:
     ```bash
     npx prisma generate
     ```
   - Run migrations to set up your database schema:
     ```bash
     npx prisma migrate dev
     ```

## 🏃 Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm run start:prod
  ```

---

## 📖 Usage Guide

### 1. Securing Routes (`@Auth`)

By default, all routes are **public**. To secure a route, use the `@Auth()` decorator.

- **Requires valid login**:

  ```typescript
  @Get('profile')
  @Auth()
  getProfile() { ... }
  ```

- **Requires specific roles**:
  ```typescript
  @Post('admin-only')
  @Auth(UserRole.ADMIN)
  createAdminTask() { ... }
  ```

### 2. Getting Current User (`@CurrentUser`)

Use the `@CurrentUser()` decorator to access the authenticated user's data from the request.

```typescript
@Get('me')
@Auth()
getMe(@CurrentUser() user: any) {
  return user;
}
```

### 3. Custom Response Metadata (`@ResponseMessage`)

To add a custom message to your standardized API response:

```typescript
@Post()
@ResponseMessage('Resource created successfully!')
create() { ... }
```

### 4. Swagger Documentation

Access the automatic Swagger UI at: `http://localhost:3000/api/docs` (default port).

---

## 📁 Project Structure

- `src/modules`: Feature-based modules (Auth, Users, etc.)
- `src/common`: Reusable decorators, guards, filters, and interceptors
- `prisma`: Database schema and migration files
- `.env`: Environment configurations (keep this secret!)
