# QuickHire - Server

Backend REST API for the QuickHire job portal, built with Express.js and MongoDB.

**Live:** [https://quick-hire-server-beta.vercel.app](https://quick-hire-server-beta.vercel.app)

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 4.18
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (access + refresh tokens, separate for user and admin)
- **Other:** bcryptjs, cookie-parser, cors, morgan

## Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- pnpm (recommended) or npm

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd quickhire-server
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Copy the sample env file and fill in the values:

```bash
cp sample.env .env
```

4. **Start the development server**

```bash
pnpm dev
```

The API will be available at `http://localhost:5000`.

## Environment Variables

| Variable               | Description                           | Example                    |
| ---------------------- | ------------------------------------- | -------------------------- |
| `NODE_ENV`             | Application environment               | `development`              |
| `PORT`                 | Port the server listens on            | `5000`                     |
| `MONGO_URI`            | MongoDB connection string             | `mongodb://localhost/quickhire` |
| `JWT_SECRET`           | Secret key for user access tokens     | *(any secure random string)* |
| `REFRESH_SECRET`       | Secret key for user refresh tokens    | *(any secure random string)* |
| `ADMIN_JWT_SECRET`     | Secret key for admin access tokens    | *(any secure random string)* |
| `ADMIN_REFRESH_SECRET` | Secret key for admin refresh tokens   | *(any secure random string)* |
| `CLIENT_URL`           | Frontend origin for CORS              | `http://localhost:3000`    |

## Available Scripts

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `pnpm dev`     | Start in watch mode (auto-restart)       |
| `pnpm start`   | Start in production mode                 |
| `pnpm lint`    | Run ESLint                               |

## Project Structure

```
quickhire-server/
  server.js              # Application entry point
  config/                # Database connection, email config
  controllers/           # Route handlers (consumer & employee apps)
  middlewares/            # Auth, error handling, RBAC
  models/                # Mongoose schemas
  routes/                # API route definitions
  services/              # External service integrations
  utils/                 # Helper functions and utilities
```

## Related

Frontend repository: [QuickHire-client](https://github.com/Shahriar-Utchas/QuickHire-client)
 
