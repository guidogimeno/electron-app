export function validateFormData(formData, requiredFields, customMessages) {
    const errors = {};

    requiredFields.forEach(key => {
        if (!formData[key] || formData[key].trim() === "") {
            errors[key] = customMessages[key] || "Este campo es obligatorio";
        }
    });
    return errors;
}