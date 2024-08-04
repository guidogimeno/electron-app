import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import FileInput from "../../components/file_input/index.js"
import { saveReport } from "../../fs/reports/index.js"
import { generateId } from "../../utils/index.js"
import { GlobalContext } from "../../context/index.js"
import CustomError from "../../services/errors/index.js"

const STATE = {
    start: 0,
    in_progress: 1
}

function NewAnalysis() {
    const context = useContext(GlobalContext)
    const [formData, setFormData] = useState({ foo: "", bar: "" })
    const [report, setReport] = useState(null)
    const [state, setState] = useState(STATE.start)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    function handleChange(event) {
        setFormData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value
        }))
    }

    /**
    * @param {FileList} files 
    * */
    async function handleFiles(files) {
        console.log("files length", files.length)
        console.log("file name", files[0].name)
        console.log("file size", files[0].size)
        console.log("file type", files[0].type)
        console.log("file path", files[0].path)
        // 0. validar tamanio y tipo de archivo
        // 1. mostrar el formulario que tienen que llenar
        // 2. armar reporte en background, sumar una barra de progreso estaria bueno
        // 3. dar opcion de ver el reporte
        // 4. para ver, llevarlo a otra vista.
        // si toca New, tiene que volver a la pantalla inicial del New

        setState(STATE.in_progress)
        setIsAnalyzing(true)
        try {
            // simulo la creacion
            await new Promise(r => setTimeout(r, 1000));
            const generatedReport = {
                id: generateId(),
                name: files[0].name,
                images: [],
                content: "este es el super contenido"
            }
            setReport(generatedReport)
        } catch (error) {
            context.showFailure(error.message)
        } finally {
            setIsAnalyzing(false)
        }
    }

    function handleCancel() {
        setFormData({ foo: "", bar: "" })
        setIsAnalyzing(false)
        // TODO: interrumpir proceso de generacion de reporte
        setState(STATE.start)
    }

    function validateForm() {
        if (formData.foo.length < 3) {
            throw new CustomError("foo tiene que tener mas de 3 caracteres")
        }
        if (formData.bar.length < 3) {
            throw new CustomError("bar tiene que tener mas de 3 caracteres")
        }
    }

    function sendMetrics() {
        // mandar la info al backend, no hace falta guardarla en el reporte local
        // service.sendReportData(formData)
        console.log("enviando datos al backend...")
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            validateForm()
        } catch (error) {
            context.showFailure(error.message)
            return
        }

        try {
            sendMetrics()
        } catch (error) {
            console.log("Failed to send metrics", error)
        }

        try {
            await saveReport(report)
        } catch (error) {
            context.showFailure(error.message)
            return
        }

        // mandarlo a ver el reporte
        // navigateTo("/hy-hips/:id")
    }

    return (
        <Page>
            {state === STATE.in_progress ?
                <div>
                    <button onClick={handleCancel}>Cancel</button>
                    <form>
                        <label>Foo</label>
                        <input
                            id="foo"
                            name="foo"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label>Bar</label>
                        <input
                            id="bar"
                            name="bar"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {!isAnalyzing ?
                            <button type="submit" onClick={handleSubmit}>
                                Submit and go to report
                            </button>
                            : null}
                    </form>
                </div>
                :
                <>
                    <FileInput onFileDrop={handleFiles} />
                </>
            }
        </Page >
    )
}

export default NewAnalysis

