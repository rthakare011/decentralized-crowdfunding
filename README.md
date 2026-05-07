
# 🧠 Decentralized Crowdfunding DApp

A **decentralized crowdfunding platform** built using **Next.js (App Router)** on the frontend and **Solidity smart contracts** deployed to an Ethereum-compatible blockchain. This DApp enables users to **create fundraising campaigns**, **view campaign details**, and **contribute ETH** securely using MetaMask. All campaign data and transactions are **stored on-chain**, ensuring full **transparency, security, and decentralization**.

---

## 🚀 Live Demo

🔗 [Visit the Live App](https://decentralized-crowdfunding-woad.vercel.app)  


---

## 📚 Table of Contents

- [Features](#features)
- [Workflow](#workflow)
- [Codebase Structure](#codebase-structure)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## 🌟 Features

- ✅ **Decentralized & Trustless** — Campaigns are powered by Ethereum smart contracts.
- 💰 **Crypto Funding (ETH)** — Contribute securely using MetaMask.
- 🧾 **Real-time Campaign Tracking** — Contributions update instantly.
- 🔍 **Campaign Discovery** — Search and view detailed campaign stats.
- 🔐 **Admin Approval System** — Only verified campaigns go live.
- 📤 **Campaign Sharing** — Shareable links for social platforms.
- 🖼️ **Engaging UI** — Modern and responsive design using Tailwind CSS.
- 🪙 **Optional UPI Payment** — For contributors without crypto wallets.

---

## 🔁 Workflow

### 💡 1. Create Campaign
Users can start a new fundraising campaign by entering:
- Title
- Description
- ETH Goal
- Deadline
- Campaign Image

→ The campaign data is saved both on-chain and in Firestore (for real-time UI updates).

### 📢 2. View Campaign
Anyone can:
- View campaign details
- See ETH raised, goal, deadline, and contributors

### 💸 3. Contribute
Contributions are made via:
- **MetaMask (ETH)**: Recorded on-chain in the smart contract.
- **UPI (optional)**: Triggers a popup with UPI ID and QR code.

### ✅ 4. Admin Approval
- Campaigns require admin review before listing.
- Approved campaigns are displayed to the public dashboard.

### 🔒 5. Close Campaign (Optional)
Campaign creators can:
- Close the campaign to block further donations
- Update funding goals (if permitted)

---

## 🧱 Codebase Structure

### 📁 Folder Layout

```

.
├── public/                            # Static assets (e.g., logos, images)
├── src/
│
│   ├── app/                           # Next.js App Router structure
│   │   ├── _not-found/                # 404 fallback UI
│   │   ├── about-us/                  
│   │   │   └── page.jsx               # About Page
│   │   ├── api/
│   │   │   └── campaigns/[id]/       
│   │   │       └── route.js          # API route for dynamic campaign ID
│   │   ├── campaigns/
│   │   │   └── page.jsx              # Campaign listing or explore page
│   │   ├── create/
│   │   │   └── page.jsx              # Campaign creation form
│   │   ├── dashboard/
│   │   │   └── page.jsx              # Dashboard for approved campaigns
│   │   ├── shareModal/
│   │   │   └── ShareCampaignModal.jsx# Modal for sharing campaigns
│   │   ├── upi-qr-modal/
│   │   │   └── QRCodeModal.jsx       # Modal showing UPI QR & ID
│   │   ├── layout.jsx                # Shared layout (Navbar/Footer)
│   │   └── page.jsx                  # Home / Landing page
│
│   ├── components/                   # Reusable UI components
│   │   ├── Header.js
│   │   ├── HeroSection.js
│   │   ├── CampaignCard.jsx
│   │   └── Modal.jsx
│
│   ├── context/
│   │   └── Web3Context.js            # Web3 provider and context
│
│   ├── data/
│   │   └── campaigns.json            # Mock or seed campaign data
│
│   ├── firebase/
│   │   └── config.js                 # Firebase configuration
│
│   ├── styles/
│   │   └── globals.css               # Global Tailwind & custom styles
│
│   ├── utils/                        # Utility functions
│   │   ├── campaignService.js        # Firebase + contract service functions
│   │   ├── constants.js              # Constants (e.g., contract address)
│   │   └── contributeToWallet.js     # ETH or UPI contribution helper
│
│   └── test/                         # Unit & integration test cases
│
├── contracts/                        # Hardhat Smart Contracts
│   ├── Campaign.sol
│   └── scripts/
│       └── deploy.js
│
├── abi/
│   └── Campaign.json                 # ABI from Hardhat
├── .env.local                        # Environment variables
├── package.json                      # Project metadata and dependencies
└── README.md                         # Project documentation

```

---

## 🧰 Tech Stack

| Layer              | Technology                     |
|-------------------|--------------------------------|
| Smart Contracts    | Solidity, Hardhat              |
| Frontend           | Next.js (App Router), React    |
| Wallet Integration | MetaMask, Ethers.js, Web3Modal |
| Backend/Sync       | Firebase Firestore             |
| Styling            | Tailwind CSS                   |
| Deployment         | Vercel                         |

---

## ⚙️ How It Works

1. **Smart Contract Deployment**:  
   Using Hardhat, the `Campaign.sol` smart contract is compiled and deployed.

2. **Frontend ↔ Blockchain**:  
   The contract's ABI is used with Ethers.js to interact with MetaMask.

3. **Campaign Creation**:  
   On submission, the form data is pushed to:
   - Smart contract (on-chain)
   - Firebase Firestore (off-chain for instant UI update)

4. **Real-Time Sync**:  
   Campaign stats like ETH raised and contributors update live via Firestore.

5. **Security**:  
   - ETH transactions are recorded on Ethereum.
   - Admins approve campaigns before public visibility.

---

## 🔧 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/sdhage1502/decentralized-crowdfunding.git
cd decentralized-crowdfunding
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Set up a project in [Firebase](https://firebase.google.com), enable **Firestore**, and paste the config in `/firebase/config.js`.

```js
// firebase/config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 4. Compile & Deploy Contract (Hardhat)

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network hardhat
```

Then, copy the ABI to `/abi/Campaign.json`.

### 5. Start the Dev Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Panel (WIP)

Admin can:
- Review and approve campaigns
- Enable or disable contributions
- View internal campaign stats

> You can manage admin roles via Firestore rules or custom Express API endpoints.

---

## 📈 Future Enhancements

- [ ] Campaign filtering by category
- [ ] Contributor analytics and insights
- [ ] IPFS for decentralized image storage
- [ ] Dashboard for users to manage their campaigns
- [ ] Refund and withdrawal mechanisms for failed campaigns
- [ ] Email/Push notification support

---

## 👨‍💻 Author

**Rahul Thakare** – Java Full-Stack Developer | MCA Student  
📍 Shree Control Chowk, Audumbar Paradise, Narhe, Pune  
📧 rahulthakare0202@gmail.com  
📞 9623354133  
🔗 [GitHub](https://github.com/rthakare011)  
🔗 [LinkedIn](https://www.linkedin.com/in/rahulthakare-2b6627377/)

---

## ⭐ Contribute & Support

If you like this project, please consider giving it a ⭐ on GitHub.  
For contributions, feel free to fork and submit a pull request.
