import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import { useNavigate } from "react-router-dom"
import FileInput from "../../components/file_input/index.js"
import { GlobalContext } from "../../context/index.js"
import CustomError from "../../services/errors/index.js"
import { track } from "../../services/metrics/index.js"
import Spinner from "../../components/spinner/index.js"
import { executeBin } from "../../executables/index.js"
import { updateReport, moveReport, removeTempReport } from "../../fs/reports/index.js"

const STATE = {
    start: 0,
    in_progress: 1,
}

// Los numeros tambien son strings por defecto, null no se puede
// porque son inputs con valores "controlados". En el back 
// despues se castean a Ints.
const emptyForm = {
    sex: "female",
    age: "",
    country: "argentina",
    painLevel: "no_data",
    siteOfPain: "no_data",
    mosSinceSymp: "",
    sport: "no_data",
    sportLevel: "no_data",
    flexion: "",
    extension: "",
    internalRotation: "",
    externalRotation: "",
    craigTest: "",
    fadir: "unknown",
    faber: "unknown",
    logRoll: "unknown",
    abHeer: "unknown",
}

function NewAnalysis() {
    const context = useContext(GlobalContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState(emptyForm)
    const [reportId, setReportId] = useState(null)
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

        setState(STATE.in_progress)
        setIsAnalyzing(true)
        try {
            const analysisId = await executeBin(files[0].path)
            console.log(`result after executing binary: ${analysisId}`)
            setReportId(analysisId)
        } catch (error) {
            context.showFailure(error.message)
        } finally {
            setIsAnalyzing(false)
        }
    }

    async function handleCancel() {
        setFormData(emptyForm)
        setIsAnalyzing(false)
        // TODO: interrumpir proceso de generacion de reporte
        // e incluso, eliminar las carpetas creadas que no debe

        if (reportId) {
            try {
                await removeTempReport(reportId)
            } catch (error) {
                context.showFailure(error.message)
            }
        }

        setState(STATE.start)
    }

    function validateForm() {
        for (const key of Object.keys(formData)) {
            if (String(formData[key]).length == 0) {
                throw new CustomError(`The ${key} field cannot be empty`)
            }
        }
    }

    // TODO: Aca falta algun tipo de loading
    async function handleSubmit(event) {
        event.preventDefault()

        try {
            validateForm()
        } catch (error) {
            context.showFailure(error.message)
            return
        }

        try {
            await track(formData)
        } catch (error) {
            console.error("Failed to send metrics", error)
        }

        try {
            await updateReport(reportId, formData.idPatient, formData.age)
        } catch(error) {
            console.error("Failed to modify angulos.json", error)
        }

        // mover caperta de temp-reports a reports
        try {
            await moveReport(reportId)
        } catch (error) {
            context.showFailure(error.message)
        }

        navigate(`/my_hips/${reportId}`)
    }

    if (state === STATE.start) {
        return (
            <Page>
                <FileInput onFileDrop={handleFiles} />
            </Page>
        )
    }

    return (
        <Page>
            <div className="metrics-form-container">
                <h1>Form</h1>
                <h2>
                    Please complete the following questions with accurate data. Help us improve the AI model to suggest more accurate diagnoses and further functionalities. Your collaboration is vital (all information must be anonymous).
                </h2>
                <form id="metrics-form">
                    <div className="sections-container">
                        <section>
                            <h3>Informaci&oacute;n Personal</h3>
                            <div className="label-select">
                                <label htmlFor="idPatient">Id del Paciente</label>
                                <input
                                    id="idPatient"
                                    name="idPatient"
                                    type="number"
                                    value={formData.idPatient}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="label-select">
                                <label htmlFor="sex">Sexo</label>
                                <select
                                    id="sex"
                                    name="sex"
                                    form="metrics-form"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="female">Femenino</option>
                                    <option value="male">Masculino</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="age">Edad</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="label-select">
                                <label htmlFor="country">Pais de Nacimiento</label>
                                <select
                                    id="country"
                                    name="country"
                                    form="metrics-form"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="argentina">Argentina</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="painLevel">Grado de dolor</label>
                                <select
                                    id="painLevel"
                                    name="painLevel"
                                    form="metrics-form"
                                    value={formData.painLevel}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="no_data">N/D</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="siteOfPain">Sitio del dolor</label>
                                <select
                                    id="siteOfPain"
                                    name="siteOfPain"
                                    form="metrics-form"
                                    value={formData.siteOfPain}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="no_data">N/D</option>
                                    <option value="groin">Ingle</option>
                                    <option value="buttock">Nalga</option>
                                    <option value="lateral">Lateral</option>
                                    <option value="thigh">Muslo</option>
                                    <option value="c_shapedPain">Dolor en forma de "C"</option>
                                    <option value="lumbar">Lumbar</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="mosSinceSymp">Meses desde el inicio de s&iacute;ntomas</label>
                                <input
                                    id="mosSinceSymp"
                                    name="mosSinceSymp"
                                    type="number"
                                    value={formData.mosSinceSymp}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="label-select">
                                <label htmlFor="sport">Deporte que practica</label>
                                <select
                                    id="sport"
                                    name="sport"
                                    form="metrics-form"
                                    value={formData.sport}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="no_data">N/D</option>
                                    <option value="soccer">Futbol</option>
                                    <option value="field_hockey">Hockey</option>
                                    <option value="tennis">Tenis</option>
                                    <option value="volleyball">Voleybol</option>
                                    <option value="table_tennis">Tenis de mesa</option>
                                    <option value="basketball">Basketball</option>
                                    <option value="baseball">Baseball</option>
                                    <option value="rugby">Rugby</option>
                                    <option value="golf">Golf</option>
                                    <option value="badminton">Badminton</option>
                                    <option value="football">Football</option>
                                    <option value="boxing">Boxeo</option>
                                    <option value="athletics">Atletismo</option>
                                    <option value="swimming">Nataci&oacute;n</option>
                                    <option value="cycling">Ciclismo</option>
                                    <option value="handball">Handball</option>
                                    <option value="skiing">Esqu&iacute;</option>
                                    <option value="gymnastics">Gimnasia</option>
                                    <option value="martial_arts">Artes marciales</option>
                                    <option value="other">Otros</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="sportLevel">Nivel de deporte</label>
                                <select
                                    id="sportLevel"
                                    name="sportLevel"
                                    form="metrics-form"
                                    value={formData.sportLevel}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="no_data">N/D</option>
                                    <option value="recreational">Recreacional</option>
                                    <option value="amateur">Amateur</option>
                                    <option value="professional">Profesional</option>
                                </select>
                            </div>
                        </section>
                        <section>
                            <h3>Examen f&iacute;sico</h3>
                            <div>
                                <h4>Rango de movimiento</h4>
                            </div>
                            <div className="label-select">
                                <label htmlFor="flexion">Flexi&oacute;n</label>
                                <input
                                    id="flexion"
                                    name="flexion"
                                    type="number"
                                    value={formData.flexion}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="label-select">
                                <label htmlFor="extension">Extensi&oacute;n</label>
                                <input
                                    id="extension"
                                    name="extension"
                                    type="number"
                                    value={formData.extension}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="label-select">
                                <label htmlFor="internalRotation">Rotaci&oacute;n interna (con flexi&oacute;n de cadera a 90°)</label>
                                <input
                                    id="internalRotation"
                                    name="internalRotation"
                                    type="number"
                                    value={formData.internalRotation}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="label-select">
                                <label htmlFor="externalRotation">Rotaci&oacute;n externa (con flexi&oacute;n de cadera a 90°)</label>
                                <input
                                    id="externalRotation"
                                    name="externalRotation"
                                    type="number"
                                    value={formData.externalRotation}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="label-select">
                                <label htmlFor="craigTest">Prueba de Craig</label>
                                <input
                                    id="craigTest"
                                    name="craigTest"
                                    type="number"
                                    value={formData.craigTest}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <h4>Pruebas</h4>
                            </div>
                            <div className="label-select">
                                <label htmlFor="fadir">Fadir</label>
                                <select
                                    id="fadir"
                                    name="fadir"
                                    form="metrics-form"
                                    value={formData.fadir}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="positive">Positivo</option>
                                    <option value="negative">Negativo</option>
                                    <option value="not_evaluated">No evaluado</option>
                                    <option value="unknown">Desconocido</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="faber">Faber</label>
                                <select
                                    id="faber"
                                    name="faber"
                                    form="metrics-form"
                                    value={formData.faber}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="positive">Positivo</option>
                                    <option value="negative">Negativo</option>
                                    <option value="not_evaluated">No evaluado</option>
                                    <option value="unknown">Desconocido</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="logRoll">Log Roll</label>
                                <select
                                    id="logRoll"
                                    name="logRoll"
                                    form="metrics-form"
                                    value={formData.logRoll}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="positive">Positivo</option>
                                    <option value="negative">Negativo</option>
                                    <option value="not_evaluated">No evaluado</option>
                                    <option value="unknown">Desconocido</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="abHeer">AB Heer</label>
                                <select
                                    id="abHeer"
                                    name="abHeer"
                                    form="metrics-form"
                                    value={formData.abHeer}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="positive">Positivo</option>
                                    <option value="negative">Negativo</option>
                                    <option value="not_evaluated">No evaluado</option>
                                    <option value="unknown">Desconocido</option>
                                </select>
                            </div>
                        </section>
                    </div>
                    {isAnalyzing ? <Spinner /> :
                        <button className="primary-button" type="submit" onClick={handleSubmit}>
                            Confirmar y ver el reporte
                        </button>
                    }
                    <button className="tertiary-button" onClick={handleCancel}>Cancelar</button>
                </form>
            </div>
        </Page >
    )
}

export default NewAnalysis

