require("dotenv").config()
require('isomorphic-fetch')
const auth = require('./auth.js')
const fetch = require('./fetch')
const fs = require("fs")
const mime = require('mime')

async function testConnection(auth, fetch){
    try {
    const authResponse = await auth.getToken(auth.tokenRequest)
  
    //Check Folder Existence Test
     /*
    const checkFolder = await fetch.callApi(process.env.GRAPH_ENDPOINT + "v1.0/groups/bfae7394-ff46-465e-b7ec-1d845626e2b8/drive/root:/Red Team/Assessments",authResponse.accessToken)
        console.log(checkFolder) */
    // Create Folder Test
    /*
    var dataPost ={
        name: '02',
        folder: { },
        '@microsoft.graph.conflictBehavior': 'rename'
      }
    const createFolder = await fetch.postApi(process.env.GRAPH_ENDPOINT + "v1.0/groups/bfae7394-ff46-465e-b7ec-1d845626e2b8/drive/root/children/Red Team/children",authResponse.accessToken, dataPost)
    console.log(createFolder)
   
      // Create File Test
*/
      

fs.readFile('testfiles/test.txt', async function read(e, f){
    var contentType = mime.getType('testfiles/test.txt')
    const createFileRequest = await fetch.putApi(process.env.GRAPH_ENDPOINT + "v1.0/groups/bfae7394-ff46-465e-b7ec-1d845626e2b8/drive/root:/Red Team/Assessments/test.txt:/content", authResponse.accessToken, f, contentType)
    console.log("Create file request:", createFileRequest)

   })
    
   


}catch(error){
    console.log(error)
}
}

async function createFolder(path, folder, auth, fetch, groupId){
    try{
        // Request AccessToken to msal-node in auth.js
        const authResponse = await auth.getToken(auth.tokenRequest)
        // Object Data Post to create new folder
        var driveItem = {
            name: folder,
            folder: {},
            '@microsoft.graph.conflictBehavior': 'rename'
        }
        // Post Request to Create Folder using GraphAPI~  GET /groups/{group-id}/drive/root:/{item-path}
        // /groups/{group-id}/drive/items/{parent-item-id}/children
        const getItemId = await fetch.callApi(process.env.GRAPH_ENDPOINT + `v1.0/groups/${groupId}/drive/root:/${path}`, authResponse.accessToken)
        const parentId = getItemId.data.id
        const createFolderRequest = await fetch.postApi(process.env.GRAPH_ENDPOINT + `v1.0/groups/${groupId}/drive/items/${parentId}/children/`, authResponse.accessToken, driveItem)
        console.log("Create folder request:", createFolderRequest)
        return createFolderRequest
    }catch(error){
        console.log(error)
        return error
    }
}

createFolder("Red Team/Assessments/", "2021", auth, fetch, "bfae7394-ff46-465e-b7ec-1d845626e2b8")
//testConnection(auth, fetch)

/*


Sobre o code review, usam ferramentas para fazer análises?
não (Usar sonar +)


como é o cilco de desenvolvimento? (devOps e etc)

Existe uma preocupação quanto a segregação dos ambientes de dev, homolog e prod?
O prefeitura sim,
Atual não


* Call sobre desenvolvimento seguro
* Jira, Gitlab, Slacks


*/

/*
Secret
Desc: app
Valor: xLq.-HTNs8f68EGBR-njv7.6gUS~_DT0JR
Id secreto: e3842c04-8031-4056-a2ef-3dfb3ecb8ff9
Tenant id: 1afd3317-0934-4c2a-ba5d-1ba6a869aa64
Client: 5a6c1622-0476-4bfb-804c-e43f585b0d1a
*/ 

/*
Team ID: bfae7394-ff46-465e-b7ec-1d845626e2b8
*/
