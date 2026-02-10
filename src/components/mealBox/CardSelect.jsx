import React from "react"
import { Typography } from "@mui/material"
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

export default function SelectToComp({
  optionData,
  Title,
  value,
  onChange,
  placeholder,
  cardInfo,
  removeCard,
  selectedCard
}) {
  const handleOnChange = (event) => {
    onChange(event.target.value)
  }
  return (
    <div className="selectWrapped">
      <FormControl sx={{ width: "100%", margin: "10px 0" }}>
        <Typography variant="body2" sx={{ marginBottom: "10px" }}>
          {Title}
        </Typography>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleOnChange}
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
          {optionData.length > 0 ? (
            optionData.map((val, index) => {
              return (
                <MenuItem value={val.id} key={index}>
                  <img src={val.cardImg} alt={`${val.brand}`} />
                  <div className="secFlex">
                    <span>{val.card_number}</span>
                    <button onClick={() => removeCard(val.id)}>
                      <img
                        src={
                          AppDataConstant.cardRemoveIcon
                        }
                        alt={""}
                      />
                    </button>
                  </div>
                </MenuItem>
              )
            })
          ) : (
            <p>No Card Found</p>
          )}
        </Select>
      </FormControl>
    </div>
  )
}
SelectToComp.propTypes = {
  Title: PropTypes.string,
  placeholder: PropTypes.string
}
