async function mkdir(name) {
    return window["fs"].mkdir(name)
}

async function writeFile(filePath, file) {
    return window["fs"].writeFile(filePath, file)
}

async function readFiles(filePath) {
    return window["fs"].readFiles(filePath)
}

async function readFile(filePath) {
    return window["fs"].readFile(filePath)
}

async function deleteDir(dirPath) {
    return window["fs"].deleteDir(dirPath)
}

async function deleteTempDir(dirPath) {
    return window["fs"].deleteTempDir(dirPath)
}


async function getPath() {
    return window["fs"].getPath()
}

async function moveDir(dirPath) {
    return window["fs"].moveDir(dirPath)
}

export {
    mkdir,
    writeFile,
    readFile,
    readFiles,
    deleteDir,
    deleteTempDir,
    getPath,
    moveDir
}

