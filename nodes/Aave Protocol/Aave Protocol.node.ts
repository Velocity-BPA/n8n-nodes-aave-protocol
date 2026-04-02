/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-aaveprotocol/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AaveProtocol implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Aave Protocol',
    name: 'aaveprotocol',
    icon: 'file:aaveprotocol.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Aave Protocol API',
    defaults: {
      name: 'Aave Protocol',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'aaveprotocolApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'LendingPool',
            value: 'lendingPool',
          },
          {
            name: 'UserAccount',
            value: 'userAccount',
          },
          {
            name: 'FlashLoan',
            value: 'flashLoan',
          },
          {
            name: 'Liquidation',
            value: 'liquidation',
          },
          {
            name: 'Staking',
            value: 'staking',
          },
          {
            name: 'Governance',
            value: 'governance',
          }
        ],
        default: 'lendingPool',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['lendingPool'] } },
  options: [
    { name: 'Get Reserves', value: 'getReserves', description: 'Get all available reserves in a lending pool', action: 'Get reserves' },
    { name: 'Get Reserve', value: 'getReserve', description: 'Get specific reserve data', action: 'Get reserve' },
    { name: 'Simulate Deposit', value: 'simulateDeposit', description: 'Simulate deposit transaction', action: 'Simulate deposit' },
    { name: 'Simulate Withdraw', value: 'simulateWithdraw', description: 'Simulate withdrawal transaction', action: 'Simulate withdraw' },
    { name: 'Simulate Borrow', value: 'simulateBorrow', description: 'Simulate borrow transaction', action: 'Simulate borrow' },
    { name: 'Simulate Repay', value: 'simulateRepay', description: 'Simulate repay transaction', action: 'Simulate repay' },
  ],
  default: 'getReserves',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['userAccount'] } },
	options: [
		{
			name: 'Get User Summary',
			value: 'getUserSummary',
			description: 'Get user account summary',
			action: 'Get user summary',
		},
		{
			name: 'Get User Reserves',
			value: 'getUserReserves',
			description: 'Get user reserve data',
			action: 'Get user reserves',
		},
		{
			name: 'Get User Transactions',
			value: 'getUserTransactions',
			description: 'Get user transaction history',
			action: 'Get user transactions',
		},
		{
			name: 'Get Health Factor',
			value: 'getHealthFactor',
			description: 'Get user health factor',
			action: 'Get health factor',
		},
		{
			name: 'Simulate Collateral Change',
			value: 'simulateCollateralChange',
			description: 'Simulate collateral enable/disable',
			action: 'Simulate collateral change',
		},
	],
	default: 'getUserSummary',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['flashLoan'] } },
  options: [
    { name: 'Get Available Flash Loans', value: 'getAvailableFlashLoans', description: 'Get available assets for flash loans', action: 'Get available flash loans' },
    { name: 'Simulate Flash Loan', value: 'simulateFlashLoan', description: 'Simulate flash loan execution', action: 'Simulate flash loan' },
    { name: 'Get Flash Loan Fees', value: 'getFlashLoanFees', description: 'Get flash loan fees for assets', action: 'Get flash loan fees' },
    { name: 'Get Flash Loan Transaction', value: 'getFlashLoanTransaction', description: 'Get flash loan transaction details', action: 'Get flash loan transaction' }
  ],
  default: 'getAvailableFlashLoans',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['liquidation'] } },
  options: [
    { 
      name: 'Get Liquidation Opportunities', 
      value: 'getLiquidationOpportunities', 
      description: 'Get available liquidation opportunities',
      action: 'Get liquidation opportunities'
    },
    { 
      name: 'Calculate Liquidation', 
      value: 'calculateLiquidation', 
      description: 'Calculate liquidation profitability',
      action: 'Calculate liquidation'
    },
    { 
      name: 'Get User Liquidation Data', 
      value: 'getUserLiquidationData', 
      description: 'Get user liquidation data',
      action: 'Get user liquidation data'
    },
    { 
      name: 'Simulate Liquidation', 
      value: 'simulateLiquidation', 
      description: 'Simulate liquidation transaction',
      action: 'Simulate liquidation'
    }
  ],
  default: 'getLiquidationOpportunities',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['staking'] } },
  options: [
    { name: 'Get Staking Overview', value: 'getStakingOverview', description: 'Get staking contract overview', action: 'Get staking overview' },
    { name: 'Get User Staking Data', value: 'getUserStakingData', description: 'Get user staking positions and rewards', action: 'Get user staking data' },
    { name: 'Simulate Stake', value: 'simulateStake', description: 'Simulate AAVE staking', action: 'Simulate stake' },
    { name: 'Simulate Unstake', value: 'simulateUnstake', description: 'Simulate AAVE unstaking', action: 'Simulate unstake' },
    { name: 'Simulate Claim Rewards', value: 'simulateClaimRewards', description: 'Simulate rewards claim', action: 'Simulate claim rewards' },
    { name: 'Get Claimable Rewards', value: 'getClaimableRewards', description: 'Get claimable staking rewards', action: 'Get claimable rewards' }
  ],
  default: 'getStakingOverview',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['governance'] } },
  options: [
    { name: 'Get Proposals', value: 'getProposals', description: 'Get all governance proposals', action: 'Get all governance proposals' },
    { name: 'Get Proposal', value: 'getProposal', description: 'Get specific proposal details', action: 'Get specific proposal details' },
    { name: 'Get Proposal Votes', value: 'getProposalVotes', description: 'Get votes for a proposal', action: 'Get votes for a proposal' },
    { name: 'Simulate Vote', value: 'simulateVote', description: 'Simulate voting on proposal', action: 'Simulate voting on proposal' },
    { name: 'Get Voting Power', value: 'getVotingPower', description: 'Get user voting power', action: 'Get user voting power' },
    { name: 'Get User Votes', value: 'getUserVotes', description: 'Get user voting history', action: 'Get user voting history' }
  ],
  default: 'getProposals',
},
{
  displayName: 'Pool Address',
  name: 'poolAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['lendingPool'], operation: ['getReserves', 'getReserve', 'simulateDeposit', 'simulateWithdraw', 'simulateBorrow', 'simulateRepay'] } },
  default: '',
  description: 'The address of the lending pool',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['lendingPool'], operation: ['getReserves', 'getReserve', 'simulateDeposit', 'simulateWithdraw', 'simulateBorrow', 'simulateRepay'] } },
  options: [
    { name: 'Ethereum Mainnet', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Avalanche', value: 'avalanche' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Harmony', value: 'harmony' },
    { name: 'Metis', value: 'metis' },
  ],
  default: 'ethereum',
  description: 'The blockchain network to query',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['lendingPool'], operation: ['getReserve', 'simulateDeposit', 'simulateWithdraw', 'simulateBorrow', 'simulateRepay'] } },
  default: '',
  description: 'The asset address or symbol',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['lendingPool'], operation: ['simulateDeposit', 'simulateWithdraw', 'simulateBorrow', 'simulateRepay'] } },
  default: '',
  description: 'The amount to deposit, withdraw, borrow, or repay (in wei or base units)',
},
{
  displayName: 'User Address',
  name: 'user',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['lendingPool'], operation: ['simulateDeposit', 'simulateWithdraw', 'simulateBorrow', 'simulateRepay'] } },
  default: '',
  description: 'The user wallet address',
},
{
  displayName: 'Interest Rate Mode',
  name: 'interestRateMode',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['lendingPool'], operation: ['simulateBorrow'] } },
  options: [
    { name: 'Stable', value: '1' },
    { name: 'Variable', value: '2' },
  ],
  default: '2',
  description: 'The interest rate mode for borrowing',
},
{
	displayName: 'User Address',
	name: 'userAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['userAccount'],
			operation: ['getUserSummary', 'getUserReserves', 'getUserTransactions', 'getHealthFactor', 'simulateCollateralChange'],
		},
	},
	default: '',
	description: 'The Ethereum address of the user',
},
{
	displayName: 'Pool Address',
	name: 'poolAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['userAccount'],
			operation: ['getUserSummary', 'getUserReserves', 'getHealthFactor'],
		},
	},
	default: '',
	description: 'The address of the Aave pool',
},
{
	displayName: 'Network',
	name: 'network',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['userAccount'],
			operation: ['getUserSummary', 'getUserReserves', 'getUserTransactions', 'getHealthFactor', 'simulateCollateralChange'],
		},
	},
	options: [
		{ name: 'Ethereum', value: 'ethereum' },
		{ name: 'Polygon', value: 'polygon' },
		{ name: 'Avalanche', value: 'avalanche' },
		{ name: 'Arbitrum', value: 'arbitrum' },
		{ name: 'Optimism', value: 'optimism' },
		{ name: 'Fantom', value: 'fantom' },
		{ name: 'Harmony', value: 'harmony' },
		{ name: 'Base', value: 'base' },
		{ name: 'Metis', value: 'metis' },
	],
	default: 'ethereum',
	description: 'The blockchain network to query',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['userAccount'],
			operation: ['getUserTransactions'],
		},
	},
	default: 100,
	description: 'Maximum number of transactions to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['userAccount'],
			operation: ['getUserTransactions'],
		},
	},
	default: 0,
	description: 'Number of transactions to skip',
},
{
	displayName: 'Asset',
	name: 'asset',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['userAccount'],
			operation: ['simulateCollateralChange'],
		},
	},
	default: '',
	description: 'The asset address to simulate collateral change for',
},
{
	displayName: 'Enable',
	name: 'enable',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['userAccount'],
			operation: ['simulateCollateralChange'],
		},
	},
	default: true,
	description: 'Whether to enable or disable the asset as collateral',
},
{
  displayName: 'Pool Address',
  name: 'poolAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['flashLoan'], operation: ['getAvailableFlashLoans'] } },
  default: '',
  description: 'The Aave lending pool address',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['flashLoan'], operation: ['getAvailableFlashLoans', 'simulateFlashLoan', 'getFlashLoanFees', 'getFlashLoanTransaction'] } },
  options: [
    { name: 'Mainnet', value: 'mainnet' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Avalanche', value: 'avalanche' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' }
  ],
  default: 'mainnet',
  description: 'Blockchain network to query',
},
{
  displayName: 'Assets',
  name: 'assets',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['flashLoan'], operation: ['simulateFlashLoan', 'getFlashLoanFees'] } },
  default: '',
  description: 'Comma-separated list of asset addresses',
},
{
  displayName: 'Amounts',
  name: 'amounts',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['flashLoan'], operation: ['simulateFlashLoan', 'getFlashLoanFees'] } },
  default: '',
  description: 'Comma-separated list of flash loan amounts (in wei)',
},
{
  displayName: 'Modes',
  name: 'modes',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['flashLoan'], operation: ['simulateFlashLoan'] } },
  default: '0',
  description: 'Comma-separated list of flash loan modes (0: no debt, 1: stable debt, 2: variable debt)',
},
{
  displayName: 'Params',
  name: 'params',
  type: 'string',
  displayOptions: { show: { resource: ['flashLoan'], operation: ['simulateFlashLoan'] } },
  default: '0x',
  description: 'Additional parameters for flash loan execution',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['flashLoan'], operation: ['getFlashLoanTransaction'] } },
  default: '',
  description: 'The transaction hash of the flash loan',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'string',
  default: 'mainnet',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getLiquidationOpportunities', 'calculateLiquidation', 'getUserLiquidationData', 'simulateLiquidation']
    }
  },
  description: 'The blockchain network to query (e.g., mainnet, polygon, arbitrum)'
},
{
  displayName: 'Min Profit',
  name: 'minProfit',
  type: 'number',
  default: 0.01,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getLiquidationOpportunities']
    }
  },
  description: 'Minimum profit threshold for liquidation opportunities'
},
{
  displayName: 'Max Health Factor',
  name: 'maxHealthFactor',
  type: 'number',
  default: 1.0,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getLiquidationOpportunities']
    }
  },
  description: 'Maximum health factor for filtering opportunities'
},
{
  displayName: 'User Address',
  name: 'user',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['calculateLiquidation', 'simulateLiquidation']
    }
  },
  description: 'The user address to calculate/simulate liquidation for'
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getUserLiquidationData']
    }
  },
  description: 'The user address to get liquidation data for'
},
{
  displayName: 'Pool Address',
  name: 'poolAddress',
  type: 'string',
  default: '',
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['getUserLiquidationData']
    }
  },
  description: 'The pool address to query'
},
{
  displayName: 'Collateral Asset',
  name: 'collateralAsset',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['calculateLiquidation', 'simulateLiquidation']
    }
  },
  description: 'The collateral asset address'
},
{
  displayName: 'Debt Asset',
  name: 'debtAsset',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['calculateLiquidation', 'simulateLiquidation']
    }
  },
  description: 'The debt asset address'
},
{
  displayName: 'Debt to Cover',
  name: 'debtToCover',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['calculateLiquidation', 'simulateLiquidation']
    }
  },
  description: 'Amount of debt to cover in the liquidation'
},
{
  displayName: 'Receive AToken',
  name: 'receiveAToken',
  type: 'boolean',
  default: false,
  displayOptions: {
    show: {
      resource: ['liquidation'],
      operation: ['simulateLiquidation']
    }
  },
  description: 'Whether to receive aTokens instead of underlying asset'
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['getStakingOverview', 'getUserStakingData', 'simulateStake', 'simulateUnstake', 'simulateClaimRewards', 'getClaimableRewards'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Avalanche', value: 'avalanche' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Harmony', value: 'harmony' },
    { name: 'Base', value: 'base' },
    { name: 'Metis', value: 'metis' },
    { name: 'BNB Smart Chain', value: 'bsc' },
    { name: 'Gnosis', value: 'gnosis' },
    { name: 'Scroll', value: 'scroll' }
  ],
  default: 'ethereum',
  description: 'Blockchain network to query',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['getUserStakingData', 'simulateStake', 'simulateUnstake', 'simulateClaimRewards', 'getClaimableRewards'] } },
  default: '',
  description: 'User wallet address to query staking data for',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['staking'], operation: ['simulateStake', 'simulateUnstake'] } },
  default: '',
  description: 'Amount to stake or unstake in AAVE tokens',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['governance'], operation: ['getProposals', 'getProposal', 'getProposalVotes', 'simulateVote', 'getVotingPower', 'getUserVotes'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Avalanche', value: 'avalanche' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Base', value: 'base' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Harmony', value: 'harmony' },
    { name: 'Metis', value: 'metis' },
    { name: 'Gnosis', value: 'gnosis' },
    { name: 'BNB Chain', value: 'bnb' },
    { name: 'Scroll', value: 'scroll' }
  ],
  default: 'ethereum',
  description: 'The blockchain network to query',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['governance'], operation: ['getProposals'] } },
  options: [
    { name: 'All', value: 'all' },
    { name: 'Pending', value: 'pending' },
    { name: 'Active', value: 'active' },
    { name: 'Succeeded', value: 'succeeded' },
    { name: 'Defeated', value: 'defeated' },
    { name: 'Queued', value: 'queued' },
    { name: 'Executed', value: 'executed' },
    { name: 'Cancelled', value: 'cancelled' },
    { name: 'Expired', value: 'expired' }
  ],
  default: 'all',
  description: 'Filter proposals by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['governance'], operation: ['getProposals', 'getProposalVotes', 'getUserVotes'] } },
  default: 20,
  description: 'Number of results to return',
  typeOptions: { minValue: 1, maxValue: 1000 },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['governance'], operation: ['getProposals', 'getProposalVotes', 'getUserVotes'] } },
  default: 0,
  description: 'Number of results to skip',
  typeOptions: { minValue: 0 },
},
{
  displayName: 'Proposal ID',
  name: 'proposalId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['governance'], operation: ['getProposal', 'getProposalVotes', 'simulateVote'] } },
  default: '',
  description: 'The ID of the governance proposal',
},
{
  displayName: 'Support',
  name: 'support',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['governance'], operation: ['simulateVote'] } },
  options: [
    { name: 'Against', value: '0' },
    { name: 'For', value: '1' },
    { name: 'Abstain', value: '2' }
  ],
  default: '1',
  description: 'Vote support type',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['governance'], operation: ['simulateVote', 'getVotingPower', 'getUserVotes'] } },
  default: '',
  description: 'The user wallet address',
  placeholder: '0x...',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'lendingPool':
        return [await executeLendingPoolOperations.call(this, items)];
      case 'userAccount':
        return [await executeUserAccountOperations.call(this, items)];
      case 'flashLoan':
        return [await executeFlashLoanOperations.call(this, items)];
      case 'liquidation':
        return [await executeLiquidationOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      case 'governance':
        return [await executeGovernanceOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeLendingPoolOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aaveprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getReserves': {
          const poolAddress = this.getNodeParameter('poolAddress', i) as string;
          const network = this.getNodeParameter('network', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/pools/${poolAddress}/reserves`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              network,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getReserve': {
          const poolAddress = this.getNodeParameter('poolAddress', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;
          const network = this.getNodeParameter('network', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/pools/${poolAddress}/reserves/${asset}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              network,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateDeposit': {
          const poolAddress = this.getNodeParameter('poolAddress', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const user = this.getNodeParameter('user', i) as string;
          const network = this.getNodeParameter('network', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/pools/${poolAddress}/deposit`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              asset,
              amount,
              user,
              network,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateWithdraw': {
          const poolAddress = this.getNodeParameter('poolAddress', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const user = this.getNodeParameter('user', i) as string;
          const network = this.getNodeParameter('network', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/pools/${poolAddress}/withdraw`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              asset,
              amount,
              user,
              network,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateBorrow': {
          const poolAddress = this.getNodeParameter('poolAddress', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const user = this.getNodeParameter('user', i) as string;
          const interestRateMode = this.getNodeParameter('interestRateMode', i) as string;
          const network = this.getNodeParameter('network', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/pools/${poolAddress}/borrow`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              asset,
              amount,
              user,
              interestRateMode,
              network,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateRepay': {
          const poolAddress = this.getNodeParameter('poolAddress', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const user = this.getNodeParameter('user', i) as string;
          const network = this.getNodeParameter('network', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/pools/${poolAddress}/repay`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              asset,
              amount,
              user,
              network,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeUserAccountOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('aaveprotocolApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getUserSummary': {
					const userAddress = this.getNodeParameter('userAddress', i) as string;
					const poolAddress = this.getNodeParameter('poolAddress', i) as string;
					const network = this.getNodeParameter('network', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/users/${userAddress}/summary`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							poolAddress,
							network,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserReserves': {
					const userAddress = this.getNodeParameter('userAddress', i) as string;
					const poolAddress = this.getNodeParameter('poolAddress', i) as string;
					const network = this.getNodeParameter('network', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/users/${userAddress}/reserves`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							poolAddress,
							network,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserTransactions': {
					const userAddress = this.getNodeParameter('userAddress', i) as string;
					const network = this.getNodeParameter('network', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/users/${userAddress}/transactions`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							network,
							limit,
							offset,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getHealthFactor': {
					const userAddress = this.getNodeParameter('userAddress', i) as string;
					const poolAddress = this.getNodeParameter('poolAddress', i) as string;
					const network = this.getNodeParameter('network', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v2/users/${userAddress}/health-factor`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							poolAddress,
							network,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'simulateCollateralChange': {
					const userAddress = this.getNodeParameter('userAddress', i) as string;
					const asset = this.getNodeParameter('asset', i) as string;
					const enable = this.getNodeParameter('enable', i) as boolean;
					const network = this.getNodeParameter('network', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/v2/users/${userAddress}/collateral`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							asset,
							enable,
							network,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex: i,
					});
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeFlashLoanOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aaveprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const network = this.getNodeParameter('network', i) as string;

      switch (operation) {
        case 'getAvailableFlashLoans': {
          const poolAddress = this.getNodeParameter('poolAddress', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/flashloans/available`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              poolAddress,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateFlashLoan': {
          const assets = this.getNodeParameter('assets', i) as string;
          const amounts = this.getNodeParameter('amounts', i) as string;
          const modes = this.getNodeParameter('modes', i) as string;
          const params = this.getNodeParameter('params', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/flashloans/simulate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              assets: assets.split(',').map(asset => asset.trim()),
              amounts: amounts.split(',').map(amount => amount.trim()),
              modes: modes.split(',').map(mode => parseInt(mode.trim())),
              params,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFlashLoanFees': {
          const assets = this.getNodeParameter('assets', i) as string;
          const amounts = this.getNodeParameter('amounts', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/flashloans/fees`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              assets,
              amounts,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFlashLoanTransaction': {
          const txHash = this.getNodeParameter('txHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/flashloans/${txHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeLiquidationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aaveprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getLiquidationOpportunities': {
          const network = this.getNodeParameter('network', i) as string;
          const minProfit = this.getNodeParameter('minProfit', i) as number;
          const maxHealthFactor = this.getNodeParameter('maxHealthFactor', i) as number;

          const queryParams = new URLSearchParams({
            network,
            minProfit: minProfit.toString(),
            maxHealthFactor: maxHealthFactor.toString()
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/liquidations/opportunities?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'calculateLiquidation': {
          const user = this.getNodeParameter('user', i) as string;
          const collateralAsset = this.getNodeParameter('collateralAsset', i) as string;
          const debtAsset = this.getNodeParameter('debtAsset', i) as string;
          const debtToCover = this.getNodeParameter('debtToCover', i) as string;
          const network = this.getNodeParameter('network', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/liquidations/calculate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: {
              user,
              collateralAsset,
              debtAsset,
              debtToCover,
              network
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUserLiquidationData': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const poolAddress = this.getNodeParameter('poolAddress', i) as string;
          const network = this.getNodeParameter('network', i) as string;

          const queryParams = new URLSearchParams({
            network,
            ...(poolAddress && { poolAddress })
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/liquidations/${userAddress}?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateLiquidation': {
          const user = this.getNodeParameter('user', i) as string;
          const collateralAsset = this.getNodeParameter('collateralAsset', i) as string;
          const debtAsset = this.getNodeParameter('debtAsset', i) as string;
          const debtToCover = this.getNodeParameter('debtToCover', i) as string;
          const receiveAToken = this.getNodeParameter('receiveAToken', i) as boolean;
          const network = this.getNodeParameter('network', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/liquidations/simulate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: {
              user,
              collateralAsset,
              debtAsset,
              debtToCover,
              receiveAToken,
              network
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeStakingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aaveprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getStakingOverview': {
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/staking/overview?network=${network}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getUserStakingData': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/staking/${userAddress}?network=${network}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'simulateStake': {
          const amount = this.getNodeParameter('amount', i) as string;
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/staking/stake`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              amount,
              userAddress,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'simulateUnstake': {
          const amount = this.getNodeParameter('amount', i) as string;
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/staking/unstake`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              amount,
              userAddress,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'simulateClaimRewards': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/staking/claim`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              userAddress,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getClaimableRewards': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/staking/rewards/${userAddress}?network=${network}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeGovernanceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aaveprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const network = this.getNodeParameter('network', i) as string;

      switch (operation) {
        case 'getProposals': {
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams({
            network,
            ...(status !== 'all' && { status }),
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/governance/proposals?${queryParams.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProposal': {
          const proposalId = this.getNodeParameter('proposalId', i) as string;

          const queryParams = new URLSearchParams({ network });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/governance/proposals/${proposalId}?${queryParams.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProposalVotes': {
          const proposalId = this.getNodeParameter('proposalId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams({
            network,
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/governance/proposals/${proposalId}/votes?${queryParams.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateVote': {
          const proposalId = this.getNodeParameter('proposalId', i) as string;
          const support = this.getNodeParameter('support', i) as string;
          const userAddress = this.getNodeParameter('userAddress', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v2/governance/vote`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              proposalId,
              support,
              userAddress,
              network,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVotingPower': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;

          const queryParams = new URLSearchParams({ network });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/governance/users/${userAddress}/voting-power?${queryParams.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUserVotes': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams({
            network,
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v2/governance/users/${userAddress}/votes?${queryParams.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
