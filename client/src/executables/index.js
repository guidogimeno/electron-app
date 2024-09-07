async function executeBin(filePath) {
    return window["bin"].execute(filePath)
}

export {
    executeBin
}
