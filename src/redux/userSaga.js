// src/redux/sagas/authSaga.js
import { put, call, takeLatest } from 'redux-saga/effects';
import { loginSuccess, loginFailure, logoutUser } from './userSlice';
import EncryptedStorage from 'react-native-encrypted-storage';

const BASE_URL = '/api/auth';

const loginUserAPI = async ({ username, password, token }) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, token }),
    });

    return response.json();
};

function* checkTokenSaga() {
    try {
        const token = yield call(EncryptedStorage.getItem, 'token');
        if (token) {
            const authRes = yield call(loginUserAPI, { token });
            if (authRes.error) throw new Error(authRes.error);
            yield put(loginSuccess({ username: authRes.user.username }));
        }
    } catch (error) {
        yield call(EncryptedStorage.removeItem, 'token');
        __DEV__ && console.error('Token invalid');
    }
}

function* loginSaga(action) {
    try {
        const { username, password } = action.payload;
        const authRes = yield call(loginUserAPI, { username, password });
        if (authRes.error) throw new Error(authRes.error);
        yield put(loginSuccess({ username: authRes.user.username }));
        yield call(EncryptedStorage.setItem, 'token', authRes.token);
    } catch (error) {
        yield put(loginFailure({ error: error.message }));
    }
}

function* logoutSaga() {
    yield call(EncryptedStorage.removeItem, 'token');
    yield put(logoutUser({ error: null }));
}

export default function* userSaga() {
    yield takeLatest('user/login', loginSaga);
    yield takeLatest('user/checkToken', checkTokenSaga);
    yield takeLatest('user/logout', logoutSaga);
}
