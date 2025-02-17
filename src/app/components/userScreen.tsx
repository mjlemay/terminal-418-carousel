import LuckyCat from '../svgs/luckycat';
import BadgeScan from '../svgs/badgeScan';
import Avatar from './avatar';
import ActionButton from './actionButton';
import { AppProviderValues } from '../lib/types';
import { useContext, useState } from 'react';
import { Context } from '../lib/appContext';
import StateBlockRow from './statblockRow';
import { s } from 'motion/react-client';

export default function userScreen(): JSX.Element {
    const { state, unSetUser = () => { } }: AppProviderValues = useContext(Context);
    const { user, logs } = state;
    const uid: string | null = user ? user.uid : 'error';
    const logCount = logs ? logs.length : 0;
    const userLogCount = logs ? logs.filter((log) => log.scan_id === uid).length : 0;
    const [activity, setActivity] = useState('pip');


    const activityPane = (activityName: string) => {
        const activities:Record<string, JSX.Element> = {
            pip: <>
                <h2 className="cyberpunk mb-4">PERFORMANCE IMPROVEMENT PLAN</h2>
                <div className="p-4">
                    <StateBlockRow icon={<LuckyCat />} title="LUCKYCAT STANDING" value={5} goal={10} />
                    <StateBlockRow icon={<BadgeScan />} title="TECHNICIAN SCANS" value={userLogCount} goal={logCount} />
                </div>
            </>,
            config: <>
                 <h2 className="cyberpunk mb-4">TECHNICIAN CONFIGURATION</h2>
            </>,
        }

        return activities[activityName] || null;
    }

    return (
        <section className="border-none flex h-full flex-col items-center justify-center p-4 pt-8 relative">
            <div className="flex flex-row min-w-full p-4 gap-8">
                <div className="basis-1/2">
                    {activityPane(activity)}
                </div>
                <div className="basis-1/2">
                    <div className='flex flex-row justify-between'>
                        <div className="basis-1/3 pb-4">
                            <Avatar seed={uid || 'error'} size={250} />
                        </div>
                        <div className="basis-2/3">
                            <p className="cyberpunk m-4">
                                AI SERIAL: {uid || 'ERR!'}
                            </p>
                        </div>
                    </div>
                    <h3 className="cyberpunk">ACTIONS</h3>
                    <div className="flex flex-row m-4 gap-4">
                        <ActionButton selected={activity === 'pip'} handleClick={() => setActivity('pip')}>PERFORMANCE IMPROVEMENT</ActionButton>
                        <ActionButton selected={activity === 'config'} handleClick={() => setActivity('config')}>CONFIGURE TECHNICIAN</ActionButton>
                        <ActionButton handleClick={() => unSetUser()}>TERMINATE CONNECTION</ActionButton>
                    </div>
                </div>
            </div>
        </section>
    )
}