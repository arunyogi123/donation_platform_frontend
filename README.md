rontend Architecture

The frontend is organized into separate layers:

Components

Reusable UI components for campaigns, donations, navigation, branding, and receipts.

Pages

Application-level screens such as campaigns, donations, authentication, profiles, receipts, and informational pages.

Services

The service layer communicates with the backend REST API:

account.ts — authentication, profile, and creator documents
campaigns.ts — campaign operations and campaign documents
donations.ts — one-time and recurring donations
payments.ts — payment URL generation and payment flow
receipts.ts — billing and receipt information

Context

AuthContext.tsx manages authentication state throughout the application.

Lib

Shared application utilities:

API client
Authentication utilities
Media URL handling
Router

The custom router handles client-side navigation and route parameters without relying on an external routing library.

API Integration

The frontend communicates with the backend through REST API endpoints for:

User authentication
User profiles
Campaigns
Campaign documents
Donations
Recurring donations
Payments
Receipts and billing

The service layer also contains development fallback/mock data for selected campaign, donation, and billing functionality.

Running Locally
Prerequisites
Node.js
npm
Install dependencies
npm install
Environment variables

Create a local environment file based on .env.example and configure the required API/environment values.

Do not commit .env files containing private credentials or API keys.

Start development server
npm run dev

The Vite development server runs on port 3000.

Build for production
npm run build
Type check
npm run lint
Project Status

The frontend currently contains the core user-facing functionality for the GiveHope donation platform, including campaign discovery, authentication, donations, recurring donations, payment flow, receipts, user profiles, and campaign creation.

The frontend is designed to work with the corresponding backend REST API.