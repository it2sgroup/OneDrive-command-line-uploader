const msal = require('@azure/msal-node');
const axios = require('axios')

/*
Secret
Desc: app
Valor: xLq.-HTNs8f68EGBR-njv7.6gUS~_DT0JR
Id secreto: e3842c04-8031-4056-a2ef-3dfb3ecb8ff9
Tenant id: 1afd3317-0934-4c2a-ba5d-1ba6a869aa64
Client: 5a6c1622-0476-4bfb-804c-e43f585b0d1a
*/ 

const msalConfig = {
	auth: {
		clientId: process.env.CLIENT_ID,
		authority: process.env.AAD_ENDPOINT + process.env.TENANT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	}
};

const tokenRequest = {
	scopes: [process.env.GRAPH_ENDPOINT + '.default'],
};

const apiConfig = {
	uri: process.env.GRAPH_ENDPOINT + 'v1.0/users',
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

/**
 * Acquires token with client credentials.
 * @param {object} tokenRequest 
 */
async function getToken(tokenRequest) {
	
	return await cca.acquireTokenByClientCredential(tokenRequest);
}

module.exports = {
	apiConfig: apiConfig,
	tokenRequest: tokenRequest,
	getToken: getToken
};
