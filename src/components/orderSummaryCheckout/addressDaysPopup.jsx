import React, { useState, useEffect, useMemo } from "react"
import { Dialog } from "@mui/material"
import { Button, Link, Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import { useSelector } from "react-redux"
import get from "lodash/get"
import DeliveryDays from "components/delivery-days"
import AppRoutes from "../../helpers/AppRoutes"

export default function AddAddressPopNew({
    open = false,
    handleClose = () => { },
    availableDays = [],
    updateDays = () => {}
}) {
    const { isExecutive } = useSelector((state) => state.auth);
    const { orderSummary } = useSelector((state) => state.CheckOutReducer);
    const { orderHistory } = useSelector((state) => state.home);

    const [orderHistoryLocalSummary, setOrderHistoryLocalSummary] = useState(null)
    const [updateDaysHandler , setupdateDaysHandler] = useState(false)
    const [orderSummaryLocal, setOrderSummaryLocal] = useState(null)
    const [updatedAddresses, setUpdatedAddresses] = useState([]);

    const allAddress = get(orderSummaryLocal, "addresses", [])

    function checkPaidStatus(array) {
        for (let i = 0; i < array?.length; i++) {
            if (array[i].payment_status == "paid") {
                return true
            }
        }
        return false
    }

    const hasPaidStatus = checkPaidStatus(orderHistoryLocalSummary)

    useEffect(() => {
        if (orderSummary) {
            setOrderSummaryLocal(orderSummary)
        }
    }, [orderSummary])


    useEffect(() => {
        if (orderHistory) {
            setOrderHistoryLocalSummary(orderHistory)
        }
    }, [orderHistory])

    const prevAddresses = useMemo(() => {
        const getCopiedArray = () => {
            const arr = [];

            allAddress.forEach((x) => {
                if (x.days && Array.isArray(x.days)) {
                    arr.push({ ...x, days: [...x.days] });
                } else {
                    arr.push({ ...x, days: [] });
                }
            });

            return arr;
        };
        return getCopiedArray();
    }, [allAddress]);

    useEffect(() => {
        setUpdatedAddresses(allAddress);

        if(!open) setupdateDaysHandler(false);
    }, [allAddress?.length, open]);
    // }, [orderSummaryLocal, open]);

    const handleEditDaysInMultipleAddresses = (day, id) => {
        setupdateDaysHandler(true)
        const modifiedAddresses = prevAddresses.map((address) => {
            // If the current address matches the id, toggle the day
            if (address.id === id) {
                if (address.days.includes(day)) {
                    // address.days = address.days.filter(d => d !== day);
                } else {
                    address.days.push(day)
                }
            } else {
                address.days = address.days.filter(d => d !== day);
            }

            return address;
        });

        setUpdatedAddresses(modifiedAddresses);
    }

    const getTimeSlot = (time_slot = '') => {
        try {
            if (isExecutive) {
                return time_slot;
            } else {
                return time_slot?.split(":")[1]
            }
        } catch (error) {
            console.log('Error at getTimeSlot', error);
            return time_slot
        }
    }
    return (
        <div>
            <Dialog className="myCard sty2" open={open} onClose={handleClose}>
                <div className="sec-padded">
                    <Typography
                        variant="h3"
                        sx={{
                            color: AppColors.primaryGreen,
                            fontWeight: 700,
                            textAlign: "center",
                            paddingBottom: "30px"
                        }}
                    >
                        Assign Delivery Address Days
                    </Typography>

                    {allAddress.length > 0 ? (
                        <>
                            {allAddress.map((address, index) => (
                                <div key={index} className="selectedCards">
                                    <div className="sectionWrapper">
                                        <div className="details">
                                            <div className="cardNumber">
                                                <div className="sectionWrap">
                                                    <div className="textWrap">
                                                        <Typography
                                                            className="label"
                                                            sx={{
                                                                fontWeight: "500",
                                                                fontSize: "15px",
                                                                lineHeight: "1",
                                                                paddingBottom: "5px",
                                                                textTransform: "capitalize",
                                                                color: AppColors.primaryGreen
                                                            }}
                                                        >
                                                            {address.type !== "other"
                                                                ? address.type ?? ""
                                                                : address.label ?? ""}
                                                            &nbsp;
                                                        </Typography>
                                                        <div className="areaWrap">
                                                            <div className="areaDetail sty2">
                                                                <Typography
                                                                    sx={{ fontSize: "13px", lineHeight: "1.5" }}
                                                                >
                                                                    {address?.emirate?.name}
                                                                </Typography>
                                                            </div>
                                                            <div className="areaDetail">
                                                                <Typography
                                                                    sx={{ fontSize: "13px", lineHeight: "1.5" }}
                                                                >
                                                                    {address?.area?.name}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                        <Typography
                                                            sx={{ fontSize: "13px", lineHeight: "1.5" }}
                                                        >
                                                            {address.street}
                                                        </Typography>
                                                        <Typography
                                                            sx={{ fontSize: "13px", lineHeight: "1.5" }}
                                                        >
                                                            {address.apartment}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                <Typography
                                                    className="label"
                                                    sx={{
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        lineHeight: "1",
                                                        paddingBottom: "5px",
                                                        textTransform: "capitalize",
                                                        color: AppColors.primaryGreen
                                                    }}
                                                >Delivery Time Slot</Typography>
                                                <Typography
                                                    sx={{ fontSize: "13px", lineHeight: "1.5", marginBottom: '10px' }}
                                                >
                                                    {getTimeSlot(address.time_slot)}
                                                </Typography>

                                                <Typography
                                                    className="label"
                                                    sx={{
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        lineHeight: "1",
                                                        marginTop: '5px',
                                                        paddingBottom: "5px",
                                                        textTransform: "capitalize",
                                                        color: AppColors.primaryGreen
                                                    }}
                                                >Select Delivery days</Typography>
                                                <DeliveryDays id={address.id} onClickDay={handleEditDaysInMultipleAddresses} selectedDays={availableDays ?? []} assignedDays={updatedAddresses.find(a => a.id === address.id)?.days ?? []} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="selectedCards">
                                {allAddress.length == 1 && hasPaidStatus ? (
                                    <Typography
                                        color={AppColors.primaryGreen}
                                        sx={{
                                            fontSize: "13px",
                                            padding: "0 15px",
                                            marginTop: "15px"
                                        }}
                                    >
                                        Please note: address changes take between 12 and 36 hours to
                                        take effect. For more information, please call our Customer
                                        Care team on{" "}
                                        <Link
                                            color={AppColors.primaryGreen}
                                            sx={{ display: "inline-block" }}
                                            href={AppRoutes.whatsapp}
                                            target="_blank"
                                        >
                                            +971 52 327 1183.
                                        </Link>
                                    </Typography>
                                ) : null}
                                {allAddress.length > 1 && hasPaidStatus ? (
                                    <Typography
                                        color={AppColors.primaryGreen}
                                        sx={{
                                            fontSize: "13px",
                                            padding: "0 15px",
                                            marginTop: "15px"
                                        }}
                                    >
                                        Please note: address changes take between 12 and 36 hours to
                                        take effect. For more information, please call our Customer
                                        Care team on{" "}
                                        <Link
                                            color={AppColors.primaryGreen}
                                            sx={{ display: "inline-block" }}
                                            href={AppRoutes.whatsapp}
                                            target="_blank"
                                        >
                                            +971 52 327 1183.
                                        </Link>
                                    </Typography>
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <Typography sx={{ textAlign: "center", padding: "40px 0" }}>
                            You do not have any delivery address. Please Add New Address
                        </Typography>
                    )}

                    <div className="fieldWrapper">
                        {!updateDaysHandler ? null : (
                            <div className="CardAction">
                                <Button
                                    onClick={() => {
                                        updateDays(updatedAddresses.map((address) => ({
                                            days: address.days,
                                            [isExecutive ? 'company_address_id' : 'address_id']: address?.id
                                        })))
                                        setupdateDaysHandler(false)
                                    }}
                                    className="outlined"
                                    variant="outlined"
                                    sx={{
                                        borderColor: AppColors.white,
                                        color: AppColors.white,
                                        maxWidth: "231px"
                                    }}
                                >
                                    Update Address
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    className={`crossButton sty2 ${isExecutive ? 'isExecutive' : ''}`}
                    sx={{ color: "red" }}
                    onClick={handleClose}
                >
                    x
                </Button>

            </Dialog>
        </div>
    )
}
