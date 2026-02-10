import React from "react"
import { Box, Typography, useMediaQuery } from "@mui/material"
import styles from "./style.module.scss"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import { useSelector } from "react-redux"

const DiscountWeekComponentNewUi = (props) => {
  const { bgColor, heading, price, currency, textColor, sign, myPrice } = props
  const { isExecutive } = useSelector((state) => state.auth)
  const [active, setActive] = React.useState(false);
  const MaxWithMoile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={clsx(styles.discount, isExecutive && styles.isExecutive)} style={{
      width: isExecutive && '100%',
      border: isExecutive ? `` : `1px solid ${AppColors.primaryGreen}`

    }}>
      {!isExecutive
        &&
        <div className={styles.weekPlanLenText} >
          <Typography
            sx={{
              paddingBottom: "20px",
              fontWeight: "600"
            }}
            variant={"body1"}
            className={styles.para}
          >
            {heading}
          </Typography>
        </div>
      }
      <div className={styles.discountMultipleBoxWrapper} style={{ justifyContent: isExecutive && 'center' }}>
        <div className={styles.discountWrapper}>
          <div className={clsx(styles.discountBox)}>
            <Typography
              sx={{
                fontSize: '16px',
                paddingBottom: "8px",
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'start'
              }}
              variant={"body1"}
              className={styles.para}
            >
              {'You Get'}
            </Typography>
            <div
              style={{ background: bgColor, transition: '0.3s ease' }}
              className={clsx(styles.discountBoxInner, isExecutive && styles.isExecutive)}
            >
              {/* <Typography
                sx={{
                  color: textColor
                }}
                variant="body3"
              >
                {"Your friend gets"}
              </Typography> */}
              <Typography
                variant={"h1"}
                sx={{
                  fontFamily: "AWConquerorInline",
                  // fontSize: "49.28px",
                  color: textColor,
                }}
              >
                {myPrice ? myPrice : 0}
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "500",
                  fontFamily: "AWConquerorInline",
                }}
                variant="body3"
              >
                {sign}
              </Typography>
            </div>
            <Typography
              sx={{
                marginTop: '20px',
                fontWeight: '400'
              }}
              variant={"body1"}
            >
              {'Credit'}
            </Typography>
          </div>
        </div>
        <div className={styles.discountWrapper}>
          <div className={styles.discountBox}>
            <Typography
              sx={{
                fontSize: '16px',
                paddingBottom: "8px",
                maxWidth: '150px',
              }}
              variant={"body1"}
              className={styles.para}
            >
              {isExecutive ? "Your colleague gets your company discount of" : "They Get"}
            </Typography>
            <div
              style={{ background: bgColor, transition: '0.3s ease' }}
              className={clsx(styles.discountBoxInner, isExecutive && styles.isExecutive)}
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
              <Box className={styles.discountBoxInnerMyDisc}
                onClick={() => !MaxWithMoile ? null : setActive(!active)}
                sx={{
                  transition: '0.3s ease',
                  borderRadius: '12px',
                  height: '100%',
                  position: 'absolute',
                  bottom: '0px',
                  bgcolor: AppColors.appLightGreen,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography
                    sx={{
                      color: "#000"
                    }}
                    variant="body3"
                  >
                    {heading == '1 Week Plan' ? "" : "Up to"}
                  </Typography>
                  <Typography
                    variant={"h1"}
                    sx={{
                      fontFamily: "AWConquerorInline",
                      // fontSize: "49.28px",
                      color: "#000",
                      paddingLeft: '10px'
                    }}
                  >
                    {price ? price + "%" : 0}

                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                    }}
                    variant="body3"
                  >
                    {currency}
                  </Typography>
                </Box>
              </Box>
            </div>
            <Typography
              sx={{
                marginTop: '20px',
                fontWeight: '400'
              }}
              variant={"body1"}
            >
              {"Discount"}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscountWeekComponentNewUi
