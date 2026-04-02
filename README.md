# n8n-nodes-aave-protocol

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with the Aave Protocol, enabling automated DeFi lending, borrowing, and liquidity operations. With 6 core resources covering lending pools, user accounts, flash loans, liquidations, staking, and governance, it empowers developers to build sophisticated DeFi workflows and automate complex financial strategies on the Aave ecosystem.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Aave-purple)
![Ethereum](https://img.shields.io/badge/Ethereum-Compatible-lightgrey)
![Web3](https://img.shields.io/badge/Web3-Enabled-green)

## Features

- **Lending Pool Operations** - Deposit, withdraw, borrow, and repay assets with real-time interest calculations
- **User Account Management** - Monitor positions, health factors, and account data across multiple markets
- **Flash Loan Execution** - Execute complex arbitrage and liquidation strategies with uncollateralized loans
- **Automated Liquidations** - Monitor and execute liquidations with customizable health factor thresholds
- **AAVE Staking Integration** - Stake AAVE tokens, claim rewards, and manage staking positions
- **Governance Participation** - Submit proposals, vote on governance decisions, and track proposal status
- **Multi-Network Support** - Compatible with Ethereum mainnet, Polygon, Avalanche, and other Aave markets
- **Real-time Market Data** - Access current interest rates, reserve data, and protocol statistics

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-aave-protocol`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-aave-protocol
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-aave-protocol.git
cd n8n-nodes-aave-protocol
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-aave-protocol
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Web3 provider API key (Infura, Alchemy, etc.) | Yes |
| Network | Target network (mainnet, polygon, avalanche) | Yes |
| Private Key | Wallet private key for transaction signing | Yes |
| RPC URL | Custom RPC endpoint (optional) | No |

## Resources & Operations

### 1. Lending Pool

| Operation | Description |
|-----------|-------------|
| Deposit | Supply assets to earn interest |
| Withdraw | Withdraw supplied assets |
| Borrow | Borrow assets against collateral |
| Repay | Repay borrowed assets |
| Set User E-Mode | Enable efficiency mode for correlated assets |
| Swap Borrow Rate | Switch between stable and variable rates |
| Get Reserve Data | Fetch reserve configuration and rates |

### 2. User Account

| Operation | Description |
|-----------|-------------|
| Get Account Data | Retrieve user's account summary |
| Get User Reserves | List user's supply and borrow positions |
| Get Health Factor | Check account's liquidation risk |
| Get Collateral | View collateral positions |
| Get Debt | View debt positions |
| Calculate Borrow Power | Determine available borrowing capacity |

### 3. Flash Loan

| Operation | Description |
|-----------|-------------|
| Execute Flash Loan | Borrow assets without collateral |
| Calculate Premium | Get flash loan fee |
| Get Available Liquidity | Check borrowable amounts |
| Validate Parameters | Pre-validate flash loan request |

### 4. Liquidation

| Operation | Description |
|-----------|-------------|
| Liquidate Call | Execute liquidation of underwater position |
| Get Liquidation Data | Calculate liquidation parameters |
| Check Liquidation Eligibility | Verify if position can be liquidated |
| Calculate Liquidation Reward | Estimate liquidation bonus |

### 5. Staking

| Operation | Description |
|-----------|-------------|
| Stake AAVE | Stake AAVE tokens in Safety Module |
| Unstake | Initiate unstaking process |
| Claim Rewards | Claim staking rewards |
| Get Staking Data | View staking position and rewards |
| Activate Cooldown | Start unstaking cooldown period |

### 6. Governance

| Operation | Description |
|-----------|-------------|
| Create Proposal | Submit new governance proposal |
| Vote | Cast vote on active proposal |
| Get Proposal | Fetch proposal details |
| List Proposals | Get all governance proposals |
| Get Voting Power | Check user's voting power |
| Delegate | Delegate voting power to another address |

## Usage Examples

```javascript
// Monitor lending pool reserves and interest rates
{
  "resource": "LendingPool",
  "operation": "Get Reserve Data",
  "asset": "USDC",
  "network": "mainnet"
}
```

```javascript
// Execute automated liquidation when health factor drops
{
  "resource": "Liquidation",
  "operation": "Liquidate Call",
  "collateralAsset": "ETH",
  "debtAsset": "USDC",
  "user": "0x1234567890123456789012345678901234567890",
  "debtToCover": "1000000000",
  "receiveAToken": false
}
```

```javascript
// Perform flash loan arbitrage
{
  "resource": "FlashLoan",
  "operation": "Execute Flash Loan",
  "assets": ["USDC", "DAI"],
  "amounts": ["1000000000", "1000000000000000000000"],
  "modes": [0, 0],
  "params": "0x"
}
```

```javascript
// Stake AAVE tokens and claim rewards
{
  "resource": "Staking",
  "operation": "Stake AAVE",
  "amount": "100000000000000000000",
  "onBehalfOf": "0x1234567890123456789012345678901234567890"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Insufficient Collateral | Not enough collateral for operation | Add collateral or reduce borrow amount |
| Reserve Not Active | Asset reserve is paused or frozen | Wait for reserve activation or use different asset |
| Health Factor Too Low | Account close to liquidation | Repay debt or add collateral |
| Flash Loan Failed | Flash loan execution reverted | Check callback logic and gas limits |
| Invalid Network | Unsupported network specified | Use supported networks (mainnet, polygon, avalanche) |
| Governance Not Eligible | Insufficient voting power | Acquire more AAVE or receive delegation |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-aave-protocol/issues)
- **Aave Documentation**: [Aave Protocol Docs](https://docs.aave.com)
- **DeFi Community**: [Aave Discord](https://discord.gg/aave)