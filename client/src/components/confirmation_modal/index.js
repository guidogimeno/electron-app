import React from "react"
import { createPortal } from "react-dom"

function ConfirmationModal({ open, onCancel, onConfirmation, children }) {
    if (!open) return null

    return createPortal(
        <>
            <div className="modal-overlay" />
            <div className="modal">
                <div className="modal-close">
                    <h4>Confirmación</h4>
                    <button onClick={onCancel} className="close-btn">x</button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-btn">Cancelar</button>
                    <button onClick={onConfirmation} className="delete-btn">Eliminar</button>
                </div>
            </div>
        </>

        ,
        document.getElementById("portal")
    )
}

export default ConfirmationModal

