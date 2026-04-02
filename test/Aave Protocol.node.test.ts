/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AaveProtocol } from '../nodes/Aave Protocol/Aave Protocol.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AaveProtocol Node', () => {
  let node: AaveProtocol;

  beforeAll(() => {
    node = new AaveProtocol();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Aave Protocol');
      expect(node.description.name).toBe('aaveprotocol');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('LendingPool Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://aave-api-v2.aave.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getReserves operation', () => {
    it('should get reserves successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getReserves')
        .mockReturnValueOnce('0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9')
        .mockReturnValueOnce('ethereum');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        reserves: [{ symbol: 'USDC', liquidityRate: '0.02' }]
      });

      const result = await executeLendingPoolOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.reserves).toBeDefined();
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://aave-api-v2.aave.com/v2/pools/0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9/reserves',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        qs: { network: 'ethereum' },
        json: true,
      });
    });

    it('should handle errors gracefully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getReserves')
        .mockReturnValueOnce('invalid-address')
        .mockReturnValueOnce('ethereum');
      
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid pool address'));

      const result = await executeLendingPoolOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid pool address');
    });
  });

  describe('simulateDeposit operation', () => {
    it('should simulate deposit successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('simulateDeposit')
        .mockReturnValueOnce('0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9')
        .mockReturnValueOnce('0xA0b86a33E6411c0bD8f8Ff3F45E5C41e47F9eD5A')
        .mockReturnValueOnce('1000000')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8DAE0a1234567890a')
        .mockReturnValueOnce('ethereum');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        gasEstimate: '150000'
      });

      const result = await executeLendingPoolOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
    });
  });

  describe('simulateBorrow operation', () => {
    it('should simulate borrow successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('simulateBorrow')
        .mockReturnValueOnce('0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9')
        .mockReturnValueOnce('0xA0b86a33E6411c0bD8f8Ff3F45E5C41e47F9eD5A')
        .mockReturnValueOnce('500000')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8DAE0a1234567890a')
        .mockReturnValueOnce('2')
        .mockReturnValueOnce('ethereum');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        healthFactor: '2.5'
      });

      const result = await executeLendingPoolOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
      expect(result[0].json.healthFactor).toBe('2.5');
    });
  });
});

