# LingvAI

LingvAI - AI-powered language learning and IELTS preparation platform

A Vue 3 + TypeScript + Vite web application optimized for mobile webview usage in superapps.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation frontend tooling
- **Vant** - Mobile UI component library
- **Pinia** - State management
- **Vue Router** - Official router for Vue.js
- **Axios** - HTTP client
- **VueUse** - Collection of Vue composition utilities

## Project Structure

```
lingvai/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   ├── composables/     # Vue composables
│   ├── layout/         # Layout components
│   ├── views/          # Page components
│   ├── router/         # Vue Router config
│   ├── stores/         # Pinia stores
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── styles/         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Features

- Mobile-first design optimized for webview
- TypeScript for type safety
- Component auto-import (Vant)
- Path aliases (@/ for src/)
- ESLint + Prettier for code quality
- Safe area support for mobile devices

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=/api
VITE_APP_ENV=development
```

## License

MIT
