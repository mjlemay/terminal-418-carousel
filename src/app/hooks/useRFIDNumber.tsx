import { useState, useCallback, useEffect } from "react";

const ID_LENGTH = parseInt(process.env.NEXT_PUBLIC_ID_LENGTH || '8', 10); 
export function useRFIDNumber(enabled:boolean) {
    const [ codeString, setCodeString ] = useState('');
    const [ rfidCode, setRfidCode ] = useState('');
    const isEnabled = enabled || false;

    const handleUserKeyPress = useCallback((event:KeyboardEvent) => {
        const { key } = event;
        if (key === 'Meta' || key === 'Enter' || key === 'Shift' || key === 'Control' || key === 'Alt') {
            return;
        }
        const newCode = codeString + key;
        setCodeString(newCode);
        // clear values if rfid value or has reach id length
        if (
            (
                isEnabled
                && newCode.length === ID_LENGTH
            )
        ) {
            const hexadecimalRegex = new RegExp('^(0x|0X)?[a-fA-F0-9]+$');     
            if (hexadecimalRegex.test(codeString)) {
                console.log('codeString', codeString);
                setRfidCode(codeString);
                setTimeout(() => {
                    setRfidCode('');
                    setCodeString('')
                }
                , 300);
            }
            setCodeString('');
        }
        
    }, [codeString, isEnabled]);

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    return rfidCode;
}