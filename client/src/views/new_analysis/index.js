import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import FileInput from "../../components/file_input/index.js"
import Spinner from "../../components/spinner/index.js"
import { saveReport } from "../../fs/reports/index.js"
import { generateId } from "../../utils/index.js"
import { GlobalContext } from "../../context/index.js"

function NewAnalysis() {
    const context = useContext(GlobalContext)
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState("")

    /**
    * @param {FileList} files 
    * */
    async function handleFiles(files) {
        setIsLoading(true)
        console.log("files length", files.length)
        console.log("file name", files[0].name)
        console.log("file size", files[0].size)
        console.log("file type", files[0].type)
        console.log("file path", files[0].path)

        // TODO: Validar tamanio y tipo de archivo
        // const foo = window["fs"].writeFile("aver si llega esto")
        try {
            setImage("src/assets/logo.png")
            setIsLoading(false)
            const report = {
                id: generateId(),
                name: files[0].name,
                images: [],
                content: "este es el super contenido"
            }

            await saveReport(report)
        } catch (error) {
            context.showFailure(error.message)
        }
    }

    return (
        <Page>
            {isLoading ?
                <Spinner /> :
                <>
                    {image ? <img src={image} className="analysis-image" /> :
                        <FileInput onFileDrop={handleFiles} />
                    }
                </>
            }
        </Page >
    )
}

export default NewAnalysis

