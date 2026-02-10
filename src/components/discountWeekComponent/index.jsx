import React from "react"
import { Box, Typography, useMediaQuery } from "@mui/material"
import styles from "./style.module.scss"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import { useSelector } from "react-redux"

const discountWeekComponent = (props) => {
  const { bgColor, heading, price, currency, textColor, sign, myPrice } = props
  const { isExecutive } = useSelector((state) => state.auth)
  const [active, setActive] = React.useState(false);
  const MaxWithMoile = useMediaQuery('(max-width: 768px)');
  return (
    <div className={clsx(styles.discount, isExecutive && styles.isExecutive)}>
      <div className={styles.discountWrapper}>
        <div className={styles.discountBox}>
          <Typography
            sx={{
              paddingBottom: "12px",
              fontWeight: "500"
            }}
            variant={"body1"}
            className={styles.para}
          >
            {heading}
          </Typography>
          <div
            style={{ background: bgColor, transition: '0.3s ease' }}
            className={styles.discountBoxInner}
            onClick={() => !MaxWithMoile ? null : setActive(!active)}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
          >
            <Typography
              sx={{
                color: textColor
              }}
              variant="body3"
            >
              {"Your friend gets"}
            </Typography>
            <Typography
              variant={"h1"}
              sx={{
                fontFamily: "AWConquerorInline",
                // fontSize: "49.28px",
                color: textColor,
                paddingLeft: '20px'
              }}
            >
              {price}
            </Typography>
            <Box className={styles.discountBoxInnerMyDisc}
              onClick={() => !MaxWithMoile ? null : setActive(!active)}
              sx={{
                transition: '0.3s ease',
                borderRadius: '12px',
                borderTopRightRadius: !active ? '0px' : '12px',
                borderTopLeftRadius: !active ? '0px' : '12px',
                height: active ? '100%' : '40px',
                position: 'absolute',
                bottom: '0px',
                bgcolor: AppColors.appLightGreen,
                width: '100%',
                ...(!active && {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }),
              }}
            >
              {
                active ?
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography
                      sx={{
                        color: "#000"
                      }}
                      variant="body3"
                    >
                      {"You get"}
                    </Typography>
                    <Typography
                      variant={"h1"}
                      sx={{
                        fontFamily: "AWConquerorInline",
                        // fontSize: "49.28px",
                        color: "#000"
                      }}
                    >
                      {myPrice}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#000"
                      }}
                      variant="body3"
                    >
                      {sign}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#000"
                      }}
                      variant="body3"
                    >
                      {currency}
                    </Typography>
                  </Box>
                  :
                  <Typography
                    sx={{
                      color: 'black',
                      fontSize: { md: '14px', xs: '12px' },
                    }}
                  >
                    {`You get ${myPrice} ${sign}`}
                  </Typography>
              }
            </Box>
          </div>
        </div>
        {/* <div className={styles.discountBox}>
          <Typography
            sx={{ paddingBottom: "12px", fontWeight: "500" }}
            variant={"body1"}
            className={styles.para}
          >
            {"Your friend gets"}
          </Typography>
          <div className={styles.discountBoxInner}>
            <Typography
              variant={"h1"}
              sx={{
                fontFamily: "AWConquerorInline",
                fontSize: "49.28px",
                color: AppColors.white
              }}
            >
              {"20%"}
            </Typography>
            <Typography
              sx={{
                color: AppColors.white
              }}
              variant="body3"
              component="p"
            >
              {"off their first month"}
            </Typography>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default discountWeekComponent
