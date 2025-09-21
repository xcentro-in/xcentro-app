# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development (with development mode)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Routing**: React Router v6
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Date Handling**: date-fns

## Architecture Overview

### Application Structure
PaySphere is a comprehensive payment management platform with the following core modules:

- **Payment Processing**: New payments, upcoming payments, payment history
- **Payee Management**: Contact management and payee relationships
- **Financial Instruments**: Credit cards, wallets, invoices
- **Business Intelligence**: Analytics, insights, reporting
- **Rewards System**: Points, milestones, redemption flows
- **User Management**: Approvals, settings, authentication

### Key Components Organization

#### Navigation Structure
The application is organized around the main navigation items defined in `src/constants/sidebar-menu.ts`:

- **Dashboard** (`/`) - Overview and quick actions
- **New Payment** (`/new-payment`) - Payment creation flows
- **Upcoming Payments** (`/payment-calendar`) - Calendar view and upcoming transactions
- **Payment History** (`/payments`) - Transaction history and filtering
- **Manage Payees** (`/payees`) - Payee management
- **Credit Cards** (`/credit-cards`) - Card management with bill payment submenu
- **Wallet** (`/wallet`) - Payment methods and wallet management
- **Invoices** (`/invoices`) - Invoice processing and payment
- **Approvals** (`/approvals`) - Transaction approval workflows
- **My Rewards** (`/rewards`) - Rewards dashboard, history, and milestones
- **Business Reports** (`/insights`) - Analytics and reporting with multiple submenu items

#### Payments Component Architecture
The payments components are organized by page/feature rather than by component type:

```
src/components/payments/
     new-payment/              # All New Payment page components
         quick-payment/        # Single payments
         batch-payment/        # Bulk payment processing
         payroll/              # Payroll-specific payments
         gst-payment/          # GST tax payments
         invoice-payment/      # Invoice payment flows
         credit-card-bill/     # Credit card bill payments
         selection/            # Payment type selection
         shared/               # Shared within new-payment flows
             steps/            # Common workflow steps
             payment-methods/  # Payment method selection
             common/           # Schedules, summaries, etc.
     upcoming-payments/        # Upcoming Payments page components
     payment-history/          # Payment History page components
     payee-management/         # Manage Payees page components
     shared/                   # Components shared across all payment pages
```

### Feature Flag System
The application uses a comprehensive feature flag system (`src/lib/featureFlags.ts`) that supports:

- **Boolean flags**: Simple on/off features
- **Percentage-based rollouts**: Gradual feature releases
- **Role-based access**: Features for specific user roles (user, developer, owner)
- **Hash-based consistency**: Stable user assignments across sessions

Current feature flags include:
- `REWARD_POINT_SYSTEM`
- `BUSINESS_ANALYTICS`
- `GST_PAYMENTS`
- `CREDIT_CARD_MANAGEMENT`
- `BILLER_PAYMENTS`

### Data Flow Patterns

#### Form Handling
Forms use React Hook Form with Zod validation:
- Form schemas defined close to components
- Custom form components in `src/components/ui/`
- Validation messages through shadcn/ui form components

#### State Management
- **Local State**: React useState for component-specific state
- **Server State**: TanStack Query for API data
- **Global State**: Context providers for app-wide state (PageTitle, Theme)

#### Routing and Navigation
- File-based routing with React Router
- Route protection handled at component level
- Navigation state managed through sidebar context

### TypeScript Configuration
- Path aliases configured with `@/*` mapping to `src/*`
- Relaxed TypeScript settings for rapid development:
  - `noImplicitAny: false`
  - `strictNullChecks: false`
  - `noUnusedLocals: false`

### UI Design System
Built on shadcn/ui with:
- Custom color scheme and spacing
- Consistent component patterns
- Responsive design with mobile-first approach
- Dark/light theme support via next-themes

### Testing and Development
- Vite for fast development builds
- ESLint for code quality
- Development server runs on port 8080
- Hot module replacement enabled for React components

## Project Context
This is a Lovable.dev project that can be edited through the web interface or locally. The codebase is designed for a business payment management platform with multiple payment types, financial reporting, and user management features.