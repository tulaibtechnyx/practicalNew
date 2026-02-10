import React, { useEffect, useState } from 'react';
import { ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import theme from "../../styles/themes/theme";
import Header from "../../components/header";
import PricingHeader from 'components/meal-pricing/PricingHeader';
import TabsAndContent from 'components/meal-pricing/TabsAndContent';
import { getMealPricingData } from 'store/reducers/homeReducer';
import SkeletonComp from 'components/skeleton';

const MealPricing = () => {
    const [dataRec, setDataRec] = useState(null)
    const { homeData } = useSelector((state) => state.homepage)
    const { isExecutive } = useSelector((state) => state.auth)
    const [PricingData, setPricingData] = useState(null)
    const [Loader, setLoader] = useState(null);
    const dispatch = useDispatch()

    useEffect(() => {
        if (homeData) {
            setDataRec(homeData)
        }
    }, [homeData])

    useEffect(() => {
        document.body.classList.add("headerBG")
        document.body.classList.add("menuItems")
    }, [])
    // Fetcing data for Pricing page
    async function fetchMealPricingDataFromApi() {
        setLoader(true)
        const response = await dispatch(getMealPricingData())
        return response

    }
    useEffect(() => {
        fetchMealPricingDataFromApi()
            .then((resp) => {
                setLoader(false)
                if (resp) {
                    setPricingData(resp?.payload?.data)
                }
            })
            .catch(err => {
                setLoader(false)
                console.log('cant fetch latest prices: ', err)
            }).finally(() => {
                setLoader(false)
            })
    }, [])
    return (
        <ThemeProvider theme={theme}>
            <Header isExecutive={isExecutive} dataRec={dataRec} />
            <section className="page--wrapper">
                <PricingHeader />
                {
                    Loader ? <SkeletonComp /> :
                        <TabsAndContent PricingData={PricingData} Loader={Loader} />
                }
            </section>
        </ThemeProvider>
    )
}

export default MealPricing
