import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { dfac, dfjac } from '../popUp/commonSX';
import AppColors from '../../helpers/AppColors';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { showFaliureToast } from '@helpers/AppToast';


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
    maxWidth = '430px',
    handleDeleteItem,
    showDeleteIcon = false,
    items,
    setAddedItems,
    removeFromArr = () => { }
}) {
    return (
        <Box
            key={item?.id}
            variant="outlined"
            sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                border: `1px solid ${isSelected ? AppColors.primaryOrange : AppColors.primaryGreen}`,
                padding: '20px',
                borderRadius: '15px',
                alignItems: { xs: 'start', md: 'center' },
                gap: '20px',
                maxWidth: maxWidth,
                // mx: { xs: '20px', md: 'auto' },
                bgcolor: bgcolor,
                position: 'relative',
            }}
        >
            {showDeleteIcon &&
                <Box position={'absolute'} top={'10px'} right={'10px'} sx={{ cursor: 'pointer' }} onClick={handleDeleteItem}>
                    <img src='/images/icons/bin.svg' />
                    {/* <DeleteOutlineIcon style={{ color: AppColors.primaryOrange }} /> */}
                </Box>
            }
            <img
                src={item?.image}
                alt={item?.title}
                style={{
                    width: '65px',
                    height: '65px',
                    objectFit: 'cover',
                    margin: '4px',
                    borderRadius: 1
                }}
            />
            <Box
                sx={{
                    ...dfac,
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    alignItems: { xs: 'start', md: 'center' }
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography
                        fontSize={{ xs: '14px', md: '18px' }}
                        sx={{ mb: { xs: '5px', md: '0px' } }}
                        variant="body2"
                        fontWeight="bold"
                        textAlign={{ xs: 'left', md: 'center' }}
                    >
                        {item?.title}
                    </Typography>
                    <Typography
                        sx={{ mb: { xs: '5px', md: '0px' } }}
                        color={'#787F82'}
                        fontSize={{ xs: '13px', md: '16px' }}
                        textAlign={{ xs: 'left', md: 'center' }}
                    >
                        Allergen: { item?.allergen ? item?.allergen : item?.allergens}
                    </Typography>
                    <Typography
                        fontSize={{ xs: '20px', md: '24px' }}
                        sx={{ mb: { xs: '5px', md: '0px' } }}
                        textAlign={{ xs: 'left', md: 'center' }}
                        fontWeight="bold"
                        color={AppColors.primaryGreen}
                    >
                        {item?.price} AED
                    </Typography>
                </Box>
                <Box sx={{ ...dfac, alignItems: 'left' }}>
                    {isSelected ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ml: { xs: 0, md: 2 },
                                gap: '5px',
                                mt: { xs: '10px', md: '0px' }
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
                    ) : showAddBtn && (
                        <Box sx={searchBtn} onClick={() => handleAdditem(item)}>
                            Add
                        </Box>
                    )}
                </Box>
            </Box>
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