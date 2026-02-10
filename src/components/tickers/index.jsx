import React, { useEffect } from "react"
import PaidAndSubscribedTicker from "./PaidAndSubscribedTicker"
import UnPaidTicker from "./UnPaidTicker"
import OneTimePaidTicker from "./OneTimePaidTicker"
import TopUpTicker from "./TopUpTicker"

export default function TickerComp({isExecutive}) {
    
  useEffect(() => {
    handleTicketStatus()
  }, [])

  const handleTicketStatus = () => {}
  return (
    <>
      <PaidAndSubscribedTicker />
      <UnPaidTicker isExecutive={isExecutive}/>
      <OneTimePaidTicker />
      <TopUpTicker />
    </>
  )
}
