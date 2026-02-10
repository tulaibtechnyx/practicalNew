import React, { useState } from "react"
import { useTheme } from "@mui/material/styles"
import { Box, Typography, useMediaQuery } from "@mui/material"
import FormControl from "@mui/material/FormControl"
import PropTypes from "prop-types"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import AppDataConstant from "helpers/AppDataConstant"
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder"
]

function getStyles(name, personName, theme ) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

export default function SelectToComp({
  optionData,
  Title,
  value,
  onChange,
  placeholder,
  cardInfo,
  isExecutive,
  TitleDesc
}) {
  const theme = useTheme()
  const [personName, setPersonName] = useState([])

  const handleChange = (event) => {
    const {
      target: { value }
    } = event

    setPersonName(typeof value === "string" ? value.split(",") : value)
  }
  const matchesMediumMobile = useMediaQuery("(max-width:780px)");
  const matchesSmallMobile = useMediaQuery("(max-width:375px)");

  const styleSpace = matchesMediumMobile ? 
  {
    fontSize: '15px !important',
    minWidth:matchesSmallMobile ? '70px':'max-content',
  }:
  {
    fontSize:'20px !important',
    minWidth:'110px',
  }
  const styleSpaceforDesc = matchesMediumMobile ? 
  {
    fontSize:matchesSmallMobile?"13px !important":"12px !important",
    minWidth:'max-content',
  }:
  {
    fontSize:'16px !important',
    minWidth:'110px'
  }
  return (
    <Box className={`selectWrapped ${isExecutive ? "isExecutive" : ''}`}
    >
      <FormControl sx={{ width: "100%", margin: "10px 0",
        maxWidth:'100%'
       }}>
        <Box sx={{
          display:'flex',
          marginBottom:'8px !important',
          flexWrap:matchesSmallMobile&&'wrap'
        }}  >
        <Typography
            sx={{ 
              ...styleSpace,
              pr:matchesSmallMobile ? "4px" : "6px",
              color:"black !important",
              fontWeight:"400 !important"


             }}>  
          {Title}
        </Typography>
        <Typography
            sx={{ 
              ...styleSpaceforDesc
             }}>  
          {TitleDesc}
        </Typography>
        </Box>
        {cardInfo ? (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            onChange={() => console.log("this is  in")}
            onSelect={() => console.log("This is selected======")}
            sx={{
              "& .MuiSelect-select .notranslate::after": placeholder
                ? {
                    content: `"${placeholder}"`,
                    opacity: 0.42
                  }
                : {},
              borderRadius: "50px",
              textAlign: "left"
            }}
          >
            {optionData.length > 0 &&
              optionData.map((val, index) => (
                <MenuItem value={val.id} key={index}>
                  <img src={val.cardImg} alt="" />
                  <div className="secFlex">
                    <span>{val.CardNum}</span>
                    <button>
                      <img src={AppDataConstant.cardRemoveIcon} alt="" />
                    </button>
                  </div>
                </MenuItem>
              ))}
          </Select>
        ) : (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              "& .MuiSelect-select .notranslate::after": placeholder
                ? {
                    content: `"${placeholder}"`,
                    opacity: 0.42
                  }
                : {},
              borderRadius: "50px",
              textAlign: "left"
            }}
          >
            {optionData.length > 0 &&
              optionData.map((val, index) => (
                <MenuItem value={val.id} key={index}>
                  {val.title}
                </MenuItem>
              ))}
          </Select>
        )}
      </FormControl>
    </Box>
  )
}
SelectToComp.propTypes = {
  Title: PropTypes.string,
  placeholder: PropTypes.string
}
