import React from "react"
import Page from "../../components/page/index.js"
import FileInput from "../../components/file_input/index.js"

function NewAnalysis() {

    /**
    * @param {FileList} files 
    * */
    function handleFiles(files) {
        console.log("files length", files.length)
        console.log("file name", files[0].name)
        console.log("file size", files[0].size)
        console.log("file type", files[0].type)
        console.log("file path", files[0].path)

        // TODO: Validar tamanio y tipo de archivo
        const foo = window["fs"].writeFile("aver si llega esto")
        console.log("es una promesa o que es esto?", foo)
    }

    return (
        <Page>
            <FileInput onFileDrop={handleFiles} />
        </Page>
    )
}

export default NewAnalysis

