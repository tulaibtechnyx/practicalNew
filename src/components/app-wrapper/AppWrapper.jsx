import React, { useEffect, useState } from 'react'
import CustomConfirmationPopup from '../custom-confirmation-modal'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import AppRoutes from '../../helpers/AppRoutes';
import { GetTickersRequest, setCloseForceOpenedPop, setPlanExpiredUpcoming, setshowCoupenPopupStateFromApp, UpcomingOrdersRequest, updatePriceRequest } from 'store/reducers/dashboardReducer';
import { unwrapResult } from '@reduxjs/toolkit';
import AppLogger from '@helpers/AppLogger';
import get from "lodash/get";
import { updateCRONDetails } from 'store/reducers/cron-reducer';
import { isRouteExcluded, setCache, setupInactivity } from '@helpers/CommonFunc';
import HelpConfirmationPopCustom from '../popUp/HelpConfirmationPopCustom';
import AppConstants from '@helpers/AppConstants';
import { getCache } from '../../helpers/CommonFunc';
import { getPricingData, setdecorationQuizData } from '../../store/reducers/homeReducer';
import PWASplashScreen from '../PWASplashScreen';



const AppWrapper = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userDetails, isExecutive } = useSelector((state) => state.auth);
    const { orderHistory, showCoupenPopupStateFromApp } = useSelector((state) => state.home);
    const { planUpdated, orderId } = useSelector(state => state.cronDetails);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const planExpiredUpcoming = useSelector((state) => state.home.planExpiredUpcoming);
    const token = get(userDetails, "data.auth_token", "");

    const [checked, setChecked] = React.useState(false);
    const PathNames = [AppRoutes.login, AppRoutes.signup, AppRoutes.quizB, AppRoutes.result, AppRoutes.termCondition]
    const isExcluded = isRouteExcluded(router.pathname, PathNames);
    const PathNamesForNonHelpModal = [AppRoutes.login, AppRoutes.signup, AppRoutes.dashboard, AppRoutes.checkOut, AppRoutes.swapItem, AppRoutes.termCondition, AppRoutes.privacy]
    const isExcludedforHelp = isRouteExcluded(router.pathname, PathNamesForNonHelpModal);
    // In - activity detection
    const [showPopup, setShowPopup] = useState(false);
    const [forceClosed, setforceClosed] = useState(false);
    const [psqModalwas, setpsqModalwas] = useState('');
    const isDashboard = router.pathname == '/dashboard';
    const handleClose = () => {
        if (checked == true) {
            sessionStorage.setItem('onceOpened', 'true')
            setforceClosed(true)
        }
        if (psqModalwas == 'trueBefore') {
            dispatch(setshowCoupenPopupStateFromApp(true))
            setpsqModalwas('')
        }
        setShowPopup(false);
    }
    const handleChangeCheck = (event) => {
        event.preventDefault();
        setChecked(!checked);
    };
    const handleChangeCheckBtn = () => {
        setChecked(true);
        sessionStorage.setItem('onceOpened', 'true')
        setforceClosed(true)
        setShowPopup(false);
        if (psqModalwas == 'trueBefore') {
            dispatch(setshowCoupenPopupStateFromApp(true))
            setpsqModalwas('')
        }

    };
    // const handleRedirect = () => {
    //     setModalOpen(false)
    //     router.push(AppRoutes.dashboard).then(async () => {
    //         await router.reload();
    //         await setTimeout(() => {
    //             dispatch(UpcomingOrdersRequest({ token }))
    //                 .then(unwrapResult)
    //                 .then((res) => {
    //                     // setCache(cacheKey, res?.data?.data, 30, AppConstants.CacheTime.sec); // Cache for 5 minutes
    //                     AppLogger("Response at upcoming", res)
    //                     dispatch(setPlanExpiredUpcoming(true));
    //                     setModalOpen(false)
    //                     console.log('app wrapper se chla hai')
    //                 }).catch((err) => {
    //                     console.log("err up", err);
    //                     setModalOpen(false)
    //                 }
    //                 ).finally(() => {
    //                     setModalOpen(false)
    //                     router.reload()
    //                     // dispatch(GetTickersRequest({ token }))
    //                     // .then(unwrapResult)
    //                     // .then((res) => {
    //                     //   // setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.min);
    //                     //   AppLogger("Response at GetResturantsRequest", res)
    //                     //   console.log("planExpiredUpcoming appwrapp",planExpiredUpcoming)
    //                     //   if (planExpiredUpcoming) {
    //                     //     document.body.classList.add("tickerON"); // Replaced jQuery with vanilla JS
    //                     //     console.log("tickerON added FROM WRAPPER");
    //                     //   } else {
    //                     //     document.body.classList.remove("tickerON"); // Replaced jQuery with vanilla JS
    //                     //   }
    //                     // })
    //                     // .catch((err) => {
    //                     //   AppLogger("Error at GetResturantsRequest", err)
    //                     //   document.body.classList.remove("tickerON");
    //                     // })
    //                 })

    //         }, 800);
    //     });
    // }
    const handleRedirect = async () => {
        // 1. Close the modal right away
        setModalOpen(false);

        // 2. Navigate to the dashboard (client-side transition)
        try {
            await router.push(AppRoutes.dashboard);

            // 3. Instead of router.reload(), just dispatch the action immediately.
            // The page component is now rendered, and the data fetch can begin.
            const result = await dispatch(UpcomingOrdersRequest({ token })).then(unwrapResult);

            // Success logic
            AppLogger("Response at upcoming", result);
            dispatch(setPlanExpiredUpcoming(true));

            // Final close (optional, depending on where this function lives)
            setModalOpen(false);
            console.log('Upcoming API ran after successful navigation.');
            router.reload()
        } catch (error) {
            // Handle navigation or API errors
            console.error("Error during redirect or upcoming orders fetch:", error);
            // Ensure modal is closed on error
            setModalOpen(false);
        }
    };
    const updatePrice = async (order_id = null) => {
        try {
            if (token && order_id) {
                setLoading(true);
                await dispatch(updatePriceRequest({ token, order_id }))
                    .then(unwrapResult)
                    .catch((err) => console.log(err))
            }
        } catch (error) {
            AppLogger("Error at updatePriceRequestHandler", error)
        } finally {
            handleClearCronDetails();
            setLoading(false);
            handleRedirect();
        }
    }
    const handleClearCronDetails = () => {
        dispatch(updateCRONDetails({
            planUpdated: false,
            orderId: null,
        }));
    }
    const handleConfirm = () => {
        updatePrice(orderId);
    }
    const getQuizDecorationData = async () => {
        try {
            // const cacheKey = `quizDecorationData`;
            // const cachedData = getCache(cacheKey);
            // if (cachedData) {
            //     AppLogger("Serving from cache", cachedData);
            //     return;
            // }
            // const response = await fetch("/api/mock-decoration-quiz-b");
            const response = await dispatch(getPricingData());
            console.log("response",response)
            // if (!response.ok) {
            //     throw new Error(`Network response was not ok, status: ${response.status}`);
            // }
            // const dataFromDecoration = await response.json();
            // if (dataFromDecoration?.showDecoration) {
            //     dispatch(setdecorationQuizData(dataFromDecoration));
            //     // setCache(cacheKey, dataFromDecoration, 1, AppConstants.CacheTime.hour);
            // } else {
            //     dispatch(setdecorationQuizData(null));
            //     // setCache(cacheKey, null, 1, AppConstants.CacheTime.hour);
            // }
        } catch (err) {
            AppLogger("Error at getData", err)
        }
    }
    useEffect(() => {
        getQuizDecorationData();
    }, []);
    const conditionToViewHelpModal = userDetails ? false : isExcludedforHelp;
    const conditionToOpenHelpModal = !userDetails ? showPopup && isExcludedforHelp : showPopup && isExcludedforHelp;

    useEffect(() => {
        if (window != "undefined") {
            const onceOpened = sessionStorage.getItem('onceOpened');
            if (onceOpened == 'true' || onceOpened == true || forceClosed) {
                // setShowPopup(false); // If the popup has been opened once, do not show it again
                return;
            }
            const clearInactivity = setupInactivity(() => {
                // Add your own logic to check if user has not reached PSQ or payment
                if (!sessionStorage.getItem('psqPassed') && !forceClosed && conditionToViewHelpModal) {
                    // if (showCoupenPopupStateFromApp == true) {
                    // }else{
                    setShowPopup(true);
                    // }
                    if (showCoupenPopupStateFromApp == true) {
                        setpsqModalwas('trueBefore');
                        dispatch(setshowCoupenPopupStateFromApp(false))
                    }
                    // sessionStorage.setItem('onceOpened', 'true'); // Set a flag to avoid showing the popup again
                }
            });

            return () => clearInactivity();
        }
    }, [forceClosed, orderHistory, conditionToViewHelpModal, showCoupenPopupStateFromApp, isDashboard]);

    useEffect(() => {
        if (planUpdated && orderId && !loading && isExcluded) {
            setShowPopup(false)
        }
    }, [planUpdated && orderId && !loading && isExcluded])

    useEffect(() => {
        return () => {
            setpsqModalwas('')
        }
    }, [])

    useEffect(() => {
        // Open modal only when API updates data successfully
        if (planUpdated && orderId && !loading && isExcluded) {
            setModalOpen(true);
        }
    }, [planUpdated, orderId, loading, isExcluded]);

    return (
        <React.Fragment>
            <PWASplashScreen />
            {
                isExcluded && modalOpen &&
                <CustomConfirmationPopup
                    open={isExcluded && modalOpen}
                    modalTitle='Your Meal Plan Has Been Updated'
                    modalDescription='Your plan has been updated to reflect the latest adjustments. Please review the changes to ensure everything meets your expectations.'
                    onConfirmBtnTitle='View My Plan'
                    handleConfirm={handleConfirm}
                    isLoading={loading}
                    onlyConfirmationBtn={true}
                />
            }
            {conditionToOpenHelpModal &&
                (
                    <HelpConfirmationPopCustom
                        checked={checked}
                        setChecked={setChecked}
                        setShowPopup={setShowPopup}
                        handleClose={handleClose}
                        handleShowCode={() => { }}
                        handleCloseOut={handleChangeCheckBtn}
                        isExecutive={isExecutive}
                        setforceClosed={setforceClosed}
                        handleChangeCheck={handleChangeCheckBtn}
                        openOnced={() => sessionStorage.setItem('onceOpened', 'true')}
                        open={conditionToOpenHelpModal} onClose={() => { }} fullWidth maxWidth="sm" />
                )}
            {children}

        </React.Fragment>
    )
}

export default AppWrapper
