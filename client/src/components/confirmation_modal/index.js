import React from "react"
import { createPortal } from "react-dom"

function ConfirmationModal({ open, onCancel, onConfirmation, children }) {
    if (!open) return null

    return createPortal(
        <>
            <div className="modal-overlay" />
            <div className="modal">
                <div className="modal-close">
                    <h4>Confirmation</h4>
                    <button onClick={onCancel}>x</button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
                <div className="modal-actions">
                    <button onClick={onConfirmation}>Confirm</button>
                    <button onClick={onCancel}>Cancel</button>
                </div >
            </div >
        </>
        ,
        document.getElementById("portal")
    )
}

export default ConfirmationModal

