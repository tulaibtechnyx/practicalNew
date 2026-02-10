import React from 'react'
import { useSelector } from 'react-redux'

const SamllLoader = (props) => {
    const { isExecutive=false } = useSelector((state) => state.auth)
    return (
        <div className={`lds-ellipsis ${isExecutive ? 'isExecutive' : ''}`} style={{
        }}>
            <div style={{}} ></div>
            <div style={{}} ></div>
            <div style={{}} ></div>
            <div style={{}} ></div>
        </div>
    )
}

export default SamllLoader