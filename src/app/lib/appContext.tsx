'use client';
import merge, { all } from 'deepmerge';
import DataContextCreator from './dataContextCreator';
import {
  Action,
  AppProviderValues,
  Store,
} from '../lib/types';
import {
  createLog,
  getUser,
  getAllianceUsers,
  getLogs,
  unSetUser,
  getTiles,
  setSelectedTile
} from './appsActions';

const appSchema = {
  user: {
    uid: null,
    meta: {},
    created_at: null,
    updated_at: null,
  },
  selectedTile: null,
  allianceUsers: {},
  factoryTiles: [],
  logs: []
}

const appContext:Store = merge({}, appSchema);

export const appReducer = (state:AppProviderValues, action: Action) => {
  const {payload, type = null} = action;
  let newState = null;
  let clonedState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case 'GET_USER':
      clonedState.user = payload;
      break;
    case 'GET_ALLIANCE_USERS':
      clonedState.allianceUsers = payload;
      break;
    case 'GET_LOGS':
      clonedState.logs = payload;
      break;
    case 'GET_TILES':
      clonedState.factoryTiles = payload;
      break;
    case 'SET_SELECTED_TILE':
      clonedState.selectedTile = payload;
      break;
    case 'UNSET_USER':
      clonedState.user = appSchema;
      break;
    default:
      break;
  }
  newState = {...state, ...clonedState};
  return newState;
}

export const { Context, Provider } = DataContextCreator(
  appReducer,
  {
    createLog, 
    getLogs,
    getUser,
    getAllianceUsers,
    getTiles,
    setSelectedTile,
    unSetUser,
  }, 
  appContext
);
