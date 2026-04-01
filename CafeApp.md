# K2: Kitchen Display (KDS) --- Full Build Prompt

## Priority Reference Order

1.  PWA Plan
2.  Theming Plan
3.  User Journeys

------------------------------------------------------------------------

## Objective

Build a production-ready, multi-tenant Café QR Ordering Progressive Web
App (PWA) using Next.js 14 with real-time order flow, admin dashboard,
kitchen display system (KDS), and customer-facing ordering experience.

------------------------------------------------------------------------

## Core Architecture (from PWA Plan)

-   Framework: Next.js 14 (App Router)
-   Backend: Node.js (API routes)
-   Database: MongoDB
-   Realtime: WebSockets / Socket.io
-   Auth: JWT (cookie-based)
-   Storage: Cloudinary (images)
-   Deployment: Vercel (frontend) + Node backend
-   PWA: Service Worker, offline support, installable app

------------------------------------------------------------------------

## User Roles

### 1. Customer

-   Scan QR → menu → cart → checkout → order tracking

### 2. Kitchen Staff (KDS)

-   Real-time order dashboard
-   Status updates (Preparing → Ready → Served)

### 3. Admin

-   Menu management
-   Table & QR setup
-   Analytics
-   Theme customization

------------------------------------------------------------------------

## Theming System (CRITICAL)

Implement a **multi-tenant theming engine**:

-   Use design tokens:
    -   colors (primary, secondary, bg, text)
    -   typography
    -   border radius
-   Store theme JSON per café
-   Inject CSS variables dynamically
-   No redeploy required on theme change
-   Theme applies instantly (\<1ms target)

------------------------------------------------------------------------

## Core Modules

### 1. Authentication

-   Phone login + OTP verification
-   JWT cookie session

### 2. Customer Flow

-   QR Scan → Table detection
-   Menu browsing (categories + items)
-   Cart system
-   Checkout (table-based ordering)
-   Live order tracking

### 3. Admin Panel

-   Menu CRUD
-   Category management
-   Item availability toggle
-   Table + QR generator
-   Analytics dashboard
-   Theme editor UI

### 4. Kitchen Display System (KDS)

-   Real-time incoming orders
-   Order cards with:
    -   items
    -   table number
    -   timestamps
-   Status transitions:
    -   Pending → Preparing → Ready → Served

------------------------------------------------------------------------

## Screens to Implement (STRICT)

Use provided Stitch wireframes EXACTLY:

-   Kitchen Display (KDS)
-   Menu Management
-   Order History
-   Table & QR Setup
-   User Profile
-   Cart Page
-   Checkout
-   Order Tracking
-   Login + OTP
-   Welcome & Scan
-   Menu Page
-   Café Settings
-   Analytics

------------------------------------------------------------------------

## Database Schema (High-Level)

Users - id - phone - role

Cafes - id - name - theme - logo

Tables - id - cafeId - tableNumber - qrCode

Menu - id - cafeId - categories\[\] - items\[\]

Orders - id - tableId - items\[\] - status - timestamps

------------------------------------------------------------------------

## API Structure

-   POST /auth/login
-   POST /auth/verify-otp
-   GET /menu
-   POST /order
-   PATCH /order/status
-   GET /orders
-   POST /menu/item
-   PATCH /menu/item
-   DELETE /menu/item

------------------------------------------------------------------------

## Realtime System

-   WebSocket channels:
    -   kitchen
    -   customer
    -   admin

Events: - order_created - order_updated - item_availability_changed

------------------------------------------------------------------------

## PWA Requirements

-   Installable
-   Offline fallback
-   Cached menu
-   Background sync (optional)

------------------------------------------------------------------------

## UI/UX Requirements

-   Mobile-first (primary)
-   Tablet support (KDS)
-   Clean minimal UI
-   Fast transitions
-   Skeleton loaders

------------------------------------------------------------------------

## Performance Targets

-   First load \< 2s
-   Theme switch \< 1ms
-   Real-time latency \< 200ms

------------------------------------------------------------------------

## Development Phases

### Phase 1

-   Auth
-   Basic menu
-   Order creation

### Phase 2

-   Admin panel
-   Menu management
-   Tables & QR

### Phase 3

-   KDS real-time
-   Order tracking

### Phase 4

-   Theming system
-   Analytics
-   Optimization

------------------------------------------------------------------------

## Final Instruction

Build this as a scalable SaaS product: - Multi-tenant ready - Clean
architecture - Modular components - Production-grade code

DO NOT: - Hardcode styles - Ignore realtime - Skip theming system

DO: - Follow wireframes exactly - Maintain consistency across all
screens
