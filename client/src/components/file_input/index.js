import React, { useState, useRef } from "react"

const FileInput = ({ onFileDrop }) => {
    const dropRef = useRef(null)
    const fileInputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)

    function handleDragOver(e) {
        e.preventDefault()
        setIsDragging(true)
    }

    function handleDragLeave(e) {
        e.preventDefault()
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
            return
        }
        setIsDragging(false)
    }

    function handleDrop(e) {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        onFileDrop(files)
    }

    function triggerFileInput() {
        fileInputRef.current.click()
    }

    return (
        <div className="dropzone-container">
            <div
                className="dropzone"
                ref={dropRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => onFileDrop(e.target.files)}
                    ref={fileInputRef}
                />
                <button className="select-file" onClick={triggerFileInput}>
                    {isDragging ?
                        <p className="p1">Suelta los archivos aqui para subirlos</p> :
                        <div>
                            <p className="p1">Arrastra aqui los archivos</p>
                            <p className="p2">o tan solo haz click aqui</p>
                        </div>}
                </button>
            </div>
        </div>
    )
}

export default FileInput

