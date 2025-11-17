# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application for a developer events platform called "DevEvent". The project features modern UI components with interactive WebGL effects and is built with React 19, TypeScript, and Tailwind CSS 4. It showcases advanced frontend techniques including custom WebGL shaders and responsive design patterns.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom CSS utilities
- **WebGL**: OGL (Open Graphics Library) for custom light ray effects
- **Icons**: Lucide React
- **Fonts**: Schibsted Grotesk & Martian Mono from Google Fonts
- **Utilities**: Class Variance Authority, Tailwind Merge, tw-animate-css

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
- **Event Management**: EventCard and event data structures
- **Navigation**: Fixed navbar with glass-morphism effect
- **UI Elements**: Custom buttons and layout utilities
- **Visual Effects**: Interactive WebGL backgrounds and styling

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

## Performance Considerations

- **Intersection observer** for lazy loading WebGL effects
- **WebGL cleanup** on component unmount
- **Proper TypeScript typing** for better performance
- **Optimized images** with Next.js Image component
- **Efficient re-renders** with proper React patterns