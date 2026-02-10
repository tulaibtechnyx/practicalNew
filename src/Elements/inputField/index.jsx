import React from "react"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import styles from "../inputField/input.module.scss"
import PropTypes from "prop-types"
import AppColors from "../../helpers/AppColors"
import clsx from "clsx"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import IconButton from "@mui/material/IconButton"
const InputField = (props) => {
  const {
    withIcon,
    placeholder,
    name,
    value,
    onChange,
    error,
    helperText,
    type,
    icon,
    length,
    defaultValue,
    disabled,
    customClass,  
    isExecutive,
    isAuthInputField = false,
    dontuseUserInput=false

  } = props
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  return (
    <div className={(`${styles.fieldWrapper} inputfieldStyle${isExecutive ? " isExecutive" : ""}${isAuthInputField ? " isAuthInputField" : ""}`)}>
      {withIcon ? (
        <TextField
          type={showPassword ? "text" : type}
          // type={type}
          hiddenLabel
          defaultValue={defaultValue}
          className={clsx(styles.userInputBoxImg, `${customClass ?? ""}`)}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          inputProps={{ maxLength: length }}
          InputProps={{
            sx: {
              borderRadius: 50,
              border: "1px solid white",
              color: AppColors.white
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      ) : (
        <TextField
          disabled={disabled}
          type={type}
          defaultValue={defaultValue}
          hiddenLabel
          className={clsx(dontuseUserInput ? "":styles.userInputBox, `${customClass ?? ""}`)}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          inputProps={{ maxLength: length }}
          InputProps={{
            sx: {
              borderRadius: 50,
              border: "1px solid white",
              color: AppColors.white
            }
          }}
        />
      )}
    </div>
  )
}
InputField.propTypes = {
  withIcon: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.any,
  helperText: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.node,
  length: PropTypes.number,
  disabled: PropTypes.bool
}
export default InputField
