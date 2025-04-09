# Data Analysis Dashboard

A modern, interactive dashboard for visualizing company performance metrics and sector comparisons built with Next.js and Recharts.

![Dashboard Preview](https://via.placeholder.com/800x450?text=Data+Analysis+Dashboard)

## Features

- 📊 Multiple visualization types (bar charts, line charts, radar charts, scatter plots)
- 🔄 Interactive filters for metrics and companies
- 📱 Fully responsive design for all device sizes
- 🎨 Clean, modern UI with shadcn/ui components
- 📈 Performance zone analysis for contextual insights
- 🔍 Detailed metric cards with comparison data

## Installation

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/peridotnepal/internship-fullstack-april.git
cd client
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Install required libraries:

\`\`\`bash
# Main visualization library
npm install recharts

# UI Components (if not already installed)
npm install @radix-ui/react-tabs
npm install @radix-ui/react-select
npm install @radix-ui/react-slot
npm install lucide-react

# For shadcn/ui components
npx shadcn@latest init
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add badge

# Utility libraries
npm install clsx tailwind-merge
\`\`\`

4. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Usage

The dashboard provides several ways to analyze company performance data:

1. **Metric Selection**: Use the dropdown to select which metric to analyze (Energy Sales, Net Profit, Return on Equity)
2. **Company Filter**: Filter to view all companies or focus on a specific company
3. **Visualization Tabs**:
   - **Comparison**: Bar chart comparing companies for the selected metric
   - **Trends**: Line chart showing historical performance over time
   - **Radar**: Radar chart comparing multiple metrics across companies
   - **Performance Zones**: Scatter plot showing relative performance vs previous period and sector average

## Component Overview

### Dashboard Components

- **MetricCard**: Displays key metrics with comparison indicators
- **ComparisonChart**: Bar chart for direct company comparisons
- **TrendChart**: Line chart for historical trend analysis
- **RadarChart**: Radar/spider chart for multi-metric comparison
- **PerformanceZones**: Quadrant analysis chart for contextual performance

### Data Structure

The dashboard uses a structured data format for company metrics:

\`\`\`javascript
{
  companies: [
    {
      name: "Company Name",
      metrics: [
        {
          name: "Metric Name",
          unit: "%",
          data: [
            { quarter: "Q1", year: 2023, value: 3.77 },
            // More data points...
          ]
        }
        // More metrics...
      ]
    }
    // More companies...
  ],
  sectorAverage: [
    // Similar structure to companies metrics
  ]
}
\`\`\`

## Customization

### Adding New Metrics

To add new metrics, update the `data` object in `dashboard.tsx` with your new metrics and ensure they follow the same structure.

### Changing Colors

The dashboard uses a consistent color scheme:
- Company A: Blue (`rgba(59, 130, 246, 1)`)
- Company B: Green (`rgba(16, 185, 129, 1)`)
- Sector Average: Gray (`rgba(156, 163, 175, 1)`)

To change these colors, update the color values in the chart components and the `getCompanyColor` function in `utils.ts`.

### Adding More Companies

To add more companies, extend the `data` object in `dashboard.tsx` and update the `companyOptions` array. You'll also need to add a new color for the company in the `getCompanyColor` function.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Recharts](https://recharts.org/) - Composable charting library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Lucide React](https://lucide.dev/) - Icon library

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Data visualization best practices inspired by Edward Tufte
- UI design influenced by Refactoring UI principles