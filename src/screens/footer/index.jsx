import React from "react"
import Footer from "../../components/footer"
const footer = ({isExecutive , hideFooterLinks}) => {
  return (
    <section className="secFooter">
      <Footer isExecutive={isExecutive} hideFooterLinks={hideFooterLinks}/>
    </section>
  )
}

export default footer
