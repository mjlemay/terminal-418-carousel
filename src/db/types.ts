export type ActionTypes = 'SET_USER' | 'GET_LOGS';

export interface Action {
  type: ActionTypes,
  payload?: Object,
}

export type DispatchFunc = (dispatch: Action) => void;

export type ProviderValues = {
  state: UserStore,
  [key: string]: Object | Function,
}


export type User = {
  uid: string | null,
}

export type UserStore = {
  user: User,
}

export type Scan = {
    scan_id: number;
    raw_value: string;
    mifare_hex?: string;
    device_id?: string;
    meta?:string;
    created_at: string;
}

export interface scanState {
  scans: Scan[],
  user: object,
  addScan: (scanId: string) => void,
  getScans: () => void,
  // getUser: (scanId: string) => void,
}