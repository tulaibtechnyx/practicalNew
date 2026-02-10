import TYPES from "store/types"
import { takeLatest, put } from "redux-saga/effects"
import {
  call_homepage_data,
  call_homepage_attachment_data
} from "../../services/api/endpoints"
import { apiResponseHandler } from "../../helpers/ShortMethods"

function* get_homepage_data(action) {
  const { payload } = action

  const { isSuccess, data } = yield apiResponseHandler(
    call_homepage_data,
    payload
  )
  if (isSuccess) {
    const homePageImagesId = []
    data.cms_documents.forEach((element) => {
      const valueObject = Object.keys(element)[0]
      if (valueObject) {
        element[valueObject].forEach((value) => {
          homePageImagesId.push(value.DocumentID)
        })
      }
    })
    let payload = {
      items: data
    }
    yield put({ type: TYPES.GET_HOME_PAGE_DATA_SUCCESS, payload })
    payload = {
      // ids: CONSTANT.HOME_PAGE_IDS,
      ids: homePageImagesId,
      format: "json"
    }
    yield put({
      type: TYPES.GET_HOME_PAGE_ATTACHMENT_DATA,
      payload
    })
  }
}

function* get_homepage_data_attachment(action) {
  const { payload } = action
  const { isSuccess, data } = yield apiResponseHandler(
    call_homepage_attachment_data,
    payload
  )
  if (isSuccess) {
    const payload = {
      items: data
    }
    yield put({ type: TYPES.GET_HOME_PAGE_ATTACHMENT_DATA_SUCCESS, payload })
    yield put({
      type: TYPES.GET_HOME_PAGE_DATA_ATTACHMENT_UPDATE
    })
  }
}

export const homePageSaga = [
  takeLatest(`${TYPES.GET_HOME_PAGE_DATA}`, get_homepage_data),
  takeLatest(
    `${TYPES.GET_HOME_PAGE_ATTACHMENT_DATA}`,
    get_homepage_data_attachment
  )
]
