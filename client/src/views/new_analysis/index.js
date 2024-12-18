import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import { useNavigate } from "react-router-dom"
import FileInput from "../../components/file_input/index.js"
import { GlobalContext } from "../../context/index.js"
import { track } from "../../services/metrics/index.js"
import Spinner from "../../components/spinner/index.js"
import { executeBin } from "../../executables/index.js"
import { updateReport, moveReport, removeTempReport } from "../../fs/reports/index.js"
import { validateFormData } from "../../components/validation/index.js";

const STATE = {
    start: 0,
    in_progress: 1,
}

// Los numeros tambien son strings por defecto, null no se puede
// porque son inputs con valores "controlados". En el back 
// despues se castean a Ints.
const emptyForm = {
    idPatient: "",
    sex: "femenino",
    age: "",
    country: "argentina",
    painLevel: "sin datos",
    siteOfPain: "sin datos",
    mosSinceSymp: "",
    sport: "sin datos",
    sportLevel: "sin datos",
    flexion: "",
    extension: "",
    internalRotation: "",
    externalRotation: "",
    craigTest: "",
    fadir: "desconocido",
    faber: "desconocido",
    logRoll: "desconocido",
    abHeer: "desconocido",
}

function NewAnalysis() {
    const context = useContext(GlobalContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState(emptyForm)
    const [reportId, setReportId] = useState(null)
    const [state, setState] = useState(STATE.start)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [submiting,setSubmiting] = useState(false)

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

    function validate() {
        setFormErrors({})
        const errors = validateFormData(formData, Object.keys(formData), {})
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // TODO: Aca falta algun tipo de loading
    async function handleSubmit(event) {
        event.preventDefault()

        if (validate()) {
            setSubmiting(true)
            try {
                await Promise.all([
                    track(formData),
                    updateReport(reportId, formData.idPatient, formData.age, formData)
                ])
            } catch (error) {
                console.error("Failed to modify angulos.json", error)
            }

            // mover caperta de temp-reports a reports
            try {
                await moveReport(reportId)
            } catch (error) {
                context.showFailure(error.message)
            }
            setSubmiting(false)
            navigate(`/my_hips/${reportId}`)
            
        }
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
                <h1>La tomografía se está procesando... </h1>
                <h2>
                    Por favor, completá el siguiente formulario de forma precisa. Esta información se utilizará para futuras estadísticas y análisis de pacientes. Tu colaboración es de suma importancia.
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
                                    className={`input ${formErrors.idPatient ? 'error' : ''}`}
                                    required
                                />
                                {formErrors.idPatient && <p className="error-message">{formErrors.idPatient}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="sex">Sexo</label>
                                <select
                                    id="sex"
                                    name="sex"
                                    form="metrics-form"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className={`select ${formErrors.sex ? 'error' : ''}`}
                                    required
                                >
                                    <option value="femenino">Femenino</option>
                                    <option value="masculino">Masculino</option>
                                </select>
                                {formErrors.sex && <p className="error-message">{formErrors.sex}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="age">Edad</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className={`input ${formErrors.age ? 'error' : ''}`}
                                    required
                                />
                                {formErrors.age && <p className="error-message">{formErrors.age}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="country">Pais de Nacimiento</label>
                                <select
                                    id="country"
                                    name="country"
                                    form="metrics-form"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={`select ${formErrors.country ? 'error' : ''}`}
                                    required
                                >
                                    <option value="argentina">Argentina</option>
                                </select>
                                {formErrors.country && <p className="error-message">{formErrors.country}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="painLevel">Grado de dolor</label>
                                <select
                                    id="painLevel"
                                    name="painLevel"
                                    form="metrics-form"
                                    value={formData.painLevel}
                                    onChange={handleChange}
                                    className={`select ${formErrors.painLevel ? 'error' : ''}`}
                                    required
                                >
                                    <option value="sin datos">N/D</option>
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
                                {formErrors.painLevel && <p className="error-message">{formErrors.painLevel}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="siteOfPain">Sitio del dolor</label>
                                <select
                                    id="siteOfPain"
                                    name="siteOfPain"
                                    form="metrics-form"
                                    value={formData.siteOfPain}
                                    onChange={handleChange}
                                    className={`select ${formErrors.siteOfPain ? 'error' : ''}`}
                                    required
                                >
                                    <option value="sin datos">N/D</option>
                                    <option value="ingle">Ingle</option>
                                    <option value="nalga">Nalga</option>
                                    <option value="lateral">Lateral</option>
                                    <option value="muslo">Muslo</option>
                                    <option value="dolor en forma de c">Dolor en forma de "C"</option>
                                    <option value="lumbar">Lumbar</option>
                                    <option value="otro">Otro</option>
                                </select>
                                {formErrors.siteOfPain && <p className="error-message">{formErrors.siteOfPain}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="mosSinceSymp">Meses desde el inicio de s&iacute;ntomas</label>
                                <input
                                    id="mosSinceSymp"
                                    name="mosSinceSymp"
                                    type="number"
                                    value={formData.mosSinceSymp}
                                    onChange={handleChange}
                                    className={`input ${formErrors.mosSinceSymp ? 'error' : ''}`}
                                    required
                                />
                                {formErrors.mosSinceSymp && <p className="error-message">{formErrors.mosSinceSymp}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="sport">Deporte que practica</label>
                                <select
                                    id="sport"
                                    name="sport"
                                    form="metrics-form"
                                    value={formData.sport}
                                    onChange={handleChange}
                                    className={`select ${formErrors.sport ? 'error' : ''}`}
                                    required
                                >
                                    <option value="sin datos">N/D</option>
                                    <option value="futbol">Futbol</option>
                                    <option value="hockey">Hockey</option>
                                    <option value="tenis">Tenis</option>
                                    <option value="voleybol">Voleybol</option>
                                    <option value="tenis de mesa">Tenis de mesa</option>
                                    <option value="basketl">Basketball</option>
                                    <option value="baseball">Baseball</option>
                                    <option value="rugby">Rugby</option>
                                    <option value="golf">Golf</option>
                                    <option value="badminton">Badminton</option>
                                    <option value="football">Football</option>
                                    <option value="boxing">Boxeo</option>
                                    <option value="atletismo">Atletismo</option>
                                    <option value="natacion">Nataci&oacute;n</option>
                                    <option value="ciclismo">Ciclismo</option>
                                    <option value="handball">Handball</option>
                                    <option value="esquiar">Esqu&iacute;</option>
                                    <option value="gimnasia">Gimnasia</option>
                                    <option value="artes marciales">Artes marciales</option>
                                    <option value="otros">Otros</option>
                                </select>
                                {formErrors.sport && <p className="error-message">{formErrors.sport}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="sportLevel">Nivel de deporte</label>
                                <select
                                    id="sportLevel"
                                    name="sportLevel"
                                    form="metrics-form"
                                    value={formData.sportLevel}
                                    onChange={handleChange}
                                    className={`select ${formErrors.sportLevel ? 'error' : ''}`}
                                    required
                                >
                                    <option value="sin datos">N/D</option>
                                    <option value="recreacional">Recreacional</option>
                                    <option value="amateur">Amateur</option>
                                    <option value="profesional">Profesional</option>
                                </select>
                                {formErrors.sportLevel && <p className="error-message">{formErrors.sportLevel}</p>}
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
                                    className={`input ${formErrors.flexion ? 'error' : ''}`}
                                    required
                                />
                                {formErrors.flexion && <p className="error-message">{formErrors.flexion}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="extension">Extensi&oacute;n</label>
                                <input
                                    id="extension"
                                    name="extension"
                                    type="number"
                                    value={formData.extension}
                                    onChange={handleChange}
                                    className={`input ${formErrors.extension ? 'error' : ''}`}
                                    required
                                />
                                {formErrors.extension && <p className="error-message">{formErrors.extension}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="internalRotation">Rotaci&oacute;n interna (con flexi&oacute;n de cadera a 90°)</label>
                                <input
                                    id="internalRotation"
                                    name="internalRotation"
                                    type="number"
                                    value={formData.internalRotation}
                                    onChange={handleChange}
                                    className={`input ${formErrors.internalRotation ? 'error' : ''}`}
                                    required
                                />
                                {formErrors.internalRotation && <p className="error-message">{formErrors.internalRotation}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="externalRotation">Rotaci&oacute;n externa (con flexi&oacute;n de cadera a 90°)</label>
                                <input
                                    id="externalRotation"
                                    name="externalRotation"
                                    type="number"
                                    value={formData.externalRotation}
                                    onChange={handleChange}
                                    className={`input ${formErrors.externalRotation ? 'error' : ''}`}
                                    required
                                />
                                {formErrors.externalRotation && <p className="error-message">{formErrors.externalRotation}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="craigTest">Prueba de Craig</label>
                                <input
                                    id="craigTest"
                                    name="craigTest"
                                    type="number"
                                    value={formData.craigTest}
                                    onChange={handleChange}
                                    className={`input ${formErrors.craigTest ? 'error' : ''}`}
                                    required
                                />
                                {formErrors.craigTest && <p className="error-message">{formErrors.craigTest}</p>}
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
                                    className={`select ${formErrors.fadir ? 'error' : ''}`}
                                    required
                                >
                                    <option value="positivo">Positivo</option>
                                    <option value="negativo">Negativo</option>
                                    <option value="no evaluado">No evaluado</option>
                                    <option value="desconocido">Desconocido</option>
                                </select>
                                {formErrors.fadir && <p className="error-message">{formErrors.fadir}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="faber">Faber</label>
                                <select
                                    id="faber"
                                    name="faber"
                                    form="metrics-form"
                                    value={formData.faber}
                                    onChange={handleChange}
                                    className={`select ${formErrors.faber ? 'error' : ''}`}
                                    required
                                >
                                    <option value="positivo">Positivo</option>
                                    <option value="negativo">Negativo</option>
                                    <option value="no evaluado">No evaluado</option>
                                    <option value="desconocido">Desconocido</option>
                                </select>
                                {formErrors.faber && <p className="error-message">{formErrors.faber}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="logRoll">Log Roll</label>
                                <select
                                    id="logRoll"
                                    name="logRoll"
                                    form="metrics-form"
                                    value={formData.logRoll}
                                    onChange={handleChange}
                                    className={`select ${formErrors.logRoll ? 'error' : ''}`}
                                    required
                                >
                                    <option value="positivo">Positivo</option>
                                    <option value="negativo">Negativo</option>
                                    <option value="no evaluado">No evaluado</option>
                                    <option value="desconocido">Desconocido</option>
                                </select>
                                {formErrors.logRoll && <p className="error-message">{formErrors.logRoll}</p>}
                            </div>
                            <div className="label-select">
                                <label htmlFor="abHeer">AB Heer</label>
                                <select
                                    id="abHeer"
                                    name="abHeer"
                                    form="metrics-form"
                                    value={formData.abHeer}
                                    onChange={handleChange}
                                    className={`select ${formErrors.abHeer ? 'error' : ''}`}
                                    required
                                >
                                    <option value="positivo">Positivo</option>
                                    <option value="negativo">Negativo</option>
                                    <option value="no evaluado">No evaluado</option>
                                    <option value="desconocido">Desconocido</option>
                                </select>
                                {formErrors.abHeer && <p className="error-message">{formErrors.abHeer}</p>}
                            </div>
                        </section>
                    </div>
                    { isAnalyzing? <Spinner /> :
                        <button className="primary-button" type="submit" onClick={handleSubmit}>
                           {submiting? <Spinner />: "Confirmar y ver el reporte"}
                        </button>
                    }
                    <button className="tertiary-button" onClick={handleCancel}>Cancelar</button>
                </form>
            </div>
        </Page >
    )
}

export default NewAnalysis

