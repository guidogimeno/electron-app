import { post } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function track(data) {
    try {
        const body = {
            sex: data.sex,
            age: data.age,
            country: data.country,
            pain_level: data.painLevel,
            site_of_pain: data.siteOfPain,
            mos_since_symp: data.mosSinceSymp,
            sport: data.sport,
            sport_level: data.sportLevel,
            flexion: data.flexion,
            extension: data.extension,
            internal_rotation: data.internalRotation,
            external_rotation: data.externalRotation,
            craig_test: data.craigTest,
            fadir: data.fadir,
            faber: data.faber,
            log_roll: data.logRoll,
            ab_heer: data.abHeer
        }
        const res = await post("/metrics", { body: body })
        if (res.status !== 201) {
            throw new CustomError("failed to send metrics")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

export {
    track
}
