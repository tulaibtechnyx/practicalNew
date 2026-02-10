import AppColors from '@helpers/AppColors';
import { Tooltip, Typography } from '@mui/material';
import React from 'react'

const DisabledComponentWrapper = (props) => {
    const {
        isDisabled,
        tooltipMessage,
        children,
        bottom = false,
        opacity = "0.5",
        right = false,
        showTooltipIcon = false,
    } = props;
    const DisabledStyles = {
        pointerEvents: "none",
        opacity: opacity,
        // filter: "grayscale(0.7)",
    };
    if (isDisabled) {
        return (
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        position: "absolute",
                        top: !bottom && '-14px',
                        bottom: bottom && '-12px',
                        left: !right && "0%",
                        right: right && "-1%",
                        // left: "54%",
                        // transform: "translateX(-50%)",
                    }}
                >
                    {
                        showTooltipIcon &&
                        <Tooltip
                            leaveTouchDelay={10000000}
                            enterTouchDelay={50}
                            title={tooltipMessage}
                            placement="top"
                            arrow
                        >

                            <Typography
                                style={{
                                    borderRadius: '10px',
                                    color: 'white',
                                    backgroundColor: AppColors.primaryOrange,
                                    padding: '5px',
                                    height: '6px',
                                    width: '6px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '12px'
                                }}
                            >
                                i
                            </Typography>
                        </Tooltip>
                    }
                </div>
                <div style={{ ...DisabledStyles }}>
                    {children}
                </div>
            </div>
        )
    } else {
        return <>{children}</>
    }
}

export default DisabledComponentWrapper