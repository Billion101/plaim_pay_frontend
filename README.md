# Palm Payment Frontend

A React TypeScript frontend application for the Palm Payment System with biometric palm verification.

## Features

### Client Section (`/client`)

- **Login & Register**: User authentication with optional palm biometric registration
- **Bank-like UI**: Blue and gold themed dashboard similar to banking applications
- **Home Dashboard**: View balance, recent transactions, and quick actions
- **Profile Management**: View user details and verify palm biometric
- **Top-up Wallet**: Add money using standard or palm authentication
- **Transaction History**: View top-up and purchase history with filtering

### Store Section (`/store`)

- **E-commerce UI**: Orange and white themed online clothing store
- **Product Catalog**: 7 clothing products starting at ₭100,000 each
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout**: Complete purchases using palm scan or standard authentication

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## API Integration

The application integrates with the Palm Payment API at `https://api.ceit-iot-lab.site/api` with the following features:

- User authentication (login/register)
- Palm biometric verification
- Wallet top-up with immediate balance update
- Order creation with balance deduction
- Transaction history (top-ups and purchases)
- Profile management

## Installation

1. **Install dependencies using Bun**:

   ```bash
   bun install
   ```

2. **Start development server**:

   ```bash
   bun run dev
   ```

3. **Build for production**:
   ```bash
   bun run build
   ```

## Project Structure

```
src/
├── components/          # Reusable components
│   └── PalmScanner.tsx  # Palm biometric scanner component
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state management
│   └── StoreContext.tsx # Shopping cart state management
├── data/               # Mock data
│   └── products.ts     # Product catalog
├── pages/              # Page components
│   ├── client/         # Client section pages
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   ├── Topup.tsx
│   │   └── History.tsx
│   └── store/          # Store section pages
│       ├── Store.tsx
│       └── Checkout.tsx
├── services/           # API services
│   └── api.ts         # API client and endpoints
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app component
├── main.tsx          # App entry point
└── index.css         # Global styles
```

## Key Features

### Palm Biometric Authentication

- Camera-based palm scanning simulation
- Secure authentication for payments and top-ups
- Base64 encoded palm codes for API integration

### Responsive Design

- Mobile-first responsive design
- Touch-friendly interface
- Optimized for various screen sizes

### Real-time Balance Updates

- Immediate balance updates after transactions
- Live transaction history
- Balance verification before purchases

### Shopping Experience

- Product catalog with categories
- Shopping cart with quantity management
- Secure checkout with palm authentication

## Usage

### Client Flow

1. **Register/Login**: Create account or sign in at `/client`
2. **Palm Registration**: Optionally register palm biometric during signup
3. **Dashboard**: View balance and recent transactions at `/client/home`
4. **Top-up**: Add money to wallet at `/client/topup`
5. **History**: View transaction history at `/client/history`

### Store Flow

1. **Browse Products**: View clothing catalog at `/store`
2. **Add to Cart**: Select products and quantities
3. **Checkout**: Complete purchase at `/store/checkout`
4. **Palm Payment**: Use palm scan for secure payment authentication

## Environment Variables

The application uses the following API endpoint:

- **API Base URL**: `https://api.ceit-iot-lab.site/api`

## Development

### Running with Bun

```bash
# Install Bun if not already installed
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

### API Integration

The app integrates with all API endpoints including:

- Authentication (`/auth/login`, `/auth/register`)
- User management (`/users/profile`, `/users/verify-palm`, `/users/topup`)
- Orders (`/orders`)
- Transactions (`/transactions/topup-history`, `/transactions/order-history`)

## Browser Support

- Modern browsers with ES2020 support
- Camera access required for palm scanning
- Local storage for authentication tokens

## Security Features

- JWT token-based authentication
- Secure palm biometric codes
- Balance verification before transactions
- Protected routes requiring authentication
# plaim_pay_frontend
