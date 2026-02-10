import { Tooltip, Typography, useTheme } from '@mui/material';
import CustomTooltip from './CustomTooltip';
import AppColors from '@helpers/AppColors';

const CustomText = ({
    color ='rgb(0, 0, 0)',
    variant = 'h5',
    fontSize = '13px',
    children,
    padding = '0px 0px 0px 0px',
    headingType = 'text',
    textTransform = false,
    bold = false,
    semibold = false,
    nowrap = false,
    sx,
    onClick,
    className = '',
    title = '',
    delay = 800,
    placement,
    fieldLabel = false,
    arrow = true,
    disabled = false,
    tooltipTheme = "primary",
    ...otherProps
}) => {
    const theme = useTheme();
    return (
        <CustomTooltip
            theme={tooltipTheme}
            enterNextDelay={delay}
            placement={placement}
            title={title ? <div style={{ maxHeight: '35vh', overflowY: 'auto' }}>{title}</div> : ''}
            arrow={arrow}
        >
            <Typography
                sx={{
                    ...sx, marginBottom: fieldLabel && '7px',
                    margin: "0px",
                    fontFamily: "EuclidCircularB, sans-serif",
                    fontSize:{
                        md:fontSize,
                        xs:12
                    },
                    lineHeight: "1.3",
                    letterSpacing: "0px",
                    fontWeight: "300",
                    display: "block",
                    color: disabled ? 'rgba(0, 0, 0, 0.38)' : color,

                }}
                className={className}
                variant={headingType === 'text' ? 'h6' : variant}
                textTransform={textTransform ? 'capitalize' : 'none'}
                noWrap={nowrap}
                fontWeight={bold ? 'bold' : semibold ? 600 : 'normal'}
                p={padding}
                onClick={!disabled ? onClick : undefined}
                {...otherProps}
            >
                {children}
            </Typography>
        </CustomTooltip>
    );
};

export default CustomText;
