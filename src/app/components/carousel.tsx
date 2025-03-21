'use client';

import { Children, ReactNode, cloneElement, useCallback, useEffect, useState } from 'react';
import { useClickAnyWhere, useCountdown, useInterval, useStep } from 'usehooks-ts';
import { useContext } from 'react';
import { Context } from '../lib/appContext';
import { AppProviderValues } from '../lib/types';
import { AnimatePresence, motion } from 'motion/react';
import UserScreen from './userScreen';
import Baudot from 'next/font/local';
import NavButton from './navButton';

const records:any = [];

interface CarouselProps {
    children?: ReactNode;
    selectedPane?: string;
    pauseMinutes?: number;
    isPaused?: boolean;
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

const TIME = 15000;
const MAX_STEPS = 4;
const ONE_SECOND = 1000;
const PAUSE_MINUTES = 1;

const baudot = Baudot({ 
    src:[
      {path: '../fonts/Baudot-Regular.ttf',weight: '400',},
    ]
  });

export default function Carousel(props:CarouselProps):JSX.Element {
    const { children, pauseMinutes = PAUSE_MINUTES } = props;
    const { 
        state,
        unSetUser = () => {},
      }: AppProviderValues = useContext(Context);
    const { user } = state;
    const carouselSteps = Children.count(children) || MAX_STEPS;
    const [isPlaying, setPlaying] = useState(true);
    const [isCounting, setIsCounting] = useState(false);
    let [currentStep, stepHelpers] = useStep(carouselSteps); // number of allowed panes
    const { goToNextStep, reset, setStep } = stepHelpers;
    const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60 * pauseMinutes,
      intervalMs: ONE_SECOND,
    })
    const isLoggedIn = user && user.uid;

    const msToTime = (ms:number):string => {
        const minutes = Math.floor(count / 60);
        const seconds = count % 60;
        const minStr = minutes <= 9 ? `0${minutes}` : `${minutes}`;
        const secondsStr = seconds <= 9 ? `0${seconds}` : `${seconds}`;
        return `${minStr}:${secondsStr}`;
    }

    const panes = Children.map(children, (child:any, index) => {
        const proppedChild = cloneElement(child, { scans: records });
        const selected = index + 1 === currentStep;
        return (selected && <motion.div
            layout
            className={`container w-100% h-[calc(100vh-64px)]`}
            layoutId="pane"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "ease-in-out" }}
        >
            {proppedChild}
        </motion.div>);
    })

    const stopClick = (event: any) => {
        event.preventDefault();
        return false;
    }

    const gotoPane = (step:number):void => {
        setStep(step);
        unSetUser();
    }

    const goCount = useCallback(() => {
        startCountdown();
        setIsCounting(true);
    }, [startCountdown]);

    const pauseCount = useCallback(() => {
        stopCountdown();
        setIsCounting(false);
    }, [stopCountdown])

    useInterval(
        () => {
          if (currentStep !== carouselSteps) {
            goToNextStep();
          } else {
            reset();
          }
          unSetUser();
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
        }
    }, [count, resetCountdown]);

      useEffect(() => {
        if (!isCounting) {
            resetCountdown();
            goCount();
        }
      }, [goCount, isCounting, resetCountdown, startCountdown]);

      useEffect(() => {
        if (props.isPaused) {
            pauseCount();
        }
      }, [props.isPaused, pauseCount]);


    return (
        <>
    <div
        className="flex min-h-screen flex-row items-center justify-between p-8 gap-x-8 relative"
        onContextMenu={(event)=> stopClick(event)}
     >
        <div className="h-[calc(100vh-64px)] w-32">
        <div className="">
            <h3 className={`cyberpunk pink ${currentStep == 1 && 'glitched'} mb-4`}>MENU</h3>
            <span onClick={() => gotoPane(1)}>
                <NavButton selected={currentStep == 1}>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={0.5}
                        stroke="currentColor" 
                        className="w-24 h-24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                </NavButton>
            </span>
            <span onClick={() => gotoPane(2)}>
            <NavButton selected={currentStep == 2}>
                <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    strokeWidth={0.5} stroke="currentColor" 
                    className="w-24 h-24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
            </NavButton>
            </span>
            <span onClick={() => gotoPane(3)}>
            <NavButton selected={currentStep == 3}>
            <svg 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.5}
                stroke="currentColor"
                className="w-24 h-24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288" />
            </svg>
            </NavButton>
            </span>
            <span onClick={() => gotoPane(4)}>
            <NavButton selected={currentStep == 4}>
                <svg 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.5}
                stroke="currentColor"
                className="w-24 h-24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                </svg>
            </NavButton>
            </span>
        </div>
        </div>
        <div className="viewer container relative mx-auto h-[calc(100vh-64px)] border border-pink">
            <div className="absolute size-[5vw] top right-0 min-w-fit">
                <div className="flex flex-col">
                    <div className="border border-pink bg-pink pl-2 pr-1 text-right">{(isPlaying) ? '--:--' : msToTime(count)}</div>
                    <p className={`${baudot.className} text-2xl text-right pr-2 text-teal`}>
                        {count * 60}{count * 15}{count * 3}
                    </p>
                </div>
            </div>
            <div className="viewframe">
                <AnimatePresence mode="wait">
                    {isLoggedIn ? <UserScreen /> : panes}
                </AnimatePresence>
            </div>
        </div>
     </div>
     </>
    )
  }