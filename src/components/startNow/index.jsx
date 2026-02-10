import React, { useEffect, useState } from "react"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import { isStagingServer, setStorage } from "../../helpers/ShortMethods"
import absoluteUrl from "next-absolute-url"
import { pushToDataLayer } from "@helpers/CommonFunc"

const startNow = (props) => {
  const { title, cta, link, sty2 ,isExecutive} = props
  const [baseUrl, setbaseUrl] = useState("")

  useEffect(() => {
    const { origin } = absoluteUrl()
    setbaseUrl(origin ?? "")
  }, [])
  return (
    <div className="container container--custom">
      <div className={`${sty2 ? styles.startBox2 : styles.startBox} ${isExecutive ? styles.isExecutive : '' } `}>
        <Typography
          variant={"body2"}
          className={styles.boxTitle}
          sx={{ padding: "0 50px", maxWidth: "380px", margin: "0 auto 20px" }}
        >
          {title}
        </Typography>
        <Button
          className={isExecutive ? styles.isExecutive : '' }
          onClick={cta == 'Find my calories' ? () => setStorage('scroll') : () => {
            pushToDataLayer("quick_quiz_cta")
          }}
          // href={
          //   isStagingServer()
          //     ? `https://stg-beta.practical.me${link}`
          //     : `https://practical.me${link}`
          // }
          href={baseUrl + link}
          variant="outlined"
          aria-label={cta}
        >
          {cta}
        </Button>
      </div>
    </div>
  )
}
startNow.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string,
  cta: PropTypes.string
}
export default startNow
