# 📘 Decentralized Crowdfunding DApp — Technical Documentation

> **Author:** Rahul Thakare | Java Full-Stack Developer | MCA Student  
> **Stack:** Next.js 15 · React 19 · Ethers.js v6 · Firebase Firestore · Tailwind CSS · Hardhat · Solidity  
> **Live:** [decentralized-crowdfunding-woad.vercel.app](https://decentralized-crowdfunding-woad.vercel.app)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Directory Map](#4-directory-map)
5. [Core Features & Data Flow](#5-core-features--data-flow)
6. [Component Documentation](#6-component-documentation)
7. [API Routes](#7-api-routes)
8. [Utility Modules](#8-utility-modules)
9. [State Management — Web3Context](#9-state-management--web3context)
10. [Environment Variables](#10-environment-variables)
11. [Developer Workflow](#11-developer-workflow)
12. [Deployment](#12-deployment)
13. [Future Enhancements](#13-future-enhancements)

---

## 1. Project Overview

The **Decentralized Crowdfunding DApp** is a hybrid Web3 application that lets anyone:

- **Launch** a fundraising campaign with an ETH goal, cover image, wallet address, and optional UPI ID.
- **Browse** all active campaigns with real-time statistics via a paginated dashboard.
- **Contribute** ETH directly from MetaMask (peer-to-peer, no intermediary) or pay in INR via UPI QR code.
- **Share** campaigns across Facebook, Twitter, WhatsApp, LinkedIn, Telegram, and Email.

Campaign **metadata** (title, description, image, wallet, UPI ID) lives in **Firebase Firestore** for instant UI rendering. Contribution **transactions** flow peer-to-peer on the **Ethereum network** via MetaMask and are reflected back in Firestore (collected ETH, contributor count) after on-chain confirmation.

> **Design Philosophy:** The app acts as a transparent fundraising front-end — no smart contract custody. ETH goes directly to the campaign creator's wallet address, making it trustless and non-custodial.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│                                                          │
│  ┌──────────────┐    ┌──────────────────────────────┐   │
│  │  Next.js App │    │       MetaMask Extension      │   │
│  │  (React 19)  │◄──►│  window.ethereum (EIP-1193)   │   │
│  └──────┬───────┘    └──────────────┬───────────────┘   │
│         │                           │                    │
│  ┌──────▼────────────────────────────▼───────────┐      │
│  │              Web3Context (ethers.js v6)        │      │
│  │  - connectWallet()   - account state           │      │
│  │  - accountsChanged   - chainChanged listeners  │      │
│  └──────────────────────┬────────────────────────┘      │
└─────────────────────────┼───────────────────────────────┘
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   Firebase   │  │  Ethereum    │  │  Next.js API      │
│  Firestore   │  │  Network     │  │  Routes           │
│              │  │  (MetaMask)  │  │  /api/campaigns/  │
│ - campaigns  │  │              │  │  [id]/route.js    │
│   collection │  │ ETH tx sent  │  │                  │
│ - CRUD ops   │  │ directly to  │  │ GET campaign by  │
│   via SDK    │  │ wallet addr  │  │ ID from Firestore │
└──────────────┘  └──────────────┘  └──────────────────┘
```

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| **No smart contract custody** | ETH is sent P2P to campaign wallet — trustless, no contract risk |
| **Firebase Firestore for metadata** | Fast real-time reads for UI; blockchain alone is too slow for browsing |
| **Dual payment (ETH + UPI)** | Reaches both crypto-native and traditional Indian users |
| **Next.js App Router** | File-system routing, Server Components, and native API routes |
| **`use client` on all pages** | Web3 requires browser APIs; all interactive pages are client-rendered |

---

## 3. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 15.1.0 | App Router, SSR, API routes |
| **UI Library** | React | 19.0.0 | Component-based UI |
| **Blockchain** | Ethers.js | 6.1.0 | Wallet connection, ETH transactions |
| **Wallet** | MetaMask (EIP-1193) | — | Browser wallet provider |
| **Database** | Firebase Firestore | 11.4.0 | Campaign metadata & stats |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS |
| **Icons** | Lucide React | 0.511.0 | SVG icon components |
| **QR Code** | qrcode.react | 4.2.0 | UPI QR code generation |
| **Toast** | react-hot-toast | 2.5.1 | User notifications |
| **Smart Contracts** | Solidity + Hardhat | 0.8.28 / 2.22.17 | On-chain contract (placeholder ABI) |
| **Deployment** | Vercel | — | Frontend hosting |
| **Analytics** | Microsoft Clarity | — | User behavior tracking |

---

## 4. Directory Map

```
decentralized-crowdfunding/
│
├── public/                          # Static assets
│   ├── logo.png                     # Header logo
│   ├── crowdfunding.svg             # Favicon & footer icon
│   └── ethereum-logo.svg           # ETH icon used across UI
│
├── src/
│   ├── app/                         # Next.js App Router root
│   │   ├── layout.jsx               # Root layout: Web3Provider + Header + Toaster
│   │   ├── page.jsx                 # Home page: HeroSection + AboutUs + Footer
│   │   │
│   │   ├── about-us/
│   │   │   ├── page.jsx             # About page (combines both sections)
│   │   │   ├── aboutProject.jsx     # Project mission & tech overview
│   │   │   └── aboutDeveloper.jsx   # Developer profile card (Rahul Thakare)
│   │   │
│   │   ├── campaigns/
│   │   │   ├── page.jsx             # Legacy campaign page (unused route)
│   │   │   ├── create/
│   │   │   │   └── page.jsx         # Campaign creation form → writes to Firestore
│   │   │   └── [id]/
│   │   │       └── page.jsx         # Campaign detail: contribute ETH or UPI
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.jsx             # Explore all campaigns (search + pagination)
│   │   │
│   │   ├── shareModal/
│   │   │   └── ShareCampaignModal.jsx  # Social sharing modal
│   │   │
│   │   ├── upi-qr-modal/
│   │   │   ├── UpiPaymentModal.jsx  # UPI modal with dynamic QR
│   │   │   └── UpiQrGenerator.jsx   # QR code generator component
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx           # Sticky nav + wallet connect button
│   │   │   ├── HeroSection.jsx      # Landing hero with CTA buttons
│   │   │   ├── Footer.jsx           # Site footer with links
│   │   │   └── promotionalCard.jsx  # Promotional banner card
│   │   │
│   │   └── api/
│   │       └── campaigns/
│   │           └── [id]/
│   │               └── route.js     # GET /api/campaigns/:id
│   │
│   ├── context/
│   │   └── Web3Context.js           # Global Web3 state + wallet functions
│   │
│   ├── firebase/
│   │   └── config.js                # Firebase app init + Firestore export
│   │
│   ├── utils/
│   │   ├── contributeToWallet.js    # Core ETH contribution logic
│   │   ├── campaignService.js       # Firestore CRUD helpers
│   │   └── constants.js             # Contract address + ABI placeholder
│   │
│   ├── data/
│   │   └── campaigns.json           # Static seed/mock data
│   │
│   └── styles/
│       └── globals.css              # Tailwind base + custom animations
│
├── test/
│   └── Lock.js                      # Hardhat test file (boilerplate)
│
├── hardhat.config.js                # Hardhat: Solidity 0.8.28
├── next.config.mjs                  # Next.js: standalone output, strict mode
├── tailwind.config.mjs              # Tailwind content paths
├── .env                             # Firebase env vars (NEXT_PUBLIC_*)
└── package.json                     # Dependencies & scripts
```

---

## 5. Core Features & Data Flow

### 5.1 Campaign Creation Flow

```
User fills form (title, description, ETH goal, image URL, walletAddress, upiId)
        │
        ▼
  handleSubmit() in /campaigns/create/page.jsx
        │
        ▼
  addDoc(collection(db, "campaigns"), campaign)  ← Firebase Firestore
        │
        ▼
  Firestore assigns auto-generated document ID
        │
        ▼
  router.push(`/campaigns/${docRef.id}`)  ← Redirect to new campaign page
```

**Campaign Firestore Document Schema:**

```json
{
  "title": "string",
  "description": "string",
  "amount": "string (ETH goal, e.g. '1.5')",
  "image": "string (URL)",
  "walletAddress": "string (0x...)",
  "upiId": "string (optional, e.g. name@upi)",
  "collected": "number (ETH, default 0)",
  "contributors": "number (count, default 0)"
}
```

---

### 5.2 ETH Contribution Flow

```
User enters ETH amount → clicks "Contribute Now"
        │
        ▼
  handleContribute() in /campaigns/[id]/page.jsx
        │
        ▼
  contributeToWallet(campaign.walletAddress, amount)
  ┌─────────────────────────────────────────────┐
  │ 1. Validates: MetaMask present               │
  │ 2. Validates: wallet address format (regex)  │
  │ 3. Validates: amount > 0                     │
  │ 4. Checks sender ETH balance                 │
  │ 5. signer.sendTransaction({ to, value })     │
  │ 6. Awaits tx.wait() (on-chain confirmation)  │
  └─────────────────────────────────────────────┘
        │
        ▼
  receipt returned → updateCampaignStats(id, campaign, amount)
        │
        ▼
  Firestore: collected += amount, contributors += 1
        │
        ▼
  setCampaign(prev => { ...prev, ...updated })  ← UI updates reactively
```

---

### 5.3 UPI Contribution Flow

```
User selects "UPI" tab → clicks "Pay with UPI"
        │
        ▼
  UpiPaymentModal opens with upiId + campaignTitle
        │
        ▼
  User enters amount (INR) → QR updates dynamically
  generateUpiLink(): "upi://pay?pa={upiId}&pn={title}&am={amount}&cu=INR"
        │
        ▼
  User scans QR with PhonePe / GPay / Paytm
        │
        ▼
  handleUpiPaymentSuccess(amount) called on confirmation
  ethApprox = amount / 250000  ← rough INR→ETH conversion
  updateCampaignStats(id, campaign, ethApprox)
```

---

### 5.4 Dashboard Data Flow

```
Dashboard mounts → useEffect fires
        │
        ▼
  getDocs(collection(db, "campaigns"))  ← fetches all campaigns
        │
        ▼
  State: campaigns[], searchQuery, currentPage
        │
        ├── filteredCampaigns = campaigns.filter(title/desc match searchQuery)
        ├── Pagination: 6 campaigns per page
        └── Stats: totalCampaigns, totalRaised, activeCampaigns, completedCampaigns
```

---

## 6. Component Documentation

### 6.1 `Header.jsx`
**Location:** `src/app/components/Header.jsx`  
**Type:** Client Component (`"use client"`)

Sticky navigation bar with logo, desktop/mobile nav, and wallet connect.

| Feature | Detail |
|---|---|
| Wallet Connected State | Shows truncated address `0xABCD...1234` in blue badge |
| Wallet Disconnected | "Connect Wallet" button → calls `connectWallet()` from `useWeb3()` |
| About Link | Smart scroll: on `/` smoothly scrolls to `#about` section; on other pages navigates to `/about-us` |
| Mobile Menu | Hamburger toggle with `Menu`/`X` icons; closes on link click |
| Active Link | Highlighted with `text-[#3247C5] bg-blue-50` via `isActiveLink()` helper |

**Props:** None (reads from `useWeb3()` context)

---

### 6.2 `HeroSection.jsx`
**Location:** `src/app/components/HeroSection.jsx`  
**Type:** Client Component

Full-viewport landing section with animated floating blobs and three CTA buttons.

| Button | Condition | Action |
|---|---|---|
| Connect Wallet | `!account` | Calls `connectWallet()` |
| Create Campaign | Always visible | If wallet connected → `/campaigns/create`; else → `connectWallet()` |
| Dashboard | Always visible | Navigates to `/dashboard` |

**Stats Displayed:** Ethereum-based · ETH Donations · On-Chain Data

---

### 6.3 `ShareCampaignModal.jsx`
**Location:** `src/app/shareModal/ShareCampaignModal.jsx`  
**Type:** Client Component

| Prop | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `function` | Callback to close modal |
| `campaignUrl` | `string` | Full URL of the campaign page |
| `campaignTitle` | `string` | Campaign name for share text |

**Share Platforms:** Facebook, Twitter, WhatsApp, LinkedIn, Telegram, Email  
**Copy Link:** Clipboard API with visual "Copied!" feedback (2s timeout)

---

### 6.4 `UpiPaymentModal.jsx`
**Location:** `src/app/upi-qr-modal/UpiPaymentModal.jsx`  
**Type:** Client Component

| Prop | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `function` | Callback to close modal |
| `upiId` | `string` | Payee UPI ID (e.g. `name@upi`) |
| `campaignTitle` | `string` | Used in UPI payment note |
| `onSuccessfulPayment` | `function(amount)` | Called after user confirms payment |

**QR Code:** Generated via `qrcode.react` (QRCodeSVG), updates in real-time as user types the INR amount. UPI deep-link format: `upi://pay?pa=...&pn=...&am=...&cu=INR`

**UX Details:**
- Escape key closes modal
- Click outside modal backdrop closes it
- Body scroll locked while open
- Copy UPI ID to clipboard button

---

### 6.5 `aboutDeveloper.jsx`
**Location:** `src/app/about-us/aboutDeveloper.jsx`  
**Type:** Client Component

Developer profile card for **Rahul Thakare**.

| Section | Content |
|---|---|
| Name & Role | Rahul Thakare — Java Full-Stack Developer |
| Institution | Zeal Institute of Business Administration Computer Application and Research, Pune |
| Course | MCA (2024–2026) |
| Contact | 9623354133 · rahulthakare0202@gmail.com |
| LinkedIn | [rahulthakare-2b6627377](https://www.linkedin.com/in/rahulthakare-2b6627377) |
| Skills | Full-Stack Development · Java Full-Stack · Engineering |
| Stats Cards | Fresher · MCA · Full-Stack Focus |

---

## 7. API Routes

### `GET /api/campaigns/:id`
**File:** `src/app/api/campaigns/[id]/route.js`

Fetches a single campaign document from Firestore by its document ID.

**Request:**
```
GET /api/campaigns/abc123XYZ
```

**Response — 200 OK:**
```json
{
  "title": "Clean Water Initiative",
  "description": "Providing clean water to rural areas.",
  "amount": "2",
  "image": "https://example.com/image.jpg",
  "walletAddress": "0xAbCd...1234",
  "upiId": "name@upi",
  "collected": 0.75,
  "contributors": 3
}
```

**Response — 404 Not Found:**
```json
{ "error": "Campaign not found" }
```

**Response — 500 Internal Server Error:**
```json
{ "error": "Error fetching campaign", "details": "..." }
```

> **Note:** This route reads directly from Firestore server-side. The primary campaign fetching in the detail page uses `fetchCampaignById()` client-side for reactivity.

---

## 8. Utility Modules

### 8.1 `contributeToWallet.js`

**Signature:**
```js
contributeToWallet(walletAddress: string, amountEth: string | number): Promise<TransactionReceipt>
```

**Validation Chain:**
1. `window.ethereum` present (MetaMask check)
2. `walletAddress` matches `/^0x[a-fA-F0-9]{40}$/`
3. `amountEth > 0` (numeric)
4. Sender balance ≥ contribution amount

**Flow:** Requests accounts → gets signer → checks balance → `parseEther(amount)` → `sendTransaction()` → `tx.wait()` → returns receipt.

**Error Handling:**
- `ACTION_REJECTED` / `4001` → "Transaction was rejected by user"
- Insufficient balance → throws descriptive error
- All errors surfaced via `react-hot-toast`

---

### 8.2 `campaignService.js`

**`fetchCampaignById(id: string)`**  
Fetches a single campaign document from Firestore. Throws `"Campaign not found."` if document doesn't exist.

**`updateCampaignStats(id: string, campaign: object, amount: number)`**  
Atomically increments `collected` and `contributors` in Firestore.
```js
collected   += amount
contributors += 1
```
Returns the new `{ collected, contributors }` values for local state sync.

---

### 8.3 `constants.js`

```js
export const contractAddress = "0xYourContractAddressHere";
export const contractABI = [
  {
    name: "createCampaign",
    inputs: [_title, _description, _goal, _deadline],
    type: "function"
  }
];
```

> ⚠️ **Action Required:** Replace `contractAddress` with your deployed Solidity contract address and populate the full ABI from Hardhat compilation artifacts.

---

## 9. State Management — Web3Context

**File:** `src/context/Web3Context.js`  
**Provider:** Wraps entire app in `src/app/layout.jsx`

**State:**

| Variable | Type | Description |
|---|---|---|
| `account` | `string \| null` | Connected wallet address |
| `isLoading` | `boolean` | True during wallet connection |
| `mounted` | `boolean` | Guards against SSR hydration issues |

**Exported Values via `useWeb3()`:**

| Value | Type | Description |
|---|---|---|
| `account` | `string \| null` | Current wallet address |
| `connectWallet` | `async function` | Triggers MetaMask connection |
| `isLoading` | `boolean` | Connection in-progress flag |

**Event Listeners (registered after mount):**
- `accountsChanged` → updates `account` state or sets to `null` on disconnect
- `chainChanged` → forces `window.location.reload()` to reset state

**Auto-connect:** On mount, calls `provider.listAccounts()` — if a wallet is already connected (e.g., user previously authorized), `account` is restored without prompting.

---

## 10. Environment Variables

Create a `.env` file at project root with the following:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> All variables are prefixed `NEXT_PUBLIC_` since they are consumed client-side. Never store private keys or wallet secrets here.

---

## 11. Developer Workflow

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18 | Runtime |
| npm | ≥ 9 | Package manager |
| MetaMask | Latest | Browser wallet |
| Git | Any | Version control |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/rthakare011/decentralized-crowdfunding.git
cd decentralized-crowdfunding
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Configure Environment

1. Copy the example env or create `.env`:
```bash
cp .env.example .env   # or create manually
```

2. Fill in all `NEXT_PUBLIC_FIREBASE_*` values from your Firebase Console.

---

### Step 4 — Set Up Firebase Firestore

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Cloud Firestore** in Native mode
3. Create a `campaigns` collection (documents are auto-created on first campaign submission)
4. **Firestore Security Rules** (development):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /campaigns/{id} {
      allow read: if true;
      allow write: if true;  // ⚠️ Restrict in production
    }
  }
}
```

---

### Step 5 — Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### Step 6 — Smart Contract Setup (Optional / Future)

The project includes Hardhat for Solidity smart contract development.

```bash
# Compile contracts
npx hardhat compile

# Run local blockchain node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Run tests
npx hardhat test
```

After deployment:
1. Copy the deployed contract address → update `src/utils/constants.js`
2. Copy the ABI from `artifacts/` → update `contractABI` in `constants.js`

---

### Available Scripts

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Starts Next.js dev server on port 3000 |
| Build | `npm run build` | Creates optimized production build |
| Start | `npm run start` | Serves production build locally |
| Lint | `npm run lint` | ESLint code quality check |

---

## 12. Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repo at [vercel.com](https://vercel.com)
3. Add all `NEXT_PUBLIC_FIREBASE_*` env vars in Vercel project settings
4. Deploy — Vercel auto-detects Next.js and uses `output: "standalone"`

**`next.config.mjs` settings:**
```js
output: "standalone",   // Optimized for containerized/serverless deployment
reactStrictMode: true,  // Catches double-render issues in development
```

### MetaMask Network Configuration

For production, contributors must have MetaMask configured to the correct network (Ethereum Mainnet or your chosen testnet). The app does **not** force a specific network but will reload on `chainChanged`.

---

## 13. Future Enhancements

| Feature | Priority | Notes |
|---|---|---|
| Campaign categories & filtering | High | Add `category` field to Firestore schema |
| IPFS image storage | High | Replace image URL with decentralized storage |
| Smart contract custody | Medium | Funds held in contract until goal; refund on failure |
| User dashboard (My Campaigns) | Medium | Filter campaigns by connected wallet address |
| Refund mechanism | Medium | Requires smart contract escrow logic |
| Email/Push notifications | Low | Firebase Cloud Messaging or SendGrid |
| Contributor analytics | Low | Charts per campaign showing donation history |
| Admin approval panel | Low | Firestore-rules-based role system |
| IPFS metadata storage | Future | Full decentralization of campaign data |

---

*Documentation generated: May 2026 · Maintained by Rahul Thakare*
