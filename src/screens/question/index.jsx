import QuesComp from "components/question"
import React from "react"

const QuesScreen = ({ tabchange, freeFood, handleTabChange, isExecutive }) => {
  return (
    // <div className="sec-padded">
    //   <div className="container  container--custom">
    <QuesComp tabchange={tabchange} freeFood={freeFood} handleTabChange={handleTabChange} isExecutive={isExecutive}/>
    //   </div>
    // </div>
  )
}

export default QuesScreen
