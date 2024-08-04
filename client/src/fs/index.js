async function mkdir(name) {
    return window["fs"].mkdir(name)
}

async function writeFile(filePath, file) {
    return window["fs"].writeFile(filePath, file)
}

export {
    mkdir,
    writeFile
}

