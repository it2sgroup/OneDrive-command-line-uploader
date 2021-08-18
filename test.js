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

/*Test command:
https://teams.microsoft.com/l/team/19%3a5ea7a4774126428c8e972137bc43c2d3%40thread.skype/conversations?groupId=44d0302f-d137-4793-b14e-55e6f93481e3&tenantId=1afd3317-0934-4c2a-ba5d-1ba6a869aa64

groupId = 44d0302f-d137-4793-b14e-55e6f93481e3
file = testfiles/modos.pdf
endpoint = 1.0/groups/
subPath = Red Team/Assessments
https://teams.microsoft.com/l/team/19%3aIDzQYP61C1xS5QOzY9V0IwPAnNfIycFoC3N_VJkEeHk1%40thread.tacv2/conversations?groupId=dcd49d0e-eb48-4c0d-97fd-39153aab97b6&tenantId=1afd3317-0934-4c2a-ba5d-1ba6a869aa64

node index.js --groupId 44d0302f-d137-4793-b14e-55e6f93481e3 --file testfiles/modos.pdf --endpoint v1.0/groups/ --subPath "Red Team/Assessments"

node index.js --groupId dcd49d0e-eb48-4c0d-97fd-39153aab97b6 --file testfiles/modos.pdf --endpoint v1.0/groups/ --subPath "Red Team/Assessments"


Git toke: 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



*/