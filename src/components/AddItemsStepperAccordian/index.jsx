import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import AppConstants from '../../helpers/AppConstants';
import SliderQuestions from './Questions/SliderQuestions';
import DatesQuestion from './Questions/DatesQuestion';
import OtherQuestionOne from './Questions/OtherQuestionOne';
import ConsultationQuestion from './Questions/ConsultationQuestion';
import { buttonOutlinedSX, buttonSX, dfjac } from '../popUp/commonSX';
import { showFaliureToast } from '@helpers/AppToast';
import ConfirmPopup from './ConfirmPopup';
import CustomButton from '@components/CustomButton'
import moment from 'moment';
import { useSelector } from 'react-redux';
import OtherQuestionScreen from './OtherQuestionScreen';
import ConfirmDates from '@components/popUp/confirmDates';

const AddItemsStepperAccordian = (props) => {
    const {
        AddItemType,
        title,
        QuestionsChecked,
        setQuestionsChecked,
        onClose = () => { },
        NoofSnackPerDay,
        setNoofSnackPerDay,
        // dates,
        // setDates,
        selectedItems,
        setSelectedItems,
        MealSize,
        setMealSize,
        MealsPerDay,
        setMealsPerDay,
        TrueQuestionCompletion,
        Mealdates,
        setMealDates,
        Snackdates,
        setSnackDates,
        Otherdates,
        setOtherDates,
        orderid,
        setFinalData,
        SnackPricing,
        setSnackPricing,
        MealDate,
        setMealDate,
        items,
        setitems,
        openOtherModal,
        setopenOtherModal,
        handleSelect,
        handleQuantityChange,
        modalMode=false
    } = props;
    const [openPop, setopenPop] = useState(false)
    const dates = AddItemType == AppConstants.AdditemModal.Meal ? Mealdates : AddItemType == AppConstants.AdditemModal.Snack ? Snackdates : Otherdates;
    const [itemIndex, setitemIndex] = useState(0);
    const [itemIndexes, setitemIndexes] = useState([]);
    const [animationDirection, setAnimationDirection] = useState('');


    const content = () => {
        if (AddItemType == AppConstants.AdditemModal.Meal) {
            return (
                <>
                    <SliderQuestions
                        MealSize={MealSize}
                        setMealSize={setMealSize}
                        MealsPerDay={MealsPerDay}
                        setMealsPerDay={setMealsPerDay}
                        AddItemType={AddItemType} />
                    <DatesQuestion
                        handleClick={handleClick}
                        AddItemType={AddItemType}
                        setSelectedItems={setSelectedItems}
                        dates={Mealdates}
                        setDates={setMealDates}
                    />
                </>
            )
        } else if (AddItemType == AppConstants.AdditemModal.Snack) {
            return (
                <>
                    <SliderQuestions
                        NoofSnackPerDay={NoofSnackPerDay}
                        setNoofSnackPerDay={setNoofSnackPerDay}
                        AddItemType={AddItemType} snack={true}
                        SnackPricing={SnackPricing}
                        setSnackPricing={setSnackPricing}
                    />
                    <DatesQuestion AddItemType={AddItemType} snack={true}
                        dates={Snackdates}
                        setSelectedItems={setSelectedItems}
                        handleClick={handleClick}
                        setDates={setSnackDates}
                        MealDate={MealDate}
                        setMealDate={setMealDate}
                    />
                </>
            )
        } else if (AddItemType == AppConstants.AdditemModal.Other) {
            return (
                <>
                    <OtherQuestionOne
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        setFinalData={setFinalData}
                        AddItemType={AddItemType}
                        MealDate={MealDate}
                        setMealDate={setMealDate}
                        items={items}
                        setitems={setitems}
                        openOtherModal={openOtherModal}
                        setopenOtherModal={setopenOtherModal}
                        handleSelect={handleSelect}
                        handleQuantityChange={handleQuantityChange}
                        TrueQuestionCompletion={TrueQuestionCompletion}
                        alreadyOpened={alreadyOpened}
                        setAlreadyOpened={setAlreadyOpened}
                    />
                    {
                        selectedItems?.length >= 1 &&
                        <DatesQuestion
                            setFinalData={setFinalData}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            handleClick={handleClick}
                            AddItemType={AddItemType} other={true}
                            MealDate={MealDate}
                            setMealDate={setMealDate}
                            dates={[]}
                            setDates={() => { }}
                            alreadyOpened={alreadyOpened}
                            setAlreadyOpened={setAlreadyOpened}
                            itemIndex={itemIndex}
                            setitemIndex={setitemIndex}
                            animationDirection={animationDirection}
                            setAnimationDirection={setAnimationDirection}
                            itemIndexes={itemIndexes}
                            setitemIndexes={setitemIndexes}
                        />
                    }
                </>
            )
        }
    }
    const btn2Disabler = () => {
        if (AddItemType == AppConstants.AdditemModal.Meal) {
            if ((MealSize > 0) && (MealsPerDay > 0)) {
                return false
            }
        } else if (AddItemType == AppConstants.AdditemModal.Snack) {
            if (NoofSnackPerDay > 0) {
                return false
            }
        } else if (AddItemType == AppConstants.AdditemModal.Other) {
            if (selectedItems?.length > 0) {
                return false
            }
        }
        return true
    }
    function DatesQuestionCheck(datesQues) {
        const hasEmptyDeliveryDates = (data) => {
            return data?.some(item => item?.deliveryDates?.length == 0);
        };
        if (AddItemType == AppConstants.AdditemModal.Other) {
            if (hasEmptyDeliveryDates(selectedItems)) {
                showFaliureToast("Please select delivery dates for all item.")
            } else {
                // handleModalSave() // directly save other items
                // setopenPop(true) // closing conset modal for other items
                if (itemIndex == selectedItems?.length - 1 || itemIndexes?.length >= selectedItems?.length) {
                    // setitemIndex(itemIndex + 1)
                    setitemIndexes([...itemIndexes, itemIndex + 1])
                    setAlreadyOpened(true)
                    setopenPop(true) // closing conset modal for other items
                } else {
                    if (itemIndex == selectedItems?.length - 2) {
                        setitemIndexes([...itemIndexes, itemIndex + 1, itemIndex + 2])
                    } else {
                        setitemIndexes([...itemIndexes, itemIndex + 1])
                    }
                    setitemIndex(itemIndex + 1)
                    setAnimationDirection('slideInRight')
                }
            }
            return
        }
        if (datesQues?.length <= 0) {
            showFaliureToast("Please select dates for delivery.")
        } else {
            setopenPop(true)
        }
    }
    function QuestionOneCheck(toastMessage) {
        showFaliureToast(toastMessage)
    }
    const handleClick = () => {
        if (AddItemType == AppConstants.AdditemModal.Meal) {
            if (!btn2Disabler()) {
                DatesQuestionCheck(Mealdates, { Q1: true })
            } else {
                QuestionOneCheck("Please select both meals size and no of meal per day.")
            }
        }
        else if (AddItemType == AppConstants.AdditemModal.Snack) {
            if (!btn2Disabler()) {
                DatesQuestionCheck(Snackdates, { Q2: true })
            } else {
                QuestionOneCheck("Please select atleast one snack per day.")
            }
        }
        else if (AddItemType == AppConstants.AdditemModal.Other) {
            if (!btn2Disabler()) {
                // if(alreadyOpened || selectedItems?.length == 1){ // already opened logic
                //     DatesQuestionCheck(dates, { Q3: true })
                // }else{
                //     setOpen(true)
                // }
                DatesQuestionCheck(dates, { Q3: true })
            } else {
                QuestionOneCheck("Please select atleast one item to move forward.")
            }
        }
        else if (AddItemType == AppConstants.AdditemModal.Consultation) {
            window.location.href = "https://calendly.com/practical_meal_plans/chat-with-our-team";
            setQuestionsChecked({
                ...QuestionsChecked, Q4: true
            })
            onClose()
        }
        else if (AddItemType == AppConstants.AdditemModal.Coaching) {
            window.location.href = "https://calendly.com/practical_meal_plans/consultation-with-our-nutritionist";
            setQuestionsChecked({
                ...QuestionsChecked, Q5: true
            })
            onClose()
        }
    }
    const convertDeliveryDatesFormatinArr = (dataArray) => {
        return dataArray?.map(item =>
            moment(item, ['DD.MM.YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD 00:00:00')
        );
    };
    const convertDeliveryDatesFormat = (dataArray) => {
        return dataArray?.map(item => ({
            ...item,
            deliveryDates: item?.deliveryDates?.map(date =>
                moment(date, ['DD.MM.YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD 00:00:00')
            )
        }));
    };
    const removeKeysFromArray = (dataArray, keysToRemove) => {
        return dataArray.map(item => {
            const newItem = { ...item };
            keysToRemove.forEach(key => {
                delete newItem[key];
            });
            return newItem;
        });
    };
    const renameKeysInArray = (dataArray, keyMap) => {
        return dataArray.map(item => {
            return Object.keys(item).reduce((acc, key) => {
                const newKey = keyMap[key] || key;
                acc[newKey] = item[key];
                return acc;
            }, {});
        });
    };

    const handleModalSave = async () => {
        if (AddItemType == AppConstants.AdditemModal.Meal) {
            setFinalData(prev => ({
                ...prev,
                mealData: {
                    order_id: orderid,
                    meal_size: MealSize, //400,500,600,700,800
                    meal_count_to_add: MealsPerDay,
                    meal_delivery_dates: convertDeliveryDatesFormatinArr(Mealdates),
                }
            }));

            TrueQuestionCompletion('Q1', 'checked', true)
            TrueQuestionCompletion('Q1', 'ModalState', false)
        }
        else if (AddItemType == AppConstants.AdditemModal.Snack) {
            setFinalData(prev => ({
                ...prev,
                snackData: {
                    order_id: orderid,
                    meal_count_to_add: NoofSnackPerDay,
                    meal_delivery_dates: convertDeliveryDatesFormatinArr(Snackdates)
                }
            }));
            TrueQuestionCompletion('Q2', 'checked', true)
            TrueQuestionCompletion('Q2', 'ModalState', false)
        }
        else if (AddItemType == AppConstants.AdditemModal.Other) {

            try {
                const withoutTheseKeys = [
                    "id",
                    "title",
                    "description",
                    "price",
                    "size",
                    "allergens",
                    "ingredients",
                    "image",
                    "created_at",
                    "updated_at",
                ];
                const convertedDatesToFormat = convertDeliveryDatesFormat(selectedItems);
                const keyMap = {
                    quantity: 'qty',
                    id: 'addon_id',
                    deliveryDates: 'delivery_dates'
                };
                const updatedArray = renameKeysInArray(convertedDatesToFormat, keyMap);
                const removedKey = removeKeysFromArray(updatedArray, withoutTheseKeys);
                setFinalData(prev => ({
                    ...prev,
                    otherItemData: removedKey
                }));
                TrueQuestionCompletion('Q3', 'checked', true)
                TrueQuestionCompletion('Q3', 'ModalState', false)
            } catch (err) { console.log("err", err) }
        }
        else if (AddItemType == AppConstants.AdditemModal.Consultation) {
            TrueQuestionCompletion('Q4', 'checked', true)
            TrueQuestionCompletion('Q4', 'ModalState', false)
        }
        else if (AddItemType == AppConstants.AdditemModal.Coaching) {
            TrueQuestionCompletion('Q5', 'checked', true)
            TrueQuestionCompletion('Q5', 'ModalState', false)
        }
        setopenPop(false)
    }

    const {
        GetcalendlybookingData
    } = useSelector(state => state?.home);
    const showBtnforConsult = Array.isArray(GetcalendlybookingData) && GetcalendlybookingData?.filter(
        (event) => event?.event_type_uuid == AppConstants.eventTypeId.Consultation)?.length > 0;
    const [open, setOpen] = useState(false);
    const [alreadyOpened, setAlreadyOpened] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const onConfirm = () => {
        DatesQuestionCheck(dates, { Q3: true })
        setOpen(false);
    }
    return (
        <Box key={title}  >
            {
                AddItemType == AppConstants.AdditemModal.Consultation ?
                    <ConsultationQuestion
                        eventData={
                            Array.isArray(GetcalendlybookingData) && GetcalendlybookingData?.filter(
                                (event) => event?.event_type_uuid == AppConstants.eventTypeId.Consultation
                            )
                        }
                        key={AppConstants.AdditemModal.Consultation} AddItemType={AddItemType} /> :
                    AddItemType == AppConstants.AdditemModal.Coaching ?
                        <ConsultationQuestion
                            eventData={
                                Array.isArray(GetcalendlybookingData) && GetcalendlybookingData?.filter(
                                    (event) => event?.event_type_uuid == AppConstants.eventTypeId.Coaching
                                )
                            }
                            key={AppConstants.AdditemModal.Coaching} AddItemType={AddItemType} Coaching={true} /> :
                        <Box sx={{ padding: '' }} >
                            {content()}
                        </Box>
            }
            {
                (AddItemType == AppConstants.AdditemModal.Consultation && showBtnforConsult) ||
                    AddItemType == AppConstants.AdditemModal.Other && selectedItems?.length == 0
                    ? <></>
                    :
                    <Box sx={{
                        ...dfjac,
                        gap: '10px', flexDirection: { xs: 'column', md: 'row' }, mt: '10px', pb: '20px'
                    }} >
                        <CustomButton
                            onClick={handleClick}
                            sx={{
                                ...buttonOutlinedSX, textAlign: 'center', px: '10px !important',
                                ":hover": {
                                    bgcolor: 'rgba(0,0,0,0.1) !important'
                                }, width: 'max-content',
                            }}
                        >
                            {AddItemType == AppConstants.AdditemModal.Consultation ? "Book Call" :
                                AddItemType == AppConstants.AdditemModal.Coaching ? "See Price and booking" :
                                    AddItemType == AppConstants.AdditemModal.Other ?
                                        itemIndex == selectedItems?.length - 1 || itemIndexes?.length >= selectedItems?.length ?
                                            "Save Dates" :
                                            "Next "
                                        :
                                        "Save Dates"
                            }
                        </CustomButton>
                    </Box>
            }
            <ConfirmPopup
                open={openPop}
                setopenPop={setopenPop}
                handleClose={() => { setopenPop(false) }}
                onSaveClick={handleModalSave}
                isExecutive={false}
                modalMode={modalMode}
                typeItem={AddItemType}
            />
            <ConfirmDates
                modalMode={modalMode}
                open={open}
                setOpen={setOpen}
                handleClose={handleClose}
                onConfirm={onConfirm}
                title={''}
                description={`Please confirm you are happy with the delivery dates for all selected items.`}
                Yes={"Confirm Dates"}
                No={"No, Go Back"}
            />
        </Box >
    )
}

export default AddItemsStepperAccordian