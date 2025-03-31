
export type User = {
    uid: string | null,
    meta: Record<string,string> | null,
    created_at: string | null,
    updated_at: string | null,
    }

export type UserStore = {
    user?: User,
    logs?: Scan[],
}

export type Scan = {
    id: number;
    scan_id: string;
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

export type ActionTypes = 'GET_USER' | 'GET_LOGS' | 'CREATE_LOG' | 'PUT_USER' | 'UNSET_USER';

export interface Action {
    type: ActionTypes,
    payload?: Object,
}

export type DispatchFunc = (dispatch: Action) => void;

type ProviderDispatch = {
    getLogs: () => void;
    unSetUser: () => void;
    getUser: (scanId: string) => void;
    createLog: (scanId: string) => void;
}

type ProviderValues = {
    state: UserStore,
    [key: string]: Object | Function,
}

export type AppProviderValues = ProviderValues & Partial<ProviderDispatch>;