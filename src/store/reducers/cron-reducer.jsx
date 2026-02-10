import { createAction, createReducer } from "@reduxjs/toolkit"
import { logOutUserRequest } from "./authReducer"
import get from "lodash/get"

const initialState = {
    planUpdated: false,
    orderId: null
}

export const updateCRONDetails = createAction("CronReducer/updateCRONDetails");

const CronReducer = createReducer(initialState, {

    [updateCRONDetails]: (state, action) => {
        const planUpdated = get(action, 'payload.planUpdated', false);
        const orderId = get(action, 'payload.orderId', null);

        state.planUpdated = !!planUpdated; 
        state.orderId = orderId;
    },

    [logOutUserRequest.fulfilled]: (state, action) => {
        return {
            ...initialState,
            isExecutive: state.isExecutive,
        }
    },
})

export default CronReducer
