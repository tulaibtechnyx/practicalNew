import React, { useState, useEffect } from "react"
import { Button, Link, SpeedDial, Typography } from "@mui/material"
import SpeedDialAction from "@mui/material/SpeedDialAction"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import FacebookIcon from "@mui/icons-material/Facebook"
import { CopyToClipboard } from "react-copy-to-clipboard"
import get from "lodash/get"
import { useDispatch, useSelector } from "react-redux"
import styles from "./style.module.scss"
import DiscountedScreen from "../../screens/discountedScreen"
import DiscountedScreenWeek from "../../screens/discountedScreenWeek"
import DiscountedScreenWeekNewUi from "../../screens/discountedScreenWeekNewUi"
import clsx from "clsx"
import useMediaQuery from "@mui/material/useMediaQuery"
import absoluteUrl from "next-absolute-url"
import AppRoutes from "helpers/AppRoutes"
import { customTimeout } from "helpers/ShortMethods"
import AppConstants from "helpers/AppConstants"
import { getCache, setCache } from "@helpers/CommonFunc"
import { GetFreeFoodRequest } from "store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "@helpers/AppLogger"

const DataRepsonse = {
  "data": {
    "referral_discount": {
      "id": 7255,
      "title": "Musaib9211",
      "promo_code": "MUSAIB9211",
      "promo_type": "All",
      "associated_emails": [],
      "ambassador_email": null,
      "ambassador_user_id": null,
      "ambassador_referral_codes": [],
      "wallet_credit_ratio": null,
      "promo_restrictions": "all_customers",
      "team_member": null,
      "created_on": null,
      "validity_type": "duration",
      "duration_from_creation": null,
      "duration_from_use": null,
      "max_use_per_customer": null,
      "max_use_total": null,
      "discount_on": [],
      "status": 0,
      "type": "All",
      "value": 20,
      "key": "referal_friend",
      "start_date": null,
      "expiry_date": null,
      "users": "[6325]",
      "length_plan_weeks": [],
      "is_multi_use": 0,
      "meal": ["All"],
      "snack": ["All"],
      "days": ["All"],
      "company_id": null,
      "parent_id": null,
      "parent": null
    },
    "refer_discount_tier": [{
      "week": 1,
      "reward_value": "10.00",
      "referrer_amount": "10.00"
    }, {
      "week": 2,
      "reward_value": "15.00",
      "referrer_amount": "25.00"
    }, {
      "week": 4,
      "reward_value": "20.00",
      "referrer_amount": "50.00"
    }]
  }
}


