'use client';

import { Children, ReactNode, cloneElement, use, useCallback, useEffect, useState } from 'react';
import { useClickAnyWhere, useCountdown, useInterval, useStep } from 'usehooks-ts';
import { useContext } from 'react';
import { Context } from '../lib/appContext';
import { AppProviderValues } from '../lib/types';
import { AnimatePresence, motion } from 'motion/react';
import Baudot from 'next/font/local';
import NavButton from './navButton';
import AvatarView from './avatarView';
import IconFactory from '../svgs/iconFactory';

const records: any = [];

interface CarouselProps {
    children?: ReactNode;
    selectedPane?: string;
    pauseMinutes?: number;
    isPaused?: boolean;
    onDrawerSelect?: (section: string) => void;
    selectedDrawer?: string;
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

const stepArray = ['', 'home', 'pip', 'factoryGame'];

const baudot = Baudot({
    src: [
        { path: '../fonts/Baudot-Regular.ttf', weight: '400', },
    ]
});

export default function Carousel(props: CarouselProps): JSX.Element {
    const { children, pauseMinutes = PAUSE_MINUTES, onDrawerSelect = ()=>{}, selectedDrawer  } = props;
    const {
        state,
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

    const msToTime = (ms: number): string => {
        const minutes = Math.floor(count / 60);
        const seconds = count % 60;
        const minStr = minutes <= 9 ? `0${minutes}` : `${minutes}`;
        const secondsStr = seconds <= 9 ? `0${seconds}` : `${seconds}`;
        return `${minStr}:${secondsStr}`;
    }

    const panes = Children.map(children, (child: any, index) => {
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

    const gotoPane = (step: number): void => {
        setStep(step);
        onDrawerSelect(stepArray[step]);
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

    useEffect(() => {
        if (selectedDrawer) {
            const index = stepArray.indexOf(selectedDrawer);
            if (index) {
                setStep(index);
            }
        }
    }, [selectedDrawer]);


    return (
        <>
            <div
                className="flex min-h-screen flex-row items-center justify-between p-8 gap-x-8 relative"
                onContextMenu={(event) => stopClick(event)}
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
                                <IconFactory />
                            </NavButton>
                        </span>
                    </div>
                    <AvatarView />
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
                            { panes }
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    )
}