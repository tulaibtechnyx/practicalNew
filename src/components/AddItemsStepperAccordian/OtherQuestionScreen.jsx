import React, { useEffect, useState } from "react";
import { Box, Typography, Checkbox } from "@mui/material";
import AppColors from "@helpers/AppColors";
import { closeIconSX, dfac, dfjac, titleSX } from "@components/popUp/commonSX";
import SearchItemCard from "./SearchMealCard";
import CloseIcon from "@mui/icons-material/Close";
import OtherItemsSearch from "./SearchMealComp";
import OtherQuesModal from "./OtherQuesModal";

const OtherQuestionScreen = (props) => {
    const {
        selectedItems,
        setSelectedItems,
        setFinalData,
        items,
        MealDate,
        setMealDate,
        setopenOtherModal,
        setitems,
        TrueQuestionCompletion,
        modalMode=false
    } = props;
    useEffect(() => {
        if (window) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth", // Enables smooth scrolling
            });
        }
    }, [])
    return (
        <Box sx={{
            // marginTop: {md:'250px',xs:'350px'},
            // position: 'absolute',
            // top: '0px',
            // bottom: '0px',
            // left: '0px',
            // height: '65vh',
            width: '100%',
            zIndex: 1,
            // backgroundColor: '#fff',
            // backgroundImage: 'url(/images/bg/quiz-bg-bk.png)',
            //  backgroundRepeat: 'no-repeat',
        //    backgroundAttachment: 'fixed',
        //    backgroundSize: 'cover',
        //    backgroundPosition: 'center',
            overflowY: 'auto',
            // overflow: 'hidden',
            // overflowY: 'auto',
            // scrollbarWidth: 'none', // For Firefox  

        }}>
            <Box sx={{
                overflow: { xs: 'auto', md: "auto" },
                scrollbarWidth: 'none', // For Firefox
                '&::-webkit-scrollbar': { // For Chrome, Safari, and Opera
                    display: 'none',
                },
                '-ms-overflow-style': 'none', // For Internet Explorer and Edge
                px: { xs: modalMode ? "0px":"20px", md: modalMode ? "20px" : '150px' }
            }}>
                <Typography
                    variant="h1"
                    sx={{ ...titleSX, textTransform: 'none', mb: '30px', background:'transparent'}}
                    color={AppColors.primaryGreen}
                >
                    Add Other Items
                </Typography>
                <OtherItemsSearch
                    selectedItemOthers={items}
                    onSaveClick={(data) => {
                        setitems(data);
                        setSelectedItems(data);
                        setopenOtherModal(false)
                        setTimeout(() => {
                            TrueQuestionCompletion(`Q${3}`, 'ModalState', true);
                        }, 500);
                    }}
                    MealDate={MealDate}
                    setMealDate={setMealDate}
                    setopenOtherModal={setopenOtherModal}
                    TrueQuestionCompletion={TrueQuestionCompletion}
                    modalMode={modalMode}
                />
            </Box>
        </Box>
    )
}

export default OtherQuestionScreen