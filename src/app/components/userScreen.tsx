import BadgeScan from '../svgs/badgeScan';
import ActionButton from './actionButton';
import { AppProviderValues } from '../lib/types';
import { useContext, useState } from 'react';
import { Context } from '../lib/appContext';
import StateBlockRow from './statblockRow';
import ValueSelectorRow from './valueSelectorRow';
import Endline from '../svgs/endline';
import Helix from '../svgs/helix';
import Reboot from '../svgs/reboot';
import FourEighteenCollective from '../svgs/418collective';
import { allianceArray } from '../lib/constants';

export default function UserScreen(): JSX.Element {
    const { 
        state,
        unSetUser = () => {},
        getUser = () => {},
    }: AppProviderValues = useContext(Context);
    const { user, logs } = state;
    const uid: string | null = user ? user.uid : 'error';
    const logCount = logs ? logs.length : 0;
    const userLogCount = logs ? logs.filter((log) => log.scan_id === uid).length : 0;
    const [activity, setActivity] = useState('pip');
    const userMeta = user ? user.meta : null;
    const alliance = userMeta ? userMeta.alliance : null;
    const allianceIndex = alliance ? allianceArray.indexOf(alliance) : -1;
    const [selector, setSelector] = useState(allianceIndex);

    const updateUserAlliance = async (allianceIndex: number) => {
        setSelector(allianceIndex);
        const alliance = allianceArray[allianceIndex];
        const meta = JSON.stringify({ alliance });
        const response = await fetch(`/api/user/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ meta }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Alliance updated successfully:', data);
            getUser(uid as string);
        }
        else {  
            console.error('Error updating alliance:', data);
        }
    }

    const activityPane = (activityName: string) => {
        const activities:Record<string, JSX.Element> = {
            pip: <>
                <h2 className="cyberpunk mb-4">PERFORMANCE IMPROVEMENT PLAN</h2>
                <div className="p-4">
                    <h3 className="cyberpunk mb-4">FOUNDRY POWER ACTIVATION</h3>
                    power: 1
                    <StateBlockRow icon={<BadgeScan />} title="TECHNICIAN SCANS" value={userLogCount} goal={logCount} />
                </div>
            </>,
            config: <>
                <h2 className="cyberpunk mb-4">SELECT SPONSOR</h2>
                <div>
                    {selector == -1 && <FourEighteenCollective width="100%" />}
                    {selector == 0 && <Endline width="100%" />}
                    {selector == 1 && <Helix width="100%" />}
                    {selector == 2 && <Reboot width="100%" />}
                </div>
                <ValueSelectorRow selectedIndex={selector} clickHandler={(num) => updateUserAlliance(num)}>
                    <span><Endline width="100%" /></span>
                    <span><Helix width="100%" /></span>
                    <span><Reboot width="100%" /></span>
                </ValueSelectorRow>
            </>,
        }

        return activities[activityName] || null; 
    }

    return (
        <section className="border-none flex h-full flex-col items-center justify-center p-4 pt-8 relative">
            <div className="flex flex-grow min-w-full p-4 gap-8">
                <div className="grow min-h-full">
                    {activityPane(activity)}
                </div>
                <div className="basis-64 min-h-full">
                    <h3 className="cyberpunk">ACTIONS</h3>
                    <div className="flex flex-row m-4 gap-4">
                        <ActionButton selected={activity === 'pip'} handleClick={() => setActivity('pip')}>PERFORMANCE IMPROVEMENT</ActionButton>
                        <ActionButton selected={activity === 'config'} handleClick={() => setActivity('config')}>SELECT SPONSOR</ActionButton>
                        <ActionButton handleClick={() => unSetUser()}>TERMINATE CONNECTION</ActionButton>
                    </div>
                </div>
            </div>
        </section>
    )
}