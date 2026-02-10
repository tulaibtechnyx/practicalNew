import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    CircularProgress
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

export default function OtherItemsSearch(props) {
    const { onSaveClick, selectedItemOthers, MealDate, setMealDate } = props;
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [AddedItems, setAddedItems] = useState([]);
    const debounceRef = useRef(null); // 🔁 store timeout ref
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.auth);
    const auth_token = userDetails?.data?.auth_token;

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setItems([]);
            return;
        }

        setLoading(true);
        try {
            const res = await dispatch(SearchsearchAddons({ token: auth_token, search: searchQuery }))
                .then(unwrapResult)
                .then((res) => {
                    const data = res?.data?.data;
                    console.log("data", data)
                    setItems(removeDuplicatesByKey([...data, ...AddedItems], 'id'));
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
        clearTimeout(debounceRef.current);
        if (searchQuery?.length >= 2) {
            debounceRef.current = setTimeout(() => {
                handleSearch();
            }, 500); // 500ms debounce delay
        }
        if (searchQuery?.length == 0) {
            if (selectedItemOthers?.length > 0) {
                setItems(removeDuplicatesByKey([...AddedItems, ...selectedItemOthers], 'id'));
            }
            else {
                setItems(removeDuplicatesByKey([...AddedItems], 'id'));
            }
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

    return (
        <Box>
            {/* 🔍 Custom Styled HTML Input */}
            <Box sx={{
                marginRight: '20px',
                ...dfjac
            }}>
                <Box sx={{
                    position: 'relative', marginBottom: '20px', width: { xs: '100%' },
                    maxWidth: '450px'
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

            {
                items?.length === 0 ? (
                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        No items found
                    </Typography>
                ) : (
                    <Box sx={{ height: { xs: '32vh', md: '45vh' }, overflow: 'auto' }}>
                        {/* Search Results */}
                        {items.filter(item => !AddedItems.some(selected => selected.id === item.id)).length > 0 && (
                            <>
                                <Typography variant="subtitle2" textAlign={'center'} sx={{ mt: 2, mb: 1 }}>
                                    Search Results
                                </Typography>
                                {items
                                    .filter(item => !AddedItems.some(selected => selected.id === item.id))
                                    .map((item) => (
                                        <SearchItemCard
                                            key={item?.id}
                                            item={item}
                                            isSelected={false}
                                            selectedItem={null}
                                            handleQuantityChange={handleQuantityChange}
                                            handleAdditem={handleAdditem}
                                            iconstyle={iconstyle}
                                            feildstyle={feildstyle}
                                            searchBtn={searchBtn}
                                            dfac={dfac}
                                            AppColors={AppColors}
                                            items={items}
                                            setAddedItems={setAddedItems}
                                            removeFromArr={(itm) => {
                                                const filteredItems = AddedItems.filter((i) => i?.id !== itm?.id);
                                                setAddedItems(filteredItems)
                                            }}
                                        />
                                    ))}
                            </>
                        )}
                        {/* Selected Items */}
                        {AddedItems.length > 0 && (
                            <>
                                <Typography variant="subtitle2" textAlign={'center'} sx={{ mt: 1, mb: 1 }}>
                                    Selected Items
                                </Typography>
                                {AddedItems.map((item) => (
                                    <SearchItemCard
                                        key={item?.id}
                                        item={item}
                                        isSelected={true}
                                        selectedItem={item}
                                        handleQuantityChange={handleQuantityChange}
                                        handleAdditem={handleAdditem}
                                        iconstyle={iconstyle}
                                        feildstyle={feildstyle}
                                        searchBtn={searchBtn}
                                        dfac={dfac}
                                        AppColors={AppColors}
                                        items={items}
                                        setAddedItems={setAddedItems}
                                        removeFromArr={(itm) => {
                                            const filteredItems = AddedItems.filter((i) => i?.id !== itm?.id);
                                            setAddedItems(filteredItems)
                                        }}
                                    />
                                ))}
                            </>
                        )}


                    </Box>
                )
            }
            {/* {
            // loading ? (
            //     <Box display="flex" justifyContent="center" mt={4}>
            //         <CircularProgress />
            //     </Box>
            // ) :
             items?.length === 0 ? (
                <Typography variant="body2" textAlign="center" color="text.secondary">
                    No items found
                </Typography>
            ) : (
                <Box sx={{ height: { xs: '32vh', md: '45vh' }, overflow: 'auto' }} >
                    {
                        items?.map((item) => {
                            const isSelected = AddedItems?.some((selected) => selected?.id === item?.id);
                            const selectedItem = AddedItems?.find((selected) => selected?.id === item?.id);

                            return (
                                <SearchItemCard
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
                                    removeFromArr={(item) => {
                                        const filteredItems = AddedItems.filter((itm) => itm?.id !== item?.id);
                                        setAddedItems(filteredItems)
                                    }}
                                />
                            )
                        }
                        )
                    }
                </Box>
            )} */}

            <Box
                sx={{ ...searchBtn, minWidth: '20px', maxWidth: '200px', mx: 'auto' }} mt={'30px'} color="primary"
                onClick={() => { onSaveClick(AddedItems) }} >
                Add items to the list
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