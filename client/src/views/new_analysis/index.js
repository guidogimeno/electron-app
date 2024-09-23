import React, { useContext, useState } from "react"
import Page from "../../components/page/index.js"
import { useNavigate } from "react-router-dom"
import FileInput from "../../components/file_input/index.js"
import { GlobalContext } from "../../context/index.js"
import CustomError from "../../services/errors/index.js"
import { track } from "../../services/metrics/index.js"
import Spinner from "../../components/spinner/index.js"
import { executeBin } from "../../executables/index.js"

const STATE = {
    start: 0,
    in_progress: 1
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

    function handleCancel() {
        setFormData(emptyForm)
        setIsAnalyzing(false)
        // TODO: interrumpir proceso de generacion de reporte
        // e incluso, eliminar las carpetas creadas que no debe
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
                            <h3>Personal Information</h3>
                            <div className="label-select">
                                <label htmlFor="sex">Sex</label>
                                <select
                                    id="sex"
                                    name="sex"
                                    form="metrics-form"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </select>
                            </div>
                            <div className="label-input">
                                <label htmlFor="age">Age</label>
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
                                <label htmlFor="country">Country of origin</label>
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
                                <label htmlFor="painLevel">Pain</label>
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
                                <label htmlFor="siteOfPain">Site of pain</label>
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
                                    <option value="groin">Groin</option>
                                    <option value="buttock">Buttock</option>
                                    <option value="lateral">Lateral</option>
                                    <option value="thigh">Thigh</option>
                                    <option value="c_shapedPain">"C"-shaped pain</option>
                                    <option value="lumbar">Lumbar</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="label-input">
                                <label htmlFor="mosSinceSymp">Months since symptoms</label>
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
                                <label htmlFor="sport">Sport</label>
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
                                    <option value="soccer">Soccer</option>
                                    <option value="field_hockey">Field Hockey</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="volleyball">Volleyball</option>
                                    <option value="table_tennis">Table Tennis</option>
                                    <option value="basketball">Basketball</option>
                                    <option value="baseball">Baseball</option>
                                    <option value="rugby">Rugby</option>
                                    <option value="golf">Golf</option>
                                    <option value="badminton">Badminton</option>
                                    <option value="football">Football</option>
                                    <option value="boxing">Boxing</option>
                                    <option value="athletics">Athletics</option>
                                    <option value="swimming">Swimming</option>
                                    <option value="cycling">Cycling</option>
                                    <option value="handball">Handball</option>
                                    <option value="skiing">Skiing</option>
                                    <option value="gymnastics">Gymnastics</option>
                                    <option value="martial_arts">Martial Arts</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="label-select">
                                <label htmlFor="sportLevel">Sport level</label>
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
                                    <option value="recreational">Recreational</option>
                                    <option value="amateur">Amateur</option>
                                    <option value="professional">Professional</option>
                                </select>
                            </div>
                        </section>
                        <section>
                            <h3>Physical Examination</h3>
                            <div>
                                <h4>Range of motion</h4>
                            </div>
                            <div className="label-input">
                                <label htmlFor="flexion">Flexion</label>
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
                            <div className="label-input">
                                <label htmlFor="extension">Extension</label>
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
                            <div className="label-input">
                                <label htmlFor="internalRotation">Internal rotation (at 90° hip flexion)</label>
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
                            <div className="label-input">
                                <label htmlFor="externalRotation">External rotation (at 90° hip flexion)</label>
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
                            <div className="label-input">
                                <label htmlFor="craigTest">Craig test</label>
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
                                <h4>Tests</h4>
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
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                    <option value="not_evaluated">Not evaluated</option>
                                    <option value="unknown">Unknown</option>
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
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                    <option value="not_evaluated">Not evaluated</option>
                                    <option value="unknown">Unknown</option>
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
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                    <option value="not_evaluated">Not evaluated</option>
                                    <option value="unknown">Unknown</option>
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
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                    <option value="not_evaluated">Not evaluated</option>
                                    <option value="unknown">Unknown</option>
                                </select>
                            </div>
                        </section>
                    </div>
                    {isAnalyzing ? <Spinner /> :
                        <button className="primary-button" type="submit" onClick={handleSubmit}>
                            Submit and go to report
                        </button>
                    }
                    <button className="tertiary-button" onClick={handleCancel}>Cancelar</button>
                </form>
            </div>
        </Page >
    )
}

export default NewAnalysis

