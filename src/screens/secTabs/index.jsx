import React from "react"
import TabPanel from "../../components/tabs"
const secTabs = ({
  changed,
  canEdit,
  retakeQuiz,
  order_id,
  type,
  setPropFunctions,
  handleAddToWallet,
  isOrderReady,
  setter,
  isExecutive,
}) => {
  return (
    <>
      <section className="secTabs">
        <TabPanel
          isOrderReady={isOrderReady}
          handleAddToWallet={handleAddToWallet}
          setPropFunctions={setPropFunctions}
          retakeQuiz={retakeQuiz}
          canEdit={canEdit}
          changed={changed}
          order_id={order_id}
          type={type}
          setter={setter}
          isExecutive={isExecutive}
        />
      </section>
    </>
  )
}

export default secTabs
