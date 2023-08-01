import { all } from "redux-saga/effects";
import userSaga from "./userSaga";
import expenseSaga from "./expenseSaga";

export default function* rootSaga() {
    yield all([
        userSaga(), 
        expenseSaga()
    ]);
}