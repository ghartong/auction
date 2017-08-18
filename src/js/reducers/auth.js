import { 
    AUTH_USER,
    AUTH_ERROR,
    SIGN_OUT_USER,
    SET_REDIRECT_URL,
    SET_IS_ADMIN
} from '../actions/login'

const initialState = {
    authenticated: false,
    redirectURL: '/',
    error: null,
    auth: null,
    isAdmin: false
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case AUTH_USER:
            return {
                ...state, authenticated: true, error: null, auth: action.payload
            }
        case AUTH_ERROR:
            return {
                ...state, error: action.payload
            }
        case SIGN_OUT_USER:
            return {
                ...state, authenticated: false, error: null, auth: null, isAdmin: false
            }
        case SET_REDIRECT_URL:
            return {
                ...state, redirectURL: action.payload
            }
        case SET_IS_ADMIN:
            return {
                ...state, isAdmin: action.payload                
            }    
        default:
            return state
    }
}
