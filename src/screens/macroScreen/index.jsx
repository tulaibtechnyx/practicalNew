import React from "react"
import Macrobalanced from "../../components/macroBalanced"
const Macroscreen = ({ awesomepage , currentDate , isExecutive}) => {
  return (
    <div className="macroscreen">
      <div className="container container--custom">
        <Macrobalanced awesomepage={awesomepage} currentDate={currentDate} isExecutive={isExecutive}/>
      </div>
    </div>
  )
}

export default Macroscreen
