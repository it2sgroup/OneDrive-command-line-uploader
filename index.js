require("dotenv").config()
require('isomorphic-fetch')
const auth = require('./auth.js')
const fetch = require('./fetch')
const fs = require("fs")
const pathHandler = require('path')
const mime = require('mime')



async function main() {
    if (process.argv.indexOf("--help") != -1) {
            showHelp()
    } else {
        if (process.argv.indexOf("--file") != -1 && process.argv.indexOf("--groupId") != -1 && process.argv.indexOf("--endpoint") != -1 && process.argv.indexOf("--subPath") != -1) {

            const file = process.argv[process.argv.indexOf("--file") + 1]
            const groupId = process.argv[process.argv.indexOf("--groupId") + 1]
            const endpoint = process.argv[process.argv.indexOf("--endpoint") + 1]
            const subPath = process.argv[process.argv.indexOf("--endpoint") + 1]
            if(subPath == 'root'){
                subPath = "/"
            }
            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth()
            const day = date.getDate()
            const path = `/${year}/${month}/${day}`
            const folderDate = await checkDateFolder(auth, fetch, groupId, date, subPath, endpoint)
            if (folderDate) {
                const upload = await uploadFile(path, file, auth, fetch, groupId, subPath, endpoint)
                if(up)
                console.log("The upload was a success")
            } else {
                console.log("Error While Creating Subfolders")
            }



        } else {
            console.error("One of the following parameters are missing:\n --groupId \n --file \n --endpoint \n --subPath")
        }
    }
}

async function checkDateFolder(auth, fetch, groupId, date, subPath, endpoint) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const yearExist = await checkIfFolderExist(`/${year}`, auth, fetch, groupId, subPath, endpoint)
    const monthExist = await checkIfFolderExist(`/${year}/${month}`, auth, fetch, groupId, subPath, endpoint)
    const dayExist = await checkIfFolderExist(`/${year}/${month}/${day}`, auth, fetch, groupId, subPath, endpoint)

    if (typeof yearExist.response != "undefined") {
        if (yearExist.response.status == 404) {
            const resp = await createFolder(`${subPath}`, `${year}`, auth, fetch, groupId, endpoint)
            if (resp.status != 201) {
                return false
            }

        }
    }
    if (typeof monthExist.response != "undefined") {
        if (monthExist.response.status == 404) {
            const resp = await createFolder(`${subPath}${year}/`, `${month}`, auth, fetch, groupId, endpoint)
            if (resp.status != 201) {
                return false
            }
        }
    }
    if (typeof dayExist.response != "undefined") {
        if (dayExist.response.status == 404) {
            const resp = await createFolder(`${subPath}${year}/${month}/`, `${day}`, auth, fetch, groupId, endpoint)
            if (resp.status != 201) {
                return false
            }
        }
    }

    return true
}


async function checkIfFolderExist(path, auth, fetch, groupId, subPath, endpoint) {
    try {
        // Request AccessToken to msal-node in auth.js
        const authResponse = await auth.getToken(auth.tokenRequest)
        // Object Data Post to create new folder
        const checkFolder = await fetch.callApi(process.env.GRAPH_ENDPOINT + `${endpoint}${groupId}/drive/root:${subPath}${path}`, authResponse.accessToken)
        console.log("check Folder Request: ", checkFolder)
        return checkFolder
    } catch (error) {
        console.log(error)
        return error
    }


}


async function createFolder(path, folder, auth, fetch, groupId, endpoint) {
    try {
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
        const getItemId = await fetch.callApi(process.env.GRAPH_ENDPOINT + `${endpoint}${groupId}/drive/root:/${path}`, authResponse.accessToken)
        const parentId = getItemId.data.id
        const createFolderRequest = await fetch.postApi(process.env.GRAPH_ENDPOINT + `${endpoint}${groupId}/drive/items/${parentId}/children/`, authResponse.accessToken, driveItem)
        console.log("Create folder request:", createFolderRequest)
        return createFolderRequest
    } catch (error) {
        console.log(error)
        return error
    }
}

async function uploadFile(path, file, auth, fetch, groupId, subPath, endpoint) {
    try {
        const authResponse = await auth.getToken(auth.tokenRequest)

        fs.readFile(file, async function read(e, f) {
            var contentType = mime.getType(file)
            const filename = pathHandler.basename(file)
            const createFileRequest = await fetch.putApi(process.env.GRAPH_ENDPOINT + `${endpoint}${groupId}/drive/root:${subPath}${path}/${filename}:/content`, authResponse.accessToken, f, contentType)
            console.log("Create file request:", createFileRequest)
            return createFileRequest
        })
    } catch (error) {
        console.log(error)
        return error
    }
}


function showHelp(){
    console.log(`Use the following parameters to upload the file:
    --groupId 
    --file
    --endpoint 
    --subPath
    Don't forget to fill the .env file with the keys you obtained when registering the app on the azure console.
  Don't forget to correctly configure the application's permissions (FIles.readWrite,groups.readWrite) and etc.
    `)
}



main()