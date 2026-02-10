import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AppColors from '../../helpers/AppColors';
import { dfac, dfjac } from '../popUp/commonSX';
import { feildstyle, iconstyle } from './Questions/OtherQuestionOne';
import SearchItemCard from './SearchMealCard';
import { removeDuplicatesByKey } from '@helpers/CommonFunc';
import { useDispatch, useSelector } from 'react-redux';
import { SearchsearchAddons } from '../../store/reducers/dashboardReducer';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';
import CustomPagination from '@components/custom-pagination';

export default function OtherItemsSearch(props) {
    const {
        onSaveClick,
        selectedItemOthers,
        MealDate,
        setMealDate,
        setopenOtherModal,
        TrueQuestionCompletion,
        modalMode
    } = props;
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [TotalSizeOfAddons, setTotalSizeOfAddons] = useState(0);
    const [items, setItems] = useState([]);
    const [AddedItems, setAddedItems] = useState([]);
    const debounceRef = useRef(null); // 🔁 store timeout ref
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.auth);
    const auth_token = userDetails?.data?.auth_token;

    const handleSearch = async () => {
        setLoading(true);
        try {
            await dispatch(SearchsearchAddons({ token: auth_token, search: searchQuery, page: 1, pageSize: 9 }))
                .then(unwrapResult)
                .then((res) => {
                    const data = res?.data?.data?.addons ?? [];
                    setTotalSizeOfAddons(res?.data?.data?.count);
                    console.log("data", data)
                    setItems(removeDuplicatesByKey([...data], 'id'));
                })
        } catch (err) {
            console.error('Search error:', err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (selectedItemOthers?.length > 0) {
            setAddedItems(selectedItemOthers)
        }
    }, [selectedItemOthers, selectedItemOthers?.length])

    // 🔁 Debounce search effect
    useEffect(() => {
        handleSearch()
    }, [])
    useEffect(() => {
        clearTimeout(debounceRef.current);
        if (searchQuery?.length >= 2) {
            debounceRef.current = setTimeout(() => {
                handleSearch();
            }, 500); // 500ms debounce delay
        }
        if (searchQuery?.length == 0) {
            handleSearch()
        }

        return () => clearTimeout(debounceRef.current);
    }, [searchQuery]);
    // 🔁 Debounce search effect

    const handleQuantityChange = (id, value) => {
        setAddedItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, value) } : item
            )
        );

    };
    const handleAdditem = (newItem) => {
        const found = AddedItems?.find((itemm) => itemm?.id == newItem?.id);
        if (!found) {
            const convertedDate = moment(MealDate).format('DD.MM.YYYY')
            setAddedItems([...AddedItems, { ...newItem, quantity: 1, deliveryDates: [convertedDate] }])
        };
    };
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1) // Reset page to 1 when changing items per page
    }

    useEffect(() => {
        handleUpdatedAddonsByPageAndRows({ page: currentPage, pageSize: itemsPerPage })
    }, [currentPage, itemsPerPage])

    const token = userDetails?.data?.auth_token;

    const handleUpdatedAddonsByPageAndRows = ({ page, pageSize }) => {
        try {
            if (token) {
                setLoading(true)
                dispatch(SearchsearchAddons({ token: auth_token, search: searchQuery, page: page, pageSize: pageSize }))
                    .then(unwrapResult)
                    .then((res) => {
                        const data = res?.data?.data?.addons ?? [];
                        setTotalSizeOfAddons(res?.data?.data?.count);
                        setItems(removeDuplicatesByKey([...data], 'id'));
                        setLoading(false)
                    })
                    .catch((err) => {
                        setLoading(false)
                    })
            }
        } catch (error) {
            console.error("Error at handleGetWalletDetails", error)
        }
    }

    const isScreenSmall = useMediaQuery("(max-width:368px)")

    return (
        <Box>
            {/* 🔍 Custom Styled HTML Input */}
            <Box sx={{
                marginRight: '20px',
                ...dfjac
            }}>
                <Box sx={{
                    position: 'relative', marginBottom: '20px', width: { xs: '100%' },
                    maxWidth: modalMode ? '250px' : '450px'
                }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="What do you want to add?"
                        style={{
                            width: '100%',
                            padding: '0px ',
                            padding: '10px 10px 10px 15px',
                            borderRadius: '25px',
                            border: '1px solid #ccc',
                            outline: 'none',
                            fontSize: '14px',
                        }}
                    />
                    <Box
                        onClick={handleSearch}
                        style={{
                            position: 'absolute',
                            right: '0px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        <SearchIcon style={{ color: AppColors.primaryGreen }} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                minHeight: '70vh',
            }}>
                {
                    loading ? (
                        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ ...dfjac }} >
                            Loading extra items for you...   <CircularProgress size={20} sx={{ color: AppColors.primaryGreen, marginLeft: '10px' }} />
                        </Typography>
                    ) :
                        items?.length === 0 ? (
                            <Typography variant="body2" textAlign="center" color="text.secondary">
                                No items found
                            </Typography>
                        ) :
                            (
                                <Box sx={{
                                    // height: { xs: '37vh', md: '50vh' },
                                    display: 'flex',
                                    flexDirection: { md: 'row', },
                                    flexWrap: 'wrap',
                                    // justifyContent: 'space-between',
                                    // overflow: 'auto',
                                    gap: '20px',
                                    // justifyContent: 'center',
                                    overflowX:'hidden',
                                }}>
                                    {/* Search Results */}

                                    {
                                        [...items]?.map((item) => {
                                            const isSelected = AddedItems?.some((selected) => selected?.id === item?.id);
                                            const selectedItem = AddedItems?.find((selected) => selected?.id === item?.id);

                                            return (
                                                <SearchItemCard
                                                    modalMode={modalMode}
                                                    minWidth={modalMode ? {md:'250px'} : { md: '440px' } }
                                                    key={item?.id}
                                                    item={item}
                                                    isSelected={isSelected}
                                                    selectedItem={selectedItem}
                                                    handleQuantityChange={handleQuantityChange}
                                                    handleAdditem={handleAdditem}
                                                    iconstyle={iconstyle}
                                                    feildstyle={feildstyle}
                                                    searchBtn={searchBtn}
                                                    dfac={dfac}
                                                    AppColors={AppColors}
                                                    items={items}
                                                        setAddedItems={setAddedItems}
                                                    handleUpdatedAddonsByPageAndRows={()=>handleUpdatedAddonsByPageAndRows({ page: currentPage, pageSize: itemsPerPage })}
                                                    removeFromArr={(itm) => {
                                                        const filteredItems = AddedItems.filter((i) => i?.id !== itm?.id);
                                                        setAddedItems(filteredItems)
                                                    }}
                                                />
                                            )
                                        })}
                                </Box>
                            )
                }

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: '20px', gap: '10px' }}>
                    <Box
                        sx={{
                            ...searchBtn, minWidth: '50px', maxWidth: '200px',
                            fontSize: isScreenSmall && '11px'

                        }} color="primary"
                        onClick={() => {
                            setopenOtherModal(false);
                            setTimeout(() => {
                                TrueQuestionCompletion(`Q${3}`, 'ModalState', true);
                            }, 500);
                        }} >
                        Close
                    </Box>
                    <Box
                        sx={{
                            ...searchBtn, minWidth: '20px', maxWidth: '200px',

                            fontSize: isScreenSmall && '11px'

                        }} color="primary"
                        onClick={() => { onSaveClick(AddedItems) }} >
                        Add items
                    </Box>
                </Box>
            </Box>
            <Box>
                <CustomPagination
                    totalItems={TotalSizeOfAddons ?? 0}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    rowsPerPageBool={false}
                    customSx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}
                />
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

