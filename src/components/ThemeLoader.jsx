import React from 'react'
import { useSelector } from 'react-redux'

const ThemeLoader = (props) => {
    const { top = '50%', zIndex= 99 } = props;
    const { isExecutive } = useSelector((state) => state.auth)

    return (
        <div className={`lds-ellipsis ${isExecutive ? 'isExecutive' : ''}`} style={{
            display: "block",
            top: top,
            position:'relative',
            zIndex:zIndex
        }}>
            <div style={{top:'75px'}} ></div>
            <div style={{top:'75px'}} ></div>
            <div style={{top:'75px'}} ></div>
            <div style={{top:'75px'}} ></div>
        </div>
    )
}

export default ThemeLoader