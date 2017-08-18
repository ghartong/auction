import { findIndex as loFindIndex } from 'lodash'

export const SIGN_OUT_USER = 'SIGN_OUT_USER'
export const SET_REDIRECT_URL = 'SET_REDIRECT_URL'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_USER = 'AUTH_USER'
export const FETCH_USER = 'FETCH_USER'
export const FETCH_USER_FAIL = 'FETCH_USER_FAIL'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const SET_IS_ADMIN = 'SET_IS_ADMIN'

export function signInUser(credentials) {
    return function(dispatch) {
        dispatch({type: 'FETCH_USER'})
        const url = '//wincfdev01/auction/api/index.cfm/auth'

        let postData = {
            un: credentials.username,
            pw: credentials.password
        }

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        let fetchData = {
            method: 'PUT',
            body: JSON.stringify(postData),
            headers: headers
        }
        return fetch(url, fetchData)
        .then(response => response.json().then(body => ({ response, body })))
        .then(({ response, body }) => {
            if (body.MESSAGE) {
                dispatch({type: 'FETCH_USER_FAIL'})
                dispatch(authError(body.MESSAGE))
            } else {
                const admins = [
                    {id: '806846'}, //Ashwin for testing
                    {id: '750638'}, //Glenn H.
                    {id: '504873'}, //Kim N.
                ]
                dispatch({type: 'FETCH_USER_SUCCESS'})
                dispatch(authUser(body))
                localStorage.setItem('user', JSON.stringify(body))
                const is_admin = loFindIndex(admins, function(o) { return o.id == body.EMPNUM; })
                if (is_admin) {
                    localStorage.setItem('is_admin', true)
                    dispatch({
                        type: 'SET_IS_ADMIN',
                        payload: true
                    })    
                }
            }
        })
        .catch((err) => {
            dispatch({type: 'FETCH_USER_FAIL'})
            dispatch(authError(err.toString()))
        })
    }
}


export function signOutUser() {
    return function(dispatch) {
        localStorage.clear()
        dispatch({
            type: SIGN_OUT_USER
        })            
    }
}

export function verifyAuth() {
    return function (dispatch) {
        if(localStorage.getItem('user')){
            dispatch(authUser(JSON.parse(localStorage.getItem('user'))))
            dispatch({
                type: 'SET_IS_ADMIN',
                payload: localStorage.getItem('is_admin') ? JSON.parse(localStorage.getItem('is_admin')) : false
            })
        }
    }
}

export function authUser(auth) {
    return {
        type: AUTH_USER,
        payload: auth
    }
}

export function authError(error) {
    return {
        type: AUTH_ERROR,
        payload: error
    }
}

export function setRedirectURL(url) {
    return {
        type: SET_REDIRECT_URL,
        payload: url
    }
}
