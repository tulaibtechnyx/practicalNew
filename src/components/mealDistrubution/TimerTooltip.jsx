import { Box, useMediaQuery } from '@mui/material';
import React, { useRef, useState } from 'react';
import AppColors from '@helpers/AppColors';

const TimerTooltip = (props) => {
    const {
        children,
        title = '',
        placement = "bottom",  // New prop for positioning
        positionBoxOnMobile = "translateX(-75%)",
        heading = '',
        matchesSmallTabletPosition = "translateX(-90%)",
        matchesSmallMobilePosition = "translateX(-80%)",
        fontSizechildren='11px'
    } = props;

    const [openTooltip, setOpenTooltip] = useState(false);
    const matchesSmallTablet = useMediaQuery("(max-width:1024px)");
    const matchesSmallMobile = useMediaQuery("(max-width:420px)");
    const matchesSmallWindow = useMediaQuery("(max-width:1295px)");

    const mouseEnter = () => setOpenTooltip(true);
    const mouseLeave = () => setOpenTooltip(false);

    const navRef = useRef(null);

    return (
        <div
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            style={{
                ...tooltipContainerStyle,
                transition: "ease-in-out 0.5s",
            }}
            ref={navRef}
            onClick={(e) => {
                e.stopPropagation();
                setOpenTooltip(!openTooltip);
                setTimeout(() => setOpenTooltip(false), 5000);
            }}
        >
            <Box sx={{
                width: '16px',
                height: '16px',
                borderRadius: '10px',
                backgroundColor: '#ed894e',
                color: 'white',
                fontSize: fontSizechildren,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {children}
            </Box>
            {/* Tooltip Box */}
            <div
                style={{
                    ...tooltipStyle2,
                    top: placement === "top" ? "auto" : "170%",  // Adjust based on placement
                    bottom: placement === "top" ? "170%" : "auto",
                    transform:
                        matchesSmallMobile ? positionBoxOnMobile :
                            matchesSmallTablet ? matchesSmallTabletPosition :
                                matchesSmallWindow ? matchesSmallMobilePosition :
                                    "translateX(-50%)",
                    visibility: openTooltip ? "visible" : "hidden",
                    opacity: openTooltip ? 1 : 0,
                    width: matchesSmallMobile ? "200px" : '300px',
                }}
            >
                {heading && <p style={{ marginTop: '0px', marginBottom: '5px' }}>{heading}</p>}
                {title}
            </div>

            {/* Tooltip Arrow */}
            <div
                style={{
                    ...triangleStyle,
                    top: placement === "top" ? "auto" : "8px",
                    bottom: placement === "top" ? "8px" : "auto",
                    transform: placement === "top" ? "translateX(-50%) rotate(0deg)" : "translateX(-50%) rotate(180deg)",
                    visibility: openTooltip ? "visible" : "hidden",
                    opacity: openTooltip ? 1 : 0,
                }}
            />
        </div>
    );
};

// Styles
export const DFJCAC = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

export const tooltipStyle = {
    ...DFJCAC,
    width: '13px',
    height: '13px',
    borderRadius: '10px',
    backgroundColor: '#ed894e',
    color: 'white',
    fontSize: '9px',
    border: `1px solid ${AppColors?.primaryOrange}`,
    position: 'relative',
    transition: 'ease-in-out 0.5s',
};

export const tooltipContainerStyle = {
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
};

const tooltipStyle2 = {
    position: "absolute",
    left: "50%",
    backgroundColor: "#179c79",
    color: "#fff",
    padding: "12px",
    borderRadius: "4px",
    fontSize: "12px",
    transition: "ease-in-out 0.5s",
    zIndex: 10,
    fontSize: '13px',
    fontFamily: 'EuclidCircularB,sans-serif',
    fontWeight: '300',
    textAlign: 'center',
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

const triangleStyle = {
    content: '""',
    position: "absolute",
    transition: "ease-in-out 0.5s",
    left: "50%",
    borderWidth: "10px",
    borderStyle: "solid",
    borderColor: "#179c79 transparent transparent transparent",
};

export default TimerTooltip;
