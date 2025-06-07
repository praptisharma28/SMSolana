const walletHandler = require("./walletHandler");
const nftHandler = require("./nftHandler");
const quizHandler = require("./quizHandler");
const educationHandler = require("./educationHandler");
const userManager = require("./userManager");

async function sendMessage(to, body, client) {
  try {
    const isWhatsApp = to.startsWith("whatsapp:");
    return await client.messages.create({
      body,
      from: isWhatsApp
        ? `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
        : process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

async function handleMessage(from, body) {
  try {
    body = body.trim().toLowerCase();

    // Command routing
    if (body === "start" || body === "help") {
      return getHelpMessage();
    }
    if (body === "create wallet") {
      return await walletHandler.handleWalletCreation(from);
    }
    if (body === "get my nft") {
      return await nftHandler.handleNFTMinting(from);
    }
    if (body === "balance") {
      return await walletHandler.handleBalanceCheck(from);
    }
    if (body === "my progress") {
      return await userManager.handleProgressCheck(from);
    }
    if (body.startsWith("send ")) {
      return await walletHandler.handleSendSOL(from, body);
    }
    if (body.startsWith("refer ")) {
      return await userManager.handleReferral(from, body);
    }

    // Quiz system
    if (quizHandler.isQuizQuestion(body)) {
      return await quizHandler.handleQuizQuestion(from, body);
    }
    if (
      ["a", "b", "c", "d"].includes(body) &&
      userManager.getUser(from)?.currentQuiz
    ) {
      return await quizHandler.handleQuizAnswer(from, body.toUpperCase());
    }
    if (body === "quiz" || body === "quizzes") {
      return quizHandler.getAvailableQuizzes(from);
    }

    // Educational content
    if (body === "what is sol?" || body === "how to buy sol?") {
      return await educationHandler.handleEducationalContent(from, body);
    }
    if (body === "wallets") {
      return educationHandler.getWalletRecommendations();
    }

    return getHelpMessage();
  } catch (error) {
    console.error("Error handling message:", error);
    return "❌ An error occurred. Please try again later.";
  }
}

function getHelpMessage() {
  return `🚀 Welcome to Web3 SMS Onboarding!
📱 Available Commands:
• START - Get started
• CREATE WALLET - Generate your Solana wallet
• GET MY NFT - Mint your achievement NFT
• BALANCE - Check your SOL balance
• MY PROGRESS - View your achievements
• QUIZ - See available quizzes
• SEND <amount> <address> - Send SOL
• REFER <phone> - Invite friends

📚 Learn & Earn Quizzes:
• WHAT IS DEFI? - Earn 0.01 SOL
• WHAT IS AN NFT? - Earn 0.01 SOL  
• WHAT IS STAKING? - Earn 0.01 SOL
• WHAT IS SOLANA? - Earn 0.015 SOL

💡 Other Commands:
• WHAT IS SOL? - Learn about Solana
• HOW TO BUY SOL? - Purchase guide
• WALLETS - Recommended wallet apps

Reply with any command to continue! 🎯`;
}

module.exports = {
  handleMessage,
  sendMessage,
  getHelpMessage,
};
