
export type User = {
    uid: string | null,
    }

export type UserStore = {
    user?: User,
    logs?: Scan[],
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

export type ActionTypes = 'GET_USER' | 'GET_LOGS' | 'CREATE_LOG' | 'PUT_USER';

export interface Action {
    type: ActionTypes,
    payload?: Object,
}

export type DispatchFunc = (dispatch: Action) => void;

type ProviderDispatch = {
    getLogs: () => void;
    getUser: (scanId: string) => void;
    createLog: (scanId: string) => void;
}

type ProviderValues = {
    state: UserStore,
    [key: string]: Object | Function,
}

export type AppProviderValues = ProviderValues & Partial<ProviderDispatch>;