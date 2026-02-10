import React, { useState, useEffect, useRef } from "react"
import { showFaliureToast } from "../../helpers/AppToast"
import { Dialog } from "@mui/material"
import { Button, Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import InputField from "Elements/inputField"
import DatePicker from "react-multi-date-picker"
import CalenderSM from "../../../public/images/icons/calenderSM.svg"
import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik"
import * as yup from "yup"
import CardSelect from "./CardSelect"
import get from "lodash/get"
import AppLogger from "helpers/AppLogger"
import {
  addCardRequest,
  createIntentionFunc,
  deleteCardRequest,
  editCardRequest,
  setUserDefaultCardRequest
} from "store/reducers/checkoutReducer"
import moment from "moment"
import { unwrapResult } from "@reduxjs/toolkit"
import Cross from "../../../public/images/icons/cross.svg"
import Tick from "../../../public/images/icons/tick.svg"
import stripe from "stripe"
import EditCardButton from "../../../public/images/icons/edit-svg.svg"
import AppDataConstant from "helpers/AppDataConstant"
import { customTimeout } from "helpers/ShortMethods"
import PaymentPopWithPixelPaymob from "@components/popUp/PaymentPopWithPixelPaymob"
import { getCache, setCache } from "@helpers/CommonFunc"

export default function AddCard({
  open,
  handleClose,
  saveCardRequest,
  updated,
  conditionForPaymob: conditionForPaymobProp,
  FirstUnPaidOrder: FirstUnPaidOrderProp,
  defaultAddress,
  PaymobModal,
  setPaymobModal,
  SecretToken,
  setSecretToken,
  getIntention
}) {
  const FirstUnPaidOrder =FirstUnPaidOrderProp && (process.env.NEXT_PUBLIC_PAYMOB_FOR_FIRST_TIME_USER == 'true' || process.env.NEXT_PUBLIC_PAYMOB_FOR_FIRST_TIME_USER == true) ? true: false;
  const conditionForPaymob =conditionForPaymobProp && (process.env.NEXT_PUBLIC_USE_PAYMOB == 'true' || process.env.NEXT_PUBLIC_USE_PAYMOB == true) ? true : false;
  const STRIPE = new stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
  const dispatch = useDispatch()
  const { error } = useSelector((state) => state.CheckOutReducer)
  const { userDetails } = useSelector((state) => state.auth)
  const { cards } = useSelector((state) => state.home)
  const { userProfile } = useSelector((state) => state.profile)
  const { isExecutive } = useSelector((state) => state.auth)

  const [newCardBody, setNewCardBody] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    card_id: "",
    stripeCardId: ""
  })
  const [selectedCard, setSelectedCard] = useState(1)
  const [errorString, setErrorString] = useState("")
  // const [allCards, setAllCards] = useState([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [currentId, setCurrentId] = useState("")
  const [cardLocalData, setCardLocalData] = useState(null)
  const [userDetailsLocal, setUserDetailsLocal] = useState(null)
  const [AddCard, setAddCard] = useState(false)
  const [updateMode, setUpdateMode] = useState(false)
  const [userProfileLocal, setUserProfileLocal] = useState(null)

  const accessToken = get(userDetailsLocal, "data.auth_token", "")
  const cardsFiltered = get(cardLocalData, "card", [])
  const defaultCard = get(cardLocalData, "default_card", null)
  const stripe_reference = get(userProfileLocal, "stripe_reference", null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (error) {
      setErrorString(error)
    } else {
      setErrorString("")
    }
  }, [error])

  useEffect(() => {
    if (userProfile) {
      setUserProfileLocal(userProfile)
    }
  }, [userProfile])

  useEffect(() => {
    if (userDetails) {
      setUserDetailsLocal(userDetails)
    }
  }, [userDetails])

  useEffect(() => {
    if (cards) {
      setCardLocalData(cards)
    }
  }, [cards])

  useEffect(() => {
    if(FirstUnPaidOrder ){
      if(conditionForPaymob ){
        defaultCardSelector()
      }else{
        return
      }
    }else{
      defaultCardSelector()
    }
  }, [defaultCard, allCards, loading])

  const [cardError, setCardError] = useState(null)

  const userAddCardHandler = async () => {
    const { cvv, name, cardNumber, expiryDate } = newCardBody
    try {
      setLoading(true)
      const token = await STRIPE.tokens.create({
        card: {
          number: cardNumber,
          exp_month: expiryDate.split("/")[1],
          exp_year: expiryDate.split("/")[2],
          cvc: cvv
        }
      })

      const reference = get(token, "id", "")
      const card_id = get(token, "card.id", "")
      const brand = get(token, "card.brand", "")
      const card_number = `**** **** **** ${get(token, "card.last4", "")}`

      const addCardBody = {
        reference,
        card_id,
        name,
        card_number,
        brand,
        expiry_date: expiryDate.length > 3 ? expiryDate.slice(3, 10) : "",
        type: 'stripe'
      }
      // const addCardBody = {
      //   card_number: cardNumber,
      //   expiry_date: expiryDate.length > 3 ? expiryDate.slice(3, 10) : "",
      //   name: name,
      //   cvv: cvv
      // }
      // AppLogger("this  is  clicked========")
      if (token) {
        dispatch(addCardRequest({ accessToken, addCardBody }))
          .then(unwrapResult)
          .then((res) => {
            console.log("res = > card",res)
             if(FirstUnPaidOrder ){
                if(conditionForPaymob ){
                  onSelectCardHandler(res?.data?.id)
                }else{
                  return
                }
            }else{
              if(!defaultCard){
                onSelectCardHandler(res?.data?.id)
              }
            }
            formik.resetForm()
            updated()
            // showSuccessToast("Card Added Successfully")
            setAddCard(false)
            setLoading(false)

            AppLogger("this  is userAddCardHandler", res)
          })
          .catch((err) => {
            setLoading(false)
            showFaliureToast(err?.message)

            AppLogger("this is error at userAddCardHandler", err)
          })
      }
    } catch (error) {
      setCardError(error.message)
      customTimeout(() => {
        if (error) {
          setCardError("")
        }
      }, 5000)

      AppLogger("Error at categoriesHandler", error.message)
    }
  }

  const handleAddCard = () => {
    if (!newCardBody.name) {
      showFaliureToast("Please enter card holder name")
    } else if (!newCardBody.cardNumber || newCardBody.cardNumber == "") {
      showFaliureToast("Please enter card number")
    } else if (!newCardBody.expiryDate || newCardBody.expiryDate == "") {
      showFaliureToast("Please select expiry date")
    } else if (!newCardBody.cvv || newCardBody.cvv == "") {
      showFaliureToast("Please enter CVV number")
    } else if (!newCardBody.cardNumber || newCardBody.cardNumber.length < 16) {
      showFaliureToast("Card Number Should be Valid")
    } else {
      setErrorString("")
      // saveCardRequest(newCardBody)
      addCardHandler(newCardBody)
      // Call API
    }
  }
  const datePickerRef = useRef()

  const validationSchema = yup.object(
    !updateMode
      ? {
          name: yup
            .string("Enter your first name")
            .matches(/^[^\s][a-zA-Z\s]+$/, "Enter your correct first name")
            .min(2, "First Name should be of minimum 2 characters length")
            .max(30, "First Name should be of maximum 30 characters length")
            .required("First Name is required"),
          cardNumber: yup
            .string()
            .matches(/^\d+$/, "Invalid Card Number")
            .min(16, "Must have 16 digits")
            .max(16, "Invalid Card Number")
            .required("Card Number is Required"),
          cvv: yup
            .string()
            .matches(/^\d+$/, "Invalid CVV number")
            .min(3, "3 numbers please.")
            .max(4, "Invalid CVV number")
            .required("CVV is Required"),
          expiryDate: yup.string().required("Expiry date is required")
        }
      : {
          name: yup
            .string("Enter your first name")
            .matches(/^[^\s][a-zA-Z\s]+$/, "Enter your correct first name")
            .min(2, "First Name should be of minimum 2 characters length")
            .max(30, "First Name should be of maximum 30 characters length")
            .required("First Name is required"),
          expiryDate: yup.string().required("Expiry date is required")
        }
  )
  const formik = useFormik({
    initialValues: {
      name: "",
      cardNumber: "",
      cvv: "",
      expiryDate: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      AppLogger("These are values=====", values)
      if (updateMode) {
        const [DD, MM, YYYY] = newCardBody?.expiryDate?.split("/")
        if (MM && YYYY) {
          handleStripeCardEdit({
            customerReference: stripe_reference,
            stripeCardId: newCardBody?.stripeCardId,
            payload: {
              name: newCardBody?.name,
              exp_month: MM,
              exp_year: YYYY
            },
            cardId: newCardBody?.card_id
          })
        }
      } else {
        handleAddCard()
      }
    }
  })
  // const optionData = [
  //   {
  //     id: 1,
  //     cardImg:
  //       "https://theprojectstagingserver.com/Practical-Images/images/logo/visa.png",
  //     CardNum: "**** 1423"
  //   },
  //   {
  //     id: 2,
  //     cardImg:
  //       "https://theprojectstagingserver.com/Practical-Images/images/logo/visa.png",
  //     CardNum: "**** 3333"
  //   }
  // ]

  const handleSelectCard = (selectedCard) => {
    AppLogger("This is handleSelect Card Response=======", selectedCard)
    setSelectedCard(selectedCard)
  }

  const addCardHandler = (cardValue) => {
    AppLogger("This is  card value========", cardValue)

    // const data = [...allCards]

    // const newCardData = {
    //   id: data.length + 1,
    //   ...cardValue,
    //   cardImg:
    //     "https://theprojectstagingserver.com/Practical-Images/images/logo/visa.png"
    // }

    // data.push(newCardData)
    // setAllCards(data)
    userAddCardHandler()
    // formik.resetForm()

    // setNewCardBody({ name: "", expiryDate: "", cardNumber: "", cvv: "" })
  }

  const removeCardHandler = (card_id) => {
    dispatch(deleteCardRequest({ accessToken, card_id }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("this is response at removeCardHandler=========", res)
        updated()
        // showSuccessToast("Card Removed Successfully")
      })
      .catch((err) => {
        AppLogger("this is error at remove")
        showFaliureToast(err?.message)
      })
    // const currentIdIndex = allCards.findIndex((card) => card.id == cardId)
    // if (currentIdIndex !== -1) {
    //   allCards.splice(currentIdIndex, 1)
    //   setAllCards([...allCards])
    // }
  }

  const onSelectCardHandler = (card_id) => {
    const cardData = { card_id: card_id }
    dispatch(setUserDefaultCardRequest({ accessToken, cardData }))
      .then(unwrapResult)
      .then((res) => {
        updated()
        AppLogger("this is response==========", res)
      })
      .catch((err) => {
        AppLogger("this  is err", err)
      })
  }
  const defaultCardSelector = () => {
    if (allCards.length >= 1 && !defaultCard) {
      const currentCard = allCards[0]

      onSelectCardHandler(currentCard.id)
    }
  }

  const onDeleteCardHandler = (id) => {
    setDeleteMode(true)
    setCurrentId(id)
  }
  const onCancelHandler = () => {
    setDeleteMode(false)
    setCurrentId("")
  }
  const handleStripeCardEdit = async ({
    customerReference,
    stripeCardId,
    payload,
    cardId
  }) => {
    try {
      setLoading(true)
      if (customerReference && stripeCardId) {
        const editCardResponse = await STRIPE.customers.updateSource(
          customerReference,
          stripeCardId,
          { ...payload }
        )

        const { name, exp_month, exp_year } = payload

        if (editCardResponse && name && exp_month && exp_year) {
          const editCardBody = {
            name,
            expiry_date: `${exp_month}/${exp_year}`,
            card_id: cardId
          }

          dispatch(editCardRequest({ accessToken, editCardBody }))
            .then(unwrapResult)
            .then((res) => {
              formik.resetForm()
              setAddCard(false)
              AppLogger("this  is userEditCardHandler", res)
              updated()
              setLoading(false)
            })
            .catch((err) => {
              showFaliureToast(err?.message)
              setLoading(false)
              AppLogger("this is error at userEditCardHandler", err)
            })
        }
      setLoading(false)
      }else{
        showFaliureToast("Cannot update card, it doesnt belong to stripe")
        setLoading(false)
      }
    } catch (error) {
      setCardError(error?.message)
      customTimeout(() => {
        if (error) {
          setCardError("")
        setLoading(false)
    }
      }, 5000)
      setLoading(false)
      AppLogger("Error at userEditCardHandler", error)
    }
  }

  const onEditPressHandler = (card) => {
    AppLogger("this is current card ========", card)
    setUpdateMode(true)
    formik.values.name = card.name
    formik.values.cardNumber = card.card_number
    formik.values.cvv = "***"

    const [MM, YYYY] =card?.expiry_date ?  card?.expiry_date?.split("/") : '';
    if (MM && YYYY) {
      formik.values.expiryDate = new Date(YYYY, MM - 1, 1)

      newCardBody.stripeCardId = card?.stripe_card_id
      newCardBody.name = card.name
      newCardBody.expiryDate = `${1}/${MM}/${YYYY}`
      newCardBody.card_id = card?.id
      setNewCardBody({ ...newCardBody })
    }
    setAddCard(true)
  }

    const allCards = cardsFiltered?.filter((item)=>{
    if(conditionForPaymob || FirstUnPaidOrder) {
      {
        if(item?.stripe_card_id == null){
          return  item
        }
      }
    }
    else {return  item?.stripe_card_id ? item : null}
  }
  )

  return (
    <div>
      <Dialog
        className="myCard"
        open={open}
        onClose={() => {
          handleClose()
          setNewCardBody({
            name: "",
            cardNumber: "",
            expiryDate: "",
            cvv: ""
          })
        }}
      >
        <div className="sec-padded">
          {AddCard ? (
            <Typography
              // component={"p"}
              variant="h2"
              sx={{
                color: AppColors.primaryGreen,
                fontWeight: 700,
                textAlign: "center",
                paddingBottom: "30px"
              }}
            >
              {updateMode ? "Update Card" : "Add New Card"}
            </Typography>
          ) : (
            <>
              {allCards.length > 0 ? (
                <Typography
                  // component={"p"}
                  variant="h2"
                  sx={{
                    color: AppColors.primaryGreen,
                    fontWeight: 700,
                    textAlign: "center",
                    paddingBottom: "30px"
                  }}
                >
                  Please select your card
                </Typography>
              ) : (
                <Typography
                  // component={"p"}
                  variant="h2"
                  sx={{
                    color: AppColors.primaryGreen,
                    fontWeight: 700,
                    textAlign: "center",
                    paddingBottom: "30px"
                  }}
                >
                  {/* You do not have any card. Please Add New Card */}
                  Add New Card
                </Typography>
              )}
            </>
          )}

          {/* {errorString && (
            <Typography
              style={{ marginBottom: 10, color: "red", textAlign: "center" }}
            >
              {errorString}
            </Typography>
          )} */}

          {/* <CardSelect
            optionData={allCards}
            value={selectedCard}
            selectedCard={selectedCard}
            removeCard={removeCardHandler}
            onChange={handleSelectCard}
            placeholder="Choose Card"
          /> */}
          {/* <Typography
            component={"p"}
            variant="body3"
            sx={{
              color: AppColors.primaryGreen,
              fontWeight: 500,
              textAlign: "center",
              paddingBottom: "18px"
            }}
          >
            Add New Card
          </Typography> */}
          {AddCard ? null : allCards.length > 0 ? (
            allCards.map((card, index) => {
              return (
                <CardComp
                  currentCard={currentId}
                  deleteMode={deleteMode}
                  selectedCard={defaultCard?.id}
                  setDefault={onSelectCardHandler}
                  onCardDelete={removeCardHandler}
                  onCancel={onCancelHandler}
                  onCardRemove={onDeleteCardHandler}
                  onEditPressHandler={onEditPressHandler}
                  card={card}
                  key={index}
                  canEdit={card?.stripe_card_id == null ? false : true}
                  canSelectCard={FirstUnPaidOrder == true ? false : true}
                />
              )
            })
          ) : (
            <Typography sx={{ textAlign: "center", padding: "40px 0" }}>
              Right now, you have not added any card details
            </Typography>
          )}

          <div className="fieldWrapper">
            {AddCard ? (
              <div className="flipWrapper">
                <form onSubmit={formik.handleSubmit}>
                  <InputField
                    helperText={formik.touched.name && formik.errors.name}
                    name="name"
                    placeholder="Name on Card"
                    // onChange={formik.handleChange}
                    value={formik.values.name}
                    error={formik.touched.name && formik.errors.name}
                    onChange={(e) => {
                      formik.handleChange(e)
                      setNewCardBody({ ...newCardBody, name: e.target.value })
                    }}
                  />

                  <InputField
                    helperText={
                      formik.touched.cardNumber && formik.errors.cardNumber
                    }
                    disabled={updateMode}
                    // value={newCardBody.cardNumber}
                    value={formik.values.cardNumber}
                    placeholder="Card Number"
                    maxLength={16}
                    onChange={(e) => {
                      const val = e.target.value
                      if(val?.length >=17){
                        return
                      }
                      formik.handleChange(e)
                      setNewCardBody({
                        ...newCardBody,
                        cardNumber: e.target.value
                      })
                    }}
                    name="cardNumber"
                    error={
                      formik.touched.cardNumber && formik.errors.cardNumber
                    }
                  />

                  <div className="dateBox">
                    <div className="dateselector">
                      <a
                        className="calenderBtn"
                        onClick={() => datePickerRef.current.openCalendar()}
                      >
                        <CalenderSM />
                      </a>
                      <DatePicker
                        placeholder="Expiry date"
                        ref={datePickerRef}
                        calendarPosition="top"
                        value={formik.values.expiryDate}
                        minDate={new Date()}
                        onlyMonthPicker
                        onChange={(e) => {
                          formik.setFieldValue("expiryDate", e)
                          setNewCardBody({
                            ...newCardBody,
                            expiryDate: e.format("DD/MM/YYYY")
                          })
                        }}
                        //  minDate={new Date()}
                        // value={newCardBody.expiryDate}
                        // format={"DD/MM/YYYY"}
                        format={"MM/YYYY"}
                        // render={<InputIcon />}
                      />
                      {formik.touched.expiryDate && formik.errors.expiryDate ? (
                        <div className="error-message-date">
                          <Typography
                            sx={{
                              fontSize: "12px",
                              lineHeight: "1.3",
                              fontWeight: "400"
                            }}
                          >
                            {formik.errors.expiryDate}
                          </Typography>
                        </div>
                      ) : null}
                    </div>

                    <div className="securityCode">
                      <InputField
                        helperText={formik.touched.cvv && formik.errors.cvv}
                        disabled={updateMode}
                        name="cvv"
                        value={formik.values.cvv}
                        placeholder="cvv"
                        onChange={(e) => {
                          formik.handleChange(e)
                          setNewCardBody({
                            ...newCardBody,
                            cvv: e.target.value
                          })
                        }}
                        error={formik.touched.cvv && formik.errors.cvv}
                      />
                    </div>
                  </div>
                  {cardError ? (
                    <Typography
                      color={AppColors.lightRed}
                      sx={{ paddingBottom: "10px" }}
                    >
                      {cardError}
                    </Typography>
                  ) : null}
                  <div className="AddCta">
                    <Button
                      variant="outlined"
                      className="cancel"
                      onClick={() => {
                        formik.values.name = ""
                        formik.values.expiryDate = ""
                        formik.values.cvv = ""
                        formik.values.cardNumber = ""
                        setNewCardBody({
                          name: "",
                          cardNumber: "",
                          expiryDate: "",
                          cvv: "",
                          card_id: "",
                          stripeCardId: ""
                        })
                        setUpdateMode(false)
                        setAddCard(false)
                        setErrorString("")
                        formik.resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      sx={{ color: "#fff" }}
                      variant="contained"
                    >
                      {updateMode ? "Update" : "Add"}
                    </Button>
                  </div>
                </form>
              </div>
            ) : null}

            {AddCard ? null : (
              <div className="CardAction">
                <Button
                  disabled={allCards.length >= 5 ? true : false}
                  onClick={() => {
                     if( conditionForPaymob || FirstUnPaidOrder ){
                          if(defaultAddress?.id == '' || defaultAddress?.id == null ){
                            showFaliureToast("Please add your address first.")
                            return
                          }else{
                            getIntention().then((res)=>{
                              handleClose()
                              return
                          }).catch(err=>{
                            console.log("err",err) 
                            return
                          })
                          }
                        }else{
                          setAddCard(true)
                        }
                  }}
                  className="outlined"
                  variant="outlined"
                  sx={{
                    borderColor: AppColors.white,
                    color: AppColors.white,
                    maxWidth: "231px"
                  }}
                >
                  Add New Card
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button
          // className="crossButton sty2"
          className={`crossButton sty2 ${isExecutive ? 'isExecutive':'' }`}
          sx={{ color: "red" }}
          onClick={() => {
            formik.values.name = ""
            formik.values.expiryDate = ""
            formik.values.cvv = ""
            formik.values.cardNumber = ""
            setNewCardBody({
              name: "",
              cardNumber: "",
              expiryDate: "",
              cvv: "",
              card_id: "",
              stripeCardId: ""
            })
            setUpdateMode(false)
            handleClose()
          }}
        >
          x
        </Button>
      </Dialog>
    </div>
  )
}

const CardComp = ({
  card,
  onCardRemove,
  setDefault,
  selectedCard,
  onCancel,
  deleteMode,
  onCardDelete,
  currentCard,
  onEditPressHandler,
  canEdit=true,
  canSelectCard=true
}) => {
  return (
    <div className="selectedCards">
      <div className="sectionWrapper">
        <div className="details">
          <div className="cardIcon">
            {card.brand === "Visa" ? (
              <img src={AppDataConstant.visaIcon} alt={""} />
            ) : card.brand === "MasterCard" ? (
              <img src={AppDataConstant.masterCard} alt={""} />
            ) : null}
          </div>
          <div className="cardNumber">
            <Typography
              className="label"
              sx={{ fontSize: "13px", lineHeight: "1" }}
            >
              {card.card_number}
              {
              canEdit && <EditCardButton onClick={() => onEditPressHandler(card)} />
              }
            </Typography>
          </div>
        </div>
        <div className="actions">
          {currentCard !== card.id && canSelectCard && (
            <Button
              disabled={selectedCard == card.id ? true : false}
              onClick={() => setDefault(card.id)}
              variant="outlined"
            >
              {selectedCard == card.id ? "Selected" : "Select"}
            </Button>
          )}
          {currentCard == card.id && (
            <Button onClick={() => onCardDelete(card.id)} variant="outlined">
              <Tick />
            </Button>
          )}
          {currentCard == card.id && (
            <Button onClick={onCancel} variant="outlined">
              <Cross />
            </Button>
          )}
          {currentCard !== card.id && (
            <Button onClick={() => onCardRemove(card.id)} variant="outlined">
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