describe('UserAccount Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://aave-api-v2.aave.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Aave Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getUserSummary operation', () => {
		it('should get user summary successfully', async () => {
			const mockResponse = {
				totalCollateralETH: '1000000000000000000',
				totalBorrowsETH: '500000000000000000',
				availableBorrowsETH: '400000000000000000',
				currentLiquidationThreshold: '8500',
				ltv: '7500',
				healthFactor: '1.7',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUserSummary')
				.mockReturnValueOnce('0x1234567890123456789012345678901234567890')
				.mockReturnValueOnce('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
				.mockReturnValueOnce('ethereum');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUserAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://aave-api-v2.aave.com/v2/users/0x1234567890123456789012345678901234567890/summary',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				qs: {
					poolAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					network: 'ethereum',
				},
				json: true,
			});
		});

		it('should handle errors when getting user summary', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUserSummary')
				.mockReturnValueOnce('invalid-address');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid user address'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeUserAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Invalid user address');
		});
	});

	describe('getUserReserves operation', () => {
		it('should get user reserves successfully', async () => {
			const mockResponse = {
				userReserves: [
					{
						underlyingAsset: '0xA0b86a33E6411c8bb77f3c4301070Da56e6e3',
						scaledATokenBalance: '1000000000000000000',
						usageAsCollateralEnabledOnUser: true,
						stableBorrowRate: '0',
						scaledVariableDebt: '0',
					},
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUserReserves')
				.mockReturnValueOnce('0x1234567890123456789012345678901234567890')
				.mockReturnValueOnce('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
				.mockReturnValueOnce('polygon');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUserAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getUserTransactions operation', () => {
		it('should get user transactions successfully', async () => {
			const mockResponse = {
				transactions: [
					{
						id: 'tx1',
						txHash: '0x123',
						action: 'Deposit',
						amount: '1000000000000000000',
						asset: 'USDC',
						timestamp: 1234567890,
					},
				],
				total: 1,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUserTransactions')
				.mockReturnValueOnce('0x1234567890123456789012345678901234567890')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(10);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUserAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getHealthFactor operation', () => {
		it('should get health factor successfully', async () => {
			const mockResponse = {
				healthFactor: '1.85',
				liquidationThreshold: '8500',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getHealthFactor')
				.mockReturnValueOnce('0x1234567890123456789012345678901234567890')
				.mockReturnValueOnce('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
				.mockReturnValueOnce('arbitrum');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUserAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('simulateCollateralChange operation', () => {
		it('should simulate collateral change successfully', async () => {
			const mockResponse = {
				healthFactorBefore: '1.85',
				healthFactorAfter: '2.1',
				liquidationThresholdBefore: '8500',
				liquidationThresholdAfter: '8750',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('simulateCollateralChange')
				.mockReturnValueOnce('0x1234567890123456789012345678901234567890')
				.mockReturnValueOnce('0xA0b86a33E6411c8bb77f3c4301070Da56e6e3')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('ethereum');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeUserAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://aave-api-v2.aave.com/v2/users/0x1234567890123456789012345678901234567890/collateral',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					asset: '0xA0b86a33E6411c8bb77f3c4301070Da56e6e3',
					enable: true,
					network: 'ethereum',
				},
				json: true,
			});
		});
	});
});

describe('FlashLoan Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://aave-api-v2.aave.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAvailableFlashLoans', () => {
    it('should successfully get available flash loans', async () => {
      const mockResponse = { availableAssets: ['0x123', '0x456'] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAvailableFlashLoans')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlashLoanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://aave-api-v2.aave.com/v2/flashloans/available',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        qs: {
          poolAddress: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
          network: 'mainnet',
        },
        json: true,
      });
    });

    it('should handle errors when getting available flash loans', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAvailableFlashLoans')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('0x123');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFlashLoanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('simulateFlashLoan', () => {
    it('should successfully simulate flash loan', async () => {
      const mockResponse = { simulation: { success: true, gasUsed: '150000' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('simulateFlashLoan')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('0x123,0x456')
        .mockReturnValueOnce('1000000000000000000,2000000000000000000')
        .mockReturnValueOnce('0,1')
        .mockReturnValueOnce('0x');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlashLoanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getFlashLoanFees', () => {
    it('should successfully get flash loan fees', async () => {
      const mockResponse = { fees: [{ asset: '0x123', fee: '9000000000000000' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFlashLoanFees')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('1000000000000000000');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlashLoanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getFlashLoanTransaction', () => {
    it('should successfully get flash loan transaction', async () => {
      const mockResponse = { txHash: '0x789', status: 'success' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFlashLoanTransaction')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('0x789abc');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFlashLoanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Liquidation Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://aave-api-v2.aave.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getLiquidationOpportunities operation', () => {
    it('should get liquidation opportunities successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLiquidationOpportunities')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce(0.01)
        .mockReturnValueOnce(1.0);

      const mockResponse = {
        opportunities: [
          {
            user: '0x123...',
            healthFactor: 0.95,
            collateralAsset: '0xabc...',
            debtAsset: '0xdef...',
            profitEstimate: 0.05
          }
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLiquidationOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://aave-api-v2.aave.com/v2/liquidations/opportunities?network=mainnet&minProfit=0.01&maxHealthFactor=1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle errors when getting liquidation opportunities', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getLiquidationOpportunities');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeLiquidationOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('calculateLiquidation operation', () => {
    it('should calculate liquidation successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('calculateLiquidation')
        .mockReturnValueOnce('0x123...')
        .mockReturnValueOnce('0xabc...')
        .mockReturnValueOnce('0xdef...')
        .mockReturnValueOnce('1000')
        .mockReturnValueOnce('mainnet');

      const mockResponse = {
        profitEstimate: 0.05,
        collateralReceived: '950',
        liquidationBonus: 0.05,
        gasEstimate: '150000'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLiquidationOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://aave-api-v2.aave.com/v2/liquidations/calculate',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: {
          user: '0x123...',
          collateralAsset: '0xabc...',
          debtAsset: '0xdef...',
          debtToCover: '1000',
          network: 'mainnet'
        },
        json: true
      });
    });

    it('should handle errors when calculating liquidation', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('calculateLiquidation');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Calculation failed'));

      const result = await executeLiquidationOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('Calculation failed');
    });
  });

  describe('getUserLiquidationData operation', () => {
    it('should get user liquidation data successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getUserLiquidationData')
        .mockReturnValueOnce('0x123...')
        .mockReturnValueOnce('0xpool...')
        .mockReturnValueOnce('mainnet');

      const mockResponse = {
        userAddress: '0x123...',
        healthFactor: 0.95,
        totalCollateral: '50000',
        totalDebt: '30000',
        liquidationThreshold: 0.8
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLiquidationOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://aave-api-v2.aave.com/v2/liquidations/0x123...?network=mainnet&poolAddress=0xpool...',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle errors when getting user liquidation data', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUserLiquidationData');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('User not found'));

      const result = await executeLiquidationOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('User not found');
    });
  });

  describe('simulateLiquidation operation', () => {
    it('should simulate liquidation successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('simulateLiquidation')
        .mockReturnValueOnce('0x123...')
        .mockReturnValueOnce('0xabc...')
        .mockReturnValueOnce('0xdef...')
        .mockReturnValueOnce('1000')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce('mainnet');

      const mockResponse = {
        transactionData: '0x...',
        gasEstimate: '150000',
        expectedProfit: 0.05,
        collateralReceived: '950'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLiquidationOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://aave-api-v2.aave.com/v2/liquidations/simulate',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        body: {
          user: '0x123...',
          collateralAsset: '0xabc...',
          debtAsset: '0xdef...',
          debtToCover: '1000',
          receiveAToken: true,
          network: 'mainnet'
        },
        json: true
      });
    });

    it('should handle errors when simulating liquidation', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('simulateLiquidation');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Simulation failed'));

      const result = await executeLiquidationOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('Simulation failed');
    });
  });
});

describe('Staking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://aave-api-v2.aave.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get staking overview successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getStakingOverview')
      .mockReturnValueOnce('ethereum');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      totalStaked: '1000000',
      totalRewards: '50000',
      apy: '7.5',
    });

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://aave-api-v2.aave.com/v2/staking/overview?network=ethereum',
      headers: {
        'X-API-Key': 'test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result[0].json.totalStaked).toBe('1000000');
  });

  it('should handle getUserStakingData errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getUserStakingData')
      .mockReturnValueOnce('0x123')
      .mockReturnValueOnce('ethereum');
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json.error).toBe('API Error');
  });

  it('should simulate stake successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('simulateStake')
      .mockReturnValueOnce('100')
      .mockReturnValueOnce('0x123')
      .mockReturnValueOnce('ethereum');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      transactionHash: '0xabc123',
      gasEstimate: '150000',
    });

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://aave-api-v2.aave.com/v2/staking/stake',
      headers: {
        'X-API-Key': 'test-key',
        'Content-Type': 'application/json',
      },
      body: {
        amount: '100',
        userAddress: '0x123',
        network: 'ethereum',
      },
      json: true,
    });
    expect(result[0].json.transactionHash).toBe('0xabc123');
  });

  it('should get claimable rewards successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getClaimableRewards')
      .mockReturnValueOnce('0x123')
      .mockReturnValueOnce('polygon');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      claimableRewards: '25.5',
      pendingRewards: '10.2',
    });

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result[0].json.claimableRewards).toBe('25.5');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Governance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://aave-api-v2.aave.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getProposals', () => {
    it('should get governance proposals successfully', async () => {
      const mockResponse = { data: [{ id: '1', title: 'Test Proposal' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProposals')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('active')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(0);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/v2/governance/proposals'),
        })
      );
    });

    it('should handle getProposals error', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getProposals');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProposal', () => {
    it('should get specific proposal successfully', async () => {
      const mockResponse = { data: { id: '1', title: 'Test Proposal' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProposal')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('1');

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProposalVotes', () => {
    it('should get proposal votes successfully', async () => {
      const mockResponse = { data: [{ voter: '0x123', support: 1 }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProposalVotes')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(0);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('simulateVote', () => {
    it('should simulate vote successfully', async () => {
      const mockResponse = { success: true, votingPowerUsed: '100' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('simulateVote')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('0x1234567890123456789012345678901234567890');

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getVotingPower', () => {
    it('should get user voting power successfully', async () => {
      const mockResponse = { data: { votingPower: '1000', propositionPower: '500' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getVotingPower')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('0x1234567890123456789012345678901234567890');

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUserVotes', () => {
    it('should get user votes successfully', async () => {
      const mockResponse = { data: [{ proposalId: '1', support: 1 }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getUserVotes')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce(0);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});
});
