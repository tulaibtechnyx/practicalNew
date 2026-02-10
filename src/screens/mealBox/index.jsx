import React, { useEffect } from "react"
import EditMealBox from "../../components/mealBox"
import { setGlobalLoading, setswitchTabTo } from "store/reducers/dashboardReducer"
import { useDispatch, useSelector } from "react-redux"

const MealBox = (props) => {
  const {
    Renewal,
    summaryData,
    confirmBtnClicked,
    paymentCheck,
    paymentStatusRenewal,
    resetPayload,
    handleClick,
    dateCall,
    renewalView,
    children,
    btnDisable,
    setChangesPending,
    isExecutive,
    setOpen,
    wantsToSwitchToTab,
    setValue,
    setDiscardModalState=()=>{},
    setclickhereClicked=()=>{},
   } = props;

  const dispatch = useDispatch()

  useEffect(()=>{
    return()=>{
      dispatch(setGlobalLoading(false));
      dispatch(setswitchTabTo(''))
      setclickhereClicked(false)
    }
  },[])

  return (
    <div className="mealWrapper">
      <EditMealBox
        btnDisable={btnDisable}
        renewalView={renewalView}
        dateCall={dateCall}
        handleClick={handleClick}
        paymentStatusRenewal={paymentStatusRenewal}
        confirmBtnClicked={confirmBtnClicked}
        summaryData={summaryData}
        Renewal={Renewal}
        paymentCheck={paymentCheck}
        resetPayload={resetPayload}
        setChangesPending={setChangesPending}
        isExecutive={isExecutive}
        setOpenUnsavedModal={setOpen}
        wantsToSwitchToTab={wantsToSwitchToTab}
        setValue={setValue}
        setDiscardModalState={setDiscardModalState}
      >
        {children}
      </EditMealBox>
    </div>
  )
}

export default MealBox
