# SAVR - AI-Powered Savings on ICP

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that has been optimized for **Static Site Generation (SSG)** to be compatible with Internet Computer Protocol (ICP) deployment.

## 🚀 Features

- **AI-Powered Savings Analysis** - Smart algorithms analyze spending patterns and create personalized savings strategies
- **ICP Staking Rewards** - Earn additional rewards while saving for your goals
- **Internet Identity Authentication** - Secure, passwordless authentication with blockchain technology
- **Static Site Generation** - Optimized for ICP deployment with full client-side functionality
- **Local Storage Persistence** - Savings analysis data persists across browser sessions

## 🏗️ Architecture

This application has been converted from Server-Side Rendering (SSR) to Static Site Generation (SSG) to ensure compatibility with ICP deployment. Key changes include:

- All pages use `"use client"` directive for client-side rendering
- Context providers wrapped in `ClientOnly` components
- API calls only execute on the client side
- Static export configuration in `next.config.ts`
- No server-side functions or server actions
- **Local Storage Integration** - Savings analysis data stored in browser localStorage for persistence

## Getting Started

### 1. Set up your API Keys

Create a `.env.local` file in the root directory and add your API keys:

```bash
# OpenAI API Configuration (Primary)
OPENAI_API_KEY=your-openai-api-key-here

# OpenRouter API Configuration (Alternative/Backup)
OPENROUTER_API_KEY=your-openrouter-api-key-here

# ICP Configuration
NEXT_PUBLIC_IC_HOST=https://ic0.app
NEXT_PUBLIC_BACKEND_CANISTER_ID=your_backend_canister_id_here
```

**API Key Options:**
- **OpenAI API Key**: Get from [OpenAI's platform](https://platform.openai.com/api-keys)
- **OpenRouter API Key**: Get from [OpenRouter](https://openrouter.ai/keys) (alternative to OpenAI)

**Note**: The application will use `OPENROUTER_API_KEY` if available, otherwise fall back to `OPENAI_API_KEY`.

### 2. Install dependencies and run the development server

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment to ICP

### Prerequisites

1. Install DFX (DFINITY Canister SDK):
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. Authenticate with ICP:
   ```bash
   dfx identity new my-identity
   dfx identity use my-identity
   dfx identity get-principal
   ```

### Deploy to ICP

#### Option 1: Using the deployment script (Recommended)
```bash
npm run deploy
```

#### Option 2: Manual deployment
```bash
# Build the application
npm run build

# Deploy to ICP
dfx deploy --network ic
```

### Environment Variables for Production

Create a `.env.local` file with your production settings:

```bash
# API Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENROUTER_API_KEY=your-openrouter-api-key-here

# ICP Configuration
NEXT_PUBLIC_IC_HOST=https://ic0.app
NEXT_PUBLIC_BACKEND_CANISTER_ID=your_backend_canister_id_here
```

## 🔧 Build Configuration

The application is configured for static export with the following settings in `next.config.ts`:

- `output: 'export'` - Enables static site generation
- `trailingSlash: true` - Required for ICP compatibility
- `images: { unoptimized: true }` - Disables Next.js image optimization
- Webpack fallbacks for client-side only modules

## 📁 Project Structure

```
vault/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ClientOnly.tsx     # Client-side only wrapper
│   └── ui/                # UI components
├── contexts/              # React contexts (ICP Price only)
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   └── useSavingsAnalysis.ts # LocalStorage-based savings data
├── lib/                   # Utility functions
│   ├── getAnalyze.ts      # AI analysis with env vars
│   └── getSuggestions.ts  # AI suggestions with env vars
├── service/               # ICP service integration
├── scripts/               # Deployment scripts
├── next.config.ts         # Next.js configuration
├── dfx.json              # DFX configuration
├── env.example           # Environment variables template
└── package.json          # Dependencies and scripts
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to ICP
- `npm run deploy:local` - Deploy to local network
- `npm run deploy:ic` - Deploy to ICP network

### Key Files for SSG Compatibility

- `components/ClientOnly.tsx` - Ensures components only render on client
- `lib/utils.ts` - Client-side utilities
- `contexts/ICPPriceContext.tsx` - Client-side only context
- `hooks/useAuth.ts` - Client-side authentication
- `hooks/useSavingsAnalysis.ts` - LocalStorage-based data persistence

## 💾 Data Persistence

The application uses localStorage for persisting savings analysis data:

- **Storage Key**: `savr_savings_analysis`
- **Data Structure**: Includes analysis results, user input, and ICP/USD rate
- **Benefits**: 
  - Data persists across browser sessions
  - No server-side state management required
  - Perfect for SSG deployment
  - Reduces context provider complexity

## 🔐 API Security

- API keys are stored in environment variables (not in code)
- Support for both OpenAI and OpenRouter APIs
- Fallback mechanism for API key selection
- No API keys are exposed in client-side code
- Environment variables are loaded at build time

## 🔒 Security

- All authentication is handled client-side using Internet Identity
- No sensitive data is stored on the server
- API calls are made directly from the client to ICP canisters
- LocalStorage data is client-side only and not transmitted to servers
- API keys are secured in environment variables

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [DFX Documentation](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)

## 🤝 Contributing

This project is optimized for ICP deployment. When contributing:

1. Ensure all new components use `"use client"` directive
2. Wrap any client-side only functionality in `ClientOnly` components
3. Avoid server-side functions or server actions
4. Use localStorage for data persistence when appropriate
5. Never hardcode API keys - always use environment variables
6. Test the build with `npm run build` before deploying

## 📄 License

This project is licensed under the MIT License.