// [
//     "title": "HydraBoost Citrus Blast 6 Pack",
//     "description": "Hydrating citrus-flavored energy drink with essential minerals",
//     "price": "68.00 AED",
//     "size": "500",
//     "allergens": ["3"],
//     "ingredients": ["21", "47"],
//     "image": "https://i.imgur.com/QjXohYO.jpg"
// },
// {
//     "title": "Revita Energy Berry Punch 12 Pack",
//     "description": "Berry punch energy drink with electrolytes and vitamins",
//     "price": "95.00 AED",
//     "size": "750",
//     "allergens": ["2"],
//     "ingredients": ["11", "34"],
//     "image": "https://i.imgur.com/JTXq6Ml.jpg"
// },
// {
//     "title": "ElectroX Lemon Lime Energy 10 Pack",
//     "description": "Zesty lemon lime flavor to refresh and energize your day",
//     "price": "89.00 AED",
//     "size": "700",
//     "allergens": ["5"],
//     "ingredients": ["12", "25"],
//     "image": "https://i.imgur.com/oyKDmTA.jpg"
// },
// {
//     "title": "PowerMix Tropical Storm 8 Pack",
//     "description": "Tropical fruit blend enriched with magnesium and potassium",
//     "price": "78.00 AED",
//     "size": "600",
//     "allergens": ["4"],
//     "ingredients": ["31"],
//     "image": "https://i.imgur.com/D1nq7na.jpg"
// },
// {
//     "title": "IonCharge Watermelon Wave 6 Pack",
//     "description": "Cool watermelon taste with balanced hydration support",
//     "price": "72.00 AED",
//     "size": "650",
//     "allergens": ["1"],
//     "ingredients": ["18"],
//     "image": "https://i.imgur.com/MI1WJrs.jpg"
// },
// {
//     "title": "VitalHydrate Orange Fizz 12 Pack",
//     "description": "Effervescent orange electrolyte drink to rehydrate fast",
//     "price": "91.00 AED",
//     "size": "800",
//     "allergens": ["2"],
//     "ingredients": ["22"],
//     "image": "https://i.imgur.com/hvQ99IQ.jpg"
// },
// {
//     "title": "EnergyWave Blue Raspberry 10 Pack",
//     "description": "Bold raspberry flavor with added B12 for sustained energy",
//     "price": "87.00 AED",
//     "size": "750",
//     "allergens": ["6"],
//     "ingredients": ["33"],
//     "image": "https://i.imgur.com/CukzPUj.jpg"
// },
// {
//     "title": "ZestFuel Mango Tango 8 Pack",
//     "description": "A tangy mango blend for quick hydration and energy boost",
//     "price": "80.00 AED",
//     "size": "700",
//     "allergens": ["9"],
//     "ingredients": ["45"],
//     "image": "https://i.imgur.com/dU3fgQa.jpg"
// },
// {
//     "title": "HydraEdge Pineapple Burst 6 Pack",
//     "description": "Pineapple-flavored drink for active hydration all day",
//     "price": "75.00 AED",
//     "size": "600",
//     "allergens": ["8"],
//     "ingredients": ["27"],
//     "image": "https://i.imgur.com/1p8c8gO.jpg"
// },
// {
//     "title": "ReCharge Grape Twist 10 Pack",
//     "description": "Grape electrolyte drink with fast-absorbing formula",
//     "price": "90.00 AED",
//     "size": "750",
//     "allergens": ["3"],
//     "ingredients": ["19", "52"],
//     "image": "https://i.imgur.com/s2LnMIW.jpg"
// }
//] */}