import { useEffect, useState } from "react";

interface TouchPulseProps {
    children?: React.ReactNode;
}

type TouchPosCoords = {
    x: number;
    y: number;
}
  
export default function TouchPulse(props:TouchPulseProps):JSX.Element {
    const { children } = props;
    const [touchPos, setTouchPos] = useState(null as unknown as TouchPosCoords);
    const [pulse, setPulse] = useState(false);

    const applyTouchPos = (event: MouseEvent) => {
        const {clientX, clientY} = event;
        setTouchPos({x: clientX, y: clientY});
        setPulse(true);
        setTimeout(() => {
            setPulse(false);
        }, 200);
    }

    useEffect(() => {
        if (document && touchPos === null) {
            document.addEventListener("click", applyTouchPos);
        }
    }, [setTouchPos, touchPos]);


    return (
        <div className={`absolute transition-size`} style={{top: touchPos?.y || 0, left: touchPos?.x || 0}}>
            <div className={`
                bg-white rounded-full transition-all duration-200 h-[80px] w-[80px] -ml-[40px] -mt-[40px]
                ${pulse ? 'opacity-50 animate-ping' : 'opacity-0'}
            `}>
                {children}
            </div>
        </div>
    )
}