import TYPES from "store/types"
import { takeLatest, put } from "redux-saga/effects"

import {
  call_landingpage_data,
  call_landingpage_attachment_data
} from "../../services/api/endpoints"
import { apiResponseHandler } from "../../helpers/ShortMethods"
// import CONSTANT from "config/constants.config"

function* get_landingpage_data(action) {
  const { payload } = action

  const { isSuccess, data } = yield apiResponseHandler(
    call_landingpage_data,
    payload
  )
  if (isSuccess) {
    const landingPageImagesId = []
    data.cms_documents.forEach((element) => {
      const valueObject = Object.keys(element)[0]
      if (valueObject) {
        element[valueObject].forEach((value) => {
          landingPageImagesId.push(value.DocumentID)
        })
      }
    })
    let payload = {
      items: data
    }
    yield put({ type: TYPES.GET_LANDING_PAGE_DATA_SUCCESS, payload })
    payload = {
      // ids: CONSTANT.LANDING_PAGE_IDS,
      ids: landingPageImagesId,
      format: "json"
    }
    yield put({
      type: TYPES.GET_LANDING_PAGE_ATTACHMENT_DATA,
      payload
    })
  }
}

function* get_landingpage_data_attachment(action) {
  const { payload } = action
  const { isSuccess, data } = yield apiResponseHandler(
    call_landingpage_attachment_data,
    payload
  )
  if (isSuccess) {
    const payload = {
      items: data
    }
    yield put({ type: TYPES.GET_LANDING_PAGE_ATTACHMENT_DATA_SUCCESS, payload })
    yield put({
      type: TYPES.GET_LANDING_PAGE_DATA_UPDATE
    })
  }
}

export const landingPageSaga = [
  takeLatest(`${TYPES.GET_LANDING_PAGE_DATA}`, get_landingpage_data),
  takeLatest(
    `${TYPES.GET_LANDING_PAGE_ATTACHMENT_DATA}`,
    get_landingpage_data_attachment
  )
]
