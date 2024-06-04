async function getStoreValue(key) {
    return window["store"].getStoreValue(key)
}

async function setStoreValue(key, value) {
    return window["store"].setStoreValue(key, value)
}

export {
    getStoreValue,
    setStoreValue
}

