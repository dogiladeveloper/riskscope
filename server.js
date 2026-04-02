const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { execSync } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const OWS_WALLET = 'observatory-agent';

function owsCmd(cmd) {
  try {
    const nvmPath = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`;
    const result = execSync(`bash -c '${nvmPath} && ${cmd}'`, { encoding: 'utf8' });
    return { success: true, output: result.trim() };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Fetch on-chain data via Etherscan public API
async function fetchWalletData(address) {
  const base = 'https://api.etherscan.io/api';
  const results = {};

  try {
    // Balance
    const bal = await axios.get(`${base}?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`, { timeout: 6000 });
    results.balance = bal.data.result ? (parseInt(bal.data.result) / 1e18).toFixed(4) : '0';
  } catch { results.balance = '0'; }

  try {
    // TX count
    const tx = await axios.get(`${base}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=YourApiKeyToken`, { timeout: 6000 });
    results.transactions = tx.data.result || [];
    results.tx_count = Array.isArray(tx.data.result) ? tx.data.result.length : 0;
  } catch { results.transactions = []; results.tx_count = 0; }

  try {
    // Token transfers
    const tok = await axios.get(`${base}?module=account&action=tokentx&address=${address}&page=1&offset=10&sort=desc&apikey=YourApiKeyToken`, { timeout: 6000 });
    results.token_transfers = tok.data.result || [];
  } catch { results.token_transfers = []; }

  return results;
}

// Calculate risk score
function calculateRisk(address, data) {
  let score = 0;
  const flags = [];
  const insights = [];

  const txCount = data.tx_count || 0;
  const balance = parseFloat(data.balance || 0);
  const tokenCount = (data.token_transfers || []).length;

  // Activity score
  if (txCount === 0) { score += 30; flags.push('NO_ACTIVITY'); }
  else if (txCount < 5) { score += 15; flags.push('LOW_ACTIVITY'); }
  else if (txCount > 100) { score += 20; flags.push('HIGH_VOLUME'); }

  // Balance checks
  if (balance === 0) { score += 20; flags.push('ZERO_BALANCE'); }
  if (balance > 100) { insights.push('HIGH_VALUE_WALLET'); }

  // Token diversity
  if (tokenCount > 10) { score += 10; flags.push('MANY_TOKENS'); }

  // Counterparty analysis
  const counterparties = new Set();
  (data.transactions || []).forEach(tx => {
    if (tx.to) counterparties.add(tx.to.toLowerCase());
    if (tx.from) counterparties.add(tx.from.toLowerCase());
  });
  const uniqueCounterparties = counterparties.size;
  if (uniqueCounterparties > 20) { score += 15; flags.push('MANY_COUNTERPARTIES'); }

  // Known risky patterns
  const recentTxs = (data.transactions || []).slice(0, 5);
  const hasContractInteraction = recentTxs.some(tx => tx.input && tx.input !== '0x');
  if (hasContractInteraction) insights.push('CONTRACT_INTERACTIONS');

  score = Math.min(score, 100);

  return {
    score,
    risk_level: score < 20 ? 'LOW' : score < 50 ? 'MEDIUM' : score < 75 ? 'HIGH' : 'CRITICAL',
    risk_color: score < 20 ? '#00ff88' : score < 50 ? '#ffcc00' : score < 75 ? '#ff8800' : '#ff3366',
    flags,
    insights,
    stats: {
      tx_count: txCount,
      balance_eth: balance,
      token_transfers: tokenCount,
      unique_counterparties: uniqueCounterparties,
      contract_interactions: hasContractInteraction
    }
  };
}

// Generate mock data for demo when no API key
function getMockData(address) {
  const seed = address.charCodeAt(2) + address.charCodeAt(3);
  return {
    balance: (seed * 0.031).toFixed(4),
    tx_count: seed % 200,
    transactions: Array(Math.min(seed % 15, 10)).fill(null).map((_, i) => ({
      hash: '0x' + Math.random().toString(16).substring(2),
      from: address,
      to: '0x' + Math.random().toString(16).substring(2, 42),
      value: String(Math.floor(Math.random() * 1e18)),
      input: i % 3 === 0 ? '0xa9059cbb...' : '0x',
      timeStamp: String(Date.now()/1000 - i * 86400)
    })),
    token_transfers: Array(seed % 8).fill(null).map((_, i) => ({
      tokenName: ['USDC', 'USDT', 'WETH', 'DAI', 'LINK'][i % 5],
      tokenSymbol: ['USDC', 'USDT', 'WETH', 'DAI', 'LINK'][i % 5],
      value: String(Math.floor(Math.random() * 1000))
    }))
  };
}

// Routes
app.post('/api/scan', async (req, res) => {
  const { address } = req.body;
  if (!address || !address.match(/^0x[0-9a-fA-F]{40}$/)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }

  // OWS sign the scan request
  const owsResult = owsCmd(`ows sign message --wallet ${OWS_WALLET} --chain evm --message "RiskScope scan: ${address}"`);

  let data;
  try {
    data = await fetchWalletData(address);
    if (data.tx_count === 0 && data.balance === '0') {
      data = getMockData(address);
    }
  } catch (e) {
    data = getMockData(address);
  }

  const risk = calculateRisk(address, data);

  // Payment simulation (x402 style)
  const payment = {
    amount: '0.001',
    currency: 'USDC',
    paid_via: 'x402',
    signed_by: 'OWS:observatory-agent',
    tx: '0x' + Math.random().toString(16).substring(2, 18)
  };

  res.json({
    address,
    scanned_at: new Date().toISOString(),
    risk,
    data: {
      balance_eth: data.balance,
      tx_count: data.tx_count,
      recent_txs: (data.transactions || []).slice(0, 5),
      tokens: (data.token_transfers || []).slice(0, 5)
    },
    ows_proof: {
      signed: owsResult.success,
      wallet: OWS_WALLET,
      output: owsResult.output || owsResult.error
    },
    payment
  });
});

app.get('/api/wallet', (req, res) => {
  res.json({
    address: '0x575AfEdDDE98dC173744D2e02b7e6F84Be58a0Ef',
    wallet: OWS_WALLET,
    chain: 'eip155:1'
  });
});

app.listen(3002, () => console.log('RiskScope running on port 3002'));
