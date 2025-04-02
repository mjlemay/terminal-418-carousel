import { useEffect } from 'react';
import Avatar from "./avatar";
import { allianceArray } from '../lib/constants';
import { AppProviderValues } from '../lib/types';
import { useContext } from 'react';
import { useCountdown } from 'usehooks-ts';
import { Context } from '../lib/appContext';
import { msToTime } from "../lib/time";
import Endline from '../svgs/endline';
import Helix from '../svgs/helix';
import Reboot from '../svgs/reboot';
import Baudot from 'next/font/local';

const ONE_SECOND = 1000;
const PAUSE_MINUTES = 3;
const baudot = Baudot({
    src: [
        { path: '../fonts/Baudot-Regular.ttf', weight: '400', },
    ]
});

export default function AvatarView(): JSX.Element {
    const {
        state,
        unSetUser = () => { },
    }: AppProviderValues = useContext(Context);
    const { user } = state;
    const userMeta = user ? user.meta : null;
    const userId = user ? user.uid : null;
    const alliance = userMeta ? userMeta.alliance : null;
    const allianceIndex = alliance ? allianceArray.indexOf(alliance) : -1;
    const [count, { startCountdown, resetCountdown }] =
        useCountdown({
            countStart: 60 * PAUSE_MINUTES,
            intervalMs: ONE_SECOND,
        })


    useEffect(() => {
        if (userId) {
            startCountdown();
        } else {
            resetCountdown();
        }
    }, [userId, startCountdown]);

    useEffect(() => {
        if (count == 0) {
            unSetUser();
        }
    }, [count, unSetUser]);


    return (
        <div className="relative">
            <h4 className="cyberpunk mb-2">
                {userId || 'OFFLINE'}
            </h4>
            <Avatar seed={userId || null} size={250} />
            <div className="absolute size-[5vw] top-[90px] left-3 inset-0 min-w-fit">
                <div className="flex flex-col">
                    <div className="bg-black/25 pl-2 pr-1 text-right">{userId ? msToTime(count) : '--:--'}</div>
                    <p className={`${baudot.className} text-2xl text-right pr-2 text-teal`}>
                        {count * 60}{count * 15}{count * 3}
                    </p>
                </div>
            </div>
            <div className="">
                <div>
                    {allianceIndex != -1 && <div className="text-xs text-center pt-1">Sponsored by</div>}
                    {allianceIndex == 0 && <Endline />}
                    {allianceIndex == 1 && <Helix />}
                    {allianceIndex == 2 && <Reboot />}
                </div>
            </div>
        </div>
    )
}