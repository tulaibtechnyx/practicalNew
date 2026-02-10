import { Checkbox, styled } from '@mui/material';
import React from 'react'
import AppColors from "@helpers/AppColors";

const RoundCheckboxStyle = styled(Checkbox)({
    "&.MuiCheckbox-root": {
      padding: 0,
      border: `2px solid ${AppColors.primaryGreen}`,
      marginRight:'10px',
    },
    "& .MuiSvgIcon-root": {
      borderRadius: "50%",
      width: 14,
      height: 14,
      border: "2px solid white",
      "path":{
        display:'none'
      }
    },
    "&.Mui-checked .MuiSvgIcon-root": {
      backgroundColor: `${AppColors.primaryGreen}`,
      border: "2px solid white",
    },
    "&.Mui-checked .MuiSvgIcon-root:after": {
      content: '""',
      display: "block",
      width: 12,
      height: 12,
      backgroundColor: "white",
      borderRadius: "50%",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  });
  
  function RoundCheckbox({ disabled, checked, onChange, name }) {
    return (
      <RoundCheckboxStyle
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        name={name}
      />
    );
  }
  
export default RoundCheckbox