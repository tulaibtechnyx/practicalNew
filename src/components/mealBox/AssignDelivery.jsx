import { TextField } from "@mui/material"
import { Dialog } from "@mui/material"
import { Button, Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import Autocomplete from "@mui/material/Autocomplete"
import { useState } from "react"
import get from "lodash/get"
import { useEffect } from "react"
import { useSelector } from "react-redux"

export default function AssignDelivery({
  open,
  handleClose,
  customClass,
  availableDays,
  availableAddresses,
  handleAddAddress,
  handleScheduleAddress,
  addressWithDays
}) {

  const [scheduleAddressBody, setScheduleAddressBody] = useState({})
  const { isExecutive } = useSelector((state) => state.auth)

  const transformInitialData = () => {
    if(availableDays?.length > 0 && addressWithDays){
      for(let i=0; i<availableDays.length; i++){
        scheduleAddressBody[availableDays[i]] = {
          address_id: addressWithDays[availableDays[i]]?.id,
           ...addressWithDays[availableDays[i]]
          }
      }
      setScheduleAddressBody({...scheduleAddressBody})
    }
  }

  useEffect(()=>{
    transformInitialData()
  }, [addressWithDays, open])

  const handleOnChangeAddress = (selectedAddress, day) => {
    const addressId = get(selectedAddress, 'id', null);
    if(addressId && day){
      scheduleAddressBody[day] = {address_id: addressId, ...selectedAddress}
    }
  }

  const handleShowLabel = (option) => {
    if(option){
      const area  = get(option, "area.name", "");
      const apartment  = get(option, "apartment", "");
      if(area && apartment){
        return `${area}, ${apartment}`
      }
    }

    return ""
  }

  const AddressBox = ({day}) =>{
    return(
        <div className="selectWrap sty2 ">
          <div className="dayCount">
            <Typography component={'p'} variant={'body1'}>{day ?? ''}</Typography>
          </div>
          <Autocomplete
            disablePortal
            defaultValue={scheduleAddressBody[day] ?? ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, i) => handleOnChangeAddress(i, day)}
            options={availableAddresses}
            getOptionLabel={(option) => handleShowLabel(option)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Delivery Address" />
            )}
          />
        </div>
   
    )
  }

  const createSVG = (type = '', customClass = '') => {
    switch (type) {
      case 'Add-Icon':
        return (
        <svg className={customClass} width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4143 22.3516C17.9372 22.3516 22.4143 17.8744 22.4143 12.3516C22.4143 6.8287 17.9372 2.35154 12.4143 2.35154C6.89145 2.35154 2.41428 6.8287 2.41428 12.3516C2.41428 17.8744 6.89145 22.3516 12.4143 22.3516ZM12.4143 24.7004C19.2344 24.7004 24.7632 19.1717 24.7632 12.3516C24.7632 5.53147 19.2344 0.00268555 12.4143 0.00268555C5.59421 0.00268555 0.0654297 5.53147 0.0654297 12.3516C0.0654297 19.1717 5.59421 24.7004 12.4143 24.7004Z" fill="#179C78"/>
          <path d="M6.89502 13.9153V10.7877H10.8637V6.81909H13.9913V10.7877H17.9336V13.9153H13.9913V17.884H10.8637V13.9153H6.89502Z" fill="#179C78"/>
        </svg>
        );
      default:
        return <></>;
    }
  };
  return (
    <div>
      <Dialog className={`myCard sty2 assignDelivery ${customClass}`} open={open} onClose={handleClose}>
        <div className="sec-padded">
          <Typography
            variant="h3"
            sx={{
              color: AppColors.primaryGreen,
              fontWeight: 700,
              textAlign: "center",
              paddingBottom: "30px"
            }}
          >
            Assign Delivery Address
          </Typography>
          <div className="fieldWrapper sty2">
            {availableDays?.length > 0 ?
              availableDays?.map((day, index) => (
                <AddressBox day={day} key={index} />
              )) : null
            }
                {availableAddresses.length < 5 ?
            <div className="addressCta">
              <div onClick={handleAddAddress ?? handleClose} className="innerWrapper">
                
                {createSVG('Add-Icon' , customClass ? 'white' : '')} 
                <Typography component={'p'} variant={'body1'}>Add New Address</Typography> 
                
              </div>
            </div>
                 : null
                 }
            <div className="popButtons">
              <Button onClick={() => handleScheduleAddress(scheduleAddressBody)} className="updateCta">
                Update 
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                className="cancel"
                
              >
                Cancel
              </Button>
              </div>
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
