'use client';
import merge from 'deepmerge';
import DataContextCreator from './dataContextCreator';
import {
  Action,
  AppProviderValues,
  UserStore,
} from '../lib/types';
import {
  createLog,
  getUser,
  getLogs
} from './appsActions';


//TODO: ADD ACTION IN SCAN HOOK FOR SETTING USER

const appSchema = {
  user: {
    uid: null,
  },
  logs: []
}

const appContext:UserStore = merge({}, appSchema);

export const appReducer = (state:AppProviderValues, action: Action) => {
  const {payload, type = null} = action;
  let newState = null;
  let clonedState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case 'GET_USER':
      clonedState.user = payload;
      break;
    case 'GET_LOGS':
      clonedState.logs = payload;
      break;
    default:
      break;
  }
  newState = {...state, ...clonedState};
  console.log('newState', newState);
  return newState;
}

export const { Context, Provider } = DataContextCreator(
  appReducer,
  {
    createLog, 
    getLogs,
    getUser,
  }, 
  appContext
);
