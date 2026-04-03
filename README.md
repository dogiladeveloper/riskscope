## 🏆 OWS Hackathon 2026 — 3 Projects

> This submission is part of a 3-project hackathon entry. All three use OWS wallet signing.

| Project | Track | Live | GitHub |
|---------|-------|------|--------|
| **RiskScope** (this repo) | Observatory · Pay-Per-Call | [riskscope.xyz](https://riskscope.xyz) | [dogiladeveloper/riskscope](https://github.com/dogiladeveloper/riskscope) |
| **OWSExchange** | Exchange · Agentic Commerce | [ows-exchange.xyz](https://ows-exchange.xyz) | [dogiladeveloper/ows-exchange](https://github.com/dogiladeveloper/ows-exchange) |
| **OWSAgentWork** | Network · Multi-Agent | [owsagentwork.xyz](https://owsagentwork.xyz) | [dogiladeveloper/owsagentwork](https://github.com/dogiladeveloper/owsagentwork) |

---

# RiskScope 🔍

> On-chain wallet intelligence powered by the Open Wallet Standard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-riskscope.xyz-c8401a?style=for-the-badge)](https://riskscope.xyz)
[![OWS](https://img.shields.io/badge/OWS-v1.2.0-c8401a?style=flat-square)](https://openwallet.sh)
[![x402](https://img.shields.io/badge/Payments-x402-ff6600?style=flat-square)](https://x402.org)
[![Track](https://img.shields.io/badge/Track-The%20Observatory-1a6bc8?style=flat-square)](https://hackathon.openwallet.sh)

**OWS Hackathon 2026 — The Observatory Track**

---

## 🎯 What It Does

RiskScope is a pay-per-scan on-chain wallet intelligence tool. Enter any Ethereum address or ENS name — the OWS observatory agent scans the entire on-chain footprint, builds a counterparty graph, and delivers a signed risk report. Each scan costs **0.001 USDC** via x402 protocol.

**[→ Live Demo: riskscope.xyz](https://riskscope.xyz)**

---

## 🏗 Architecture

```
User Input (0x... or ENS name)
        │
        ▼
  ENS Resolution (ensdata.net)
        │
        ▼
  OWS Observatory Agent ──── Signs scan request
  (observatory-agent wallet)
        │
        ▼
  Etherscan V2 API
  ┌─────────────────────────────────┐
  │  ETH Balance                    │
  │  Transaction History (nonce)    │
  │  Token Transfers (ERC-20)       │
  │  Counterparty Graph             │
  └─────────────────────────────────┘
        │
        ▼
  Risk Scoring Engine
  (0-100 score, flags, insights)
        │
        ▼
  x402 Payment (0.001 USDC)
        │
        ▼
  Signed Risk Report
```

---

## ✨ Features

- **Real On-chain Data** — Etherscan V2 API, live balances & transactions
- **ENS Support** — Enter `vitalik.eth` or any `.eth` name
- **Risk Scoring** — 0-100 score with LOW/MEDIUM/HIGH/CRITICAL levels
- **Counterparty Analysis** — Unique counterparty count, behavioral patterns
- **Token Exposure** — Full ERC-20 token history with amounts
- **OWS Signing Proof** — Every scan cryptographically signed & verifiable
- **x402 Monetization** — 0.001 USDC per scan via x402 protocol
- **Mobile Responsive** — Works on any device

---

## 🔧 Required Stack

| Component | Usage |
|-----------|-------|
| **OWS CLI v1.2.0** | Wallet management & scan signing |
| **OWS Wallet** | `observatory-agent` — scan authentication |
| **MoonPay Agent Skill** | Payment integration |
| **Allium / Etherscan V2** | On-chain data intelligence layer |
| **x402 Protocol** | Per-scan monetization |
| **Node.js + Express** | Backend API server |

---

## 🚀 Quick Start

```bash
# Install OWS
npm install -g @open-wallet-standard/core

# Create observatory wallet
ows wallet create --name observatory-agent

# Install dependencies
npm install

# Start server
node server.js
```

Visit `http://localhost:3002`

---

## 🔐 OWS Integration

```javascript
// Every scan request signed by OWS agent
const owsResult = owsCmd(
  `ows sign message --wallet observatory-agent --chain evm --message "RiskScope scan: ${address}"`
);
// Returns verifiable cryptographic proof
// Key wiped after signing — agent never sees private key
```

**Wallet:** `observatory-agent`  
**Chain:** `eip155:1` (Ethereum)  
**Address:** `0x575AfEdDDE98dC173744D2e02b7e6F84Be58a0Ef`

---

## 📊 Risk Scoring

| Score | Level | Flags |
|-------|-------|-------|
| 0-20 | 🟢 LOW | CLEAN |
| 21-50 | 🟡 MEDIUM | LOW_ACTIVITY, MANY_TOKENS |
| 51-75 | 🟠 HIGH | HIGH_VOLUME, MANY_COUNTERPARTIES |
| 76-100 | 🔴 CRITICAL | Multiple risk signals |

---

## 💰 x402 Monetization

```
Scan Request → x402 Payment (0.001 USDC) → OWS Signs → Report Delivered
```

- **Price:** 0.001 USDC per scan
- **Protocol:** x402 (HTTP-native stablecoin payments)
- **Signed by:** OWS observatory-agent wallet
- **Use cases:** VC due diligence, DeFi risk assessment, compliance

---

## 🏆 Hackathon

Built for **OWS Hackathon 2026 — The Observatory Track**

**Judged on:** Quality of onchain intelligence, depth of data usage, creativity of x402 monetization — real data, real payments, not mocked.

- [hackathon.openwallet.sh](https://hackathon.openwallet.sh)
- [openwallet.sh](https://openwallet.sh)
- [github.com/open-wallet-standard/core](https://github.com/open-wallet-standard/core)

---

## 📁 Project Structure

```
riskscope/
├── server.js          # Express API + OWS + Etherscan integration
├── public/
│   └── index.html     # Risk scanner UI
└── package.json
```

---

*Built with ❤️ using Open Wallet Standard v1.2.0*

---

## Live OWS Signing Proof

Every scan is cryptographically signed by the OWS observatory-agent wallet:
```bash
$ ows sign message --wallet observatory-agent --chain evm \
    --message "RiskScope: wallet intelligence powered by OWS v1.2.0"

3bfdc809b526e1eb9ffba1a9bc35839207954fa7b2468fcbc2568237a31c8d6951bbf3edad680d2e9885418b9969da038a3783b7d9c4e62feb983b915f2f38f41b
```

**Wallet:** observatory-agent | **Address:** 0x575AfEdDDE98dC173744D2e02b7e6F84Be58a0Ef  
**Key exposure:** None — wiped from memory after signing ✓

---

## Zerion Multichain Portfolio

RiskScope integrates Zerion API to show complete multichain portfolio data:

- Total portfolio value in USD across all chains
- 38+ supported chains (Ethereum, Base, Polygon, Arbitrum, Optimism...)
- Top token holdings with USD values
- DeFi positions and NFT data
```bash
# Zerion API endpoint used
GET https://api.zerion.io/v1/wallets/{address}/positions/?currency=usd
```

**Powered by:** [Zerion API](https://zerion.io/api)

---

## 👨‍💻 About the Builder

Built by **Doğan Sarı** — independent developer specializing in algorithmic trading systems, crypto bots, and blockchain infrastructure.

| Platform | Handle |
|----------|--------|
| 🐦 Twitter/X | [@dogiladeveloper](https://twitter.com/dogiladeveloper) |
| 💬 Telegram | [@dogiladeveloper](https://t.me/dogiladeveloper) |
| 🎮 Discord | dogiladeveloper |
| 🐙 GitHub | [dogiladeveloper](https://github.com/dogiladeveloper) |

*Built end-to-end in one night for OWS Hackathon 2026.*
