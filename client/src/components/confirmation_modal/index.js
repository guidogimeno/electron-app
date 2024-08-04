import React from "react"
import { createPortal } from "react-dom"

function ConfirmationModal({ open, onClose }) {
    if (!open) return null

    return createPortal(
        <>
            <div className="modal-overlay" />
            <div className="modal">
                <button onClick={onClose}>x</button>
            </div >
        </>
        ,
        document.getElementById("portal")
    )
}

export default ConfirmationModal

