import React, { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import PropTypes from "prop-types"
import AllergiesEdit from "./AllergiesEdit"
import DislikeEdit from "./DislikeEdit"
import TimeSlots from "./TimeSlotEdit"
import DaysEdit from "./DaysEdit"
import AppColors from "helpers/AppColors"
import { showFaliureToast } from "../../helpers/AppToast"
import AppLogger from "../../helpers/AppLogger"
import Button from "@mui/material/Button"
import { Typography } from "@mui/material"
import { useSelector } from "react-redux"

export default function Popup({
  open,
  handleClose,
  currentModalType,
  currentData,
  handleFormData,
  days,
  onClose,
  selectedAddressTimeSlot,
  loading=false,
  handleCloseCross,
  dontCloseOnsave=false
}) {
  const [userAddressData, setAddressData] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const vegeterianData = ["Yes I am", "No I am not"]
  const culinaryData = [1, 0]
  const notificationData = [1, 0]
  const breakfastData = [1, 0]
  const [activeIndex, setActiveIndex] = useState(0)
  const [ErrorText, setErrorText] = useState(false)
  const [AddErrorText, setAddErrorText] = useState(false)
  const { isExecutive } = useSelector((state) => state.auth)
  useEffect(() => {
    if (currentData) {
      setAddressData(currentData)
      setUserPhone(currentData)
    } else {
      setAddressData("")
      setUserPhone("")
    }
  }, [currentData])

  useEffect(() => {
    currentFieldsPopulateHandler()
  }, [currentData, currentModalType])

  const currentFieldsPopulateHandler = () => {
    if (currentModalType == "vegeterian") {
      AppLogger("This is currentModal======", currentData)
      const currentIndex = vegeterianData.findIndex((val) => val == currentData)

      if (currentIndex !== -1) {
        setActiveIndex(currentIndex)
      }
    }
    if (currentModalType == "culinary_check") {
      AppLogger("This is currentModal======", currentData)
      const currentIndex = culinaryData.findIndex((val) => val == currentData)

      if (currentIndex !== -1) {
        setActiveIndex(currentIndex)
      }
    }
    if (currentModalType == "notification") {
      const currentIndex = notificationData.findIndex(
        (val) => val == currentData
      )

      if (currentIndex !== -1) {
        setActiveIndex(currentIndex)
      }
    }
    if (currentModalType == "exclude_breakfast") {
      const currentIndex = breakfastData.findIndex(
        (val) => val == currentData
      )

      if (currentIndex !== -1) {
        setActiveIndex(currentIndex)
      }
    }
  }
  const handleClick = (index) => {
    setActiveIndex(index)
  }

  const VegeterianEdit = () => (
    <>
      <div className="allergiessection">
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
        >
          {"Are you Vegetarian?"}
        </Typography>
        <div className="alergiesWrap">
          {vegeterianData.map((val, i) => (
            <button
              key={i}
              className={activeIndex === i ? "active" : ""}
              onClick={() => {
                handleFormData(val, currentModalType)
                handleClose()
                handleClick(i)
              }}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
      <Button 
      // className="crossButton" 
      className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
      onClick={handleClose}>
        x
      </Button>
    </>
  )

  const CulinaryCheck = () => {
    return (
      <>
        <div className="allergiessection">
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
          >
            {"Do you want us to deliver cutlery with your food?"}
          </Typography>
          <div className="alergiesWrap">
            {culinaryData.map((val, i) => {
              return (
                <button
                  key={i}
                  className={activeIndex === i ? "active" : ""}
                  onClick={() => {
                    handleFormData(val, currentModalType)
                    handleClose()
                    handleClick(i)
                  }}
                >
                  {val === 1 ? "Yes" : "No"}
                </button>
              )
            })}
          </div>
        </div>
        <Button 
        // className="crossButton"
        className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
         onClick={handleClose}>
          x
        </Button>
      </>
    )
  }

  const NotificationCheck = () => {
    return (
      <>
        <div className="allergiessection">
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
          >
            {
              "Do you want our delivery partners to let you know each time your food is on its way?"
            }
          </Typography>
          <div className="alergiesWrap">
            {notificationData.map((val, i) => {
              return (
                <button
                  key={i}
                  className={activeIndex === i ? "active" : ""}
                  onClick={() => {
                    handleFormData(val, currentModalType)
                    handleClose()
                    handleClick(i)
                  }}
                >
                  {val === 1 ? "Yes" : "No"}
                </button>
              )
            })}
          </div>
        </div>
        <Button 
        // className="crossButton" 
        className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
        onClick={handleClose}>
          x
        </Button>
      </>
    )
  }

  const ExcludeBreakfastCheck = () => {
    return (
      <>
        <div className="allergiessection">
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
          >
            {
              "Do you want to exclude breakfast items?"
            }
          </Typography>
          <div className="alergiesWrap">
            {breakfastData.map((val, i) => {
              return (
                <button
                  key={i}
                  className={activeIndex === i ? "active" : ""}
                  onClick={() => {
                    handleFormData(val, currentModalType)
                    handleClose()
                    handleClick(i)
                  }}
                >
                  {val === 1 ? "Yes" : "No"}
                </button>
              )
            })}
          </div>
        </div>
        <Button 
        // className="crossButton"
        className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
         onClick={handleClose}>
          x
        </Button>
      </>
    )
  }

  const DelieveryAddress = ({ value, setValue, onClick }) => {
    return (
      <>
        <Typography
          component={"p"}
          variant="body3"
          sx={{
            color: AppColors.primaryGreen,
            fontWeight: 500,
            textAlign: "center",
            paddingBottom: "18px"
          }}
        >
          Address
        </Typography>
        {AddErrorText ? (
          <div className="errorMsg">
            <Typography>Enter Correct Address</Typography>
          </div>
        ) : null}
        <div className="addressWrapper" id="form">
          <input
            autoFocus
            type="text"
            id="delieveryAddress"
            placeholder="Enter Your Address"
            value={value}
            onChange={setValue}
          />
          <button onClick={onClick}>Save</button>
        </div>
        <Button 
        // className="crossButton"
        className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
         onClick={handleClose}>
          x
        </Button>
      </>
    )
  }

  const Phone = ({ value, setValue, onClick }) => {
    return (
      <>
        <Typography
          component={"p"}
          variant="body3"
          sx={{
            color: AppColors.primaryGreen,
            fontWeight: 500,
            textAlign: "center",
            paddingBottom: "18px"
          }}
        >
          Phone Number
        </Typography>
        <div className="addressWrapper" id="Phone-form">
          <input
            maxlength="14"
            autoFocus
            type="text"
            id="Phone"
            placeholder="Enter your phone number"
            value={value}
            onChange={setValue}
          />
          {ErrorText ? (
            <div className="errorMsg">
              <Typography>Enter Correct Phone Number</Typography>
            </div>
          ) : null}

          <button onClick={onClick}>Save</button>
        </div>
        <Button 
        // className="crossButton"
        className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
         onClick={handleClose}>
          x
        </Button>
      </>
    )
  }

  const renderComponentHandler = () => {
    switch (currentModalType) {
      case "allergy":
        return (
          <AllergiesEdit
            handleClose={handleClose}
            currentData={currentData}
            setCurrentData={(data) => handleFormData(data, currentModalType)}
          />
        )

      case "vegeterian":
        return <VegeterianEdit />

      case "food_dislikes":
        return (
          <DislikeEdit
            type="dislike"
            handleClose={handleClose}
            currentData={currentData}
            setCurrentData={(data) => handleFormData(data, currentModalType)}
          />
        )
      case "days_food_delivery":
        return (
          <DaysEdit
            crossClose={handleCloseCross}
            handleClose={handleClose}
            currentData={currentData}
            onClose={onClose}
            days={days}
            loading={loading}
            dontCloseOnsave={dontCloseOnsave}
            setCurrentData={(data) => handleFormData(data, currentModalType)}
          />
        )
      case "delivery_address":
        return (
          <DelieveryAddress
            value={userAddressData}
            setValue={(e) => setAddressData(e.target.value)}
            onClick={() => {
              if (userAddressData) {
                // Start------added for validation //
                if (!userAddressData || !userAddressData.match(/^[^0-9\s].*/)) {
                  showFaliureToast(
                    "Please enter your correct address to continue"
                  )
                  setAddErrorText(true)
                } else {
                  handleClose()
                  setAddErrorText(false)
                }
                handleFormData(userAddressData, currentModalType)
                // END //

                // handleFormData(userAddressData, currentModalType)
                // handleClose()
              } else {
                showFaliureToast("Please enter your address to continue")
              }
            }}
          />
        )
      case "delivery_time":
        return (
          <TimeSlots
            type="dislike"
            handleClose={handleClose}
            selectedAddressTimeSlot={selectedAddressTimeSlot}
            currentData={currentData}
            setCurrentData={(data) => handleFormData(data, currentModalType)}
          />
        )
      case "phone":
        return (
          <Phone
            value={userPhone}
            setValue={(e) => setUserPhone(e.target.value)}
            onClick={() => {
              if (userPhone) {
                // Start------added for validation //

                if (!userPhone || !userPhone.match(/^\d+$/)) {
                  // showFaliureToast("Please enter your correct phone number")
                  setErrorText(true)
                } else {
                  handleClose()
                  setErrorText(false)
                }
                // END //
                handleFormData(userPhone, currentModalType)
                // handleFormData(userAddressData, currentModalType)
                // handleClose()
              } else {
                showFaliureToast("Please enter your phone number")
              }
            }}
          />
        )
      case "culinary_check":
        return <CulinaryCheck />
      case "notification":
        return <NotificationCheck />
      case "exclude_breakfast":
        return <ExcludeBreakfastCheck />
      default:
        break
    }
  }

  return (
    <div className="editPrefencePop">
      <Dialog
        className={
          renderComponentHandler()?.props?.type == "dislike"
            ? "editPop Allergy"
            : "editPop"
        }
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={true}
      >
        {renderComponentHandler()}
      </Dialog>
    </div>
  )
}
Popup.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleFormData: PropTypes.func,
  currentModalType: PropTypes.string,
  currentData: PropTypes.any,
  value: PropTypes.any,
  setValue: PropTypes.any,
  onClick: PropTypes.any
}

// DelieveryAddress.propTypes = {
//   value: PropTypes.any,
//   setValue: PropTypes.any,
//   onClick: PropTypes.any
// }
