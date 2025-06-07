const {
  PublicKey,
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");
const userManager = require("./userManager");

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

async function handleWalletCreation(from) {
  const existingUser = userManager.getUser(from);

  if (existingUser) {
    const balance = await getWalletBalance(existingUser.address);
    return `✅ You already have a wallet!
📍 Address: ${existingUser.address}
💰 Balance: ${balance} SOL
🏆 Achievements: ${existingUser.achievements?.length || 0}
Reply "MY PROGRESS" to see your journey!`;
  }

  try {
    const keypair = Keypair.generate();
    const address = keypair.publicKey.toBase58();

    const airdropSig = await connection.requestAirdrop(
      keypair.publicKey,
      0.1 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSig, "confirmed");

    const userData = {
      keypair,
      address,
      achievements: ["WALLET_CREATED"],
      totalEarned: 0.1,
      quizCompleted: [],
      referrals: 0,
      joinedAt: new Date().toISOString(),
      currentQuiz: null,
      nftMinted: false,
    };

    userManager.setUser(from, userData);
    await userManager.awardAchievement(from, "WALLET_CREATED");

    return `🎉 Wallet Created Successfully!
📍 Your Address: ${address}
💰 Starting Balance: 0.1 SOL
🏆 Achievement Unlocked: Wallet Creator
🎁 Bonus: +0.05 SOL

🎯 Next Steps:
• Reply "GET MY NFT" for your first NFT
• Try "QUIZ" to see earning opportunities
• Check "MY PROGRESS" anytime

Welcome to Web3! 🚀`;
  } catch (error) {
    console.error("Wallet creation error:", error);
    return "❌ Wallet creation failed. Please try again.";
  }
}

async function handleBalanceCheck(from) {
  const user = userManager.getUser(from);
  if (!user) return '❌ Create a wallet first with "CREATE WALLET"';

  try {
    const balance = await getWalletBalance(user.address);
    const achievements = user.achievements?.length || 0;
    const completedQuizzes = user.quizCompleted?.length || 0;

    return `💰 Your Wallet Balance
📍 Address: ${user.address}
💎 Balance: ${balance} SOL
🏆 Achievements: ${achievements}
📈 Total Earned: ${user.totalEarned} SOL
🎯 Referrals: ${user.referrals || 0}
📚 Quizzes: ${completedQuizzes}/4

💡 Earn more SOL with quiz commands!`;
  } catch (error) {
    console.error("Balance check error:", error);
    return "❌ Could not fetch balance. Try again.";
  }
}

async function handleSendSOL(from, body) {
  const user = userManager.getUser(from);
  if (!user) return '❌ Create a wallet first with "CREATE WALLET"';

  const parts = body.split(" ");
  if (parts.length !== 3) {
    return `❌ Invalid format. Use: SEND <amount> <address>
Example: SEND 0.1 ${user.address.substring(0, 8)}...`;
  }

  const amount = parseFloat(parts[1]);
  const toAddress = parts[2];

  if (isNaN(amount) || amount <= 0) {
    return "❌ Invalid amount. Must be a positive number.";
  }

  try {
    const balance = await getWalletBalance(user.address);
    if (amount > balance) {
      return `❌ Insufficient balance. You have ${balance} SOL.`;
    }

    // Demo mode - show transaction preview
    return `✅ Transaction Preview:
    
💸 From: ${user.address}
📍 To: ${toAddress}
💰 Amount: ${amount} SOL
⛽ Fee: ~0.000005 SOL

⚠️ Demo mode - transaction not executed.
In production, this would transfer real SOL! 🚀`;
  } catch (error) {
    console.error("Send SOL error:", error);
    return "❌ Transaction failed. Check addresses and try again.";
  }
}

async function getWalletBalance(address) {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return (balance / LAMPORTS_PER_SOL).toFixed(4);
  } catch (error) {
    console.error("Balance fetch error:", error);
    return "0.0000";
  }
}

module.exports = {
  handleWalletCreation,
  handleBalanceCheck,
  handleSendSOL,
  getWalletBalance,
};
