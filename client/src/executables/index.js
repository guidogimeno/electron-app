async function executeBin(fileName) {
    return window["bin"].execute(fileName)
}

export {
    executeBin
}
