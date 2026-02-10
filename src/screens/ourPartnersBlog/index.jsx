import React from "react"
import CommunityComp from "../../components/ourCommunityBlog"
const OurPartnersScreen = ({isExecutive}) => {
  return (
    <>
      <div className="sec-padded">
        <CommunityComp isExecutive={isExecutive}/>
      </div>
    </>
  )
}

export default OurPartnersScreen
