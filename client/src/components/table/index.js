import React from "react"

function Table(props) {
    const data = props.data

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.date}</td>
                        <td><span onClick={() => {
                            // service.borrar pdf
                        }}>icono de borrar</span></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table

