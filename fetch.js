const axios = require('axios');

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint 
 * @param {string} accessToken 
 */
async function callApi(endpoint, accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.get(endpoint, options);
        return response;
    } catch (error) {
        return error;
    }
};
async function postApi(endpoint, accessToken, data){
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json" 
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.post(endpoint, data, options);
        return response;
    } catch (error) {
        return error;
    }
}

async function putApi(endpoint, accessToken, data, content){
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": content
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.put(endpoint, data, options);
        return response;
    } catch (error) {
        return error;
    }
}
module.exports = {
    callApi: callApi,
    postApi: postApi,
    putApi: putApi
};