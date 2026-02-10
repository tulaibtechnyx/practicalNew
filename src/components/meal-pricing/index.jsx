import React, { useEffect, useState } from 'react';
import { ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import theme from "../../styles/themes/theme";
import Header from "../../components/header";
import PricingHeader from 'components/meal-pricing/PricingHeader';
import TabsAndContent from 'components/meal-pricing/TabsAndContent';
import { getMealPricingData } from 'store/reducers/homeReducer';
import { Typography } from '@mui/material';
import AppColors from '@helpers/AppColors';

const MealPricing = () => {
    const [dataRec, setDataRec] = useState(null)
    const [PricingData, setPricingData] = useState(null)
    const { homeData } = useSelector((state) => state.homepage)
    const dispatch = useDispatch()
    useEffect(() => {
        if (homeData) {
            setDataRec(homeData)
        }
    }, [homeData])

    useEffect(() => {
        document.body.classList.add("headerBG")
        document.body.classList.add("singleLogo")
        document.body.classList.add("menuItems")
    }, [])

    // Fetcing data for Pricing page
    async function fetchMealPricingDataFromApi() {
        const resp = await dispatch(getMealPricingData())
        return resp

    }
    useEffect(() => {
        console.log("Im index pricing page")
        // fetchMealPricingDataFromApi().then((resp)=>{console.log("resp",resp)})
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Header dataRec={dataRec} />
            <section className="page--wrapper">
                <PricingHeader />
               
                <TabsAndContent />
            </section>
        </ThemeProvider>
    )
}

export default MealPricing
