import React, { useState, useEffect, useRef, useMemo } from "react"
import { showFaliureToast, showSuccessToast } from "../../helpers/AppToast"
import AppConstants from "../../helpers/AppConstants"
import { TextField } from "@mui/material"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import { Dialog } from "@mui/material"
import { Button, Link, Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import FormLabel from "@mui/material/FormLabel"
import RadioGroup from "@mui/material/RadioGroup"
import Radio from "@mui/material/Radio"
import Autocomplete from "@mui/material/Autocomplete"
import InputField from "Elements/inputField"
import DatePicker from "react-multi-date-picker"
import CalenderSM from "../../../public/images/icons/calenderSM.svg"
import EditButtonAddress from "../../../public/images/icons/edit-svg.svg"
import Cross from "../../../public/images/icons/cross.svg"
import Tick from "../../../public/images/icons/tick.svg"

import EditButton from "../../../public/images/icons/edit-svg.svg"

import { useDispatch, useSelector } from "react-redux"
import { setIn, useFormik } from "formik"
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
import DeliveryDays from "components/delivery-days"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"

import AppRoutes from "../../helpers/AppRoutes"
import { customTimeout } from "helpers/ShortMethods"
export default function AddAddressPopNew({
  type,
  open,
  handleClose,
  saveCardRequest,
  preferancesPop,
  updated,
  currentAddress,
  updateModeSetter,
  availableDays,
  updateDays
}) {
  const dispatch = useDispatch()
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { userProfile } = useSelector((state) => state.profile)
  const { addresss, UAEAddresses, startUpData, orderHistory, companyEmirates } = useSelector(
    (state) => state.home
  )
  const [startUpLocalSummary, setStartUpLocalSummary] = useState(null)
  const [orderHistoryLocalSummary, setOrderHistoryLocalSummary] = useState(null)
  const [addressBody, setAddressBody] = useState({
    address: "",
    label: "",
    address_id: "",
    type: "",
    area_id: "",
    emirate_id: "",
    cities: [],
    emiratesValue: "",
    areaValue: "",
    street: "",
    apartment: "",
    timeSlots: [],
    time_slot: "",
    deliveryInstructions: "",
    days: [],
    labels: [],
    streets: [],
    apartments: [],
  })
  const [updateMode, setUpdateMode] = useState(false)
  const [deleteAddress, setdeleteAddress] = useState(false)
  const [UAEAddressesLocal, setUAEAddressesLocal] = useState(null)
  const [cities, setCities] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [selectValue, setSelectValue] = useState("")
  const [areaValue, setAreaValue] = useState("")
  const [addressDataLocal, setAddressDataLocal] = useState(null)
  const [userDetailsLocal, setUserDetailsLocal] = useState(false)
  const [message, setMessage] = useState(false)
  const [currentId, setCurrentId] = useState("")
  const [deleteMode, setDeleteMode] = useState(false)
  const [AddCard, setAddCard] = useState(false)
  const [updatedAddresses, setUpdatedAddresses] = useState([]); // empty this state when popup closes
  const [AddressLoader, setAddressLoader] = useState(false)

  const accessToken = get(userDetailsLocal, "data.auth_token", "")
  const companyName = get(userProfile, "company_object.name", "")

  const emirates = useMemo(() => {
    if(!isExecutive) return UAEAddresses;

    return companyEmirates;
  }, [UAEAddresses, companyEmirates])

  const getAddressFields = (emirate) => {
    const companyAddresses = get(emirate, "company_address", []);
    if (companyAddresses.length === 0) return { cities: [], labels: [] };

    
    const fields = companyAddresses.reduce(
      ({ labels}, address) => {
        labels.push(address?.label);
        return {labels}; 
      },
      { labels: [] }
    );
    
    return fields; 
  };

  const getDependentFields = (emirate_id, label) => {
    const emirate = emirates.find((emirate) => emirate.id === emirate_id);
    
    if(!emirate) return {labels: [], apartments: [], streets: [], cities: []};

    const companyAddress = get(emirate, "company_address", []);

    const fields = companyAddress.filter((compAdress) => compAdress.label == label).reduce(({ apartments, streets, timeSlots, cities}, address) => {
      apartments.push(address.apartment);
      streets.push(address.street);
      timeSlots.push(address?.time_slot);
      cities.push(address?.area);
      return {apartments, streets, timeSlots, cities};
    }, { apartments: [], streets: [], timeSlots: [], cities: []})

    return fields;
  }

  const getCompanyAddressId = () => {
    const emirate = emirates.find((emirate) => emirate.id === addressBody.emirate_id);

    if(!emirate || !addressBody.area_id || !addressBody.label || !addressBody.street || !addressBody.apartment || !addressBody.time_slot) return null;

    const companyAddress = get(emirate, "company_address", []);

    const finalAddress = companyAddress.find((compAdress) => (compAdress.area_id == addressBody.area_id && 
    compAdress.label == addressBody.label &&
    compAdress.street == addressBody.street &&
    compAdress.apartment == addressBody.apartment && 
    compAdress.time_slot == addressBody.time_slot)
  );

    return get(finalAddress, 'id', null)
  }; 

  const allAddress = get(addressDataLocal, "address", [])
  const defaultAddress = get(addressDataLocal, "default_address", null)

  const allTimeSlot = get(startUpLocalSummary, "time_slots", [])

  useEffect(() => {
    if (orderHistory) {
      setOrderHistoryLocalSummary(orderHistory)
    }
  }, [orderHistory])

  useEffect(() => {
    if (updateModeSetter) {
      updateModeSetter({
        func: () => {
          setAddressBody({
            address_id: "",
            address: "",
            label: "",
            type: "",
            emirate_id: "",
            emiratesValue: "",
            area_id: "",
            areaValue: "",
            street: "",
            apartment: "",
            cities: [],
            timeSlots: [],
            time_slot: "",
            labels: [],
            streets: [],
            apartments: []
          })
          setAddCard(true);
        }
      });
    }
  }, [])

  function checkPaidStatus(array) {
    for (let i = 0; i < array?.length; i++) {
      if (array[i].payment_status == "paid") {
        return true
      }
    }
    return false
  }

  // Example usage

  const hasPaidStatus = checkPaidStatus(orderHistoryLocalSummary)

  useEffect(() => {
    if (startUpData) {
      setStartUpLocalSummary(startUpData)
    }
  }, [startUpData])

  useEffect(() => {
    if (UAEAddresses) {
      setUAEAddressesLocal(UAEAddresses)
    }
  }, [UAEAddresses])

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
      address_line_one: "-",
      [isExecutive ? "company_address_id" : "address_id"]: isExecutive ? getCompanyAddressId() : get(addressData, "address_id", ""),
      type: get(addressData, "type", ""),
      emirate_id: get(addressData, "emirate_id", ""),
      area_id: get(addressData, "area_id", ""),
      street: get(addressData, "street", ""),
      apartment: get(addressData, "apartment", ""),
      time_slot: `${get(addressData, "emiratesValue", "")}:${get(
        addressBody,
        "time_slot",
        ""
      )}`,
      days: get(addressData, "days", ""),
    }

    dispatch(updateAddressRequest({ accessToken, updateAddressBody }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at addAddressRequest", res)
        setAddCard(false)
        setAddressBody({
          address_id: "",
          address: "",
          label: "",
          type: "",
          emirate_id: "",
          area_id: "",
          areaValue: "",
          cities: [],
          emiratesValue: "",
          street: "",
          apartment: "",
          timeSlots: [],
          time_slot: "",
          deliveryInstructions: "",
          days: "",
          labels: [],
          streets: [],
          apartments: []
        })
        updated()
      })
      .catch((err) => {
        AppLogger("Error at updateAddressRequest", err)
      })
  }

  const handleUpdateAddressesRequest = (addressesData) => {
    if (!Array.isArray(addressesData) || addressesData.length === 0) {
      return;
    }
  
    // Loop through each address in the array
    addressesData.forEach((addressData) => {
      const updateAddressBody = {
        label: get(addressData, "label", ""),
        address_line_one: "-",
        address_id: get(addressData, "id", ""),
        type: get(addressData, "type", ""),
        emirate_id: get(addressData, "emirate_id", ""),
        area_id: get(addressData, "area_id", ""),
        street: get(addressData, "street", ""),
        apartment: get(addressData, "apartment", ""),
        time_slot: `${get(addressData, "emiratesValue", "")}:${get(
          addressData,
          "time_slot",
          ""
        )}`,
        days: get(addressData, "days", ""),
      };
  
      // Dispatch the request for each address
      dispatch(updateAddressRequest({ accessToken, updateAddressBody }))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at updateAddressRequest", res);
  
          // Optionally, you can reset addressBody after each update
          setAddressBody({
            address_id: "",
            address: "",
            label: "",
            type: "",
            emirate_id: "",
            area_id: "",
            areaValue: "",
            cities: [],
            emiratesValue: "",
            street: "",
            apartment: "",
            timeSlots: [],
            time_slot: "",
            deliveryInstructions: "",
            days: "",
            labels: [],
            streets: [],
            apartments: []
          });
  
          // Call updated function after each successful request
          updated();
        })
        .catch((err) => {
          AppLogger("Error at updateAddressRequest", err);
        });
    });
  };

  const handleAddAddress = () => {
    if (!addressBody.street) {
      showFaliureToast("Please enter Building / Street Name")
    } else if (!addressBody.apartment) {
      showFaliureToast("Please enter Apartment / Villa Number")
    } else if (!addressBody.time_slot) {
      showFaliureToast("Please enter Time Slot")
    }
    // else if (addressBody.address.length < 20) {
    //   showFaliureToast("Address length must be minimum 20")
    // }
    // else if (!addressBody.address.match(/^[^\s]+.*/)) {
    //   showFaliureToast("Please Enter Valid Address")
    // }
    else if (!addressBody.label && addressBody.type === "other") {
      showFaliureToast("Please enter address label")
    } else if (
      addressBody.label &&
      !addressBody.label.match(/^(?!\d)\s*[^\s]/) &&
      addressBody.type === "other"
    ) {
      showFaliureToast("Please enter correct label")
      // } else if (addressBody.label.length < 5) {
      //   showFaliureToast("label length must be minimum 5")
    } else if (!addressBody.type && !isExecutive) {
      showFaliureToast("Please add a type of address")
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
      const {
        address,
        label,
        type = '',
        emirate_id,
        area_id,
        street,
        apartment,
        emiratesValue,
        time_slot,
        days,
      } = addressBody
      setAddressLoader(true)
      const addAddressBody = {
        address_line_one: "-",
        ...(!isExecutive && {
          type: type,
        }),
        ...(isExecutive && {
          company_address_id: getCompanyAddressId()
        }),
        label: label,
        emirate_id: emirate_id,
        area_id: area_id,
        street: street,
        apartment: apartment,
        time_slot: `${emiratesValue}:${time_slot}`,
        days: days
      }
      if (type !== "" || isExecutive) {
        
        dispatch(addAddressRequest({ accessToken, addAddressBody }))
          .then(unwrapResult)
          .then((res) => {
      setAddressLoader(false)
            
            AppLogger("This is  response at addAddressHandler===========", res)
            updated()
            // showSuccessToast("Address Added Successfully")
            setAddressBody({
              address: "",
              address_id: "",
              type: "",
              area_id: "",
              emirate_id: "",
              street: "",
              apartment: "",
              areaValue: "",
              emiratesValue: "",
              cities: [],
              timeSlots: [],
              time_slot: "",
              labels: [],
              streets: [],
              apartments: []
            })
            // formik.resetForm()
            setAddCard(false)
          })
          .catch((err) => {
      setAddressLoader(false)

            // showSuccessToast("Address Added Successfully")
            showFaliureToast(err?.message)
            AppLogger("This is error at  addAddressHandler============", err)
          })
      } else {
        showFaliureToast("Type is required")
      }
    } catch (err) {
      setAddressLoader(false)

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
    addressBody.days = address.days
    addressBody.address_id = address.id
    addressBody.emirate_id = address.emirate_id ?? get(address, 'emirate.id', null);
    addressBody.area_id = address.area_id
    addressBody.street = address.street
    addressBody.apartment = address.apartment
    if(isExecutive){
      addressBody.time_slot = address.time_slot;
    }else{
    addressBody.time_slot = address.time_slot?.split(":")[1]
    addressBody.emiratesValue = address.time_slot?.split(":")[0]
    addressBody.timeSlots =
        allTimeSlot.find((val) => val.city == address?.time_slot?.split(":")[0])
          ?.values ?? []
    }
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

  const [age, setAge] = useState(10)

  const handleChange2 = (event) => {
    setAge(event.target.value)
  }

  const handleClear = () => {
    if (cities.length == 0) {
      return ""
    }
  }

  const finder = (type) => {
    if(isExecutive){
      const companyEmirates = emirates.find((val) => val.id == addressBody.emirate_id);

      if (!companyEmirates) return "";

      if (type === "emirates") return companyEmirates.name ?? "";

      const {labels} = getAddressFields(companyEmirates);

      const {streets, apartments, timeSlots, cities} = getDependentFields(addressBody.emirate_id, addressBody.label);
      if (type === "area") {
          const area = cities?.find((val) => val.id == addressBody.area_id);
          return area?.name ?? "";
      }

      if (type === "cities") return cities ?? [];
      if(type === "labels") return labels;
      if(type === "streets") return streets;
      if(type === "apartments") return apartments;
      if(type === "timeslots") return timeSlots;

    }else{
      const emirates = UAEAddressesLocal.find((val) => val.id == addressBody.emirate_id);
    
      if (!emirates) return "";
    
      if (type === "emirates") return emirates.name ?? "";
    
      if (type === "area") {
        const area = emirates.areas?.find((val) => val.id == addressBody.area_id);
        return area?.name ?? "";
      }
    
      if (type === "cities") return emirates.areas ?? [];
    }
  
    return { emirates: "", area: "", name: "" };
  }

  useEffect(() => {
    if (updateMode) {
      setAddressBody({
        ...addressBody,
        emiratesValue: finder("emirates") ?? "",
        areaValue: finder("area") ?? "",
        cities: finder("cities") ?? "",
        ...(isExecutive && {
          labels: finder("labels"),
          streets: finder("streets"),
          apartments: finder("apartments"),
          timeSlots: finder('timeslots')
        }),
      })
    }
  }, [updateMode])

  const emiratesValueHandler = () => {
    return addressBody.emiratesValue ?? ""
  }

  const areasValueHandler = () => {
    return addressBody.areaValue ?? ""
  }

  const daysValueHandler = () => {
    return addressBody.days ?? ""
  }

  const timeSlotValueHandler = () => {
    return addressBody.time_slot ?? ""
  }

  const labelValueHandler = () => {
    return addressBody.label ?? ""
  }

  const streetValueHandler = () => {
    return addressBody.street ?? ""
  }

  const apartmentValueHandler = () => {
    return addressBody.apartment ?? ""
  }

  const getSelectedAddressTimeSlots = (x) => {
    const ts = allTimeSlot.find((val) => val.city == x?.split(":")[0])
    if (ts) {
      return ts?.values
    }
  }
  // const weekDays = [
  //   { title: "Mon" },
  //   { title: "Tue" },
  //   { title: "Wed" },
  //   { title: "Thur" },
  //   { title: "Fri" },
  //   { title: "Sat" },
  //   { title: "Sun" }
  // ]
  // const [openDrop, setOpenDrop] = useState(false)


  const prevAddresses = useMemo(() => {
    const getCopiedArray = () => {
      const arr = [];
  
      allAddress.forEach((x) => {
        if(x.days && Array.isArray(x.days)){
          arr.push({ ...x, days: [...x.days] });
        }else{
          arr.push({ ...x, days: [] });
        }
      });
  
      return arr;
    };
    return getCopiedArray();
  }, [allAddress]);

  useEffect(() => {
    setUpdatedAddresses(allAddress);
  // }, [allAddress]);
  }, [addressDataLocal]);


  const [updateDaysHandler , setupdateDaysHandler] = useState(false)
  const handleEditDaysInMultipleAddresses = (day, id) => {
    setupdateDaysHandler(true)
    const modifiedAddresses = prevAddresses.map((address) => {
      // If the current address matches the id, toggle the day
      if (address.id === id) {
        if(address.days.includes(day)){
          // address.days = address.days.filter(d => d !== day);
        }else{
          address.days.push(day)
        }
      }else{
        address.days = address.days.filter(d => d !== day);
      }

      return address;
  });

    setUpdatedAddresses(modifiedAddresses);
  }

  const getTimeSlot = (time_slot = '') => {
    try {
      if(isExecutive){
        return time_slot;
      }else{
        return time_slot?.split(":")[1]
      }
    } catch (error) {
      console.log('Error at getTimeSlot', error);
      return time_slot
    }
  }
  return (
    <div>
      <Dialog className="myCard sty2" open={open} onClose={!updateDaysHandler && handleClose}>
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
              {isExecutive?"Set Workplace Delivery Address": 'Add New Address'}
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
            <>
              {allAddress.map((address, index) => (
                <div key={index} className="selectedCards">
                  <div className="sectionWrapper">
                    <div className="details">
                      <div className="cardNumber">
                        <div className="sectionWrap">
                          <div className="textWrap">
                            <Typography
                              className="label"
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
                              &nbsp;
                              {
                                !isExecutive && (
                                  <EditButtonAddress
                                    onClick={() => onEditPressHandler(address)}
                                  />
                                )
                              }
                            </Typography>
                            <div className="areaWrap">
                              <div className="areaDetail sty2">
                                <Typography
                                  sx={{ fontSize: "13px", lineHeight: "1.5" }}
                                >
                                  {address?.emirate?.name}
                                </Typography>
                              </div>
                              <div className="areaDetail">
                                <Typography
                                  sx={{ fontSize: "13px", lineHeight: "1.5" }}
                                >
                                  {address?.area?.name}
                                </Typography>
                              </div>
                            </div>
                            <Typography
                              sx={{ fontSize: "13px", lineHeight: "1.5" }}
                            >
                              {address.street}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "13px", lineHeight: "1.5" }}
                            >
                              {address.apartment}
                            </Typography>
                          </div>
                          <div
                            className="actions"
                            style={{
                              pointerEvents:
                                allAddress.length == 1 ? "none" : "all"
                            }}
                          >
                            {address.id !== currentId && !isExecutive && (
                              <Button
                                disabled={
                                  address?.id == defaultAddress?.id
                                    ? true
                                    : false
                                }
                                onClick={() => {
                                  onSelectDefaultHandler(address.id)
                                  setMessage(true)
                                  customTimeout(() => {
                                    setMessage(false)
                                  }, 8000)
                                }}
                                variant="outlined"
                              >
                                {address.id !== currentId &&
                                  `${address?.id == defaultAddress?.id
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
                              !isExecutive &&
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
                            {/* <Typography onClick={() => onEditPressHandler(address)}>
                      <EditButtonAddress />
                    </Typography> */}
                          </div>
                        </div>
                        <Typography
                          className="label"
                          sx={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "1",
                            paddingBottom: "5px",
                            textTransform: "capitalize",
                            color: AppColors.primaryGreen
                          }}
                        >Delivery Time Slot</Typography>
                        <Typography
                          sx={{ fontSize: "13px", lineHeight: "1.5", marginBottom: '10px' }}
                        >
                          {getTimeSlot(address.time_slot)}
                        </Typography>

                        <Typography
                          className="label"
                          sx={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "1",
                            marginTop: '5px',
                            paddingBottom: "5px",
                            textTransform: "capitalize",
                            color: AppColors.primaryGreen
                          }}
                        >Select Delivery days</Typography>
                        <DeliveryDays id={address.id} onClickDay={handleEditDaysInMultipleAddresses} selectedDays={availableDays ?? []} assignedDays={updatedAddresses.find(a => a.id === address.id)?.days ?? []} />
                      </div>
                    </div>
                    {/* <div className="editSec">
                    <Typography onClick={() => onEditPressHandler(address)}>
                      <EditButtonAddress />
                    </Typography>
                  </div> */}
                  </div>
                </div>
              ))}
              <div className="selectedCards">
                {message && allAddress.length == 1 && hasPaidStatus ? (
                  <Typography
                    color={AppColors.primaryGreen}
                    sx={{
                      fontSize: "13px",
                      padding: "0 15px",
                      marginTop: "15px"
                    }}
                  >
                    Please note: address changes take between 12 and 36 hours to
                    take effect. For more information, please call our Customer
                    Care team on{" "}
                    <Link
                      color={AppColors.primaryGreen}
                      sx={{ display: "inline-block" }}
                      href={AppRoutes.whatsapp}
                      target="_blank"
                    >
                      +971 52 327 1183.
                    </Link>
                  </Typography>
                ) : null}
                {allAddress.length > 1 && hasPaidStatus ? (
                  <Typography
                    color={AppColors.primaryGreen}
                    sx={{
                      fontSize: "13px",
                      padding: "0 15px",
                      marginTop: "15px"
                    }}
                  >
                    Please note: address changes take between 12 and 36 hours to
                    take effect. For more information, please call our Customer
                    Care team on{" "}
                    <Link
                      color={AppColors.primaryGreen}
                      sx={{ display: "inline-block" }}
                      href={AppRoutes.whatsapp}
                      target="_blank"
                    >
                      +971 52 327 1183.
                    </Link>
                  </Typography>
                ) : null}
              </div>
            </>
          ) : (
            <Typography sx={{ textAlign: "center", padding: "40px 0" }}>
              You do not have any delivery address. Please Add New Address
            </Typography>
          )}
          <div className="fieldWrapper">
            {AddCard ? (
              <form onSubmit={handleSubmit}>
                <div className="selectWrap">
                {
                    isExecutive && (
                      <InputField
                      sx={{
                        pointerEvents: 'none'
                      }}
                      placeholder="Company Name"
                      value={companyName}
                    />
                    )
                  }
                {/* <Autocomplete
                  multiple
                  className="daysHandler"
                  disablePortal
                  options={Array.isArray(availableDays) ? availableDays : []} // Ensure it's always an array
                  getOptionLabel={(option) => {
                    return option ? String(option) : "";
                  }}
                  value={Array.isArray(addressBody.days) ? addressBody.days : []} // Ensure it's always an array
                  onChange={(e, value) => {
                    console.log("onChange value:", value); // Log value to debug
                    if (Array.isArray(value)) {
                      setAddressBody({
                        ...addressBody,
                        days: value, // Assign all selected values as an array
                      });
                    } else {
                      setAddressBody({
                        ...addressBody,
                        days: [], // Ensure days is set to an empty array
                      });
                    }
                  }}
                  renderTags={(selected, getTagProps) => (
                    <div className="chipsWrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '4px' }}>
                      {selected.map((option, index) => (
                        <Chip
                          key={index}
                          label={option}
                          {...getTagProps({ index })}
                          style={{ margin: 2 }}
                        />
                      ))}
                    </div>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} placeholder={addressBody.days && addressBody.days.length > 0 ? "" : "Delivery Day"} />
                  )}
                /> */}


                  <Autocomplete
                    disablePortal
                    options={emirates ?? []}
                    getOptionLabel={(option) => option.name ?? ""}
                    isOptionEqualToValue={(option, value) =>
                      option.name == value?.name
                    }
                    disableClearable={
                      emiratesValueHandler() == "" ? true : false
                    }
                    inputValue={emiratesValueHandler() ?? ""}
                    value={emiratesValueHandler() ?? ""}
                    onInputChange={(e) => {
                      if (e) {
                        setAddressBody({
                          ...addressBody,
                          emiratesValue: e.target.value
                        })
                      }
                    }}
                    onChange={(e, i) => {
                      if (i) {
                        if(isExecutive){
                          const {labels} = getAddressFields(i);

                          setAddressBody({
                            ...addressBody,
                            emiratesValue: i.name,
                            labels: labels,
                            emirate_id: i.id
                          })
                        }else{
                          setAddressBody({
                            ...addressBody,
                            cities: i.areas,
                            emiratesValue: i.name,
                            timeSlots:
                              allTimeSlot.find((val) => val.city == i.name)
                                ?.values ?? []
                          })
                        }
                      } else {
                        setAddressBody({
                          ...addressBody,
                          cities: [],
                          emiratesValue: "",
                          areaValue: "",
                          emirate_id: "",
                          area_id: "",
                          timeSlots: [],
                          time_slot: "",
                          labels: [],
                          apartments: [],
                          streets: [],
                          ...(isExecutive && {
                            label: "",
                            street: "",
                            apartment: ""
                          })
                        })
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Emirate" />
                    )}
                  />
                {
                  isExecutive && (
                    <Autocomplete
                      disablePortal
                      disabled={addressBody.labels?.length == 0}
                      options={
                        addressBody.labels?.length > 0 ? addressBody.labels : []
                      }
                      disableClearable={labelValueHandler() == ""}
                      inputValue={labelValueHandler()}
                      value={labelValueHandler()}
                      onChange={(_, i) => {
                        if(i){
                          if(isExecutive){
                            const { apartments, streets, timeSlots, cities} = getDependentFields(addressBody.emirate_id, i);
                            setAddressBody({
                              ...addressBody,
                              apartments: apartments,
                              streets: streets,
                              timeSlots: timeSlots,
                              cities: cities,
                              label: i
                            })      
                          }
                        }else{
                          setAddressBody({
                            ...addressBody,
                            areaValue: "",
                            area_id: "",
                            apartments: [],
                            streets: [],
                            timeSlots: [],
                            ...(isExecutive && {
                              time_slot: "",
                              label: "",
                              street: "",
                              apartment: "",
                              cities: []
                            })
                          })
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Labels" />
                      )}
                    />
                  )
                }
                  <Autocomplete
                    disablePortal
                    disabled={addressBody.cities?.length == 0 ? true : false}
                    options={
                      addressBody.cities?.length > 0 ? addressBody.cities : []
                    }
                    getOptionLabel={(option) => option.name ?? ""}
                    disableClearable={areasValueHandler() == "" ? true : false}
                    inputValue={areasValueHandler() ?? ""}
                    value={areasValueHandler() ?? ""}
                    onChange={(e, i) => {
                      if (i) {
                        if(isExecutive){
                          const { apartments, streets, timeSlots} = getDependentFields(addressBody.emirate_id, addressBody.label);
                          setAddressBody({
                            ...addressBody,
                            areaValue: i.name,
                            emirate_id: i.emirate_id,
                            area_id: i.id,
                            apartments: apartments,
                            streets: streets,
                            timeSlots: timeSlots
                          })                     
                        }else{
                          setAddressBody({
                            ...addressBody,
                            areaValue: i.name,
                            emirate_id: i.emirate_id,
                            area_id: i.id,
                          })
                        }
                      } else {
                        setAddressBody({
                          ...addressBody,
                          areaValue: "",
                          area_id: "",
                          ...(!isExecutive && {
                            label: "",
                            street: "",
                            apartment: "",
                            emirate_id: "",
                          })
                        })
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Area" />
                    )}
                  />
                </div>
                {
                  isExecutive ? (
                    <div className="selectWrap">
                      <Autocomplete
                        disablePortal
                        disabled={addressBody.streets?.length == 0}
                        options={
                          addressBody.streets?.length > 0 ? addressBody.streets : []
                        }
                        disableClearable={streetValueHandler() == ""}
                        inputValue={streetValueHandler()}
                        value={streetValueHandler()}
                        onChange={(_, i) => {
                          setAddressBody({
                            ...addressBody,
                            street: i
                          })
                        }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Streets" />
                        )}
                      />
                    </div>
                  ) : (
                    <InputField
                      sx={{
                        color: AppColors.white
                      }}
                      name="streetName"
                      placeholder="Building / Street Name"
                      value={addressBody.street}
                      onChange={(e) => {
                        handleChange(e)
                        setAddressBody({ ...addressBody, street: e.target.value })
                      }}
                    />
                  )
                }
                {
                  isExecutive ? (
                    <div className="selectWrap">
                      <Autocomplete
                        disablePortal
                        disabled={addressBody.apartments?.length == 0}
                        options={
                          addressBody.apartments?.length > 0 ? addressBody.apartments : []
                        }
                        disableClearable={apartmentValueHandler() == ""}
                        inputValue={apartmentValueHandler()}
                        value={apartmentValueHandler()}
                        onChange={(_, i) => {
                          setAddressBody({
                            ...addressBody,
                            apartment: i
                          })
                        }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Apartments" />
                        )}
                      />
                    </div>
                  ) : (
                    <InputField
                      sx={{
                        color: AppColors.white
                      }}
                      customClass="villa"
                      name="villaNumber"
                      placeholder="Apartment / Villa / Office number / Business Name"
                      value={addressBody.apartment}
                      onChange={(e) => {
                        handleChange(e)
                        setAddressBody({
                          ...addressBody,
                          apartment: e.target.value
                        })
                      }}
                    />
                  )
                }
                <div className="selectWrap">
                  <Autocomplete
                    disablePortal
                    disabled={addressBody.timeSlots?.length == 0 ? true : false}
                    options={
                      addressBody.timeSlots?.length > 0
                        ? addressBody.timeSlots
                        : []
                    }
                    disableClearable={
                      timeSlotValueHandler() == "" ? true : false
                    }
                    inputValue={timeSlotValueHandler() ?? ""}
                    value={timeSlotValueHandler() ?? ""}
                    onChange={(e, i) => {
                      if (i) {
                        setAddressBody({
                          ...addressBody,
                          time_slot: i
                        })
                      } else {
                        setAddressBody({
                          ...addressBody,
                          time_slot: ""
                        })
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Time Slot" />
                    )}
                  />
                </div>
                {/* <div className="selectWrap">
                  <Autocomplete
                    open={openDrop}
                    onOpen={() => setOpenDrop(true)}
                    onClose={() => setOpenDrop(false)}
                    multiple
                    id="multiple-limit-tags"
                    options={weekDays}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Emirate" />
                    )}
                  />
                </div> */}
                {/* <TextField
                  className="textarea"
                  multiline
                  value={addressBody.address}
                  defaultValue={addressBody.address}
                  name="address"
                  placeholder="E.g. Apartment 123, 1st Street, Jumeriah 1, Dubai, PO Box 00000"
                  minRows={6}
                  // maxRows={4}
                  onChange={(e) => {
                    handleChange(e)
                    setAddressBody({ ...addressBody, address: e.target.value })
                  }}
                /> */}
                {
                  !isExecutive && (
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
                  ) 
                }

                {addressBody.type == "other" && !isExecutive ? (
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

                {/* <div className="specialInstructions">
                  <Typography
                    sx={{
                      textAlign: "left",
                      color: preferancesPop
                        ? AppColors.primaryGreen
                        : AppColors.white,
                      fontSize: "12px",
                      padding: "13px 0"
                    }}
                  >
                    Please write any special instructions here
                  </Typography>
                  <textarea
                    placeholder="Please leave outside the front door"
                    // value={addressBody.deliveryInstructions}
                    onChange={(e) => {
                      // AppLogger("Value", e.target.value)
                      addressBody.deliveryInstructions = e.target.value
                      setAddressBody({ ...addressBody })
                    }}
                    // className={styles.instrucionBox}
                  ></textarea>
                </div> */}

                <div className="popButtons">
                  <Button
                    // onClick={handleAddAddress}
                    onClick={() => {
                      setAddressBody({
                        address_id: "",
                        address: "",
                        label: "",
                        type: "",
                        emirate_id: "",
                        emiratesValue: "",
                        area_id: "",
                        areaValue: "",
                        street: "",
                        apartment: "",
                        cities: [],
                        time_slot: "",
                        labels: [],
                        apartments: [],
                        streets: [],
                        timeSlots: []
                      })

                      setAddCard(false)
                    }}
                    variant="outlined"
                    className="cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      AddressLoader||
                      addressBody.emirate_id == "" ||
                      addressBody.area_id == "" ||
                      addressBody.time_slot == ""
                      // addressBody.deliveryInstructions == ""
                    }
                    className="add"
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      // formik.handleSubmit()
                      // if (formik.isValid) {
                      handleAddAddress()
                      if (updateMode) {
                        setMessage(true)
                        customTimeout(() => {
                          setMessage(false)
                        }, 5000)
                      }
                      // }
                    }}
                  >
                    {`${updateMode ? "Update" : "Add "}`}
                  </Button>
                </div>
              </form>
            ) : null}

            {AddCard  || updateDaysHandler ? null : (
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
            {!updateDaysHandler ? null : (
              <div className="CardAction">
                <Button
                  onClick={() => {
                    updateDays(updatedAddresses.map((address) => ({
                      days: address.days,
                      [isExecutive ? 'company_address_id' : 'address_id']: isExecutive ? address?.id : address.id
                    })))
                    setupdateDaysHandler(false)
                  }}
                  className="outlined"
                  variant="outlined"
                  sx={{
                    borderColor: AppColors.white,
                    color: AppColors.white,
                    maxWidth: "231px"
                  }}
                >
                  Update Address
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {!updateDaysHandler ? <Button
          // className="crossButton sty2"
          className={`crossButton sty2 ${isExecutive ? 'isExecutive':'' }`}
          sx={{ color: "red" }}
          onClick={handleClose}
        >
          x
        </Button> : null }
        
      </Dialog>
    </div>
  )
}
