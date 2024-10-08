async function generatePDF(content) {
    return window["pdf"].generatePDF(content)
}

export {
    generatePDF
}

