import { post, put, del } from "../../services/index.js"
import CustomError from "../errors/index.js"

async function createUser(user) {
    try {
        const body = {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password,
            job_title: user.jobTitle,
            academic_title: user.academicTitle,
            country: user.country,
            state: user.state,
            city: user.city,
            institution: user.institution
        }
        const res = await post("/user", { body: body })
        if (res.status !== 201) {
            throw new CustomError("failed to signup")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

async function updateUser(user) {
    try {
        const res = await put("/user", { body: user })
        if (res.status !== 200) {
            throw new CustomError("failed to update user")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}

async function deleteUser() {
    try {
        const res = await del("/user")
        if (res.status !== 200) {
            throw new CustomError("failed to delete user")
        }
        return res.data
    } catch (error) {
        throw new CustomError(error.message)
    }
}


export {
    createUser,
    updateUser,
    deleteUser
}

