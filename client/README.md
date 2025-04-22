# NepalPortfolio Financial Dashboard

<div align="center">
  <img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</div>

A modern financial insights dashboard built with Next.js 15, React 19, and Tailwind CSS to visualize and analyze company financial data within the Nepal market. This project was developed as part of a full-stack internship (April 2025) at PeridotNepal.

## ✅ Internship Tasks Completed

1. **Frontend Data Visualization** - Interactive dashboard with multiple view modes with fetching sample api (Cards, Pulse, Performance)
2. **Dividend Checker** -API integration for fetching and displaying dividend data by fiscal period

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI primitives)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Development**: TypeScript, ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/peridotnepal/internship-fullstack-april/tree/rahul-chaudhary

   cd internship-fullstack-april/client
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Available Scripts

- `pnpm dev` - Start the development server with turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check for code quality issues

## 📱 Key Components

- **CompanyDashboard**: Main dashboard view for a single company
- **CompanyComparison**: Interface for comparing multiple companies
- **PerformanceZone**: Visual representation of company performance metrics
- **MarketPulse**: Market trend visualization
- **QuickSynopsis**: Summary of key financial indicators
- **HistoricalPerformance**: Charts for historical financial data
- **DividendChecker**: Tool for fetching and displaying dividend data by fiscal period (YYYY/YYYY format)

## 🔒 Security

The application includes built-in encryption/decryption utilities for sensitive data using CryptoJS.

## 🎨 UI Customization

The project uses a custom Tailwind CSS configuration with theme variables defined in the global CSS. Dark mode is supported out of the box.
