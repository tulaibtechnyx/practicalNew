import AppColors from '@helpers/AppColors';
import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const CustomDropdown = ({ matchesSmallMobile, options, selectedValue, onChange, isDisabled, widthDrop = '', AlloOpen = false, showComma = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    const handleOptionClick = (value, disabled) => {
        if (disabled) return;
        onChange(value);
        setIsOpen(false);
    };
    React.useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);


    return (
        <div
            ref={dropdownRef}
            style={{
                position: 'relative', display: 'inline-block',
                width: widthDrop ? widthDrop : 'max-content',
                marginRight: '5px'
            }}>
            {/* Toggle Button */}
            <div
                onClick={() => !isDisabled && AlloOpen && setIsOpen(!isOpen)}
                style={{
                    borderRadius: '4px',
                    backgroundColor: isDisabled ? '#f5f5f5' : '#fff',
                    color: isDisabled ? '#aaa' : AppColors?.primaryGreen,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    textAlign: widthDrop ? "center" : 'left',
                    fontSize: matchesSmallMobile ? '11px' : '14px',
                    display: AlloOpen && 'flex',
                    alignItems: AlloOpen && 'center',
                    gap: AlloOpen && '10px',
                    justifyContent: AlloOpen && 'end',
                }}
            >
                {options.find((opt) => opt.value === selectedValue)?.label || 'Select'}{showComma && ','}
                {
                    (AlloOpen && !showComma) &&
                    (isOpen ?
                        <KeyboardArrowUpIcon />
                        :
                        <KeyboardArrowDownIcon />)
                }
            </div>

            {/* Dropdown Options */}
            {isOpen && !isDisabled && (
                <div
                    style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        width: '100%',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        zIndex: 1000,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {options.map(({ value, label, disabled }) => (
                        <div
                            key={value}
                            onClick={() => handleOptionClick(value, disabled)}
                            style={{
                                padding: '8px',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                color: disabled ? '#aaa' : '#000',
                                backgroundColor: disabled ? '#f9f9f9' : '#fff',
                                textAlign: 'center',
                                borderBottom: '1px solid #eee',
                                hover: disabled ? null : { backgroundColor: '#ddd' },
                                fontSize: '12px'
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};



export default CustomDropdown