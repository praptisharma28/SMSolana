const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const {
  createNft,
  mplTokenMetadata,
} = require("@metaplex-foundation/mpl-token-metadata");
const {
  createSignerFromKeypair,
  generateSigner,
  percentAmount,
  signerIdentity,
} = require("@metaplex-foundation/umi");
const userManager = require("./userManager");

const NFT_CONFIG = {
  name: "Web3 Onboarder",
  symbol: "ONBD",
  uri: "https://gateway.pinata.cloud/ipfs/bafkreicascom7ru7wcgj42xnuikhvaujchseztap7vngapchid7bxk35aa",
  sellerFeeBasisPoints: percentAmount(0),
};

async function handleNFTMinting(from) {
  const user = userManager.getUser(from);
  if (!user) return '❌ Create a wallet first with "CREATE WALLET"';

  if (user.nftMinted) {
    return `✅ You already have your onboarding NFT!
🖼️ NFT: ${NFT_CONFIG.name}
🔗 Mint Address: ${user.nftMintAddress}
🏆 Achievement: NFT Collector
Keep earning more achievements! 🚀`;
  }

  try {
    const umi = createUmi("http://127.0.0.1:8899");
    umi.use(mplTokenMetadata());

    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(
      Uint8Array.from(user.keypair.secretKey)
    );

    const signer = createSignerFromKeypair(umi, umiKeypair);
    umi.use(signerIdentity(signer));

    const mint = generateSigner(umi);

    const result = await createNft(umi, {
      mint,
      name: NFT_CONFIG.name,
      symbol: NFT_CONFIG.symbol,
      uri: NFT_CONFIG.uri,
      sellerFeeBasisPoints: NFT_CONFIG.sellerFeeBasisPoints,
      creators: [
        {
          address: signer.publicKey,
          verified: true,
          share: 100,
        },
      ],
    }).sendAndConfirm(umi);

    user.nftMinted = true;
    user.nftMintAddress = mint.publicKey.toString();

    if (!user.achievements.includes("FIRST_NFT")) {
      await userManager.awardAchievement(from, "FIRST_NFT");
    }

    return `🎉 NFT Minted Successfully!
🖼️ Your NFT: ${NFT_CONFIG.name}
🔗 Mint Address: ${mint.publicKey.toString()}
📋 Transaction: ${result.signature}
🏆 Achievement: NFT Collector
🎁 Reward: +0.03 SOL

View on Solana Explorer:
https://explorer.solana.com/address/${mint.publicKey.toString()}?cluster=custom

🎯 Keep earning! Try quiz commands for more rewards.`;
  } catch (error) {
    console.error("NFT minting error:", error);

    if (error.message.includes("NullSigner")) {
      return `❌ NFT minting failed: Signer configuration error
      
🔧 This is a known issue we're tracking on GitHub.
Please try again in a few moments, or check:
• Local Solana node is running (solana-test-validator)
• Sufficient balance for transaction fees
• Network connectivity

Report: github.com/your-repo/issues/new`;
    }

    return `❌ NFT minting failed: ${error.message}

This might be due to:
• Local Solana node not running (run: solana-test-validator)
• Insufficient balance for transaction
• Network connectivity issues

Try again later or check your setup! 🔧`;
  }
}

module.exports = {
  handleNFTMinting,
  NFT_CONFIG,
};
