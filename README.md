# Xcentro Payment Management Platform

A comprehensive payment management platform built with React, TypeScript, and modern web technologies.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development](#development)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js) or **yarn**
- **Git**

## Quick Start

Follow these steps to get the development environment running:

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd xcentro-app

# 2. Install dependencies
npm install

# 3. Create your environment configuration file
# IMPORTANT: You must create a .env file from .env.example
cp .env.example .env
# Then edit .env with your configuration (see Environment Configuration section)

# 4. Start the development server
npm run dev

# The application will be available at http://localhost:8080
```

## Development

### Development Server

The development server runs on **port 8080** with hot module replacement (HMR) enabled:

```bash
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080) to view the application.

### Code Quality

Run ESLint to check code quality:

```bash
npm run lint
```

### Building for Production

Build the application for production:

```bash
npm run build
```

Build for development mode (with development configuration):

```bash
npm run build:dev
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Configuration

The application uses environment variables for configuration.

**IMPORTANT:** You must create your own `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Then edit the `.env` file with your specific configuration:

### Required Variables

#### Backend API URL
```bash
VITE_API_URL=http://localhost:8888
```

**Available environments:**
- **Local Development:** `http://localhost:8888`
- **Development Server:** `https://api-dev.xcentro.in/v1`
- **Staging:** `https://api-staging.xcentro.in/v1`
- **Production:** `https://api.xcentro.in/v1`

#### Cloudflare Turnstile (Optional - Production Only)
```bash
VITE_TURNSTILE_SITE_KEY=
```

Bot protection for login page. Leave empty for development - Turnstile will be automatically disabled.

**Testing Keys:**
- Always passes: `1x00000000000000000000AA`
- Always blocks: `2x00000000000000000000AB`
- Force challenge: `3x00000000000000000000FF`

Get your production key from: [Cloudflare Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)

## Project Structure

```
xcentro-app/
├── src/
│   ├── components/           # React components
│   │   ├── payments/        # Payment-related components (organized by feature)
│   │   │   ├── new-payment/       # New payment flows
│   │   │   ├── upcoming-payments/ # Calendar & upcoming views
│   │   │   ├── payment-history/   # Transaction history
│   │   │   ├── payee-management/  # Payee management
│   │   │   └── shared/            # Shared payment components
│   │   ├── ui/              # shadcn/ui components
│   │   └── ...              # Other feature components
│   ├── contexts/            # React contexts (Auth, PageTitle, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── data/                # Mock data for development
│   ├── lib/                 # Utility functions & helpers
│   ├── constants/           # App constants & configuration
│   └── pages/               # Page components (routes)
├── public/                  # Static assets
├── .env.example            # Environment variables template
├── CLAUDE.md               # AI assistant instructions
└── README.md               # This file
```

### Component Organization

Components are organized by feature/page rather than by component type:

- **`new-payment/`** - All New Payment page components and flows
- **`upcoming-payments/`** - Calendar view and upcoming transactions
- **`payment-history/`** - Transaction history and filtering
- **`payee-management/`** - Payee CRUD operations
- **`shared/`** - Components shared across multiple payment features

## Tech Stack

### Frontend Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing

### UI Framework
- **shadcn/ui** - Component library (Radix UI + Tailwind CSS)
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **next-themes** - Dark/light theme support

### State Management
- **TanStack Query** - Server state management
- **Custom Hooks** - API data fetching with mock data support
- **React Context** - Global state (Auth, PageTitle)

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Data Visualization
- **Recharts** - Charts and graphs
- **date-fns** - Date manipulation

## Architecture Overview

### API Integration Pattern

The application follows a **layered architecture** for backend integration:

#### 1. API Service Layer (`src/services/api.ts`)
- Centralized API client with authentication
- Defines all endpoint signatures and types
- Ready for production integration
- Contains TODO comments for backend team

#### 2. Custom Hooks Layer (`src/hooks/`)
- React-specific data fetching
- Currently uses mock data from `/data/mock*.ts`
- Handles loading states, errors, and caching
- Examples: `useUpcomingPayments`, `usePayees`, `usePaymentInsights`

#### 3. Data Fetching Strategies
- **Upcoming Payments:** Hybrid (server pagination for table, frontend filtering for calendar)
- **Payees:** Single API call with frontend filtering (optimal for 20-30 records)
- **Payment Insights:** Single API call with partial data handling

### Authentication System

- **AuthContext** (`src/contexts/AuthContext.tsx`) - Global auth state
- **ProtectedRoute** - Route-level guards
- **Token-based** - JWT stored in localStorage
- **Anti-flicker** - Prevents login page flash on reload

### Feature Flags

The application uses a comprehensive feature flag system (`src/lib/featureFlags.ts`):

- **Boolean flags** - Simple on/off features
- **Percentage-based rollouts** - Gradual releases
- **Role-based access** - Features for specific roles
- **Hash-based consistency** - Stable user assignments

Current flags:
- `REWARD_POINT_SYSTEM`
- `BUSINESS_ANALYTICS`
- `GST_PAYMENTS`
- `CREDIT_CARD_MANAGEMENT`
- `BILLER_PAYMENTS`

### Routing Structure

Key application routes:

```
/ - Dashboard
/new-payment - Payment creation flows
/payment-calendar - Upcoming payments (calendar view)
/payments - Payment history
/payees - Payee management
/credit-cards - Card management
/wallet - Payment methods
/bills - Invoice processing
/approvals - Transaction approvals
/rewards - Rewards dashboard
/insights - Business reports & analytics
/settings - User settings
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server (port 8080)
npm run lint         # Run ESLint
```

### Building
```bash
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

## Deployment

For deployment instructions, see [README_DEPLOYMENT.md](README_DEPLOYMENT.md).

The application supports:
- Docker containerization
- Multi-stage builds
- Environment-specific configurations
- Production optimizations

## Key Development Notes

### Mock Development Mode
- All APIs currently use mock data
- Mock data in `/src/data/mock*.ts`
- Production-ready API layer in `/src/services/api.ts`
- Uncomment real API calls when backend is ready

### TypeScript Configuration
- Path aliases: `@/*` maps to `src/*`
- Relaxed settings for rapid development
- Use `import { Component } from '@/components/...'` syntax

### UI Components
- Based on shadcn/ui
- Located in `src/components/ui/`
- Customizable with Tailwind classes
- Supports dark/light themes

### Code Standards
- Use ESLint for linting
- Follow existing component patterns
- Organize by feature, not component type
- Keep components focused and single-responsibility

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run lint` to check code quality
4. Test your changes locally with `npm run dev`
5. Commit with clear, descriptive messages
6. Push to your branch and create a pull request

## Support & Documentation

- **CLAUDE.md** - Instructions for AI assistant development
- **README_DEPLOYMENT.md** - Deployment documentation
- **Project Issues** - [GitHub Issues](https://github.com/xcentro-in/xcentro-app/issues)

## License

Proprietary - Xcentro

---

**Note:** This project is built with [Lovable.dev](https://lovable.dev) and can be edited through the web interface or locally.
