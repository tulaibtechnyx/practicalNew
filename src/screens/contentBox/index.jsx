import React from "react"
import ContentBox from "../../components/contentBox"
import PropTypes from "prop-types"

const Content = (props) => {
  const { dataRec } = props
  return <ContentBox dataRec={dataRec} />
}
Content.propTypes = {
  dataRec: PropTypes.any
}
export default Content
