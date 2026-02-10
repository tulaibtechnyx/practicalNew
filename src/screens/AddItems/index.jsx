import CustomAccordian from '@components/CustomAccordian'
import AdditemPop from '@components/popUp/AdditemPop'
import AppColors from '@helpers/AppColors'
import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppConstants from '../../helpers/AppConstants'
import AddItemsStepperAccordian from '@components/AddItemsStepperAccordian'
import { dfac, dfjac } from '@components/popUp/commonSX'
import { useRouter } from 'next/router'
import { buttonOutlinedSX } from '../../components/popUp/commonSX'
import CustomButton from '../../components/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { addOtherItems, addOtherMeal, addOtherSnacks, GetTickersRequest, mealSnackPricing, UpcomingOrdersRequest } from '../../store/reducers/dashboardReducer'
import { unwrapResult } from '@reduxjs/toolkit'
import { showFaliureToast, showSuccessToast } from '@helpers/AppToast'
import { isNull } from '@helpers/CommonFunc'
import $ from "jquery"
import Loader2 from '@components/loader/Loader2'
import moment from 'moment'
import OtherQuestionScreen from '@components/AddItemsStepperAccordian/OtherQuestionScreen'
const AddItems = (props) => {
    const { 
        AddItemsBool = false, 
        setAddItems = () => {},
        AddItemstext = '',
        setAddItemstext = () => {},
        handleChange = () => {},
        finalData = {},
        setFinalData = () => {},
        setOpen = () => {},
        coachingBool = false,
        setcoachingBool = () => {},
        ConsultBool = false,
        setConsultBool = () => {},
        MealDate    = null,
        setMealDate = () => {},
        orderIDfromProps = null,
        modalMode = false,
        handleCloseOut = () => {},
    } = props;
    const dispatch = useDispatch()
    const [AddItemPop, setAddItemPop] = useState(false);
    const [AddItemType, setAddItemType] = useState('');
    const ModalTitle = AddItemType == AppConstants.AdditemModal.Meal ? 'Add Meal(s)' : AddItemType == AppConstants.AdditemModal.Snack ? 'Add Snack(s)' : AddItemType;
    const [QuestionsChecked, setQuestionsChecked] = useState({
        Q1: { checked: false, ModalState: false },
        Q2: { checked: false, ModalState: false },
        Q3: { checked: false, ModalState: false },
        Q4: { checked: false, ModalState: false },
        Q5: { checked: false, ModalState: false },
    });
    const [NoofSnackPerDay, setNoofSnackPerDay] = useState(0)
    const [SnackPricing, setSnackPricing] = useState(0)
    const [Mealdates, setMealDates] = useState([]);
    const [Snackdates, setSnackDates] = useState([]);
    const [Otherdates, setOtherDates] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [MealSnackPrice, setMealSnackPrice] = useState([]);
    const [MealSize, setMealSize] = useState(400)
    const [MealsPerDay, setMealsPerDay] = useState(0)
    const [Loading, setLoading] = useState(false)
    const { userDetails } = useSelector((state) => state.auth)
    const { parentOrderId } = useSelector((state) => state.orders);
    const orderid = orderIDfromProps ?? parentOrderId;
    const token = userDetails?.data?.auth_token;
    const totalPriceAddons = calculateTotalPrice(finalData?.otherItemData?.length > 0 && selectedItems);
    const [submissionStatus, setSubmissionStatus] = useState({
        meal: false,
        snack: false,
        other: false
    });

    const TrueQuestionCompletion = (QuestionNo, QuestionKey = 'checked', bool = true) => {
        setQuestionsChecked(prev => ({
            ...prev,
            [QuestionNo]: {
                ...prev?.[QuestionNo],
                [QuestionKey]: bool
            }
        }));
    }
    const handleClose = () => {
        if(modalMode){
        setMealSize(0)
        setMealsPerDay(0)
        setMealDates([])
        setSnackDates([])
        setOtherDates([])
        setSelectedItems([])
        setMealSnackPrice([])
        setFinalData({ meal: false, snack: false, other: false })
        setAddItemstext('')
        setAddItems(false)
        handleChange(0, AppConstants?.TabValues.UPCOMING_ORDERS);
        handleCloseOut()
            return
        }
        setMealSize(0)
        setMealsPerDay(0)
        setMealDates([])
        setSnackDates([])
        setOtherDates([])
        setSelectedItems([])
        setMealSnackPrice([])
        setFinalData({ meal: false, snack: false, other: false })
        setAddItemstext('')
        setAddItems(false)
        handleChange(0, AppConstants?.TabValues.UPCOMING_ORDERS);
    }
    function calculateTotalPrice(items) {
        const itemArr = items?.length > 0 ? items : [];
        return itemArr?.reduce((total, item) => {
            const price = parseFloat(item?.price); // Convert string to number
            const quantity = item?.quantity || 0;  // Default to 0 if missing
            const lengthDays = item?.deliveryDates?.length || 0;  // Default to 0 if missing
            return total + (price * quantity) * lengthDays;
        }, 0);
    };
    const handleMainConfirmAndClose = async () => {
        const failed = [];
        setLoading(true)
        // 1. Meal
        if (finalData.mealData && !submissionStatus.meal) {
            try {
                setLoading(true)
                await dispatch(addOtherMeal({
                    token,
                    ...finalData.mealData
                })).then(unwrapResult)
                    .then(res => {
                        setLoading(false)
                        setFinalData(prev => ({
                            ...prev,
                            mealData: null
                        }));
                    })
                TrueQuestionCompletion('Q1', 'checked', true);
                TrueQuestionCompletion('Q1', 'ModalState', false);
                setSubmissionStatus(prev => ({ ...prev, meal: true }));
            } catch (err) {
                setLoading(false)
                failed.push(`Meals: ${err?.response?.data?.message || "Unknown error"}`);
                showFaliureToast(`Failed to submit: ${failed.join(", ")}`);
                return; // Stop further API calls
            }
        }

        // 2. Snack
        if (finalData.snackData && !submissionStatus.snack) {
            try {
                setLoading(true)
                await dispatch(addOtherSnacks({
                    token,
                    ...finalData.snackData
                })).then(unwrapResult)
                    .then(res => {
                        setLoading(false)
                        setFinalData(prev => ({
                            ...prev,
                            snackData: null
                        }));
                    })
                TrueQuestionCompletion('Q2', 'checked', true);
                TrueQuestionCompletion('Q2', 'ModalState', false);
                setSubmissionStatus(prev => ({ ...prev, snack: true }));
            } catch (err) {
                setLoading(false)
                failed.push(`Snacks: ${err?.response?.data?.message || "Unknown error"}`);
                showFaliureToast(`Failed to submit: ${failed.join(", ")}`);
                return;
            }
        }

        // 3. Other Items
        if (finalData.otherItemData && !submissionStatus.other) {
            try {
                setLoading(true)
                await dispatch(addOtherItems({
                    token,
                    order_id: orderid,
                    addons: finalData.otherItemData
                })).then(unwrapResult)
                    .then(res => {
                        setLoading(false)
                        setFinalData(prev => ({
                            ...prev,
                            addons: null
                        }));
                    })
                TrueQuestionCompletion('Q3', 'checked', true);
                TrueQuestionCompletion('Q3', 'ModalState', false);
                setSubmissionStatus(prev => ({ ...prev, other: true }));
            } catch (err) {
                setLoading(false)
                failed.push(`Other Items: ${err?.response?.data?.message || "Unknown error"}`);
                showFaliureToast(`Failed to submit: ${failed.join(", ")}`);
                return;
            }
        }

        // ✅ All successful
        setLoading(true)
        dispatch(UpcomingOrdersRequest({ token })).then(() => {
            setLoading(false)
            dispatch(GetTickersRequest({ token }))
                .then(unwrapResult)
                .then((res) => {
                    setLoading(false)
                    AppLogger("Response at GetResturantsRequest", res)
                })
                .catch((err) => {
                    setLoading(false)
                    $("body").removeClass("tickerON")
                })
            if(modalMode){
                setLoading(false)
                handleCloseOut()
                setFinalData({ otherItemData: null, snackData: null, mealData: null })
                router.reload()
            } else{
                setFinalData({ otherItemData: null, snackData: null, mealData: null })
                setAddItems(false);
                handleChange(0, AppConstants?.TabValues.UPCOMING_ORDERS);
                setLoading(false)
            }

        })
    };
    function calculatePrice(type, quantity, size,days) {
        try {
            const item = MealSnackPrice?.find(
                (food) => food?.type == type && food?.calories == size
            );
            return item?.price * quantity * days;
        }
        catch (err) { console.log("err", err) }
    }
    useEffect(() => {
        if (AddItemstext == 'hit') {
            handleMainConfirmAndClose().then(res => {
                setAddItemstext('')
                setAddItems(false)
                setOpen(false)
                handleChange(0, AppConstants?.TabValues.UPCOMING_ORDERS)
                setFinalData({ otherItemData: null, snackData: null, mealData: null })
            })
        }
    }, [AddItemstext])
    useEffect(() => {
        try {
            // format('YYYY-MM-DD 00:00:00')
            if (MealDate) {
                const convertedDate = moment(MealDate).format('DD.MM.YYYY')
                setMealDates([convertedDate])
                setSnackDates([convertedDate])
            }
        } catch (err) { console.log("err", err) }
    }, []);
    useEffect(() => {
        try {
            dispatch(mealSnackPricing({ token: token, orderId: orderid })).then((res) => {
                setMealSnackPrice(res?.payload?.data?.data)
            })
        } catch (err) { console.log("err", err) }
    }, []);
    const questionConfigs = [
        {
            price: calculatePrice('meal', finalData?.mealData?.meal_count_to_add, finalData?.mealData?.meal_size, finalData?.mealData?.meal_delivery_dates?.length),
            checked: finalData.mealData,
            key: "Q1", title: AppConstants.AdditemModal.Meal
        },
        {
            price: calculatePrice('snack', finalData?.snackData?.meal_count_to_add, 200,finalData?.snackData?.meal_delivery_dates?.length),
            checked: finalData.snackData,
            key: "Q2", title: AppConstants.AdditemModal.Snack
        },
        {
            price: totalPriceAddons,
            checked: finalData.otherItemData,
            key: "Q3", title: AppConstants.AdditemModal.Other
        },
        // Uncomment if you want to include consultation and coaching options
        // {
        //     price: null,
        //     checked: ConsultBool,
        //     key: "Q4", title: AppConstants.AdditemModal.Consultation
        // },
        // {
        //     price: null,
        //     checked: coachingBool,
        //     key: "Q5", title: AppConstants.AdditemModal.Coaching
        // },
    ];

    useEffect(() => {
        if (window) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth", // Enables smooth scrolling
            });
        }
    }, [])
    const router = useRouter()
    const event_type_uuid = router?.query?.event_type_uuid ?? '';
    const {
        GetcalendlybookingData
    } = useSelector(state => state?.home);

    useEffect(() => {
        if (GetcalendlybookingData) {
            const consult = GetcalendlybookingData?.filter(
                (event) => event?.event_type_uuid == AppConstants.eventTypeId.Consultation
            );
            if (consult?.length >= 1) {
                setConsultBool(true)
            }
            const coach = GetcalendlybookingData?.filter(
                (event) => event?.event_type_uuid == AppConstants.eventTypeId.Coaching
            );
            if (coach?.length >= 1) {
                setcoachingBool(true)
            }
        }
    }, [GetcalendlybookingData])
    useEffect(() => {
        return () => {
            if (event_type_uuid) {
                router.replace('/dashboard', null, {
                    shallow: true
                })
            }
        }
    }, [])
    const [items, setitems] = useState([]);
    const [openOtherModal, setopenOtherModal] = useState(false);

    // Handle checkbox selection
    const handleSelect = (item) => {
        setSelectedItems((prev) => {
            const exists = prev.find((selected) => selected.id === item.id);
            if (exists) {
                return prev.filter((selected) => selected.id !== item.id); // Remove item
            } else {
                return [...prev, { ...item, quantity: 1 }]; // Add item with quantity 1
            }
        });
    };

    // Handle quantity change
    const handleQuantityChange = (id, value) => {
        setSelectedItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, value) } : item
            )
        );
    };
    return (
        <div className={modalMode ? "" : "sec-padded" }
            style={{
           backgroundImage: modalMode ? "":'url(/images/bg/quiz-bg-webp.webp)',
           backgroundRepeat: "repeat-y",
           backgroundPosition:"fixed",
        //    backgroundAttachment: 'fixed',
           backgroundSize: 'cover',
        //    backgroundPosition: 'center',
           minHeight: modalMode ? "95%" : '70vh',
        }}>
        {/* // <div 
        // style={{ 
        //     paddingTop: '160px',
        //     backgroundImage: 'url(/images/bg/quiz-bg-bk.png)',
        //     backgroundRepeat: 'no-repeat',
        //     backgroundSize: 'cover',
        //     backgroundPosition: 'center',
        //     overflowY: 'hidden',
        //     minHeight: '60vh',
        // }}
        // > */}
            {(Loading) ? <Loader2 /> : ''}
            {
                openOtherModal ? 
                 <OtherQuestionScreen
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    setFinalData={setFinalData}
                    items={items}
                    setitems={setitems}
                    MealDate={MealDate}
                    setMealDate={setMealDate}
                    setopenOtherModal={setopenOtherModal}
                    TrueQuestionCompletion={TrueQuestionCompletion}
                    modalMode={modalMode}
                />
                :
            <div className={modalMode ? "":"container container--custom"}
                style={{
                    position: 'relative',
                    
                }}
            >
                <Box sx={{ textAlign: 'center', width: '100%' }} >
                    <Typography sx={{
                        fontSize: { xs: '22px', md: '32px' },
                        my: { xs: '10px', md: '20px' }

                    }} color={AppColors.primaryGreen} fontWeight={'500'}>
                        Add Item
                    </Typography>
                    <Typography sx={{
                        fontSize: { xs: '16px', md: '26px' },
                        mb: { xs: '10px', md: '20px' }
                    }} >
                        What do you want to Add?
                    </Typography>
                </Box>
                <Box sx={{
                    ...dfjac,
                    // width: '100%',
                    flexDirection: 'column',
                    rowGap: { xs: '10px', md: '20px' },
                    zIndex: 50,
                    px: modalMode ? "0px":'30px',

                }}>
                    {questionConfigs.map(({ key, title, price, checked }) => (
                        <CustomAccordian
                            price={price == 0 ? null : price}
                            key={key}
                            ticked={checked}
                            title={title}
                            open={QuestionsChecked?.[key]?.ModalState}
                            setOpen={() => TrueQuestionCompletion(key, 'ModalState', !QuestionsChecked?.[key]?.ModalState)}
                            onClickCheck={() => TrueQuestionCompletion(key, 'checked', false)}
                            setAddItemType={setAddItemType}
                        >
                            <AddItemsStepperAccordian
                                modalMode={modalMode}
                                items={items}
                                setitems={setitems}
                                openOtherModal={openOtherModal}
                                setopenOtherModal={setopenOtherModal}
                                handleSelect={handleSelect}
                                handleQuantityChange={handleQuantityChange}
                                MealDate={MealDate}
                                setMealDate={setMealDate}
                                SnackPricing={SnackPricing}
                                setSnackPricing={setSnackPricing}
                                orderid={orderid}
                                TrueQuestionCompletion={TrueQuestionCompletion}
                                NoofSnackPerDay={NoofSnackPerDay}
                                setNoofSnackPerDay={setNoofSnackPerDay}
                                Mealdates={Mealdates}
                                setMealDates={setMealDates}
                                Snackdates={Snackdates}
                                setSnackDates={setSnackDates}
                                Otherdates={Otherdates}
                                setOtherDates={setOtherDates}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                                MealSize={MealSize}
                                setMealSize={setMealSize}
                                MealsPerDay={MealsPerDay}
                                setMealsPerDay={setMealsPerDay}
                                AddItemType={title}
                                ticked={QuestionsChecked?.[key]}
                                title={title}
                                setAddItemType={setAddItemType}
                                setQuestionsChecked={setQuestionsChecked}
                                onClickCheck={() => TrueQuestionCompletion(key, 'checked', true)}
                                setFinalData={setFinalData}
                            />
                        </CustomAccordian>
                    ))}
                    <Box sx={{ ...dfac, gap: '20px', my: '20px', flexDirection: { xs: 'column', md: 'row' } }}>
                        <CustomButton
                            onClick={handleClose}
                            sx={{
                                ...buttonOutlinedSX, textAlign: 'center', px: '10px !important',
                                ":hover": {
                                    bgcolor: 'rgba(0,0,0,0.1) !important'
                                }, width: 'max-content',
                            }}
                        >
                            Close
                        </CustomButton>
                        <CustomButton
                            disabled={
                                (isNull(finalData.mealData) &&
                                    isNull(finalData.snackData) &&
                                    isNull(finalData.otherItemData)) ||
                                Loading}
                            onClick={handleMainConfirmAndClose}
                            sx={{
                                ...buttonOutlinedSX, textAlign: 'center', px: '10px !important',
                                ":hover": {
                                    bgcolor: 'rgba(0,0,0,0.1) !important'
                                }, width: 'max-content',
                            }}
                        >
                            Confirm and close
                        </CustomButton>
                    </Box>
                </Box>
            </div>
            }
            {
                AddItemPop &&
                <AdditemPop
                    title={ModalTitle}
                    open={AddItemPop}
                    AddItemType={AddItemType}
                    onClose={() => { setAddItemPop(false) }}
                    QuestionsChecked={QuestionsChecked}
                    setQuestionsChecked={setQuestionsChecked}
                />
            }
           
        </div>)
}

export default AddItems


