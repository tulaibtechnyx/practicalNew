import React from "react"
import BannerThank from "../../components/bannerThanks"
import PropTypes from "prop-types"
const BannerBg = (props) => {
  const { data } = props
  return <BannerThank data={data} />
}
BannerBg.propTypes = {
  data: PropTypes.object
}

export default BannerBg
