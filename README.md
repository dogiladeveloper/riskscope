# RiskScope 🔍

> On-chain wallet risk screener powered by the Open Wallet Standard

**OWS Hackathon 2026 — The Observatory Track**

[![Live Demo](https://img.shields.io/badge/Live-riskscope.xyz-c8401a?style=flat-square)](https://riskscope.xyz)
[![OWS](https://img.shields.io/badge/Powered%20by-OWS%20v1.2.0-c8401a?style=flat-square)](https://openwallet.sh)

## What it does

RiskScope is an on-chain intelligence tool that scans any Ethereum wallet address and generates a full risk profile — counterparty graph, behavioral patterns, token exposure — charged per-scan via x402 protocol.

## How it works

1. User submits an Ethereum wallet address
2. x402 payment of 0.001 USDC charged automatically
3. OWS observatory agent signs the scan request
4. Agent fans out across on-chain data (txs, tokens, counterparties)
5. Risk score 0-100 generated with flag analysis
6. Signed report returned — tamper-proof, verifiable

## Required Stack

- ✅ OWS CLI v1.2.0
- ✅ OWS wallet for scan signing (observatory-agent)
- ✅ MoonPay agent skill integration
- ✅ Allium data endpoints as intelligence layer
- ✅ x402 for per-scan monetization

## Risk Scoring

| Score | Level | Description |
|-------|-------|-------------|
| 0-20 | LOW | Clean wallet, normal activity |
| 21-50 | MEDIUM | Some flags, moderate risk |
| 51-75 | HIGH | Multiple risk signals |
| 76-100 | CRITICAL | High risk, investigate |

## Architecture
```
Wallet Address → x402 Payment → OWS Sign → On-chain Scan → Risk Score → Signed Report
                                    ↑
                           observatory-agent wallet
                           (keys never exposed)
```

## OWS Wallet
```
Wallet: observatory-agent
Chain: eip155:1 (Ethereum)
Address: 0x575AfEdDDE98dC173744D2e02b7e6F84Be58a0Ef
```

## Quick Start
```bash
npm install
node server.js
```

## Live Demo

Visit [riskscope.xyz](https://riskscope.xyz) — paste any Ethereum address to get a full risk report.
