import axios from "axios";
import Cookies from 'js-cookie';


export const HOST = process.env.REACT_APP_API_HOST || "/api";

export const LOGIN = `${HOST}/login`;
export const REGISTER = `${HOST}/register`;
export const LOGOUT = `${HOST}/logout`;
export const USER = `${HOST}/user`;
export const PRODUCTS = `${HOST}/products`;
export const CREATE = `${HOST}/products/create`;
export const BUY = `${HOST}/products/%s/buy`;
export const COMMENT = `${HOST}/products/%s/comment`;


function handleResponse401(err) {
    if (err.response && err.response.status === 401) {
        Cookies.remove('jwt');
        window.location.reload();
    };
}

function get({url, handler, excHandler, handle401}) {
    axios
        .get(url, {withCredentials: true})
        .then(res => {
            if (handler) handler(res.data);
        })
        .catch(err => {
            if (handle401) handleResponse401(err);
            if (excHandler) excHandler(err);
        });
}

function post({url, data, handler, excHandler, handle401}) {
    axios
        .post(url, JSON.stringify(data), {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => {
            if (handler) handler(res.data);
        })
        .catch(err => {
            if (handle401) handleResponse401(err);
            if (excHandler) excHandler(err);
        });
}

function put({url, data, handler, excHandler, handle401}) {
    axios
        .put(url, JSON.stringify(data), {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => {
            if (handler) handler(res.data);
        })
        .catch(err => {
            if (handle401) handleResponse401(err);
            if (excHandler) excHandler(err);
        });
}

export function getLogout({handler, excHandler}) {
    get({url: LOGOUT, handler: handler, excHandler: excHandler});
}

export function getUser({handler, excHandler}) {
    get({url: USER, handler: handler, excHandler: excHandler, handle401: true});
}

export function postLogin({data, handler, excHandler}) {
    post({url: LOGIN, data: data, handler: handler, excHandler: excHandler});
}

export function postRegister({data, handler, excHandler}) {
    post({url: REGISTER, data: data, handler: handler, excHandler: excHandler});
}

export function postCreate({data, handler, excHandler}) {
    post({url: CREATE, data: data, handler: handler, excHandler: excHandler, handle401: true});
}

export function postComment({pid, data, handler, excHandler}) {
    post({url: COMMENT.replace('%s', pid), data: data, handler: handler, excHandler: excHandler, handle401: true});
}

export function putBuy({pid, handler, excHandler}) {
    put({
        url: BUY.replace('%s', pid), 
        data: {pid: pid, reason: 'Reason: buy'}, 
        handler: handler, 
        excHandler: excHandler, 
        handle401: true
    });
}
