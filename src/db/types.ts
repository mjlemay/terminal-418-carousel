export type Scan = {
    scan_id: number;
    raw_value: string;
    mifare_hex?: string;
    device_id?: string;
    meta?:string;
    created_at: string;
}