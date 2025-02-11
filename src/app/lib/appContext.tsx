'use client';
import merge from 'deepmerge';
import DataContextCreator from './dataContextCreator';
import {
  Action,
  ProviderValues,
  UserStore,
} from '../../db/types';
import { setUser } from './appsActions';

//TODO: ADD ACTION IN SCAN HOOK FOR SETTING USER


const appSchema = {
  user: {
    uid: null,
  },
}

const appContext:UserStore = merge({}, appSchema);

export const appReducer = (state:ProviderValues, action: Action) => {
  const {payload, type = null} = action;
  let newState = null;
  let clonedState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case 'SET_USER':
      clonedState.user = payload;
      newState = clonedState;
      break;
      case 'GET_LOGS':
      break;
    default:
      newState = state;
  }
  return newState;
}

export const { Context, Provider } = DataContextCreator(
  appReducer,
  {
    setUser
  }, 
  appContext
)