import { all } from "redux-saga/effects"
import quizPageSagas from "./quizPageSaga"
import authSagas from "./authSaga"
import AppLogger from 'helpers/AppLogger'

function* rootSaga() {
  try {
    yield all([...quizPageSagas, ...authSagas])
  } catch (err) {
     AppLogger( "Error at rootSaga", err)
  }
}

export default rootSaga
