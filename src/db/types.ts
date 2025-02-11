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