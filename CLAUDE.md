# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application for a developer events platform called "DevEvent". The project features modern UI components with interactive WebGL effects and is built with React 19, TypeScript, and Tailwind CSS 4. It showcases advanced frontend techniques including custom WebGL shaders and responsive design patterns.

## Technology Stack

### Core Framework & Runtime
- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5
- **Package Manager**: npm (with pnpm lockfile present)

### UI & Styling
- **Styling**: Tailwind CSS 4 with custom configuration
- **CSS Utilities**: tw-animate-css for custom animations
- **Icons**: Lucide React icon library
- **Fonts**:
  - Schibsted Grotesk (Google Fonts) - main display font
  - Martian Mono (Google Fonts) - monospace font

### Advanced Graphics & Effects
- **WebGL**: OGL (Open Graphics Library) for custom light ray effects
- **Shaders**: Custom fragment shaders for ray rendering
- **Animation**: RequestAnimationFrame loop for real-time rendering

### Analytics & Database
- **Analytics**: PostHog for user behavior tracking
- **Database**: MongoDB (configured via Mongoose)
- **Analytics Integration**: Client-side PostHog instrumentation

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## PostHog Analytics Integration

### Configuration
- **Client-side**: `instrumentation-client.ts` - PostHog JS initialization with debug mode in development
- **Server-side**: URL rewrites in `next.config.ts` for PostHog API endpoints
- **Features**: Exception tracking, debug mode, custom API endpoints (`/ingest`)

### Key Features
- **Exception tracking** enabled for error monitoring
- **Debug mode** active in development environment
- **Custom API endpoints** for data ingestion and static assets
- **Trailing slash support** for PostHog API requests

## Database Integration

### MongoDB Setup
- **Connection String**: Configured via `MONGODB_URI` environment variable
- **ODM**: Mongoose for data modeling and schema management
- **Deployment**: MongoDB Atlas cluster-based deployment
- **Connection Management**: Connection pooling with support for multiple databases
- **Location**: `lib/mongodb.ts` - Database connection and model management

## Key Components Architecture

### LightRays Component (`components/LightRays.tsx`)
- **Advanced WebGL implementation** using OGL library
- **Interactive effects** with mouse-following capabilities
- **Performance optimized** with proper cleanup and intersection observer
- **Configurable parameters** for colors, speed, spread, and visual effects
- **Real-time rendering** with requestAnimationFrame loop
- **Responsive design** with proper DPI handling

### Core Application Structure
- **App Router**: Modern Next.js app directory structure
- **Root Layout** (`app/layout.tsx`): Global fonts, metadata, and WebGL background
- **Main Page** (`app/page.tsx`): Event showcase with featured events listing
- **Global CSS** (`app/globals.css`): Custom Tailwind config, utilities, and component styles

### Component Organization
- **Event Management**: EventCard and event data structures in `lib/constants.ts`
- **Navigation**: Fixed navbar with glass-morphism effect in `Navbar.tsx`
- **UI Elements**: Custom buttons and layout utilities in `lib/utils.ts`
- **Visual Effects**: Interactive WebGL backgrounds and styling
- **Analytics Integration**: PostHog tracking setup in `instrumentation-client.ts`

## Configuration Details

### Tailwind CSS 4 Setup
- **Custom theme configuration** with color variables for dark theme
- **Utility functions** for common patterns (flex-center, text-gradient, glass)
- **Component-specific styles** using @layer components
- **Custom variants** for dark mode support

### Next.js Configuration
- **TypeScript support** with proper typing
- **Flexible configuration** in `next.config.ts`
- **Image optimization** via Next.js Image component

## Styling System

### Design Tokens
- **Color palette**: Dark theme with vibrant accent colors
- **Typography**: Mix of display fonts (Schibsted Grotesk) and code fonts (Martian Mono)
- **Spacing**: Consistent padding and margins using Tailwind spacing scale
- **Effects**: Glass morphism, shadows, and gradients

### Component Styling
- **Utility classes** for reusable patterns
- **Responsive design** with mobile-first approach
- **Custom animations** and interactive states
- **Accessibility considerations** with proper contrast ratios

## WebGL Implementation

### Light Rays System
- **Custom fragment shaders** for ray rendering
- **Mouse interaction** with smoothing and influence controls
- **Performance optimization** with proper cleanup and error handling
- **Multiple ray patterns** with configurable parameters
- **Intersection observer** for performance optimization

### Technical Considerations
- **Canvas lifecycle management** with proper cleanup
- **Memory management** with WebGL context loss handling
- **Responsive rendering** with DPI-aware sizing
- **Error boundaries** for graceful WebGL degradation

## Development Patterns

### Component Architecture
- **Client components** marked with `"use client"` directive
- **Server components** for static content and layouts
- **Prop interfaces** defined for TypeScript safety
- **Custom hooks** for complex state management

### File Organization
- **Components** in separate files with clear naming conventions
- **Assets** in public directory with proper pathing
- **Styles** organized in globals.css with Tailwind classes
- **Type definitions** inline or in component files

## Environment Variables

The application requires several environment variables for proper operation:

### Database Configuration
- `MONGODB_URI`: MongoDB connection string for database access

### Analytics Configuration
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog project API key (publicly accessible)
- Optional: `NODE_ENV`: Set to "development" for debug features

### Database Connection Management
- **Connection String Format**: `mongodb://[username:password@]host[:port]/database`
- **Atlas Deployment**: Use MongoDB Atlas connection string with cluster configuration
- **Environment-based Configuration**: Different connection strings for development and production

## Performance Considerations

### Client-Side Performance
- **Intersection observer** for lazy loading WebGL effects
- **WebGL cleanup** on component unmount with proper lifecycle management
- **Optimized images** with Next.js Image component
- **Efficient re-renders** with proper React patterns and memoization

### Analytics Performance
- **PostHog batching** for event aggregation
- **Debug mode** only in development to avoid performance impact in production
- **Client-side instrumentation** with minimal overhead

### Database Performance
- **Connection pooling** with multiple database support
- **Connection caching** to avoid repeated connection establishment
- **Lazy loading** of database connections when needed
- **Proper cleanup** of database connections on application shutdown