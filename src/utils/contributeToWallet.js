import { ethers } from "ethers";
import { toast } from "react-hot-toast";

/**
 * Sends ETH to a given wallet address using MetaMask and ethers.js
 * Includes full validation: MetaMask presence, wallet format, amount value, and balance check.
 * @param {string} walletAddress - Recipient wallet address
 * @param {string | number} amountEth - Amount in ETH to send
 * @returns {Promise<object>} Transaction receipt
 */
export const contributeToWallet = async (walletAddress, amountEth) => {
  // Validate inputs first before attempting transaction
  if (!window.ethereum) {
    toast.error("MetaMask is not installed.");
    throw new Error("MetaMask not installed");
  }

  // Validate wallet address
  if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    toast.error("Invalid or missing wallet address.");
    throw new Error("Invalid wallet address");
  }

  // Validate amount
  if (!amountEth || isNaN(amountEth) || Number(amountEth) <= 0) {
    toast.error("Enter a valid amount greater than 0.");
    throw new Error("Invalid amount");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // Check user's ETH balance
    const userBalanceWei = await provider.getBalance(userAddress);
    const userBalanceEth = Number(ethers.formatEther(userBalanceWei));
    const contribution = Number(amountEth);

    if (contribution > userBalanceEth) {
         throw new Error(`Insufficient ETH balance. You have ${userBalanceEth.toFixed(4)} ETH available.`);
    }

    // Convert to Wei and send transaction
    const amountInWei = ethers.parseEther(amountEth.toString());
    
    // Show pending toast
    const pendingToast = toast.loading("Processing transaction...");
    
    const tx = await signer.sendTransaction({
      to: walletAddress,
      value: amountInWei,
    });

    // Update toast to show transaction sent
    toast.dismiss(pendingToast);
    toast.success("Transaction sent. Waiting for confirmation...");
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    // Success toast with transaction hash
    toast.success(`Transaction confirmed! Hash: ${receipt.hash.slice(0, 10)}...`);
    
    return receipt;
  } catch (error) {
    // Handle user rejections differently
    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      toast.error("Transaction was rejected by user.");
    } else {
      console.error("Contribution failed:", error);
      toast.error(`Transaction failed: ${error.message || "Unknown error"}`);
    }
    throw error;
  }
};