const userManager = require("./userManager");

const EDUCATIONAL_CONTENT = {
  "WHAT IS SOL?": {
    title: "🌟 What is SOL?",
    content: `SOL is the native cryptocurrency of the Solana blockchain!

💡 Key Facts:
• Fast transactions (65,000+ per second)
• Ultra-low fees (fraction of a penny)
• Used for transaction fees and staking
• Powers DeFi, NFTs, and Web3 apps

🔥 Why SOL matters:
• Cheaper than Ethereum gas fees
• Faster than Bitcoin transactions
• Growing ecosystem of dApps
• Environmentally friendly (Proof of Stake)

💰 Current uses:
• Pay transaction fees
• Stake to earn rewards
• Trade on DEXs like Jupiter
• Buy NFTs and participate in DeFi

🚀 Get started: Use 'CREATE WALLET' to begin your SOL journey!`,
  },
  "HOW TO BUY SOL?": {
    title: "💳 How to Buy SOL",
    content: `Ready to get your first SOL? Here's how:

🏦 Centralized Exchanges (Easiest):
• Coinbase - Beginner friendly
• Binance - Low fees
• Kraken - Secure and regulated
• FTX - Advanced trading features

💳 Payment Methods:
• Bank transfer (lowest fees)
• Debit/Credit card (instant)
• PayPal (some exchanges)
• Wire transfer (large amounts)

🔄 Decentralized Options:
• Jupiter (Solana DEX)
• Raydium (Automated Market Maker)
• Orca (User-friendly DEX)

⚠️ Safety Tips:
• Use reputable exchanges only
• Enable 2FA security
• Withdraw to your own wallet
• Never share private keys

🎯 Next Steps:
1. Buy SOL on exchange
2. Create your wallet with 'CREATE WALLET'
3. Transfer SOL to your wallet
4. Start earning with quizzes!

💡 Pro Tip: Start small and learn as you go!`,
  },
};

const WALLET_RECOMMENDATIONS = {
  title: "📱 Recommended Solana Wallets",
  content: `Choose the perfect wallet for your SOL journey:

🔥 Top Mobile Wallets:
• Phantom - Most popular, user-friendly
• Solflare - Feature-rich, great for staking
• Glow - Social features, easy onboarding
• Backpack - New, sleek design

💻 Desktop Wallets:
• Phantom (Browser Extension)
• Solflare Web
• Exodus - Multi-currency support
• Ledger - Hardware wallet (most secure)

🛡️ Security Features to Look For:
• Seed phrase backup
• Biometric authentication
• Hardware wallet support
• Regular security updates

⭐ Beginner Recommendation:
Start with Phantom - it's trusted by millions and super easy to use!

🎯 Pro Tips:
• Always backup your seed phrase
• Use a hardware wallet for large amounts
• Never share your private keys
• Test with small amounts first

💡 Our bot creates wallets too! Try 'CREATE WALLET' for instant setup.`,
};

async function handleEducationalContent(from, topic) {
  const user = userManager.getUser(from);
  const topicKey = topic.toUpperCase();

  if (!EDUCATIONAL_CONTENT[topicKey]) {
    return "❌ Educational content not found. Try 'WHAT IS SOL?' or 'HOW TO BUY SOL?'";
  }

  const content = EDUCATIONAL_CONTENT[topicKey];

  if (user) {
    if (!user.educationViewed) user.educationViewed = [];
    if (!user.educationViewed.includes(topicKey)) {
      user.educationViewed.push(topicKey);
    }
  }

  return `${content.title}\n\n${content.content}`;
}

function getWalletRecommendations() {
  return `${WALLET_RECOMMENDATIONS.title}\n\n${WALLET_RECOMMENDATIONS.content}`;
}

function getWeb3Glossary() {
  return `📚 Web3 Glossary - Essential Terms:

🔑 Wallet: Your digital account for crypto
💰 DeFi: Decentralized Finance (no banks)
🖼️ NFT: Non-Fungible Token (unique digital item)
🔒 Staking: Lock tokens to earn rewards
⚡ dApp: Decentralized Application
🌐 DEX: Decentralized Exchange
💎 HODL: Hold On for Dear Life (long-term holding)
🚀 Moon: Price going up significantly
💸 Gas: Transaction fees on blockchain
🔗 Blockchain: Distributed digital ledger

💡 Learn more with our quizzes - type 'QUIZ'!`;
}

function getSolanaEcosystem() {
  return `🌟 Solana Ecosystem Overview:

🔥 DeFi Platforms:
• Jupiter - Best DEX aggregator
• Raydium - Automated Market Maker
• Marinade - Liquid staking protocol
• Mango Markets - Decentralized trading

🖼️ NFT Marketplaces:
• Magic Eden - Largest NFT marketplace
• Solanart - Premium NFT platform
• Exchange.art - Curated art platform
• Metaplex - NFT infrastructure

🎮 Gaming & Metaverse:
• Star Atlas - Space exploration MMO
• Aurory - Pokémon-inspired game
• Stepn - Move-to-earn fitness app
• Solana Monkey Business - Profile NFTs

🏗️ Infrastructure:
• Phantom - Most popular wallet
• Solflare - Feature-rich wallet
• Serum - High-speed DEX protocol
• Pyth - Price data oracle

💡 Join the ecosystem! Start with 'CREATE WALLET'`;
}

function getDeFiSafetyTips() {
  return `🛡️ DeFi Safety Guide:

⚠️ Common Scams to Avoid:
• Fake airdrops asking for private keys
• Phishing websites (check URLs carefully)
• "Too good to be true" APY promises
• Unrealistic guaranteed returns

🔒 Security Best Practices:
• Never share your seed phrase
• Use hardware wallets for large amounts
• Double-check contract addresses
• Start with small test transactions
• Enable 2FA on all accounts

✅ Before Using Any Protocol:
• Research the team and project
• Check audit reports
• Read community feedback
• Understand the risks involved
• Only invest what you can afford to lose

🎯 Red Flags:
• Anonymous teams
• No audit reports
• Pressure to invest quickly
• Promises of guaranteed profits
• Requests for private keys

💡 Remember: In DeFi, you are your own bank!`;
}

module.exports = {
  handleEducationalContent,
  getWalletRecommendations,
  getWeb3Glossary,
  getSolanaEcosystem,
  getDeFiSafetyTips,
  EDUCATIONAL_CONTENT,
};
