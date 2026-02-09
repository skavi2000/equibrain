# Equibrain - Next.js Frontend

Investment intelligence platform for CSE and HK markets built with Next.js 15, TypeScript, and Tailwind CSS v4.

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── dashboard/     # Main dashboard page
│   │   ├── watchlist/     # Watchlist with charts
│   │   ├── markets/       # Markets overview
│   │   ├── equimind/      # AI chat interface
│   │   └── discover/      # Discover hub
│   └── login/             # Login page
├── components/
│   ├── layout/            # Layout components (Sidebar, Topbar)
│   ├── shared/            # Shared components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and helpers
├── stores/                # Zustand state stores
└── providers/             # React context providers
```

## Features

### Dashboard
- Portfolio value tracking with charts
- Today's P&L (Profit & Loss)
- Active trading agents overview
- Market pulse with top stocks
- Quick trade widget
- Recent activity feed

### Watchlist
- Multi-stock watchlist management
- Professional candlestick charts (Lightweight Charts)
- Real-time price updates
- Company information tabs
- Stock details panel

### EquiMind AI
- AI-powered investment chat
- Multiple search strategies (Deep Think, EquiMind Search, Web Search)
- Activity feed with reasoning visualization
- Stock ticker linking
- Chat history

### Discover
- **Agents**: Trading agent management and monitoring
- **Screener**: Custom stock screening tool
- **Alerts**: Price and volume alert system
- **Diagnostic Tool**: System health monitoring

### Markets
- Market overview with sectors
- Top gainers and losers
- Volume leaders
- Market statistics

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Lightweight Charts + Recharts
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Routes

| URL | Page | Description |
|-----|------|-------------|
| `/` | Root | Redirects to login |
| `/login` | Login | Authentication page |
| `/dashboard` | Dashboard | Main overview |
| `/watchlist` | Watchlist | Stock charts and tracking |
| `/markets` | Markets | Market overview |
| `/equimind` | EquiMind | AI chat interface |
| `/discover?tab=agents` | Agents | Trading agents |
| `/discover?tab=screener` | Screener | Stock screener |
| `/discover?tab=alerts` | Alerts | Alert management |
| `/discover?tab=diagnostic-tool` | Diagnostics | System health |

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication (Optional)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Theme Customization

Theme colors are defined in [src/app/globals.css](src/app/globals.css):

```css
:root {
  --primary: #2563EB;
  --ai-violet: #7C3AED;
  --gain: #16A34A;
  --loss: #DC2626;
  /* ... */
}
```

## Backend Integration

This frontend is designed to work with a FastAPI backend. Key integration points:

1. **Authentication**: `/api/auth/login`, `/api/auth/logout`
2. **Market Data**: `/api/stocks/prices`, `/api/stocks/chart`
3. **Portfolio**: `/api/portfolio/value`, `/api/portfolio/pnl`
4. **Agents**: `/api/agents/list`, `/api/agents/signals`
5. **Alerts**: `/api/alerts/create`, `/api/alerts/history`
6. **AI Chat**: `/api/equimind/chat`, `/api/equimind/search`

## Development Guidelines

### Adding a New Page

1. Create page in `src/app/(dashboard)/your-page/page.tsx`
2. Add route to sidebar navigation in `src/components/layout/sidebar.tsx`
3. Implement page using existing UI components
4. Test responsiveness and accessibility

### Adding a New Component

1. Place in appropriate folder (`components/ui`, `components/shared`, etc.)
2. Use TypeScript for type safety
3. Follow existing naming conventions
4. Export from component file

### Styling Guidelines

- Use Tailwind utility classes
- Reference design tokens from globals.css
- Maintain consistent spacing (4px base unit)
- Use semantic color names (e.g., `text-gain` not `text-green-600`)

## Performance Optimization

- Use Next.js Image component for images
- Implement lazy loading for heavy components
- Optimize chart rendering
- Use React.memo for expensive components
- Implement proper data fetching strategies

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Charts not rendering
- Check if `lightweight-charts` is properly installed
- Verify chart container has proper dimensions
- Check browser console for errors

### Styles not applying
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind configuration

### Route not found
- Verify file is in correct directory
- Check route group structure
- Restart dev server

## Support

For issues and questions:
- Check [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md) for migration details
- Review Next.js documentation: https://nextjs.org/docs
- Check component documentation: https://ui.shadcn.com

## License

Copyright © 2026 Equibrain. All rights reserved.