const ReferralComp = (props) => {
  const { handleChange, freeFoodSetter } = props
  const { freeFoodData } = useSelector((state) => state.home)
  const [referalDataLocal, setReferealDataLocal] = useState(null)
  // const referealCode = get(referalDataLocal, "friend_discount.promo_code", "")
  const referealCode = get(referalDataLocal, "referral_discount.promo_code", "")
  const percentValue = get(referalDataLocal, "friend_discount.value", "")
  const discountValue = get(referalDataLocal, "user_discount.value", "")
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const [loadingFood, setloadingFood] = useState(false)
  const [baseUrl, setbaseUrl] = useState("")
  const matches = useMediaQuery("(max-width:767px)")
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)
  const { userDetails } = useSelector((state) => state.auth)
  const token = get(userDetails, "data.auth_token", "")
  const dispatch = useDispatch()

  const { isExecutive } = useSelector((state) => state.auth)
  const getFreeFoodRequestHandler = () => {
    try {
      setloadingFood(true)
      const cacheKey = `freefood`;
      const cachedData = getCache(cacheKey);
      // const cachedData = DataRepsonse?.data;
      if (cachedData) {
        AppLogger("Serving from cache", cachedData);
        setReferealDataLocal(cachedData)
        setloadingFood(false)
        return;
      }
      if (token) {
        dispatch(GetFreeFoodRequest({ token }))
          .then(unwrapResult)
          .then((res) => {
            setloadingFood(false)
            setReferealDataLocal(res?.data?.data)
            setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
            AppLogger("This is response at GetFreeFoodRequest========", res)
          })
          .catch((err) => {
            setloadingFood(false)
           })
      }

    } catch (err) { console.log("err,", err)
        setloadingFood(false)
     }
  }
  useEffect(() => {
      getFreeFoodRequestHandler()
  }, [])
  useEffect(() => {
    const { origin } = absoluteUrl()
    setbaseUrl(origin ?? "")
  }, [])

  const handleUrl = () => {
    return `${baseUrl}?code=${referealCode}`
  }

  const message = encodeURIComponent(
    `Hey there! Enjoy a fantastic 20% discount on your first order at PractiCal when you use my referral code. Simply click on this link ${handleUrl()} to grab this amazing deal!`
  )

  const executiveMessage = encodeURIComponent(
    `Hey there, here's my referral code for a discount on PractiCal Executive. Simply click on this link ${handleUrl()} to grab this amazing deal!`
  )

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${isExecutive ? executiveMessage : message}`
    window.open(url, "_blank")
  }

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${handleUrl()}&src=sdkpreparse&quote=${message}`
    window.open(url, "_blank")
  }

  // useEffect(() => {
  //   if (freeFoodData) {
  //     setReferealDataLocal(freeFoodData)
  //   }
  // }, [freeFoodData])

  const handleCopy = () => {
    setCopied(true)
  }
  return (
    <div className={`${styles.refferal} ${isExecutive ? styles.isExecutive : ''}`}>
      <DiscountedScreenWeekNewUi
        percentDiscount={percentValue}
        discountValue={discountValue}
        referalDataLocal={referalDataLocal}
        loader={loadingFood}
      />
      <div className={`${styles.refferalWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
        <Typography variant={"body1"} sx={{ fontWeight: "600" }}>
          {"Share your referral code "}
        </Typography>
        <div className={clsx(styles.linkWrapper, isExecutive ? styles.isExecutive : '')}>
          <CopyToClipboard
            text={`${handleUrl()}`}
            onCopy={handleCopy}
          >
            <Button
              // className="copyClip"
              sx={{
                textTransform: "capitalize",
                color: "#444444"
              }}
            >
              {copied ? "Copied" : "Copy Link"}
              {isExecutive ?
                <svg style={{ marginLeft: '15px' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.8707 3.4978H3.57318C2.70077 3.4978 1.99219 4.20638 1.99219 5.0788V18.419C1.99219 19.2914 2.70077 20 3.57318 20H12.8707C13.7432 20 14.4517 19.2914 14.4517 18.419V5.0788C14.4476 4.20638 13.7391 3.4978 12.8707 3.4978ZM13.3418 18.4149C13.3418 18.677 13.1288 18.89 12.8667 18.89H3.56909C3.30695 18.89 3.09397 18.677 3.09397 18.4149V5.0788C3.09397 4.81666 3.30695 4.60368 3.56909 4.60368H12.8667C13.1288 4.60368 13.3418 4.81666 13.3418 5.0788V18.4149Z" fill="#FA7324" />
                  <path d="M16.4264 0H7.12885C6.25643 0 5.54785 0.708581 5.54785 1.581C5.54785 1.88818 5.7936 2.13393 6.10079 2.13393C6.40798 2.13393 6.65373 1.88818 6.65373 1.581C6.65373 1.31886 6.86671 1.10588 7.12885 1.10588H16.4264C16.6885 1.10588 16.9015 1.31886 16.9015 1.581V14.9212C16.9015 15.1833 16.6885 15.3963 16.4264 15.3963C16.1192 15.3963 15.8735 15.642 15.8735 15.9492C15.8735 16.2564 16.1192 16.5021 16.4264 16.5021C17.2988 16.5021 18.0074 15.7936 18.0074 14.9212V1.581C18.0074 0.708581 17.2988 0 16.4264 0Z" fill="#FA7324" />
                </svg>
                :
                <img src="images/icons/copy-icon.png" alt="" />
              }
            </Button>
          </CopyToClipboard>
          {/* {copied ? "heheheheh" : null} */}
        </div>
      </div>
      {!isExecutive && <Typography
        variant={"body3"}
        sx={{ fontSize: "12px !important" }}
        component={"p"}
        className={styles.para}
      >
        For more information on exactly how this works, see{" "}
        <Link
          // href="#simple-tab-5"
          sx={{
            display: "inline",
            cursor: "pointer"
          }}
          onClick={() => {
            handleChange(0, 6)
            freeFoodSetter(true)
            customTimeout(() => {
              freeFoodSetter(false)
            }, 500)
          }}
        >
          here
        </Link>
      </Typography>}
      {referealCode && (
        <div className={styles.ClipButton}>
          <SpeedDial
            sx={{ marginTop: 2 }}
            ariaLabel="SpeedDial example"
            icon={referealCode}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction={matches ? "down" : "right"}
          >
            <SpeedDialAction
              key="WhatsApp"
              icon={<WhatsAppIcon />}
              onClick={handleWhatsAppShare}
            />
            <SpeedDialAction
              key="Facebook"
              icon={<FacebookIcon />}
              onClick={handleFacebookShare}
            />
          </SpeedDial>
        </div>
      )}
    </div>
  )
}

export default ReferralComp

