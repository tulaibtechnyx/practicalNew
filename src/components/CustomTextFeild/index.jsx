export default function CustomTextField({ placeholder, name, value, onChange, helperText, maxWidth = '260px', ...rest }) {
    const inputStyle = {
        borderRadius: "50px",
        border: "1px solid #ccc",
        padding: "14px 16px",
        fontSize: "16px",
        width: "100%",
        outline: "none",
        marginBottom: "16px",
        maxWidth: maxWidth,
        textAlign: 'center',
    };

    const placeholderStyle = {
        color: "grey",
        opacity: 1,
        fontWeight: 300,
    };

    return (
        <>
            <input
                type="text"
                style={{ ...inputStyle }}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                {...rest}
            />
            <style>
                {`
                input {
                    font-family: "EuclidCircularB" !important;
                    font-weight: 300 !important;
                }
                input::placeholder {
                    color: ${placeholderStyle.color};
                    opacity: ${placeholderStyle.opacity};
                    font-weight: ${placeholderStyle.fontWeight};
                }
                `}
            </style>
            {helperText && (
                <div style={{ color: 'rgb(244, 67, 54)', fontSize: "12px", marginTop: "-6px", marginLeft: '14px', marginBottom: '10px', fontFamily: "EuclidCircularB !important" }}>
                    {helperText}
                </div>
            )}
        </>
    );
}