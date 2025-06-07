# SMSolana - SMS-Based Web3 Onboarding

> Bringing Web3 to the masses through SMS/WhatsApp - No apps, no complexity, just text and earn!

## What is SMSolana?

SMSolana is an SMS/WhatsApp bot that onboards non-crypto users to Web3 through text messages. Users can create Solana wallets, earn SOL rewards, mint NFTs, and learn about Web3 - all through familiar messaging apps.

**Perfect for emerging markets and non-tech users** 🌍

## Key Features

- **Text-to-Earn**: Complete quizzes and earn SOL rewards
- **Wallet Creation**: Generate Solana wallets via SMS
- **Interactive Learning**: Web3 education with instant rewards
- **NFT Minting**: Achievement badges and collectibles
- **Universal Access**: Works on any phone with SMS/WhatsApp

## Quick Start

### Prerequisites
- Node.js 16+
- Twilio account
- Solana CLI tools

### Setup (3 terminals needed)

```bash
# 1. Clone and install
git clone https://github.com/yourusername/SMSolana.git
cd SMSolana && npm install

# 2. Terminal 1: Start Solana validator
solana-test-validator

# 3. Terminal 2: Start bot server
npm start

# 4. Terminal 3: Create ngrok tunnel
ngrok http 3000
```

### Configure Twilio
- SMS webhook: `https://your-ngrok-url.ngrok.io/sms`
- WhatsApp webhook: `https://your-ngrok-url.ngrok.io/whatsapp`

## How It Works

**Sample conversation:**
```
User: CREATE WALLET
Bot: ✅ Wallet created! Balance: 0.1 SOL 🎁 +0.05 SOL bonus

User: WHAT IS DEFI?
Bot: 💡 DeFi allows financial services without banks... 🎁 +0.01 SOL earned!

User: GET MY NFT
Bot: 🎉 Achievement NFT minted!
```

## Available Commands

| Command | Description | Reward |
|---------|-------------|---------|
| `CREATE WALLET` | Generate Solana wallet | 0.05 SOL |
| `WHAT IS SOL?` | Learn about Solana | 0.01 SOL |
| `WHAT IS DEFI?` | DeFi education | 0.01 SOL |
| `GET MY NFT` | Mint achievement NFT | 0.03 SOL |
| `BALANCE` | Check SOL balance | - |
| `REFER <phone>` | Invite friends | 0.1 SOL |

## Environment Setup

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SOLANA_RPC_URL=http://127.0.0.1:8899
PORT=3000
```

## Architecture

```
SMS/WhatsApp → Twilio → Express.js Bot → Solana Blockchain
                           ↓
                    User Data + Metaplex NFTs
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for global Web3 adoption by (Prapti)[https://github.com/praptisharma28]** 🌍📱⛓️
