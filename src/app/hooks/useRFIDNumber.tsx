import { useState, useCallback, useEffect } from "react";

const WAIT = 300;
const CPS_MIN = 3;
const CPS_MAX = 30;
const ID_LENGTH = 8;

export function useRFIDNumber(enabled:boolean) {
    const [ codeString, setCodeString ] = useState('');
    const [ rfidCode, setRfidCode ] = useState('');
    const [ lastDate, setLastDate ] = useState(new Date());
    const isEnabled = enabled || false;

    const handleUserKeyPress = useCallback((event:KeyboardEvent) => {
        const { key } = event;
        const nextDate = new Date();
        let cps = nextDate.getTime() - lastDate.getTime();
        if (cps >= WAIT) {
            setRfidCode('');
            cps = CPS_MIN; //allows for first character to pass through
        }

        if (
            isEnabled
            && key !== 'enter'
            && cps <= CPS_MAX
            && cps >= CPS_MIN
        ) {
            const newCode = codeString + key;
            setCodeString(newCode);
            setRfidCode('');
        }
        if (
            cps > CPS_MAX
            || cps < CPS_MIN
        ) {
            setCodeString(''); // resets reader if cps is inconsistent
        }
        // clear values if rfid value or has reach id length
        if (
            (
                isEnabled
                && key !== 'enter'
                && codeString.length === ID_LENGTH
            )
        ) {
            const hexadecimalRegex = new RegExp('^(0x|0X)?[a-fA-F0-9]+$');     
            if (hexadecimalRegex.test(codeString)) {
                setRfidCode(codeString);
            }
            setCodeString('');
        }

        setLastDate(nextDate);
    }, [codeString, isEnabled, lastDate]);

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    return rfidCode;
}