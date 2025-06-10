# SMSolana - SMS-Based Web3 Onboarding
<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/6f500b5c-b8bf-46d0-972a-7388841375ce"
    width="300"
    style="border: 5px solid #00ffe1; border-radius: 12px; box-shadow: 0 0 15px #00ffe1;" 
    alt="Screenshot 2025-06-08 at 2 49 26 AM"
  />
</p>

> Bringing Web3 to the masses through SMS/WhatsApp - No apps, no complexity, just text and earn!

## What is SMSolana?
SMSolana is an SMS/WhatsApp bot that onboards non-crypto users to Web3 through text messages. Users can create Solana wallets, earn SOL rewards, mint NFTs, and learn about Web3 - all through familiar messaging apps.

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/bef6a046-dc92-41b2-98df-3ebf7ebbd52b"
    width="700"
    style="border: 5px solid #00ffe1; border-radius: 12px; box-shadow: 0 0 15px #00ffe1;" 
    alt="Screenshot 2025-06-08 at 2 49 26 AM"
  />
</p>

**Perfect for emerging markets and non-tech users** 🌍

## Key Features
- **Text-to-Earn**: Complete quizzes and earn SOL rewards
- **Wallet Creation**: Generate Solana wallets via SMS
- **Interactive Learning**: Web3 education with instant rewards
- **NFT Minting**: Achievement badges and collectibles
- **Universal Access**: Works on any phone with SMS/WhatsApp

## Quick Start

### Option 1: Docker (Recommended) 🐳
```bash
# 1. Clone repository
git clone https://github.com/praptisharma28/SMSolana.git
cd SMSolana

# 2. Set up environment
cp .env.docker .env
# Edit .env with your Twilio credentials

# 3. Start everything with Docker
docker-compose up -d

# 4. Create ngrok tunnel (new terminal)
ngrok http 3000
```

### Option 2: Manual Setup
**Prerequisites:** Node.js 16+, Twilio account, Solana CLI

```bash
# 1. Clone and install
git clone https://github.com/praptisharma28/SMSolana.git
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
# .env file
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890
SOLANA_RPC_URL=http://127.0.0.1:8899  # or http://solana-validator:8899 for Docker
PORT=3000
```

## Architecture
```
SMS/WhatsApp → Twilio → Express.js Bot → Solana Blockchain
                           ↓
                    User Data + Metaplex NFTs
```

## License
MIT License - see [LICENSE](LICENSE) file for details.

---
**Made with ❤️ for global Web3 adoption by [Prapti](https://github.com/praptisharma28)** 🌍📱⛓️
