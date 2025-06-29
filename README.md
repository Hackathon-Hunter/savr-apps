# SAVR - AI-Powered Savings Platform on ICP

**Smart savings plans with AI analysis and ICP staking rewards**

SAVR is a decentralized savings application built on the Internet Computer Protocol (ICP) that combines AI-powered financial insights with secure blockchain technology to help users achieve their savings goals while earning staking rewards.

## 🌟 Features

### Core Savings Functionality
- **Create Savings Goals**: Set personalized savings targets with custom deadlines and amounts
- **AI-Powered Insights**: Get intelligent recommendations and analysis for your savings journey
- **Progress Tracking**: Monitor your savings progress with detailed analytics and milestones
- **Flexible Contributions**: Top up your savings at any time with automatic tracking

### ICP Staking Integration
- **Automated ICP Staking**: Stake your savings to earn additional rewards through ICP network participation
- **Neuron Management**: Create and manage ICP neurons with customizable dissolve delays
- **Rewards Tracking**: Monitor staking rewards and annual percentage yield (APY)
- **Flexible Unstaking**: Unstake funds when needed with transparent fee structures

### AI Features
- **Personalized Suggestions**: AI-generated savings goals based on your income and financial situation
- **Smart Analysis**: Intelligent insights into your saving patterns and recommendations for improvement
- **Chat Interface**: Interactive AI assistant to help with financial planning and questions

### Security & Authentication
- **Internet Identity**: Passwordless, biometric authentication for maximum security
- **Decentralized**: Your data stays private and secure on the Internet Computer
- **ICRC-1 Compliance**: Standardized token handling following ICP best practices

## 🏗️ Project Structure

```
savr-apps/
├── src/                          # Backend Motoko canisters
│   ├── SavingManager.mo          # Main savings functionality
│   ├── Types.mo                  # Type definitions
│   └── Utils.mo                  # Utility functions
├── app/                          # Next.js frontend application
│   ├── page.tsx                  # Landing page
│   ├── dashboard/                # Dashboard pages
│   ├── details/                  # Savings details pages
│   ├── api/                      # API routes
│   └── components/               # React components
├── service/                      # Service layer
│   ├── icService.ts              # ICP interaction services
│   ├── backend.did.ts            # Backend interface definitions
│   └── auth.ts                   # Authentication utilities
├── contexts/                     # React contexts
│   ├── ICPPriceContext.tsx       # ICP price management
│   └── SavingsAnalysisContext.tsx # Savings analysis
├── lib/                          # Utility libraries
│   └── openai.ts                 # AI integration
└── dfx.json                      # DFX configuration
```

## 🚀 Getting Started

### Prerequisites

- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/build/install-dfx) (version 0.14.1 or higher)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [MOPS Package Manager](https://mops.one/) for Motoko dependencies

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd savr-apps
   ```

2. **Install dependencies**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Install Motoko dependencies
   mops install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Add your OpenAI API key for AI features
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Local Development

1. **Start the Internet Computer replica**
   ```bash
   dfx start --clean --background
   ```

2. **Deploy the backend canisters**
   ```bash
   dfx deploy
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend canister: `http://localhost:4943?canisterId={backend_canister_id}`

## 🔧 Configuration

### DFX Configuration

The project uses a standard DFX configuration with:
- **Backend canister**: Motoko-based savings manager
- **Frontend canister**: Next.js application assets
- **Local replica**: For development and testing

### Environment Variables

```bash
# Required for AI features
OPENAI_API_KEY=your_openai_api_key

# Optional: Custom ICP ledger canister (defaults to mainnet)
ICP_LEDGER_CANISTER_ID=ryjl3-tyaaa-aaaaa-aaaba-cai
```

## 📱 Usage Examples

### Creating a New Savings Goal

```bash
# Via DFX CLI
dfx canister call backend startSaving '(record {
  savingName = "Dream Vacation";
  amount = 100_000_000;  // 1 ICP in e8s
  totalSaving = 1_000_000_000;  // 10 ICP target
  deadline = 1714696949000000000;  // Timestamp in nanoseconds
  principalId = "YOUR_PRINCIPAL_ID";
  isStaking = opt true;
  priorityLevel = opt 1;
  savingsRate = opt 10_000_000  // 0.1 ICP per month
})'
```

### Frontend Integration

```typescript
// Create a new savings goal
const newSaving = await createSaving(actor, {
  savingName: "Emergency Fund",
  amount: "1.0",  // ICP amount
  totalSaving: "10.0",
  deadline: "2024-12-31",
  isStaking: true
});

// Get user's savings
const savings = await getUserSavings(actor, principal);

// Stake ICP for additional rewards
const stakeResult = await stakeICP(actor, {
  savingId: 1,
  amount: "5.0",
  dissolveDelay: 2592000n,  // 30 days
  principalId: principal.toString()
});
```

## 🔗 API Reference

### Core Savings Methods

- `startSaving(request: StartSavingRequest): SavingResponse` - Create a new savings goal
- `topUpSaving(request: TopUpRequest): TransactionResponse` - Add funds to existing savings
- `getUserSavings(userId: Text): [Saving]` - Retrieve user's savings goals
- `withdrawSaving(savingId: SavingId): TransactionResponse` - Withdraw from savings

### Staking Methods

- `stakeICP(request: StakeICPRequest): StakeResponse` - Stake ICP for rewards
- `unstakeICP(request: UnstakeRequest): UnstakeResponse` - Unstake ICP
- `getStakingInfo(savingId: SavingId): ?StakingInfo` - Get staking details
- `claimStakingRewards(savingId: SavingId, principalId: Text): TransactionResponse` - Claim rewards

### AI Integration

- `chat(messages: ChatMessage[]): Text` - AI-powered chat assistance
- `prompt(input: Text): Text` - AI analysis and suggestions

## 🏛️ Architecture

### Backend (Motoko)
- **SavingManager**: Core business logic for savings and staking
- **ICRC-1 Integration**: Standard ICP token handling
- **Neuron Management**: ICP staking through Network Nervous System (NNS)
- **AI Integration**: OpenAI API integration for intelligent insights

### Frontend (Next.js + React)
- **Modern UI/UX**: Tailwind CSS with glassmorphism design
- **Real-time Updates**: Live ICP price feeds and staking rewards
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Context Management**: React contexts for state management

### Security Features
- **Internet Identity**: Decentralized authentication
- **Principal-based Access**: Secure user identification
- **Transparent Fees**: Clear fee structure for all operations
- **Audit Trail**: Complete transaction history

## 🎯 Roadmap

- [ ] **Multi-asset Support**: Support for additional cryptocurrencies
- [ ] **Advanced AI Features**: More sophisticated financial planning tools
- [ ] **Social Features**: Savings groups and challenges
- [ ] **Mobile App**: Native mobile applications
- [ ] **DeFi Integration**: Integration with other DeFi protocols on ICP

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Internet Computer**: [internetcomputer.org](https://internetcomputer.org)
- **DFX Documentation**: [internetcomputer.org/docs](https://internetcomputer.org/docs)
- **ICRC-1 Standard**: [github.com/dfinity/ICRC-1](https://github.com/dfinity/ICRC-1)
- **Next.js**: [nextjs.org](https://nextjs.org)

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Join our community discussions
- Check the documentation

---

**Built with ❤️ on the Internet Computer**