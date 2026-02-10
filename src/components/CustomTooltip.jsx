import { styled, Tooltip, tooltipClasses } from '@mui/material';


const CustomStyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        fontWeight: '300',
        backgroundColor: '#179c78 !important',
        color: '#fff',
        border: 'none',
        fontSize: '13px ',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '200px',
        textAlign: 'center',
        fontFamily: 'EuclidCircularB,sans-serif'
    },
    [`& .${tooltipClasses.arrow}`]: {
        fontSize: '22px',
        borderWidth: '20px 20px 0 20px !important',
        color: '#179c78 !important',
    },
}));
const CustomStyledTooltipLightColor = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        fontWeight: '300',
        backgroundColor: '#fff !important',
        color: '#179c78',
        border: '1px solid #179c78',
        fontSize: '13px ',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '200px',
        textAlign: 'center',
        fontFamily: 'EuclidCircularB,sans-serif'
    },
    [`& .${tooltipClasses.arrow}`]: {
        fontSize: '22px',
        borderWidth: '20px 20px 0 20px !important',
        color: '#fff !important',
    },
}));

const CustomTooltip = ({ theme = 'primary', title, children, ...props }) => {
    if (theme == 'primary'){
        return (
            <CustomStyledTooltip
                title={title}
                arrow
                {...props}
            >
                {children}
            </CustomStyledTooltip>
        )
    }else{
        return (
            <CustomStyledTooltipLightColor
                title={title}
                arrow
                {...props}
            >
                {children}
            </CustomStyledTooltipLightColor>
        )
    }
};

export default CustomTooltip;
