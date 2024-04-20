'use client';

import { Children, ReactNode, cloneElement, useCallback, useEffect, useState } from 'react';
import { useClickAnyWhere, useCountdown, useInterval, useStep } from 'usehooks-ts';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import axios from 'axios';
import moment from 'moment';
import { isValidHex } from '../lib/hex';
import Baudot from 'next/font/local';
import Wave from '../svgs/wave';
import Rfid from '../svgs/rfid';

const COOL_DOWN = 15;

interface CarouselProps {
    children?: ReactNode;
  }

type Scan = {
    scan_id: number;
    raw_value: string;
    mifare_hex?: string;
    created_at: string;
}

type ScanResponse = {
    scans: Scan[];
}

const TIME = 5000;
const MAX_STEPS = 4;
const ONE_SECOND = 1000;
const PAUSE_MINUTES = 1;

const baudot = Baudot({ 
    src:[
      {path: '../fonts/Baudot-Regular.ttf',weight: '400',},
    ]
  });

const defaultRecord = {
    scan_id: 0,
    raw_value: '',
    mifare_hex: '',
    created_at: new Date().toISOString(),
}

export default function Carousel(props:CarouselProps):JSX.Element {
    const { children } = props;
    let [isPlaying, setPlaying] = useState(true);
    let [isCounting, setIsCounting] = useState(false);
    let [rfidCode, setRfidCode] = useState('');
    let [status, setStatus] = useState('');
    let [lastRfidCode, setLastRfidCode] = useState('');
    let [records, setRecords] = useState([] as Scan[]);
    let [isModalOpen, setModalOpen] = useState(false);
    let [currentStep, stepHelpers] = useStep(MAX_STEPS); //number of allowed panes
    const { goToNextStep, reset, setStep } = stepHelpers;
    const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60 * PAUSE_MINUTES,
      intervalMs: ONE_SECOND,
    })

    const msToTime = (ms:number):string => {
        const minutes = Math.floor(count / 60);
        const seconds = count % 60;
        const minStr = minutes <= 9 ? `0${minutes}` : `${minutes}`;
        const secondsStr = seconds <= 9 ? `0${seconds}` : `${seconds}`;
        return `${minStr}:${secondsStr}`;
    }

    const panes = Children.map(children, (child:any, index) => {
        const proppedChild = cloneElement(child, { scans: records });
        return (<div className={`pane ${index + 1 === currentStep && 'selected'} container w-100% h-[calc(100vh-64px)]`}>
            {proppedChild}
        </div>);
    })

    const stopClick = (event: any) => {
        event.preventDefault();
        return false;
    }

    const offsetBg = (step:number):string => {
        return `-${step * 20}vw`
    }
    
    const gotoPane = (step:number):void => {
        setModalOpen(false);
        setStep(step);
        setLastRfidCode('');
        setStatus('');
    }
    const buildRfidCode = (char:string) => {
        if (char !== 'enter') {
            const newCode = rfidCode + char;
            setRfidCode(newCode);
            setLastRfidCode('');
            setModalOpen(false);
        }
        if (char === 'enter') {
            setLastRfidCode(rfidCode);
            setModalOpen(true);
            setRfidCode('');
        }
    };

    const hasRecord = useCallback((code:string):boolean => {
        return records?.some(function (r) {
            if (r?.raw_value === code) {
                return true;
            }
            return false;
        })    
    }, [records])

    const coolDownTime =  useCallback((code:string):string => {
        if (hasRecord(code)) {
           let lastScan = records?.find(scan => {
            return scan.raw_value === code
           });
           let timeStamp = lastScan?.created_at;
           let now = moment();
           let created = moment(timeStamp).add(-7, 'hours');
           let duration = moment.duration(now.diff(created));
           let waited = duration.asMinutes();
           if (waited >= COOL_DOWN) {
            return 'none';
           }
           const waitTime = Math.ceil(COOL_DOWN - waited);
           return `${waitTime} min`
        }
        return 'none';
    }, [hasRecord, records]);

    const goCount = useCallback(() => {
        startCountdown();
        setIsCounting(true);
    }, [startCountdown]);

    const pauseCount = useCallback(() => {
        stopCountdown();
        setIsCounting(false);
    }, [stopCountdown])

    const saveRecord = useCallback((scan:string) => {
        if (coolDownTime(scan) === 'none') {
            axios.post('/api/scan', {
                code: scan
            })
            .then(function (response) {
                console.log(response);
                setStatus('request sent');
                fetchRecords();
            })
            .catch(function (error) {
                console.log(error);
                setStatus('Fail: Data corrupted');
                setStatus('error');
            });
        } else {
            setStatus('Fail: Cool Down Incomplete');
        }
    }, [coolDownTime]);

    const fetchRecords = () => {
        axios.get('/api/scan')
          .then(function (response:any) {
            const { scans } = response?.data;
            scans.length >= 1 && setRecords(scans)
          })
          .catch(function (error) {
            console.log(error);
            setStatus('error');
          });
    }

    useInterval(
        () => {
          // Your custom logic here
          if (currentStep !== MAX_STEPS) {
            goToNextStep();
          } else {
            reset();
          }
        },
        // Delay in milliseconds or null to stop it
        isPlaying ? TIME : null,
      )

    useClickAnyWhere(() => {
        setPlaying(false);
        resetCountdown();
        goCount();
    })
    
    useEffect(() => {
        if (count == 0) {
            setPlaying(true);
            resetCountdown();
            setIsCounting(false);
            setLastRfidCode('')
            setRfidCode('');
            setModalOpen(false);
        }
      }, [count, resetCountdown]);

      useEffect(() => {
        if (lastRfidCode.length >= 4 && status === '') {
            setStatus('loading');
            saveRecord(lastRfidCode);
            resetCountdown();
            goCount();
        }
      }, [goCount, lastRfidCode, resetCountdown, saveRecord, startCountdown, status]);

      useEffect(() => {
        if (isModalOpen && !isCounting) {
            resetCountdown();
            goCount();
        }
      }, [goCount, isCounting, isModalOpen, resetCountdown, startCountdown]);

      useEffect(() => {
        if (currentStep == 1){
            fetchRecords();
        }
      }, [currentStep]);

    return (
        <>
          <KeyboardEventHandler
              handleKeys={['alphanumeric', 'enter']}
              onKeyEvent={(key:any) => buildRfidCode(key)} />
        <div className="absolute size-full overflow-hidden">
            <div className={`absolute w-[300vw] top-[30vh] opacity-20`} style={{left: offsetBg(currentStep)}}>
                <Wave />
            </div>
        </div>
    <div
        className="flex min-h-screen flex-row items-center justify-between p-8 gap-x-8 relative"
        onContextMenu={(event)=> stopClick(event)}
     >
        <div className="h-[calc(100vh-64px)] w-32">
        <div className="">
            <span onClick={() => gotoPane(1)}>
            <h3 className={`cyberpunk pink ${currentStep == 1 && 'glitched'}`}>01</h3>
                <svg xmlns="http://www.w3.org/2000/svg" 
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={0.5}
                    stroke="currentColor" 
                    className={`w-24 h-24 ${currentStep == 1 && 'glitched'}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
            </span>
            <span onClick={() => gotoPane(2)}>
            <h3 className={`cyberpunk pink ${currentStep == 2 && 'glitched'}`}>02</h3>
            <svg 
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                strokeWidth={0.5} stroke="currentColor" 
                className={`w-24 h-24 ${currentStep == 2 && 'glitched'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
            </span>
            <span onClick={() => gotoPane(3)}>
            <h3 className={`cyberpunk pink ${currentStep == 3 && 'glitched'}`}>03</h3>
            <svg 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.5}
                stroke="currentColor"
                className={`w-24 h-24 ${currentStep == 3 && 'glitched'}`}
            >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288" />
            </svg>
            </span>
            <span onClick={() => gotoPane(4)}>
            <h3 className={`cyberpunk pink ${currentStep == 4 && 'glitched'}`}>04</h3>
            <svg 
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.5}
            stroke="currentColor"
            className={`w-24 h-24 ${currentStep == 4 && 'glitched'}`}
            >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
            </span>
        </div>
        </div>
        <div className="viewer container relative mx-auto h-[calc(100vh-64px)] border border-pink">
            <div className="absolute size-[5vw] top right-0 min-w-fit">
                <div className="flex flex-col">
                    <div className="border border-pink bg-pink pl-2 pr-1 text-right">{(isPlaying || isModalOpen) ? '--:--' : msToTime(count)}</div>
                    <p className={`${baudot.className} text-2xl text-right pr-2 text-teal`}>
                        {count * 60}{count * 15}{count * 3}
                    </p>
                </div>
            </div>
            <div className="viewframe">
                {panes}
            </div>
        </div>
     </div>
     {isModalOpen && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center bg-black/[.6] items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-full max-h-full overflow-y-hidden">
                <div className="flex items-center justify-center h-screen w-full">
                    <div className="flex border bg-black/[.7] w-screen items-top border-teal">
                    <div className="absolute size-[5vw] top right-4 min-w-fit">
                        <div className="border border-teal bg-teal pl-2 pr-1 text-right"> {msToTime(count)}</div>
                            <p className={`${baudot.className} text-2xl text-right pr-2 text-teal`}>
                            {count * 15}{count * 77}{count * 3}
                            </p>
                        </div>
                        <div className="bg-teal flex-auto w-32">
                            <Rfid />
                        </div>
                        <div className="flex-auto w-64 p-4">
                            <h1 className="cyberpunk">N•E•O•F•O•B<br/> ATTEMPT DETECTED</h1>
                            <h5 className="cyberpunk text-red uppercase text-nowrap">|| Warning: validation corrupted</h5>
                            <p className="uppercase text-nowrap text-teal">
                                $ byte UID&nbsp;&nbsp;[ {isValidHex(lastRfidCode)
                                    ? (<span className="text-green">pass</span>) : (<span className="text-red">fail</span>) } ]
                                </p>
                            <p className="uppercase text-nowrap  text-teal">
                                Dig1t LENGTH&nbsp;&nbsp;[ {lastRfidCode.length == 8
                                   ? (<span className="text-green">pass</span>) : (<span className="text-red">fail</span>) } ]
                                </p>
                            <p className="uppercase text-nowrap text-teal">
                                User R3cord&nbsp;&nbsp;[ {hasRecord(lastRfidCode)
                                   ? (<span className="text-green">pass</span>) : (<span className="text-red">fail</span>) } ]
                            </p>
                            <p className="uppercase text-nowrap text-teal">
                                Cooldown&nbsp;&nbsp;[ <span className="text-white">{coolDownTime(lastRfidCode)}</span> ]
                                </p>
                            <p>{`||| ${status} |||`}</p>
                            <p>{(coolDownTime(lastRfidCode) === '15 min' && status === 'request sent' ) ? (<span className="text-green">APPROVED</span>) : (<span className="text-red">REJECTED</span>) }</p>
                            <button 
                                className={`cyberpunk ${(coolDownTime(lastRfidCode) === '15 min' && status === 'request sent') && 'green'}`}
                                onClick={() => gotoPane(2)}>CLICK 2 CONTINUE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
     </>
    )
  }