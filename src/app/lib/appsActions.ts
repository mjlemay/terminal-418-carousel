import { DispatchFunc } from '../lib/types';
import { requestData } from './requestData';


export const getLogs = (dispatch: DispatchFunc) => async () => {
    const data = await requestData('/api/scan');

    dispatch({
        type: 'GET_LOGS',
        payload: data,
    });
    return data;
  }

export const createLog = (dispatch: DispatchFunc) => async (scanId: string | null) => {
    const body = JSON.stringify({scanId});
    return requestData('/api/scan', body, 'post');
}

export const getUser = (dispatch: DispatchFunc) => async (scanId: string | null) => {
    const defaultUser = {
        uid: scanId
    }
    console.log("THIS IS A BIG CONSOLE LOG TO SHOW IF THIS CODE HITS");
    const data = await requestData(`/api/user/${scanId}`);
    
    console.log('requestData', data);
    if (data && Object.keys(data).length === 0) {
        console.log('no user found so creating a user')
        dispatch({
            type: 'GET_USER',
            payload: defaultUser,
        });
        const body = JSON.stringify({scanId});
        return requestData(`/api/user/${scanId}`, body, 'post');
    } else {
        const user = {...defaultUser, ...data};
        dispatch({
            type: 'GET_USER',
            payload: user,
        });
    }
}

export const putUser = (dispatch: DispatchFunc) => async () => {
    const data = await requestData('/api/user');

    dispatch({
        type: 'PUT_USER',
        payload: data,
    });
    return data;
}

export const unSetUser = (dispatch: DispatchFunc) => () => {
    dispatch({
        type: 'UNSET_USER'
    });
    return;
}

