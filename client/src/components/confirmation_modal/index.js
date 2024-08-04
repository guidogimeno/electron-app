import React from "react"
import { createPortal } from "react-dom"

function ConfirmationModal({ open, onCancel, onConfirmation, children }) {
    if (!open) return null

    return createPortal(
        <>
            <div className="modal-overlay" />
            <div className="modal">
                {children}
                <button onClick={onCancel}>x</button>
                <button onClick={onConfirmation}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div >
        </>
        ,
        document.getElementById("portal")
    )
}

export default ConfirmationModal

