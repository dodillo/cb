# Financial Performance Suite

An enterprise-ready platform for operational budgeting, variance intelligence, scenario modeling, and automated financial insights. The product is designed to support production workflows with baseline data fallback when live integrations are not configured.

## Features

- **Operational Data Intake**: Ingest structured datasets via upload, paste, or baseline feeds
- **Budget & Cost Management**: Track budgets, costs, and accounting entries across lines of business
- **Variance Intelligence**: Compare planned vs. actual performance with KPI summaries
- **Scenario Modeling**: Evaluate decision models and optimization outcomes
- **Automated Financial Intelligence**: Generate executive summaries and action recommendations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase project (optional for baseline mode)
- Google Gemini API key (optional for AI features)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-organization/financial-performance-suite.git
   cd financial-performance-suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   - `GEMINI_API_KEY`: Google Gemini API key
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_KEY`: Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

4. **Database setup (optional)**
   - Create a Supabase project
   - Run migrations in `supabase/migrations/`
   - Update environment variables with Supabase credentials

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open http://localhost:3000 in your browser.

## Project Structure

```
financial-performance-suite/
  src/
    app/                # Next.js app routes
    components/         # Reusable UI components
    hooks/              # Data hooks and state helpers
    lib/                # Services, data, and utilities
    types/              # TypeScript definitions
  assets/               # Static assets
  docs/                 # Documentation
  tests/                # Tests
  supabase/             # Database schema and migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

Primary tables:
- `analyses` - Analysis runs and reports
- `budgets` - Budget definitions and tracking
- `costs` - Cost records
- `standard_costs` - Standard cost benchmarks
- `products` - Product or service catalog
- `accounting_entries` - Journal entries
- `scenarios` - Scenario definitions

## API Routes

- `/api/analyses` - Analysis operations
- `/api/budgets` - Budget management
- `/api/products` - Product management
- `/api/seed` - Database seeding
- `/api/ai-analysis` - Automated financial intelligence

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Support

For support, contact support@example.com.
