import React, { useState } from "react";
import { Box, Typography, Checkbox } from "@mui/material";
import AppColors from "@helpers/AppColors";
import { closeIconSX, dfac, dfjac, titleSX } from "@components/popUp/commonSX";
import SearchItemCard from "../SearchMealCard";
import ConfirmDates from "../../popUp/confirmDates";

const OtherQuestionOne = (props) => {

    const {
        selectedItems,
        setSelectedItems,
        setFinalData,
        MealDate,
        setMealDate,
        TrueQuestionCompletion,
        items,
        setitems,
        openOtherModal,
        setopenOtherModal,
        handleSelect,
        handleQuantityChange,
    } = props;


    React.useEffect(() => {
        if (selectedItems?.length > 0) {
            setitems(selectedItems)
        }
    }, [])

    const handleAddItem = () => {

        setopenOtherModal(true)
        setTimeout(() => {
            for (let index = 1; index <= 5; index++) {
                TrueQuestionCompletion(`Q${index}`, 'ModalState', false);
            }
            // TrueQuestionCompletion(`Q${3}`, 'ModalState', false);
        }, 500);
    }
    return (
        <Box sx={{ mt: 1, mx: 'auto' }}  >
            <Typography sx={{ textAlign: 'center', fontSize: {xs:'14px ',md:'22px'}, fontWeight: 500 }}>
                Step 1:
            </Typography>
            <Typography textAlign="center" sx={{ my: '5px', mb: '10px' ,fontSize: {xs:'14px ',md:'18px'}, }}>
                Please select items:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }} >
                {
                    items.map((item) => {
                        const isSelected = true;
                        const selectedItem = selectedItems.find((selected) => selected.id === item.id);
                        return (
                            <SearchItemCard
                                key={item?.id}
                                item={item}
                                isSelected={isSelected}
                                selectedItem={selectedItem}
                                handleQuantityChange={handleQuantityChange}
                                handleAdditem={() => { }}
                                iconstyle={iconstyle}
                                feildstyle={feildstyle}
                                showAddBtn={false}
                                bgcolor={"white"}
                                minWidth={"78%"}
                                width={{ xs: 'auto' }}
                                showDeleteIcon={true}
                                handleDeleteItem={() => {
                                    const newItems = items?.filter((it) => it?.id != item?.id);
                                    setitems(newItems)
                                    setSelectedItems(newItems);
                                    setFinalData(prev => ({
                                        ...prev,
                                        otherItemData: null
                                    }));
                                }}
                            />
                        );
                    })
                }

            </Box>
            <Box my={2}>
                <Box
                    onClick={handleAddItem}
                    sx={{
                        ...roundBtnStyle,

                    }} > + </Box>
                <Typography sx={{ mt: '8px' }} color={AppColors.primaryGreen} gutterBottom textAlign="center">
                    Add items
                </Typography>
            </Box>
            {/* <OtherQuesModal
                open={openOtherModal}
                selectedItemOthers={items}
                onClose={() => { setopenOtherModal(false) }}
                onSaveClick={(data) => {
                    console.log("data", data)
                    setitems(data);
                    setSelectedItems(data);
                    setopenOtherModal(false)
                }}
                MealDate={MealDate}
                setMealDate={setMealDate}
            /> */}

        </Box >
    );
};

export default OtherQuestionOne;
export const iconstyle = {
    height: "12px",
    width: "12px",
    ...dfjac,
    bgcolor: AppColors.primaryGreen,
    color: "white",
    padding: "6px",
    borderRadius: "5px",
    fontSize: "12px",
    cursor: "pointer",

}
export const feildstyle = {
    width: "20px",
    padding: "6px 9px",
    borderRadius: "5px",
    textAlign: "center",
    border: `1px solid ${AppColors.primaryGreen}`,
}
export const roundBtnStyle = {
    height: '30px',
    width: '30px',
    borderRadius: '30px',
    padding: '14px',
    border: `1px solid ${AppColors.primaryGreen}`,
    margin: 'auto',
    padding: 'auto',
    fontSize: '24px',
    color: AppColors.primaryGreen,
    cursor: 'pointer',
    ...dfjac,
    ":hover": {
        bgcolor: 'rgba(0,0,0,0.1) !important'
    },

}
export const liststyle = {
    display: "flex",
    alignItems: "center",
    p: 2,
    mb: 2,
    borderRadius: 2,
    transition: "0.3s ease",
}