import { DispatchFunc } from '../../db/types'

export const setUser = (dispatch: DispatchFunc) => async (scanId: string | null) => {
    const data = {
        uid: scanId
    }
    dispatch({
        type: 'SET_USER',
        payload: data,
    });
  }
  