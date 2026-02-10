import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import { Typography } from "@mui/material"
import { useState, useEffect } from "react"
import useMediaQuery from "@mui/material/useMediaQuery"
import Minus from "../../../public/images/icons/minus-circle.svg"
export default function ProtienPop(props) {
  const {
    view,
    open,
    handleClose,
    onConfirm,
    protein,
    popUpData,
    proteinId,
    onDelete,
    isExtraProteins,
    proteinPaymentStatus,
    isExecutive
  } = props
  const [value, setValue] = useState(null)
  const [error, setError] = useState(false)
  const [details, setDetails] = useState({
    gram: 0,
    price: 0
  })
  const [isRemove, setIsRemove] = useState(false);
  const matches = useMediaQuery("(max-width:767px)")

  const handleChange = (id) => {
    setValue(id)
    // popUpData(id)
    setError(false)
  }

  const findSelectedGramId = (grammage) => {
    if (protein && protein.extra_proteins_gram.length > 0) {
      const selectedId = protein.extra_proteins_gram?.find(
        (val) => val?.gram == grammage
      )
      if (selectedId) {
        return selectedId?.id
      } else {
        return null
      }
    } else {
      return null
    }
  }

  useEffect(() => {
    if (proteinId && isExtraProteins) {
      setValue(findSelectedGramId(proteinId))
    } else {
      setValue(null)
    }
  }, [proteinId, open, isExtraProteins])

  const handleConfirm = (id) => {
    if (!id) {
      setError(true)
    } else {
      onConfirm(id)
    }
  }

  const handleClosePopup = () => {
    if (error) {
      setValue(null), setError(false), handleClose()
    } else {
      setValue(null), handleClose(), setIsRemove(false)
    }
  }

  const handleRemoveProtein = () => {
    setValue(null), onDelete()
  }

  const handleDisclaimer = (gram, price) => {
    if(price && gram){
      return `You are removing ${gram}g of protein, your wallet will be credited with ${price} AED.`
    }

    return ""
  }

  const handleUpdate = () => {
    if(details.price && details.gram && proteinPaymentStatus || isRemove){
      handleRemoveProtein()
      setDetails({gram: 0, price: 0})
    }else{
      handleConfirm(value)
    }

    handleClosePopup();
  }

  const handleCancel = () => {
    if(details.price && details.gram){
      setDetails({gram: 0, price: 0})
    }
    if(isRemove){
      setIsRemove(false);
    }
  }

  const handleRemove = (gram, price) => {
    if(proteinPaymentStatus && gram && price){
      setDetails({ gram, price})
    }else{
      setIsRemove(true);
      // handleRemoveProtein(), handleClosePopup();
    }
  }

  const proteinValueFinder = (gram) => {
    if(gram && typeof gram == 'number'){
      const proteinObj = protein?.extra_proteins_gram?.find((val) => val?.id == gram);
      if(typeof proteinObj == 'object'){
        return proteinObj;
      }
    }

    return null;
  }

  const isDetails = (isRemove) => {
    if(details?.gram && details?.price || isRemove){
      return true
    }

    return false
  }

  return (
    <Dialog open={open} onClose={handleClose} className={`infoPop protien ${isExecutive ? "isExecutive" : ""}`}>
      <DialogTitle
        variant="h1"
        sx={{
          textAlign: "center",
          color: isExecutive ? AppColors.primaryOrange :  AppColors.primaryGreen,
          padding: "36px 24px 20px 24px;"
        }}
      >
        Add Protein
      </DialogTitle>
      <Typography>Type: {protein?.name}</Typography>
      <DialogContent>
        <FormControl>
          {protein &&
            protein.extra_proteins_gram.length > 0 &&
            protein.extra_proteins_gram.map((inner, index) => {
              return (
                <RadioGroup
                  key={index}
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={(e) =>
                    !view ? handleChange(e.target.value) : null
                  }
                >
                  <div className="radioWrap">
                    <FormControlLabel value={inner.id} disabled={details.price || details.gram || isRemove ? true : false} control={<Radio />} />
                    <div className="content">
                      <Typography className="calories">
                        {inner.calories} calories
                      </Typography>
                      <Typography className="equals">=</Typography>
                      <Typography className="calories">
                        {inner.gram} g Protein
                      </Typography>
                      <Typography
                        className="calories"
                        color={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                      >
                        (+ {inner.price} AED)
                      </Typography>
                      {value === inner.id && !view && (
                        <Typography
                          className="remove-cta"
                          onClick={() => handleRemove(inner.gram, inner.price)}
                          variant="contained"
                          style={{ marginBottom: "10px" }}
                          sx={{ cursor: "pointer" }}
                        >
                          <Minus />
                        </Typography>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              )
            })}
        </FormControl>

        {error && (
          <Typography sx={{ marginTop: "10px" }} color="error">
            Please select an option.
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        className="ButtonAction"
        sx={{
          justifyContent: "center",
          paddingBottom: "28px",
          flexWrap: "wrap"
        }}
      >
        {/* <Button
          className="Btn"
          disabled={!value}
          onClick={handleConfirm}
          variant="contained"
          style={{ marginBottom: "10px" }}
        >
          Confirm
        </Button> */}
        {
          isDetails() ? <Typography variant={'body3'} gutterBottom component="span" >{handleDisclaimer(details.gram, details.price)}</Typography> : null
        }
        {value && !view ? <>
          <Button
            className="Btn"
            onClick={handleUpdate}
            variant="contained"
            style={{ marginBottom: "10px" }}
          >
            Update
          </Button>
          {
            isDetails(isRemove) ?
          <Button
            className="Btn"
            onClick={handleCancel}
            variant="contained"
            style={{ marginBottom: "10px" }}
          >
            Cancel
          </Button> : null
          }
        </> : null}
        {matches && value && !isDetails() && !view && proteinValueFinder(value) && !isRemove ? (
          <Button
            className="Btn"
            onClick={() => handleRemove(proteinValueFinder(value)?.gram, proteinValueFinder(value)?.price)}
            variant="contained"
            style={{ marginBottom: "10px" }}
          >
            Remove
          </Button>
        ) : null}
        <Button

          className={`crossButton sty2 ${isExecutive ? "isExecutive" : ''}`}
          sx={{ color: isExecutive ? AppColors.primaryOrange : "red" }}
          onClick={handleClosePopup}
        >
          x
        </Button>
      </DialogActions>
    </Dialog>
  )
}
ProtienPop.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onConfirm: PropTypes.func,
  protein: PropTypes.object,
  popUpData: PropTypes.func,
  proteinId: PropTypes.number,
  onDelete: PropTypes.func
}
