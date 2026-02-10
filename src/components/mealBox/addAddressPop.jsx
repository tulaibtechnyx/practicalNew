import React, { useState, useEffect, useRef } from "react"
import { showFaliureToast, showSuccessToast } from "../../helpers/AppToast"
import AppConstants from "../../helpers/AppConstants"
import { TextField } from "@mui/material"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import { Dialog } from "@mui/material"
import { Button, Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import FormLabel from "@mui/material/FormLabel"
import RadioGroup from "@mui/material/RadioGroup"
import Radio from "@mui/material/Radio"

import InputField from "Elements/inputField"
import DatePicker from "react-multi-date-picker"
import CalenderSM from "../../../public/images/icons/calenderSM.svg"
import EditButtonAddress from "../../../public/images/icons/edit-svg.svg"
import Cross from "../../../public/images/icons/cross.svg"
import Tick from "../../../public/images/icons/tick.svg"

import EditButton from "../../../public/images/icons/edit-svg.svg"

import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik"
import * as yup from "yup"
import CardSelect from "./CardSelect"
import get from "lodash/get"
import AppLogger from "helpers/AppLogger"
import {
  addAddressRequest,
  deleteAddressRequest
} from "store/reducers/checkoutReducer"
import moment from "moment"
import { unwrapResult } from "@reduxjs/toolkit"
import { setDefaultAddressRequest } from "store/reducers/dashboardReducer"
import { updateAddressRequest } from "../../store/reducers/checkoutReducer"
import message from "../../helpers/AppErrors"
export default function AddAddressPop({
  type,
  open,
  handleClose,
  saveCardRequest,
  preferancesPop,
  updated,
  currentAddress
}) {
  const dispatch = useDispatch()
  const { userDetails } = useSelector((state) => state.auth)
  const { addresss } = useSelector((state) => state.home)
  const { isExecutive } = useSelector((state) => state.auth)
  const [addressBody, setAddressBody] = useState({
    address: "",
    label: "",
    address_id: "",
    type: ""
  })
  const [updateMode, setUpdateMode] = useState(false)
  const [deleteAddress, setdeleteAddress] = useState(false)

  const [addressDataLocal, setAddressDataLocal] = useState(null)
  const [userDetailsLocal, setUserDetailsLocal] = useState(false)
  const [currentId, setCurrentId] = useState("")
  const [deleteMode, setDeleteMode] = useState(false)
  const [AddCard, setAddCard] = useState(false)
  const accessToken = get(userDetailsLocal, "data.auth_token", "")

  const allAddress = get(addressDataLocal, "address", [])
  const defaultAddress = get(addressDataLocal, "default_address", null)

  // useEffect(() => {
  //   handleInitialValues()
  // }, [type])

  useEffect(() => {
    if (addresss) {
      setAddressDataLocal(addresss)
    }
  }, [addresss])

  useEffect(() => {
    editModeHandler()
  }, [addressBody])

  useEffect(() => {
    defaultAddressSelector()
  }, [defaultAddress, allAddress])

  useEffect(() => {
    if (userDetails) {
      setUserDetailsLocal(userDetails)
    }
  }, [userDetails])

  const editModeHandler = () => {
    if (addressBody.address_id) {
      setUpdateMode(true)
    } else {
      setUpdateMode(false)
    }
  }

  const handleUpdateAddressRequest = (addressData) => {
    const updateAddressBody = {
      label: get(addressData, "label", ""),
      address_line_one: get(addressData, "address", ""),
      address_id: get(addressData, "address_id", ""),
      type: get(addressData, "type", "")
    }

    dispatch(updateAddressRequest({ accessToken, updateAddressBody }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at addAddressRequest", res)
        setAddCard(false)
        setAddressBody({ address_id: "", address: "", label: "", type: "" })
        updated()
      })
      .catch((err) => {
        AppLogger("Error at updateAddressRequest", err)
      })
  }

  const handleAddAddress = () => {
    if (!addressBody.address) {
      showFaliureToast(message.ENTER_ADDRESS)
    } else if (addressBody.address.length < 20) {
      showFaliureToast(message.ADDRESS_LEN_MIN_20)
    } else if (!addressBody.address.match(/^[^\s]+.*/)) {
      showFaliureToast(message.VALID_ADDRESS)
    } else if (!addressBody.label && addressBody.type === "other") {
      showFaliureToast(message.ADDRESS_LABEL)
    } else if (
      addressBody.label &&
      !addressBody.label.match(/^(?!\d)\s*[^\s]/) &&
      addressBody.type === "other"
    ) {
      showFaliureToast(message.CORRECT_LABEL)
      // } else if (addressBody.label.length < 5) {
      //   showFaliureToast("label length must be minimum 5")
    } else if (!addressBody.type) {
      showFaliureToast(message.TYPE_OF_ADDRESS)
    } else {
      // Call API
      if (updateMode) {
        handleUpdateAddressRequest(addressBody)
      } else {
        AppLogger("This is address body========", addressBody)
        // handleAddAddressRequest(addressBody)
        addAddressHandler()
      }
    }
  }
  // const validationSchema = yup.object({
  //   address: yup
  //     .string()
  //     .matches(/^\S/, "invalid address")
  //     .min(20, "should be of minimum 20 characters length")
  //     // .max(200, "Not more than 200 characters")
  //     .required("Address is required"),
  //   address_id: yup
  //     .string()
  //     .matches(/^[^0-9\s][\s\S]*$/, "Enter Correct Label")
  //     .min(4, "Must have 4 characters length")
  //     .max(30, "Address Name should be of maximum 30 characters length")
  //     .required("Address label is Required")
  // })

  // const formik = useFormik({
  //   initialValues: {
  //     address: addressBody.address,
  //     address_id: addressBody.address_id,
  //     label: addressBody.label,
  //     type: addressBody.type
  //   },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
  //     saveUserOnButtonHandler(values)
  //   }
  // })

  const addAddressHandler = () => {
    try {
      const { address, label, type } = addressBody
      const addAddressBody = {
        address_line_one: address,
        // address_line_two: label,
        type: type,
        label: label
      }
      if (type !== "") {
        dispatch(addAddressRequest({ accessToken, addAddressBody }))
          .then(unwrapResult)
          .then((res) => {
            AppLogger("This is  response at addAddressHandler===========", res)
            updated()
            // showSuccessToast("Address Added Successfully")
            setAddressBody({ address: "", address_id: "", type: "" })
            // formik.resetForm()
            setAddCard(false)
          })
          .catch((err) => {
            // showSuccessToast("Address Added Successfully")
            showFaliureToast(err?.message)
            AppLogger("This is error at  addAddressHandler============", err)
          })
      } else {
        showFaliureToast("Type is required")
      }
    } catch (err) {
      AppLogger("This is add  address Handler=========", err)
    }
  }

  const deleteAddressHandler = (address_id) => {
    dispatch(deleteAddressRequest({ accessToken, address_id }))
      .then(unwrapResult)
      .then((res) => {
        // showSuccessToast("Address Deleted Successfully")
        AppLogger("This  is response at delete aaddress========", res)
        updated()
      })
      .catch((err) => {
        AppLogger("This is error at delete address============", err)
      })
  }

  const onSelectDefaultHandler = (address_id) => {
    dispatch(setDefaultAddressRequest({ accessToken, address_id }))
      .then(unwrapResult)
      .then((res) => {
        updated()
        AppLogger("This si resposne at onSelectDefaultHandler==========", res)
      })
      .catch((err) => {
        AppLogger("This  is error at onSelectDefaultHandler============", err)
      })
  }
  const defaultAddressSelector = () => {
    if (allAddress.length >= 1 && !defaultAddress) {
      const currentAddress = allAddress[0]

      onSelectDefaultHandler(currentAddress.id)
    }
  }
  const onEditPressHandler = (address) => {
    AppLogger("this is current address========", address)
    addressBody.address = address.address_line_one
    addressBody.label = address.label
    addressBody.type = address.type
    addressBody.address_id = address.id
    setAddressBody({ ...addressBody })
    setAddCard(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setAddressBody((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  return (
    <div>
      <Dialog className="myCard sty2" open={open} onClose={handleClose}>
        <div className="sec-padded">
          {AddCard ? (
            <Typography
              // component={"p"}
              variant="h3"
              sx={{
                color: AppColors.primaryGreen,
                fontWeight: 700,
                textAlign: "center",
                paddingBottom: "30px"
              }}
            >
              Add New Address
            </Typography>
          ) : (
            <Typography
              // component={"p"}
              variant="h3"
              sx={{
                color: AppColors.primaryGreen,
                fontWeight: 700,
                textAlign: "center",
                paddingBottom: "30px"
              }}
            >
              Select Delivery Address
            </Typography>
          )}

          {AddCard ? null : allAddress.length > 0 ? (
            allAddress.map((address, index) => (
              <div key={index} className="selectedCards">
                <div className="sectionWrapper">
                  <div className="details">
                    <div className="cardNumber">
                      <Typography
                        sx={{
                          fontWeight: "500",
                          fontSize: "15px",
                          lineHeight: "1",
                          paddingBottom: "5px",
                          textTransform: "capitalize",
                          color: AppColors.primaryGreen
                        }}
                      >
                        {address.type !== "other"
                          ? address.type ?? ""
                          : address.label ?? ""}
                      </Typography>
                      <Typography sx={{ fontSize: "13px", lineHeight: "1.5" }}>
                        {address.address_line_one}
                      </Typography>
                    </div>
                  </div>
                  <div className="actions">
                    {address.id !== currentId && (
                      <Button
                        disabled={
                          address?.id == defaultAddress?.id ? true : false
                        }
                        onClick={() => onSelectDefaultHandler(address.id)}
                        variant="outlined"
                      >
                        {address.id !== currentId &&
                          `${
                            address?.id == defaultAddress?.id
                              ? "Selected"
                              : "Select"
                          }`}
                      </Button>
                    )}

                    {deleteMode && address.id == currentId && (
                      <Button
                        onClick={() => deleteAddressHandler(address.id)}
                        variant="outlined"
                      >
                        <Tick />
                      </Button>
                    )}
                    {/* <Button
                        onClick={() => deleteAddressHandler(address.id)}
                        variant="outlined"
                      >
                        Delete
                      </Button> */}
                    {address.id !== currentId && (
                      <Button
                        onClick={() => {
                          setCurrentId(address.id)
                          setDeleteMode(true)
                        }}
                        variant="outlined"
                      >
                        Delete
                      </Button>
                    )}

                    {deleteMode && address.id == currentId && (
                      <Button
                        onClick={() => {
                          setDeleteMode(false)
                          setCurrentId("")
                        }}
                        variant="outlined"
                      >
                        <Cross />
                      </Button>
                    )}
                    <Typography onClick={() => onEditPressHandler(address)}>
                      <EditButtonAddress />
                    </Typography>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", padding: "40px 0" }}>
              You do not have any delivery address. Please Add New Address
            </Typography>
          )}
          <div className="fieldWrapper">
            {AddCard ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  className="textarea"
                  // variant="outlined"
                  multiline
                  value={addressBody.address}
                  defaultValue={addressBody.address}
                  // helperText={formik.touched.address && formik.errors.address}
                  // error={formik.touched.address && formik.errors.address}
                  // required
                  name="address"
                  placeholder="E.g. Apartment 123, 1st Street, Jumeriah 1, Dubai, PO Box 00000"
                  minRows={6}
                  // maxRows={4}
                  onChange={(e) => {
                    handleChange(e)
                    setAddressBody({ ...addressBody, address: e.target.value })
                  }}
                />
                <div className="addressRadio">
                  <FormControl>
                    <FormLabel
                      id="demo-radio-buttons-group-label"
                      sx={{
                        color: preferancesPop
                          ? AppColors.primaryGreen
                          : AppColors.white,
                        fontSize: "12px",
                        padding: "13px 0"
                      }}
                    >
                      Please tell us if this address is:
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue={addressBody.type}
                      // defaultChecked={addressBody.type ? true : false}
                      value={addressBody.type}
                      onChange={(e) => {
                        setAddressBody({
                          ...addressBody,
                          type: e.target.value
                        })
                      }}
                      name="type"
                    >
                      <FormControlLabel
                        value="home"
                        control={
                          <Radio
                            checked={addressBody.type == "home" ? true : false}
                          />
                        }
                        label="Home"
                      />
                      <FormControlLabel
                        value="office"
                        control={
                          <Radio
                            checked={
                              addressBody.type == "office" ? true : false
                            }
                          />
                        }
                        label="Office"
                      />
                      <FormControlLabel
                        value="other"
                        control={
                          <Radio
                            checked={addressBody.type == "other" ? true : false}
                          />
                        }
                        label="Other"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>

                {addressBody.type == "other" ? (
                  <InputField
                    sx={{
                      color: AppColors.white
                    }}
                    // helperText={
                    //   formik.touched.address_id && formik.errors.address_id
                    // }
                    // error={formik.touched.address_id && formik.errors.address_id}
                    name="address_id"
                    placeholder="Please name the address"
                    value={
                      addressBody.type !== "other" ? "" : addressBody.label
                    }
                    disabled={addressBody.type !== "other"}
                    // value={addressBody.address}
                    // maxLength={200}
                    onChange={(e) => {
                      handleChange(e)
                      setAddressBody({ ...addressBody, label: e.target.value })
                    }}
                  />
                ) : null}

                <div className="popButtons">
                  <Button
                    // onClick={handleAddAddress}
                    onClick={() => {
                      setAddressBody({
                        address_id: "",
                        address: "",
                        label: "",
                        type: ""
                      })

                      setAddCard(false)
                    }}
                    variant="outlined"
                    className="cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="add"
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      // formik.handleSubmit()
                      // if (formik.isValid) {
                      handleAddAddress()
                      // }
                    }}
                  >
                    {`${updateMode ? "Update" : "Add "}`}
                  </Button>
                </div>
              </form>
            ) : null}

            {AddCard ? null : (
              <div className="CardAction">
                <Button
                  disabled={allAddress.length >= 5 ? true : false}
                  onClick={() => {
                    setAddCard(true)
                  }}
                  className="outlined"
                  variant="outlined"
                  sx={{
                    borderColor: AppColors.white,
                    color: AppColors.white,
                    maxWidth: "231px"
                  }}
                >
                  Add New Address
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button
          // className="crossButton sty2"
          className={`crossButton sty2 ${isExecutive ? 'isExecutive':'' }`}
          sx={{ color: "red" }}
          onClick={handleClose}
        >
          x
        </Button>
      </Dialog>
    </div>
  )
}
