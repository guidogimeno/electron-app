import React from "react"
import Page from "../../components/page/index.js"
import FileInput from "../../components/file_input/index.js"

function NewAnalysis() {
    return (
        <Page>
            <FileInput onFileDrop={(files) => console.log("dropeaste esto", files)} />
        </Page>
    )
}

export default NewAnalysis

