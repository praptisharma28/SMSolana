const userManager = require("./userManager");
const { Connection, LAMPORTS_PER_SOL } = require("@solana/web3.js");

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

const QUIZZES = {
  "WHAT IS DEFI?": {
    id: "defi",
    question:
      "💰 DeFi Quiz: What does DeFi stand for?\n\nA) Digital Finance\nB) Decentralized Finance\nC) Direct Finance\nD) Dynamic Finance\n\n🎁 Reward: 0.01 SOL",
    correctAnswer: "B",
    reward: 0.01,
    explanation:
      "✅ Correct! DeFi stands for Decentralized Finance - financial services built on blockchain without traditional intermediaries like banks.",
  },
  "WHAT IS AN NFT?": {
    id: "nft",
    question:
      "🖼️ NFT Quiz: What does NFT stand for?\n\nA) New Finance Token\nB) Network File Transfer\nC) Non-Fungible Token\nD) Next Future Technology\n\n🎁 Reward: 0.01 SOL",
    correctAnswer: "C",
    reward: 0.01,
    explanation:
      "✅ Correct! NFT stands for Non-Fungible Token - unique digital assets that represent ownership of specific items or content.",
  },
  "WHAT IS STAKING?": {
    id: "staking",
    question:
      "🔒 Staking Quiz: What is crypto staking?\n\nA) Buying crypto with stakes\nB) Locking tokens to secure network and earn rewards\nC) Trading crypto for profit\nD) Mining new cryptocurrencies\n\n🎁 Reward: 0.01 SOL",
    correctAnswer: "B",
    reward: 0.01,
    explanation:
      "✅ Correct! Staking involves locking your tokens to help secure the blockchain network and earn rewards in return.",
  },
  "WHAT IS SOLANA?": {
    id: "solana",
    question:
      "⚡ Solana Quiz: What makes Solana special?\n\nA) It's the oldest blockchain\nB) High-speed, low-cost transactions\nC) Only for NFTs\nD) Works without internet\n\n🎁 Reward: 0.015 SOL",
    correctAnswer: "B",
    reward: 0.015,
    explanation:
      "✅ Correct! Solana is known for its high-speed transactions (65,000+ TPS) and extremely low fees, making it ideal for DeFi and dApps.",
  },
};

function isQuizQuestion(body) {
  return Object.keys(QUIZZES).includes(body.toUpperCase());
}

function getAvailableQuizzes(from) {
  const user = userManager.getUser(from);
  if (!user) return '❌ Create a wallet first with "CREATE WALLET"';

  const completedQuizzes = user.quizCompleted || [];
  let quizList = "📚 Available Learn & Earn Quizzes:\n\n";

  Object.entries(QUIZZES).forEach(([command, quiz]) => {
    const isCompleted = completedQuizzes.includes(quiz.id);
    const status = isCompleted ? "✅ Completed" : "📝 Available";
    const reward = isCompleted ? "Earned" : `Earn ${quiz.reward} SOL`;

    quizList += `${status} | ${command}\n💰 ${reward}\n\n`;
  });

  quizList += `🎯 Progress: ${completedQuizzes.length}/${
    Object.keys(QUIZZES).length
  } completed\n`;
  quizList += `💡 Type any quiz question to start earning!`;

  return quizList;
}

async function handleQuizQuestion(from, body) {
  const user = userManager.getUser(from);
  if (!user) return '❌ Create a wallet first with "CREATE WALLET"';

  const quizKey = body.toUpperCase();
  const quiz = QUIZZES[quizKey];

  if (!quiz) {
    return "❌ Quiz not found. Type 'QUIZ' to see available quizzes.";
  }

  const completedQuizzes = user.quizCompleted || [];
  if (completedQuizzes.includes(quiz.id)) {
    return `✅ You've already completed this quiz!\n\n🏆 Previous reward: ${quiz.reward} SOL earned\n\n📚 Try other quizzes with 'QUIZ' command.`;
  }

  user.currentQuiz = quiz.id;

  return `${quiz.question}\n\n💡 Reply with A, B, C, or D to answer!`;
}

async function handleQuizAnswer(from, answer) {
  const user = userManager.getUser(from);
  if (!user || !user.currentQuiz) {
    return "❌ No active quiz. Start a quiz first!";
  }

  const currentQuiz = Object.values(QUIZZES).find(
    (q) => q.id === user.currentQuiz
  );
  if (!currentQuiz) {
    user.currentQuiz = null;
    return "❌ Quiz session expired. Please start again.";
  }

  const isCorrect = answer === currentQuiz.correctAnswer;

  if (isCorrect) {
    try {
      if (!user.quizCompleted) user.quizCompleted = [];
      user.quizCompleted.push(currentQuiz.id);

      user.totalEarned = (user.totalEarned || 0) + currentQuiz.reward;

      await simulateSOLReward(user.address, currentQuiz.reward);

      if (
        user.quizCompleted.length >= 3 &&
        !user.achievements.includes("QUIZ_MASTER")
      ) {
        await userManager.awardAchievement(from, "QUIZ_MASTER");
      }

      user.currentQuiz = null;

      const achievementBonus =
        user.quizCompleted.length >= 3
          ? "\n🏆 Quiz Master Achievement Unlocked! +0.02 SOL bonus!"
          : "";

      return `${currentQuiz.explanation}\n\n🎉 Reward Earned: ${
        currentQuiz.reward
      } SOL\n💰 Total Earned: ${user.totalEarned} SOL\n📚 Quizzes Completed: ${
        user.quizCompleted.length
      }/${
        Object.keys(QUIZZES).length
      }${achievementBonus}\n\n🎯 Keep learning! Type 'QUIZ' for more.`;
    } catch (error) {
      console.error("Quiz reward error:", error);
      return "✅ Correct answer! But reward transfer failed. Please try again.";
    }
  } else {
    user.currentQuiz = null;
    const correctAnswerText = Object.entries({
      A: "A",
      B: "B",
      C: "C",
      D: "D",
    }).find(([key]) => key === currentQuiz.correctAnswer)?.[0];

    return `❌ Incorrect! The right answer was ${currentQuiz.correctAnswer}.\n\n${currentQuiz.explanation}\n\n💡 Don't worry! You can retry this quiz anytime.\nType 'QUIZ' to see all available quizzes.`;
  }
}

async function simulateSOLReward(address, amount) {
  console.log(`💰 Quiz reward: ${amount} SOL sent to ${address}`);

  try {
    const { PublicKey } = require("@solana/web3.js");
    const publicKey = new PublicKey(address);
    const airdropSig = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSig, "confirmed");
    console.log(`✅ Demo airdrop completed: ${airdropSig}`);
  } catch (error) {
    console.error("Demo airdrop failed:", error);
  }
}

module.exports = {
  isQuizQuestion,
  getAvailableQuizzes,
  handleQuizQuestion,
  handleQuizAnswer,
  QUIZZES,
};
