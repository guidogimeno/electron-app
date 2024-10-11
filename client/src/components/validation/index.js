// validateForm.js
export function validateFormData(formData, requiredFields) {
    let errors = {}

    for (const key of requiredFields) {
        if (!formData[key] || String(formData[key]).trim().length === 0) {
            errors[key] = "Este campo es obligatorio";
        }
    }

    return errors;
}