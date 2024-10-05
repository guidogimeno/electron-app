async function generatePDF(content) {
    console.log("estoy aca", content)
    return window["pdf"].generatePDF(content)
}

export {
    generatePDF
}

