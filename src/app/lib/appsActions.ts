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
    const data = await requestData(`/api/user/${scanId}`);

    console.log('data', data);
    if (data && data.length === 0) {
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


