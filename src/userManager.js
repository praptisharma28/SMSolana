// In-memory user storage
const users = {};

// Achievement system
const achievements = {
  WALLET_CREATED: { name: "Wallet Creator", reward: 0.05 },
  FIRST_NFT: { name: "NFT Collector", reward: 0.03 },
  QUIZ_MASTER: { name: "Knowledge Seeker", reward: 0.02 },
  REFERRAL_MASTER: { name: "Community Builder", reward: 0.1 },
};

function getUser(from) {
  return users[from];
}

function setUser(from, userData) {
  users[from] = userData;
}

function getUserCount() {
  return Object.keys(users).length;
}

async function handleProgressCheck(from) {
  const user = users[from];
  if (!user) return '❌ Create a wallet first with "CREATE WALLET"';

  const achievementList = user.achievements
    .map((a) => `🏆 ${achievements[a]?.name || a}`)
    .join("\n");

  const completedQuizzes = user.quizCompleted?.length || 0;
  const totalQuizzes = 4; // Update based on your quiz count

  return `🎯 Your Web3 Journey
👤 Member since: ${new Date(user.joinedAt).toLocaleDateString()}
💎 Total Earned: ${user.totalEarned} SOL
📍 Wallet: ${user.address}

🏆 Achievements (${user.achievements.length}):
${achievementList}

📚 Quiz Progress: ${completedQuizzes}/${totalQuizzes}
🤝 Referrals: ${user.referrals}
${
  user.nftMinted
    ? "🖼️ NFT Collected: ✅"
    : "🖼️ NFT: Get yours with 'GET MY NFT'"
}

🎯 Keep learning and earning! 🚀`;
}

async function handleReferral(from, body) {
  const user = users[from];
  if (!user) return '❌ Create a wallet first with "CREATE WALLET"';

  const parts = body.split(" ");
  if (parts.length !== 2) {
    return `❌ Invalid format. Use: REFER <phone>
Example: REFER +1234567890`;
  }

  const referredPhone = parts[1];
  user.referrals = (user.referrals || 0) + 1;

  // Award referral bonus
  if (user.referrals >= 5 && !user.achievements.includes("REFERRAL_MASTER")) {
    await awardAchievement(from, "REFERRAL_MASTER");
  }

  return `🤝 Referral Sent!
📱 Invited: ${referredPhone}
🎯 Your referrals: ${user.referrals}
🎁 Referral bonus: 0.05 SOL (when they join)
${
  user.referrals >= 5
    ? "🏆 Referral Master achieved!"
    : `${5 - user.referrals} more referrals for Referral Master! 🚀`
}

Help build the Web3 community! 🌍`;
}

async function awardAchievement(from, achievementKey) {
  const user = users[from];
  if (!user || user.achievements.includes(achievementKey)) return;

  user.achievements.push(achievementKey);
  const achievement = achievements[achievementKey];
  user.totalEarned = (user.totalEarned || 0) + achievement.reward;

  console.log(`Achievement unlocked for ${from}: ${achievement.name}`);
}

module.exports = {
  getUser,
  setUser,
  getUserCount,
  handleProgressCheck,
  handleReferral,
  awardAchievement,
  achievements,
};
