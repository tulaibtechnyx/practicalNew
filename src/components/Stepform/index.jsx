import React, { useState } from "react"
import Gender from "../Formcomponents/Gender"
import Goal from "../Formcomponents/Goal"
import Activity from "../Formcomponents/Activity"
import Age from "../Formcomponents/Age"
import Weight from "../Formcomponents/Weight"
import Meals from "../Formcomponents/Meals"
import Final from "../Formcomponents/Final"

function Stepform() {
  
  const [step, setstep] = useState(1)
  const [formData, setFormData] = useState({})

  const nextStep = () => {
    setstep(step + 1)
  }
  const prevStep = () => {
    setstep(step - 1)
  }

  const handleInputData = (input) => (e) => {
    const { value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [input]: value
    }))
  }

  switch (step) {
    case 1:
      return (
        <Gender
          nextStep={nextStep}
          handleFormData={handleInputData}
          values={formData}
        />
      )
    case 2:
      return (
        <Goal
          nextStep={nextStep}
          prevStep={prevStep}
          handleFormData={handleInputData}
          values={formData}
        />
      )
    case 3:
      return (
        <Activity
          nextStep={nextStep}
          prevStep={prevStep}
          handleFormData={handleInputData}
          values={formData}
        />
      )
    case 4:
      return (
        <Age
          nextStep={nextStep}
          prevStep={prevStep}
          handleFormData={handleInputData}
          values={formData}
        />
      )
    case 5:
      return (
        <Weight
          nextStep={nextStep}
          prevStep={prevStep}
          handleFormData={handleInputData}
          values={formData}
        />
      )
    case 6:
      return (
        <Meals
          nextStep={nextStep}
          prevStep={prevStep}
          handleFormData={handleInputData}
          values={formData}
        />
      )
    case 7:
      return <Final values={formData} />
    default:
      return null
  }
  // Switch Functionality Starts//
}

export default Stepform
