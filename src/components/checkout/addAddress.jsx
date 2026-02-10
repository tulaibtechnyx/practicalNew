import React, { useState, useEffect, useMemo } from "react"
import { showFaliureToast } from "../../helpers/AppToast"
import message from '../../helpers/AppErrors'
import AppConstants from "../../helpers/AppConstants"
import { Dialog } from "@mui/material"
import get from "lodash/get"
import InputField from "Elements/inputField"
import { Button, Link, Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { useFormik } from "formik"
import { TextField } from "@mui/material"
import AppLogger from "helpers/AppLogger"
import * as yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import Autocomplete from "@mui/material/Autocomplete"
import AppRoutes from "../../helpers/AppRoutes"
import Chip from "@mui/material/Chip"
import PopUpConfirmDays from "@components/mainStepper/PopUpConfirmDays"
import { useRouter } from "next/router"
import Popup from "../mealBox/MealPopUp"
import { UpdatePreferencesSliderRequest } from "store/reducers/profileReducer"
import { unwrapResult } from "@reduxjs/toolkit"
export default function AddAddress({
  currentAddress,
  type,
  handleAddAddressRequest,
  onClick,
  open,
  handleClose,
  updateAddress,
  preferancesPop,
  availableDeliveryDays,
  AddressLoader,
  setShowAddressPopup,
  TotalAddressLength
}) {
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
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { UAEAddresses, startUpData, companyEmirates } = useSelector((state) => state.home)
  const { userProfile } = useSelector((state) => state.profile)

  const companyName = get(userProfile, "company_object.name", "")
  const deliveryDays = userProfile?.profile?.days_food_delivery
  const [startUpLocalSummary, setStartUpLocalSummary] = useState(null)
  const [UAEAddressesLocal, setUAEAddressesLocal] = useState(null)
  const [updateMode, setUpdateMode] = useState(false)
  const [orderType, setOrderType] = useState(null)
  const router = useRouter()
  const [openModalforDayConfirm, setOpenModalforDayConfirm] = useState(false);
  const justDayNameExtract = deliveryDays

  useEffect(() => {
    if (router.query.order_id) {
      setOrderType(router.query.type)
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    if (startUpData) {
      setStartUpLocalSummary(startUpData)
    }
  }, [startUpData])

  const emirates = useMemo(() => {
    if (!isExecutive) return UAEAddresses;

    return companyEmirates;
  }, [UAEAddresses, companyEmirates])

  const getDependentFields = (emirate_id, label) => {
    const emirate = emirates.find((emirate) => emirate.id === emirate_id);

    if (!emirate) return { labels: [], apartments: [], streets: [], cities: [] };

    const companyAddress = get(emirate, "company_address", []);

    const fields = companyAddress.filter((compAdress) => compAdress.label == label).reduce(({ apartments, streets, timeSlots, cities }, address) => {
      apartments.push(address.apartment);
      streets.push(address.street);
      timeSlots.push(address?.time_slot);
      cities.push(address?.area);
      return { apartments, streets, timeSlots, cities };
    }, { apartments: [], streets: [], timeSlots: [], cities: [] })

    return fields;
  }

  const getCompanyAddressId = () => {
    const emirate = emirates.find((emirate) => emirate.id === addressBody.emirate_id);

    if (!emirate || !addressBody.area_id || !addressBody.label || !addressBody.street || !addressBody.apartment || !addressBody.time_slot) return null;

    const companyAddress = get(emirate, "company_address", []);

    const finalAddress = companyAddress.find((compAdress) => (compAdress.area_id == addressBody.area_id &&
      compAdress.label == addressBody.label &&
      compAdress.street == addressBody.street &&
      compAdress.apartment == addressBody.apartment &&
      compAdress.time_slot == addressBody.time_slot)
    );

    return get(finalAddress, 'id', null)
  };

  const getAddressFields = (emirate) => {
    const companyAddresses = get(emirate, "company_address", []);
    if (companyAddresses.length === 0) return { cities: [], labels: [] };

    const fields = companyAddresses.reduce(
      ({ labels }, address) => {
        labels.push(address?.label);
        return { labels };
      },
      { labels: [] }
    );

    return fields;
  };

  const allTimeSlot = get(startUpLocalSummary, "time_slots", [])

  const emiratesValueHandler = () => {
    return addressBody.emiratesValue ?? ""
  }

  const areasValueHandler = () => {
    return addressBody.areaValue ?? ""
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

  useEffect(() => {
    if (UAEAddresses) {
      setUAEAddressesLocal(UAEAddresses)
    }
  }, [UAEAddresses])

  // useEffect(() => {
  //   handleInitialValues()
  // }, [type])

  const finder = (type) => {
    if (isExecutive) {
      const companyEmirates = emirates.find((val) => val.id == addressBody.emirate_id);

      if (!companyEmirates) return "";

      if (type === "emirates") return companyEmirates.name ?? "";

      const { labels } = getAddressFields(companyEmirates);

      const { streets, apartments, timeSlots, cities } = getDependentFields(addressBody.emirate_id, addressBody.label);
      if (type === "area") {
        const area = cities?.find((val) => val.id == addressBody.area_id);
        return area?.name ?? "";
      }

      if (type === "cities") return cities ?? [];
      if (type === "labels") return labels;
      if (type === "streets") return streets;
      if (type === "apartments") return apartments;
      if (type === "timeslots") return timeSlots;

    } else {
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
    if (currentAddress?.address_id) {
      // const addres = get(currentAddress, "address_line_one", "")
      // const labe = get(currentAddress, "label", "")
      // const currId = get(currentAddress, "address_id", "")
      // const currType = get(currentAddress, "type", "")

      addressBody.address = currentAddress.address_line_one
      addressBody.label = currentAddress.label
      addressBody.type = currentAddress.type
      addressBody.address_id = currentAddress.address_id
      addressBody.emirate_id = get(currentAddress, 'emirate.id', null)
      addressBody.area_id = currentAddress.area_id
      addressBody.street = currentAddress.street
      addressBody.apartment = currentAddress.apartment
      addressBody.areaValue = currentAddress.area.name
      addressBody.days = currentAddress.days
      if (isExecutive) {
        addressBody.labels = finder("labels")
        addressBody.streets = finder("streets")
        addressBody.apartments = finder("apartments")
        addressBody.timeSlots = finder("timeslots")
        addressBody.labels = finder("labels")
        addressBody.cities = finder('cities');
        addressBody.time_slot = currentAddress.time_slot;
        addressBody.emiratesValue = get(currentAddress, "emirate.name", "")
      } else {
        addressBody.timeSlots = currentAddress.timeSlots
        addressBody.cities = currentAddress.cities
        addressBody.emiratesValue = currentAddress.time_slot.split(":")[0]
        addressBody.time_slot = currentAddress.time_slot.split(":")[1]
      }
      setAddressBody({ ...addressBody })

      // setAddressBody({
      //   address: addres,
      //   label: labe,
      //   address_id: currId,
      //   type: currType
      // })
      // formik.setFieldValue("address", addres)
      // formik.setFieldValue("label", labe)

      // formik.setFieldValue("address_id", currId)
      setUpdateMode(true)
    } else {
      setUpdateMode(false)
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
    }
  }, [currentAddress])

  // const handleInitialValues = () => {
  //   if (type == AppConstants.addressTypes.update) {
  //     const addressLineOne = get(currentAddress, "address_line_one", "")
  //     const addressLineTwo = get(currentAddress, "address_line_two", "")
  //     const currType = get(currentAddress, "currType", "")
  //     addressBody.address = addressLineOne + addressLineTwo
  //     addressBody.label = get(currentAddress, "label", "")
  //     addressBody.type = currType
  //     setAddressBody({ ...addressBody })
  //   } else {
  //     setAddressBody({
  //       address: "",
  //       label: "",
  //       type: ""
  //     })
  //   }
  // }

  // const handleAddAddress = () => {
  //   if (!addressBody.address) {
  //     // showFaliureToast("Please enter address")
  //   } else if (!addressBody.label) {
  //     // showFaliureToast("Please enter address label")
  //   } else {
  //     // Call API
  //     if (updateMode) {
  //       updateAddress(addressBody)
  //     } else {
  //       handleAddAddressRequest(addressBody)
  //     }
  //   }
  // }

  const handleAddAddress = () => {
    // if (!addressBody.address) {
    //   showFaliureToast("Please enter address")
    // }
    document.body.style.overflow = 'visible'
    if (!addressBody.street) {
      showFaliureToast(message.BUILDING_STREET_NAME)
    } else if (!addressBody.apartment) {
      showFaliureToast(message.APARTMENT_VILLA_NUMBER)
    } else if (!addressBody.time_slot) {
      showFaliureToast(message.TIME_SLOT)
    }
    // else if (addressBody.address.length < 20) {
    //   showFaliureToast("Address length must be minimum 20")
    // }
    // else if (!addressBody.address.match(/^[^\s]+.*/)) {
    //   showFaliureToast("Please Enter Valid Address")
    // }
    else if (!addressBody.label && addressBody.type === "other") {
      showFaliureToast(message.ADDRESS_LABEL)
    } else if (
      addressBody.label &&
      !addressBody.label.match(/^(?!\d)\s*[^\s]/) &&
      addressBody.type === "other"
    ) {
      showFaliureToast(message.CORRECT_LABEL)
      // } else if (addressBody.label.length < 5) {
      //   showFaliureToast("label length must be minimum 5")
    } else if (!addressBody.type && !isExecutive) {
      showFaliureToast(message.TYPE_OF_ADDRESS)
    } else {
      // Call API
      if (updateMode) {
        updateAddress({
          ...addressBody,
          address_id: isExecutive ? getCompanyAddressId() : get(addressBody, "address_id", null),
        })
      } else {
        AppLogger("This is address body========", addressBody)
        handleAddAddressRequest({
          ...addressBody,
          ...(isExecutive && {
            company_address_id: getCompanyAddressId()
          }),
        })
        // addAddressHandler()
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
  //   // .required("Address label is Required")
  // })
  // const formik = useFormik({
  //   initialValues: {
  //     address: addressBody.address,
  //     address_id: addressBody.address_id,
  //     label: addressBody.label
  //   },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
  //     saveUserOnButtonHandler(values)
  //   }
  // })


  const handleSubmitPress = () => {
    handleClose()
    setOpenModalforDayConfirm(false)
    handleAddAddress()
    setAlreadyOpened(false)

  }
  const [openDays, setDaysOpen] = useState(false)
  const [AlreadyOpened, setAlreadyOpened] = useState(false)
  const [currentModalType, setCurrentModalType] = useState("")
  const [currentData, setCurrentData] = useState(null)
  const [allUserPreferencesData, setAllUserPreferencesData] = useState(
    {
      vegeterian: "",
      allergy: [],
      meal_plan_start_date: "",
      days_food_delivery: [],
      meal_plan_pause_date: [],
      food_dislikes: [],
      meal_plan_end_date: "",
      delivery_address: "",
      snacks_deliver_per_day: "",
      meals_deliver_per_day: "",
      meal_days_per_week: "",
      meal_plan_require_weeks: "",
      meal_plan: [],
      phone: "",
      culinary_check: 1,
      notification: 0,
      exclude_breakfast: 0
    }
  )
  let GuestProfile = userProfile?.guest;
  let userProfileMain = userProfile;

  const dispatch = useDispatch()
  React.useEffect(() => {
    if (userProfile?.profile) {
      const { allergies, dislikes, pause_dates, profile, guest, phone } =
        userProfileMain;

      const allAllergies = allergies.map((allergy) => allergy?.title)
      const allDislikes = dislikes.map((dislike) => dislike?.title)
      const pauseDates =
        pause_dates.length > 0
          ? pause_dates?.map((pauseDate) => {
            const dateObj = new Date(pauseDate?.meal_plan_pause_date)
            // const dateObj = new Date(date)
            const formattedDate = dateObj
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })
              .replace(/\//g, ".")
            return formattedDate
          })
          : []
      setAllUserPreferencesData({
        vegeterian: profile?.vegeterian,
        allergy: allAllergies,
        days_food_delivery: profile?.days_food_delivery,
        meal_plan_pause_date: pauseDates,
        food_dislikes: allDislikes,
        meal_plan_start_date: profile?.meal_plan_start_date,
        meal_plan_end_date: profile?.meal_plan_end_date,
        delivery_address: profile?.delivery_address,
        snacks_deliver_per_day: guest?.snacks_deliver_per_day,
        meals_deliver_per_day: guest?.meals_deliver_per_day,
        meal_days_per_week: guest?.meal_days_per_week,
        meal_plan_require_weeks: guest?.meal_plan_require_weeks,
        meal_plan: guest?.meal_plan,
        phone: phone,
        culinary_check: profile?.culinary_check ?? 1,
        notification: profile?.notification ?? 1,
        exclude_breakfast: profile?.exclude_breakfast ?? 0
      })
    }
  }, [userProfile?.profile]);

  const handleClickOpen = (type, data) => {
    setCurrentModalType(type)
    setCurrentData(data)
    setDaysOpen(true)
  }
  const handleCloseDays = (event, reason) => {
    setDaysOpen(false)
  }
  const handleGetPreviousPayload = () => {
    if (userProfile) {
      const { guest } = userProfile
      return {
        meal_plan: guest?.meal_plan,
        snacks_deliver_per_day: guest?.snacks_deliver_per_day,
        meals_deliver_per_day: guest?.meals_deliver_per_day,
      }
    }

    return {}
  }
  const [isLoading, setIsLoading] = useState(false)
  const updatePreferencesHandler = async () => {
    const { auth_token } = userDetails?.data
    setIsLoading(true)

    const allData = {
      ...allUserPreferencesData,
      ...handleGetPreviousPayload()
    }
    dispatch(
      UpdatePreferencesSliderRequest({
        preferenceData: allData,
        token: auth_token
      })
    )
      .then(unwrapResult)
      .then((res) => {
        setIsLoading(false)
        setDaysOpen(false)
        AppLogger("Response at updatePreferencesHandler", res)
      })
      .catch((error) => {
        setIsLoading(false)
        AppLogger("Error at updatePreferencesHandler", error)
      })
  }


  const handleFormChangeData = (value, key) => {
    try {
      allUserPreferencesData[key] = value
      setAllUserPreferencesData({ ...allUserPreferencesData })
      updatePreferencesHandler()
      setAlreadyOpened(true)
    } catch (err) {
      AppLogger("Error at handleFormChangeData", err)
    }
  }
  return (
    <div>
      <Dialog
        className={preferancesPop ? "myAddress sty2" : "myAddress"}
        // className="myAddress"
        open={open}
        // onClose={() => {
        //   handleClose()
        //   // setAddressBody({
        //   //   address: "",
        //   //   label: ""
        //   // })
        // }}
      >
        <div className="sec-padded">
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              color: preferancesPop ? AppColors.primaryGreen : AppColors.white
            }}
          >
            {/* {`${updateMode ? "Edit" : "Add New"} Address`} */}
            {
              isExecutive ? updateMode ?
                "Edit Workplace Delivery Address" : 'Set Workplace Delivery Address'
                : `${updateMode ? "Edit" : "Add New"} Address`
            }
          </Typography>

          <div className="fieldWrapper">
            <form>
              {/* <form onSubmit={formik.handleSubmit}> */}
              {/* <TextareaAutosize
                // value={addressBody.label}
                value={formik.values.address}
                helperText={formik.touched.address && formik.errors.address}
                error={formik.touched.address && formik.errors.address}
                // required
                name="address"
                placeholder="Address"
                minRows={6}
                maxRows={4}
                onChange={(e) => {
                  formik.handleChange(e)
                  // formik.setFieldValue("address", e.target.value)
                  setAddressBody({ ...addressBody, label: e.target.value })
                }}
                // onBlur={formik.handleBlur}
                // onBlur={() => formik.setFieldTouched("address", true)}
              /> */}
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
                  options={Array.isArray(availableDeliveryDays) ? availableDeliveryDays : []} // Ensure it's always an array
                  getOptionLabel={(option) => {
                    return option ? String(option) : "";
                  }}
                  value={Array.isArray(addressBody.days) ? addressBody.days : []} // Ensure it's always an array
                  onChange={(e, value) => {
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
                    option.name == value.name
                  }
                  disableClearable={emiratesValueHandler() == "" ? true : false}
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
                      if (isExecutive) {
                        const { labels } = getAddressFields(i);

                        setAddressBody({
                          ...addressBody,
                          emiratesValue: i.name,
                          labels: labels,
                          emirate_id: i.id
                        })
                      } else {
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
                        timeSlots: [],
                        emiratesValue: "",
                        areaValue: "",
                        emirate_id: "",
                        area_id: "",
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
                        if (i) {
                          if (isExecutive) {
                            const { apartments, streets, timeSlots, cities } = getDependentFields(addressBody.emirate_id, i);
                            setAddressBody({
                              ...addressBody,
                              apartments: apartments,
                              streets: streets,
                              timeSlots: timeSlots,
                              cities: cities,
                              label: i
                            })
                          }
                        } else {
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
                  onInputChange={(e) => {
                    if (e) {
                      setAddressBody({
                        ...addressBody,
                        areaValue: e.target.value
                      })
                    }
                  }}
                  disableClearable={areasValueHandler() == "" ? true : false}
                  inputValue={areasValueHandler() ?? ""}
                  value={areasValueHandler() ?? ""}
                  onChange={(e, i) => {
                    if (i) {
                      if (isExecutive) {
                        const { apartments, streets, timeSlots } = getDependentFields(addressBody.emirate_id, addressBody.label);
                        setAddressBody({
                          ...addressBody,
                          areaValue: i.name,
                          emirate_id: i.emirate_id,
                          area_id: i.id,
                          apartments: apartments,
                          streets: streets,
                          timeSlots: timeSlots
                        })
                      } else {
                        setAddressBody({
                          ...addressBody,
                          areaValue: i.name,
                          emirate_id: i.emirate_id,
                          area_id: i.id
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
                ) :
                  <InputField
                    sx={{
                      color: AppColors.white
                    }}
                    name="streetName"
                    placeholder="Building / Street Name"
                    value={addressBody.street}
                    onChange={(e) => {
                      setAddressBody({ ...addressBody, street: e.target.value })
                    }}
                  />
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
                ) :
                  <InputField
                    sx={{
                      color: AppColors.white
                    }}
                    customClass="villa"
                    name="villaNumber"
                    placeholder="Apartment / Villa / Office number / Business Name"
                    value={addressBody.apartment}
                    onChange={(e) => {
                      setAddressBody({
                        ...addressBody,
                        apartment: e.target.value
                      })
                    }}
                  />
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
                  disableClearable={timeSlotValueHandler() == "" ? true : false}
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
              {/* <InputField
                // value={addressBody.label}
                value={formik.values.address}
                helperText={formik.touched.address && formik.errors.address}
                error={formik.touched.address && formik.errors.address}
                // required
                name="address"
                placeholder="Address"
                minRows={6}
                maxRows={4}
                onChange={(e) => {
                  formik.handleChange(e)
                  // formik.setFieldValue("address", e.target.value)
                  setAddressBody({ ...addressBody, label: e.target.value })
                }}
                // onBlur={formik.handleBlur}
                onBlur={() => formik.setFieldTouched("address", true)}
              ></InputField> */}

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
                        value={addressBody.type}
                        onChange={(e) => {
                          setAddressBody({
                            ...addressBody,
                            type: e.target.value
                          })
                        }}
                        name="radio-buttons-group"
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
                              checked={addressBody.type == "office" ? true : false}
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
                  placeholder="Please name the address "
                  value={addressBody.type !== "other" ? "" : addressBody.label}
                  disabled={addressBody.type !== "other"}
                  // value={addressBody.address}
                  // maxLength={200}
                  onChange={(e) => {
                    // formik.handleChange(e)
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
                  disabled={
                    AddressLoader ||
                    addressBody.emirate_id == "" ||
                    addressBody.area_id == "" ||
                    addressBody.time_slot == "" 
                  }
                  // type="submit"
                  onClick={() => {
                    // if (updateMode == true) {
                    //   handleAddAddress()
                    // }
                    // formik.handleSubmit()
                    if (orderType == AppConstants.full && TotalAddressLength <= 0 && !isExecutive && !AlreadyOpened) {
                      setOpenModalforDayConfirm(true)

                      // handleClickOpen(
                      //   "days_food_delivery",
                      //   allUserPreferencesData.days_food_delivery
                      // )
                    } else {
                      handleAddAddress()
                    }
                    // if (formik.isValid) {
                    // }
                  }}
                  // onClick={handleAddAddress}
                  className="outlined"
                  variant="outlined"
                  sx={{ borderColor: AppColors.white, color: AppColors.white }}
                >
                  {`${updateMode ? "Update" : "Add this Address"}`}
                </Button>
                <Button
                  onClick={() => {
                    handleClose()
                    setAddressBody({
                      ...addressBody,
                      area_id: "",
                      emirate_id: "",
                      cities: [],
                      emiratesValue: "",
                      areaValue: "",
                      street: "",
                      apartment: "",
                      timeSlots: [],
                      time_slot: "",
                      labels: [],
                      apartments: [],
                      streets: [],
                      timeSlots: []
                    })
                  }}
                  className="outlined"
                  variant="outlined"
                  sx={{ borderColor: AppColors.white, color: AppColors.white }}
                >
                  Cancel
                </Button>
                {updateMode ? (
                  <Typography
                    color={AppColors.white}
                    sx={{
                      fontSize: "13px",
                      padding: "0 15px",
                      marginTop: "10px"
                    }}
                  >
                    Please note: address changes take between 12 and 36 hours to
                    take effect. For more information, please call our Customer
                    Care team on{" "}
                    <Link
                      target="_Blank"
                      color={AppColors.white}
                      sx={{
                        display: "inline-block",
                        paddingBottom: "0 !important"
                      }}
                      href={AppRoutes.whatsapp}
                    >
                      +971 52 327 1183.
                    </Link>
                  </Typography>
                ) : null}
              </div>
            </form>
          </div>
        </div>
        <Button className={`crossButton ${isExecutive ? 'isExecutive' : ''}`} onClick={handleClose}>
          x
        </Button>
      </Dialog>
      <PopUpConfirmDays
        addressBody={addressBody}
        openModalforDayConfirm={openModalforDayConfirm}
        isExecutive={isExecutive}
        AppColors={AppColors}
        setOpenModal={setOpenModalforDayConfirm}
        // handleBack={handleBack}
        formData={{ days_food_delivery: justDayNameExtract }}
        onYesClick={handleSubmitPress}
        onNoClick={() => {
          setShowAddressPopup(true)
        }}
        changeDaysFunc={()=>{
          setOpenModalforDayConfirm(false);
           handleClickOpen("days_food_delivery",allUserPreferencesData.days_food_delivery)
        }}
      />
      <Popup
        // selectedAddressTimeSlot={selectedAddressTimeSlot}
        open={openDays}
        currentModalType={'days_food_delivery'}
        // handleClose={handleCloseDays}
        handleClose={handleCloseDays}
        onClose={() => { }}
        handleClickOpen={handleClickOpen}
        days={allUserPreferencesData?.meal_days_per_week}
        currentData={currentData}
        handleFormData={handleFormChangeData}
        loading={isLoading}
        dontCloseOnsave={true}
      />
    </div>
  )
}
