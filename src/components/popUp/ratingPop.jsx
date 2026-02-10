import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { Typography } from "@mui/material"
import { fontWeight } from "@mui/system"
import Rating from "@mui/material/Rating"
import { TextField } from "@mui/material"
import * as yup from "yup"
import { Formik, Field } from "formik"
import { FeedbackOutlined } from "@mui/icons-material"
import { UpcomingOrdersRequest } from "../../store/reducers/dashboardReducer"
import { useDispatch } from "react-redux"
import AppLogger from "../../helpers/AppLogger"
import Chilli from "../../../public/images/icons/chilli.svg"
import { customTimeout } from "helpers/ShortMethods"
export default function RatingPop({
  open,
  handleClose,
  currentMeal,
  value,
  submitPress,
  setValue,
  isExecutive
}) {
  // const [value, setValue] = useState(0)
  const initialValues = {
    feedback: ""
  }
  const [refresh, setRefresh] = useState(false)
  const [message, setMessage] = useState(false)

  const validationSchema = yup.object().shape({
    // feedback: yup.string().required("feedback is required")
  })
  return (
    <Dialog open={open} onClose={handleClose} className={`infoPop sty4 ${isExecutive ? "isExecutive" : ""}`}>
      <DialogTitle
        variant="h1"
        sx={{
          textAlign: "center",
          color: isExecutive? AppColors.primaryOrange : AppColors.primaryGreen,
          padding: "28px 24px 0px 24px;"
        }}
      >
        Your Feedback
      </DialogTitle>
      <DialogContent sx={{ padding: "17px 27px" }}>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            margin: "0 auto",
            maxWidth: "270px",
            color: AppColors.darkGrey,
            textAlign: "center",
            paddingBottom: "9px",
            fontSize: "15px !important"
          }}
        >
          Please rate your {currentMeal?.meals?.type ?? "custom meal"}
        </DialogContentText>
        <div className="FeedbackWrap">
          <div className="image">
            {currentMeal?.meals?.is_chilli ? <Chilli /> : null}
            <img src={currentMeal?.meals?.image} alt="" />
          </div>
          <Typography
            component={"p"}
            variant="body3"
            sx={{
              margin: "0 auto",
              maxWidth: "270px",
              color: AppColors.darkGrey,
              textAlign: "center",
              paddingBottom: "9px",
              fontSize: "15px !important",
              fontWeight: "500",
              paddingTop: "20px"
            }}
          >
            {currentMeal?.meals?.title}
          </Typography>
          <div className="ratingSec">
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue)
              }}
            />
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (value == 0) {
              setMessage(true)
              customTimeout(() => {
                setMessage(false)
              }, 4000)
            }
            if (value > 0) {
              submitPress({ feedback: values.feedback, value })
              setRefresh(!refresh)
            }
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field name="feedback">
                {({ field, form: { touched, errors }, meta }) => (
                  <TextField
                    className="textarea"
                    {...field}
                    id="feedback"
                    multiline
                    error={Boolean(touched.feedback && errors.feedback)}
                    helperText={touched.feedback && errors.feedback}
                    placeholder={`Tell us how was your ${
                      currentMeal?.meals?.type ?? "custom meal"
                    }!`}
                    minRows={4}
                  />
                )}
              </Field>
              <DialogActions
                sx={{
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingBottom: "28px",
                  paddingTop: "30px"
                }}
              >
                {message ? (
                  <Typography
                    sx={{ marginBottom: "15px" }}
                    color={AppColors.lightRed}
                  >
                    Rating is required
                  </Typography>
                ) : null}
                <Button
                  className="Btn"
                  type="submit"
                  variant="contained"
                  // onClick={()=>submitPress(value,feedback)}
                  sx={{
                    background: AppColors.white,
                    borderColor: AppColors.white,
                    color: AppColors.white,
                    minWidth: "231px",
                    "&:hover": {
                      backgroundColor: AppColors.white
                    }
                  }}
                >
                  Submit
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
        {/* <TextField
            className="textarea"
            // variant="outlined"
            multiline
            // value={addressBody.address}
            // defaultValue={addressBody.address}
            // helperText={formik.touched.address && formik.errors.address}
            // error={formik.touched.address && formik.errors.address}
            // required
            // name="address"
            placeholder="Tell us how was your meal!"
            minRows={6}
            // maxRows={4}
            // onChange={(e) => {
            //   formik.handleChange(e)
            //   setAddressBody({ ...addressBody, address: e.target.value })
            // }}
          /> */}
      </DialogContent>
    </Dialog>
  )
}
RatingPop.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
