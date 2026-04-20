# Finance Dashboard UI Assessment

A comprehensive financial data dashboard built with Next.js frontend and Node.js backend, providing real-time currency rates, gold/silver prices, FD rates, NEPSE stock data, and financial news.

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - REST API framework
- **MySQL 2** - Relational database for storing scraped data
- **Puppeteer** - Headless browser automation for web scraping
- **Cheerio** - jQuery-like HTML parsing library
- **Node-Cron** - Task scheduling for automated data scraping
- **RSS-Parser** - Parsing RSS feeds for news
- **Axios** - HTTP client for API requests
- **Date-fns** - Date manipulation library
- **Nodemon** - Development server with hot reload
- **CORS** - Cross-Origin Resource Sharing middleware

### Frontend (Next.js + React)

- **Next.js 16.2.3** - React framework with server-side rendering
- **React 19.2.4** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS 4** - Utility-first CSS framework
- **shadcn/ui** - Headless UI component library (Base UI)
- **Lucide React** - Icon library
- **React Calendar** - Calendar component for date selection
- **HTML-to-Image** - Converting DOM to PNG/JPG
- **HTML2Canvas** - Canvas-based HTML to image conversion
- **DOM-to-Image** - DOM serialization to image format
- **Axios** - HTTP client for API requests
- **idb (IndexedDB)** - Client-side database for caching
- **Class-variance-authority** - Type-safe CSS class management
- **Tailwind-merge** - Merge TailwindCSS classes

## Features Overview

- Modular UI architecture with reusable components
- Real-time financial data display
- Social media optimized layouts (Instagram square ready)
- Clean and modern responsive design
- Multiple export options (PNG, JPG, Canvas)
- Client-side data caching with IndexedDB
- Automated backend data scraping and scheduling
- Dynamic content rendering
- Responsive & reusable UI components
- Date-based data filtering and selection

## Modules Status

### Frontend Pages (Completed)

[x] **Currency Exchange Rate Module** - Real-time currency conversion rates
[x] **Gold & Silver Rate Module** - Precious metal price tracking  
[x] **FD Interest Rate Module** - Fixed Deposit interest rate information
[x] **News UI Module** - Financial news display from RSS feeds and web scraping
[x] **NEPSE Weekly Summary** - Nepal Stock Exchange data and statistics
[x] **AGM Module** - Annual General Meeting information
[x] **Gainer / Loser Section** - Stock performance indicators

### Backend Services (Completed)

[x] **Metal Scraper Service** - Automated gold/silver price scraping
[x] **Currency Scraper Service** - Currency rate data collection
[x] **FD Rates Scraper Service** - Fixed deposit rate information
[x] **NEPSE Data Scraper Service** - Stock market data aggregation
[x] **News Parser Service** - RSS feed and web-based news collection
[x] **AGM Scraper Service** - Annual general meeting data extraction
[x] **Cron Job Scheduler** - Automated periodic data refresh

### Pending Modules

[ ] Did You Know Section
[ ] Sector Performance Module
[ ] Energy Update Module

### Pending Features

- [x] Export tables as PNG/JPG
- [x] Export full page layouts as social media post
- [x] Download full layout as Instagram-ready post

## Project Structure

```
root/
├── modules/                    # Frontend (Next.js)
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx            # Dashboard home
│   │   ├── agm/                # AGM module page
│   │   ├── currencyExchangeRate/ # Currency rates page
│   │   ├── fdRate/             # FD rates page
│   │   ├── goldRate/           # Gold & silver rates page
│   │   ├── nepseData/          # NEPSE data page
│   │   └── news/               # News page
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── CurrencyCard.tsx
│   │   ├── CurrencySelector.tsx
│   │   ├── DownloadCard.tsx
│   │   ├── MonthSelector.tsx
│   │   ├── Navbar.tsx
│   │   ├── PriceCard.tsx
│   │   └── UnitSelector.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useClock.js
│   │   ├── useCurrency.js
│   │   ├── useGoldHistory.js
│   │   └── useMetalRate.js
│   ├── lib/                    # Utility functions
│   │   ├── currency.ts
│   │   ├── indexeddb.ts        # IndexedDB client-side database
│   │   ├── metal.ts
│   │   └── utils.ts
│   └── public/                 # Static assets
│
└── server/                     # Backend (Node.js + Express)
    ├── controller/             # Business logic controllers
    │   ├── agmScraper.js
    │   ├── FdScraper.js
    │   ├── metalScraper.js
    │   ├── nepseScraper.js
    │   └── newsParser.js
    ├── service/                # High-level services
    │   ├── AgmScraper.js
    │   ├── FdScraper.js
    │   ├── metalScraper.js
    │   ├── nepseScraper.js
    │   └── NewsParse.js
    ├── routes/                 # API endpoints
    │   ├── agmScraper.js
    │   ├── fdRates.js
    │   ├── metalScraper.js
    │   ├── nepseScraper.js
    │   └── news.js
    ├── cron/                   # Scheduled tasks
    │   └── scraper.js          # Periodic data refresh jobs
    ├── model/                  # Database models
    │   └── fdRates.js
    ├── config/                 # Configuration
    │   └── db.js               # MySQL database connection
    └── server.js               # Express server entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (package manager)
- MySQL 8.0+

### Installation

1. **Install dependencies**

```bash
pnpm install
```

2. **Setup Backend**

```bash
cd server
pnpm install
pnpm dev  # Start with nodemon in development
```

3. **Setup Frontend**

```bash
cd modules
pnpm install
pnpm dev  # Start Next.js development server
```

### Configuration

- **Database**: Configure MySQL connection in `server/config/db.js`
- **API Endpoints**: Backend runs on port (configured in server.js)
- **Frontend**: Runs on `http://localhost:3000`

## Data Flow

1. **Automated Data Scraping**: Node-Cron triggers scheduled scraper jobs
2. **Web Scraping**: Puppeteer and Cheerio extract data from websites
3. **Database Storage**: Scraped data stored in MySQL
4. **API Endpoints**: Express API serves data to frontend
5. **Client-Side Caching**: IndexedDB caches data for offline access
6. **Image Export**: HTML-to-Image, HTML2Canvas, and DOM-to-Image convert content to shareable formats
