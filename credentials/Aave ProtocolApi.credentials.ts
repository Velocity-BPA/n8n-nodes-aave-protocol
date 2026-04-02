import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AaveProtocolApi implements ICredentialType {
	name = 'aaveProtocolApi';
	displayName = 'Aave Protocol API';
	documentationUrl = 'https://docs.aave.com/developers/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key for Aave Protocol API authentication',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://aave-api-v2.aave.com',
			required: true,
			description: 'Base URL for the Aave Protocol API',
		},
	];
}