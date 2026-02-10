import React from "react"
import EditContent from "../../components/editContent"
import PropTypes from "prop-types"

const ContentText = (props) => {
  const { title, para, para2, para3, para4, mb ,color ,link , handlePartnerChange , isExecutive} = props
  return (
    <EditContent
      isExecutive={isExecutive}
      handlePartnerChange={handlePartnerChange}
      link={link}
      mb={mb}
      title={title}
      para={para}
      para2={para2}
      para3={para3}
      para4={para4}
      color={color}
    />
  )
}

ContentText.propTypes = {
  title: PropTypes.string,
  para: PropTypes.string,
  para2: PropTypes.string,
  para3: PropTypes.string,
  para4: PropTypes.string
}

export default ContentText
