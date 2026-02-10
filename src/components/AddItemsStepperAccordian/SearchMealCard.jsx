import { Box, Typography, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { dfac, dfjac, overlayStyle } from '../popUp/commonSX';
import AppColors from '../../helpers/AppColors';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { showFaliureToast } from '@helpers/AppToast';
import MealInfoPop from '@components/popUp/mealInfoPop';
import { useState } from 'react';
import { extractObjects } from '@helpers/ShortMethods';
// import LockICON from "../../../public/images/meal/lock.svg"
import LockICON from "../../../public/images/meal/lock.svg"
import BypassDialog from '@components/popUp/BypassPop';
import { useDispatch, useSelector } from 'react-redux';
import { cheatMealAddon } from 'store/reducers/ordersReducer';
import get from 'lodash/get'
import { unwrapResult } from '@reduxjs/toolkit';
import { truncateText } from '@helpers/CommonFunc';

export default function SearchItemCard({
    item,
    isSelected,
    selectedItem,
    handleQuantityChange,
    handleAdditem,
    iconstyle,
    feildstyle,
    showAddBtn = true,
    bgcolor = 'transparent',
    minWidth = { md: '440px' },
    width = { xs: '100%' },
    handleDeleteItem,
    showDeleteIcon = false,
    items,
    setAddedItems,
    removeFromArr = () => { },
    handleUpdatedAddonsByPageAndRows = () => { },
    modalMode = false
}) {
    const { userDetails } = useSelector((state) => state.auth)
    const isScreenSmallMobile = useMediaQuery("(max-width:400px)")
    const isScreenSmall = useMediaQuery("(max-width:767px)")

    const [open, setOpen] = useState(false);
    const [openByPassPop, setOpenByPassPop] = useState(false)
    const [openByLoader, setOpenByLoader] = useState(false)
    const token = get(userDetails, "data.auth_token", null)

    const dispatch = useDispatch()
    const handleBypass = async () => {
        try {
            setOpenByLoader(true)
            const res = await dispatch(cheatMealAddon({ addon_id: item?.id, token: token }))
                .then(unwrapResult).then((res) => {
                    handleAdditem(item)
                    handleUpdatedAddonsByPageAndRows()
                    setOpenByPassPop(false);
                    setOpenByLoader(false)

                    console.log("res", res)
                }).catch((err) => {

                    setOpenByLoader(false)
                    console.log("err", err)
                })
        } catch (error) {
            setOpenByLoader(false)
            console.log("error", error)
        }
    }
    return (
        <Box
            key={item?.id}
            variant="outlined"
            sx={{
                display: 'flex',
                alignItems: 'center',
                border: `1px solid ${isSelected ? AppColors.primaryOrange : AppColors.primaryGreen}`,
                padding: modalMode ? '10px' : '20px',
                borderRadius: '15px',
                alignItems: 'start',
                gap: '20px',
                flex: { xs: 'auto', md: 1 },
                minWidth: minWidth,
                maxWidth: { md: '470px' },
                width: width,
                minHeight: '140px',
                // height: '130px',
                // maxWidth: maxWidth,
                mx: { xs: '20px', md: '0px' },
                bgcolor: bgcolor,
                position: 'relative',
                justifySelf: 'left',
                bgcolor: AppColors.white,
            }}

        >
            {!showDeleteIcon && (item?.is_cheat == 1 || item?.is_cheat == true) &&
                <Box position={'absolute'} top={'10px'} right={'10px'} sx={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <img src="/images/meal/unlocknew.svg" alt="unloick" style={{
                        width: isScreenSmall ? "28px" : '37px',
                        height: isScreenSmall ? '25px' : '27px'
                    }} />
                    <Typography color={AppColors.primaryGreen} fontSize={'8px'} fontWeight={'bold'} sx={{ mt: '-6px', ml: isScreenSmall ? "-4px" : '1px' }} >
                        Unlocked
                    </Typography>
                </Box>
            }
            {!showDeleteIcon && item?.is_lock &&
                <Box position={'absolute'} top={'10px'} right={'10px'} sx={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <LockICON
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenByPassPop(true)
                        }} />
                    {/* <DeleteOutlineIcon style={{ color: AppColors.primaryOrange }} /> */}
                </Box>
            }
            {showDeleteIcon &&
                <Box position={'absolute'} top={'14px'} right={'14px'} sx={{ cursor: 'pointer' }} onClick={handleDeleteItem}>
                    <img src='/images/icons/bin.svg' style={{width:'22px'}} />
                </Box>
            }
            <Box sx={{
                position: 'relative',
                width: isScreenSmall ? "100px" : '120px',
                height: isScreenSmall ? "100px" : '120px',

            }}>
                <img
                    src={item?.image}
                    alt={item?.title?.slice(0, 12)+"..."}
                    style={{
                        width: '100%',
                        // height: '65px',
                        objectFit: 'contain',
                        margin: '4px',
                        borderRadius: '8px',
                        
                    }}
                />
                {
                   !showDeleteIcon && item?.is_lock &&
                    <div style={{ ...overlayStyle, fontSize: isScreenSmall ? "10px" : '14px' }}>
                        Locked Due to Selected Preferences
                    </div>
                }
            </Box>
            <Box
                sx={{
                    ...dfac,
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'start'
                }}
            >
                <Box sx={{ flex: 1 }}
                    onClick={() => {
                        setOpen(true)
                    }}>
                    <Typography
                        fontSize={'14px'}
                        sx={{ mb: '5px', pr: 2 }}
                        variant="body2"
                        fontWeight="bold"
                        textAlign={'left'}
                    >
                        {item?.title}
                    </Typography>
                    <Typography
                        sx={{ mb: '5px', pt: '5px' }}
                        color={'#787F82'}
                        fontSize={'13px'}
                        textAlign={'left'}
                    >
                        {truncateText(item?.description,modalMode ? 30 : isScreenSmallMobile ? 65 : isScreenSmall ? 90 : 130)}
                    </Typography>
                    <Typography
                        fontSize={'20px'}
                        sx={{ mb: '5px' }}
                        textAlign={'left'}
                        fontWeight="bold"
                        color={AppColors.primaryGreen}
                    >
                        {item?.price} AED
                    </Typography>
                </Box>
                <Box sx={{ ...dfac, alignItems: 'left' }}

                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {isSelected ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ml: 0,
                                gap: '5px',
                                mt: '10px'
                            }}
                        >
                            <Box
                                sx={iconstyle}
                                onClick={() => {
                                    if (selectedItem?.quantity == 1) {
                                        removeFromArr(selectedItem);
                                        return
                                    }
                                    handleQuantityChange(item.id, selectedItem.quantity - 1)

                                }}
                            >
                                <RemoveIcon style={{ fontSize: '14px' }} />
                            </Box>
                            <input
                                style={feildstyle}
                                value={selectedItem.quantity}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    const quantity = Math.max(1, Math.min(5, Number(value)));
                                    handleQuantityChange(item.id, quantity);
                                }}
                            />
                            <Box
                                sx={iconstyle}
                                onClick={() => {
                                    if (selectedItem.quantity < 5) {
                                        handleQuantityChange(item.id, selectedItem.quantity + 1)
                                        return
                                    }
                                    showFaliureToast("Cannot add more than 5 items.")
                                }
                                }
                            >
                                <AddIcon style={{ fontSize: '14px' }} />
                            </Box>
                        </Box>
                    ) : !item?.is_lock && showAddBtn && (
                        <Box sx={{ ...searchBtn, }} onClick={() => handleAdditem(item)}>
                            Add
                        </Box>
                    )}
                </Box>
            </Box>
            {
                open &&
                <MealInfoPop
                    isExecutive={false}
                    info={{
                        ingredients:
                            item?.ingredients?.map((item) => { return { title: item } }) ?? null,
                        title: item?.title,
                        type: item?.type,
                        image: item?.image,
                        description: item?.description,
                        calories: item?.size ?? 0,
                        proteins: item?.proteins ?? null,
                        carbs: item?.carbs ?? null,
                        fats: item?.fats ?? null,
                        mb: item?.mb ?? null,
                        isChilli: item?.is_chilli,
                        qty: item?.quantity,
                        allergy: item?.allergen ? item?.allergen : item?.allergens ?? null,
                    }}
                    isExtraProteins={item?.proteins}
                    view={true}
                    handleSwap={() => { }}
                    open={open}
                    handleClose={() => {
                        setTimeout(() => {
                            setOpen(false)
                        }, 100);
                    }}
                    isAddonItem={true}
                    RemoveMealLoader={false}
                    addProtienPop={() => {
                        setOpen(false)
                    }}
                    showSwapButton={false}
                    showRemoveBtn={false}
                    handleDeleteMealClick={() => { }}
                />
            }
            {
                openByPassPop &&
                <BypassDialog
                    openByLoader={openByLoader}
                    open={openByPassPop}
                    onClose={() => {
                        setOpenByPassPop(false);
                    }}
                    onCloseSnack={() => {
                        setOpenByPassPop(false);
                    }}
                    onConfirm={null}
                    meal={item}
                    common_allergies={item?.common_allergies.map((value) => ({ title: value }))}
                    common_dislikes={[]}
                    isVeg={false}
                    mealorderId={0}
                    mealId={0}
                    orderId={0}
                    token={'abc'}
                    categoryKey={''}
                    ByPassMealRequestfromProp={() => {
                        handleBypass()
                    }}
                />
            }
        </Box>
    );
}

const searchBtn = {
    minWidth: '62px',
    height: '26px',
    bgcolor: AppColors.primaryGreen,
    padding: '6px 10px',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'white',
    cursor: 'pointer',
    ...dfjac,

}