export const contractAddress = "0xYourContractAddressHere"; // Replace with your deployed contract address

export const contractABI = [
    // Replace with your contract's ABI (Application Binary Interface)
    {
        "inputs": [
            { "internalType": "string", "name": "_title", "type": "string" },
            { "internalType": "string", "name": "_description", "type": "string" },
            { "internalType": "uint256", "name": "_goal", "type": "uint256" },
            { "internalType": "uint256", "name": "_deadline", "type": "uint256" }
        ],
        "name": "createCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
