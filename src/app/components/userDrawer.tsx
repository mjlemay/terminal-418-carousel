import BadgeScan from '../svgs/badgeScan';
import moment from "moment";
import ActionButton from './actionButton';
import { AppProviderValues } from '../lib/types';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../lib/appContext';
import ValueSelectorRow from './valueSelectorRow';
import Endline from '../svgs/endline';
import Helix from '../svgs/helix';
import Reboot from '../svgs/reboot';
import FourEighteenCollective from '../svgs/418collective';
import { allianceArray } from '../lib/constants';
import StateBlockRow from './statblockRow';
import OneStar from '../svgs/onestar';


const DEVICE_NAME = process.env.NEXT_PUBLIC_DEVICE_NAME || 'unknown_terminal';

type UserDrawerProps = {
    section: string;
    onDrawerSelect?: (section: string) => void;
}

export default function UserDrawer({ section = 'pip', onDrawerSelect = () => { } }: UserDrawerProps): JSX.Element {
    const {
        state,
        getUser = () => { },
        getTiles = () => { },
    }: AppProviderValues = useContext(Context);
    const { user, logs, selectedTile } = state;
    const uid: string | null = user ? user.uid : 'error';
    const logCount = logs ? logs.length : 0;
    const userLogCount = logs ? logs.filter((log) => log.scan_id === uid).length : 0;
    const userMeta = user ? user.meta : null;
    const alliance = userMeta ? userMeta.alliance : null;
    const activations = userMeta ? userMeta.activations : 0;
    const allianceIndex = alliance ? allianceArray.indexOf(alliance) : -1;
    const [selector, setSelector] = useState(allianceIndex);
    const allianceIsLocked = userMeta && userMeta.lastSponsored 
        && moment().isAfter(moment(userMeta.lastSponsored).add(1, 'minutes'))
        && moment().isBefore(moment(userMeta.lastSponsored).add(1, 'day'));
    const allianceToBeLocked = userMeta && userMeta.lastSponsored && moment().isBefore(moment(userMeta.lastSponsored).add(1, 'minutes'));
    const tileLocked = userMeta && userMeta.lastTiled && moment().isBefore(moment(userMeta.lastTiled).add(1, 'hour'));
    const authLocked = userMeta && userMeta.lastAuth && moment().isBefore(moment(userMeta.lastAuth).add(1, 'hour'));

    const updateUserAlliance = async (allianceIndex: number) => {
        setSelector(allianceIndex);
        const alliance = allianceArray[allianceIndex];
        const now = moment();
        const oldMeta = user?.meta || {};
        const meta = JSON.stringify({ ...oldMeta, alliance, lastSponsored: now.format() });
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

    const updateUserLastCLick = async (lastKey: string) => {
        const now = moment();
        const oldMeta = user?.meta || {};
        const meta = JSON.stringify({ ...oldMeta, [lastKey]: now.format() });
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

    const updateUserActivations = async () => {
        const now = moment();
        const oldMeta = user?.meta || {};
        let activations: number = userMeta ? parseInt(userMeta.activations, 10) : 0;
        activations++;
        const meta = JSON.stringify({ ...oldMeta, activations, lastActivation: now.format() });
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

    const updateFactoryTile = async (isPowered: string, poweredBy: string) => {
        const tileName = selectedTile;
        const mapName = DEVICE_NAME;
        const meta = JSON.stringify({ isPowered, poweredBy });
        const factoryTiles = state.factoryTiles;
        const factoryTile = factoryTiles.find((tile) => tile.tile_name === selectedTile);
        if (!factoryTile) {
            const response = await fetch(`/api/factoryMeta/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meta, mapName, tileName }),
            });
            const data = await response.json();
            if (response.ok) {
                updateUserLastCLick('lastTiled');
                getUser(uid as string);
            }
            else {
                console.error(`Error creating tile ${selectedTile}`, data);
            }
        } else {
            const currentMeta = factoryTile.meta ? JSON.parse(factoryTile.meta) : {};
            const tileId = factoryTile.id;
            const meta = JSON.stringify({ ...currentMeta, isPowered, poweredBy });
            const response = await fetch(`/api/factoryMeta/${tileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meta }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`Tile ${selectedTile} updated successfully:`, data);
                getUser(uid as string);
            }
            else {
                console.error(`Error updating tile ${selectedTile}`, data);
            }
        }
        getTiles();
    }

    const activityPane = (activityName: string) => {
        const activities: Record<string, JSX.Element> = {
            home: <>
                <h2 className="cyberpunk mb-4"><b>NEOBAND</b> ACTIONS</h2>
                <div className="flex flex-col m-4 gap-4">
                    <ActionButton handleClick={() => onDrawerSelect('pip')}>PERFORMANCE IMPROVEMENT</ActionButton>
                    <ActionButton handleClick={() => onDrawerSelect('factoryGame')}>FACTORY POWER</ActionButton>
                    <ActionButton handleClick={() => onDrawerSelect('sync')}>SYNCHRONIZE TERMINALS</ActionButton>
                    <ActionButton handleClick={() => onDrawerSelect('auth')}>AUTHENTICATOR CODE</ActionButton>
                </div>
            </>,
            pip: <>
                <h2 className="cyberpunk mb-4">PERFORMANCE IMPROVEMENT</h2>
                <div className="flex flex-col m-4 gap-4">
                    <StateBlockRow title="Scans Percentage" icon={<BadgeScan />} value={userLogCount} goal={logCount} />
                    <StateBlockRow title="Authentications" icon={<OneStar />} value={activations as number} />
                </div>
            </>,
            sync: <>
            <h2 className="cyberpunk mb-4">SYNCHRONIZE TERMINAL</h2>
            <div className="flex flex-col m-4 gap-4">
            </div>
            </>,
            auth: <>
            <h2 className="cyberpunk mb-4">AUTHENTICATE TERMINAL</h2>
            <div className="flex flex-col m-4 gap-4">
            </div>
            </>,
            factoryGame: <>
                <h2 className="cyberpunk mb-4">SELECTED TILE</h2>
                {tileLocked && (<p>⇐ COOLDOWN FOR 1 HOUR ⇒</p>)}
                {!tileLocked && user?.meta?.alliance && (<ActionButton handleClick={() => updateFactoryTile('true', user?.meta?.alliance || 'default')}>ACTIVATE</ActionButton>)}
                {!tileLocked && (<ActionButton handleClick={() => updateFactoryTile('false', 'default')}>DEACTIVATE</ActionButton>)}
            </>,
            sponsor: <>
                <h2 className="cyberpunk mb-4">SELECT SPONSOR</h2>
                <div className='flex flex-col items-center justify-center'>
                    {allianceToBeLocked && (<span>⇐ Locks in 10 mins for 24hrs ⇒</span>)}
                </div>
                <div>
                    {selector == -1 && <FourEighteenCollective width="100%" />}
                    {selector == 0 && <Endline width="100%" />}
                    {selector == 1 && <Helix width="100%" />}
                    {selector == 2 && <Reboot width="100%" />}
                </div>
                {!allianceIsLocked && (
                    <ValueSelectorRow selectedIndex={selector} clickHandler={(num) => updateUserAlliance(num)}>
                        <span><Endline width="100%" /></span>
                        <span><Helix width="100%" /></span>
                        <span><Reboot width="100%" /></span>
                    </ValueSelectorRow>
                )}
                {allianceIsLocked && (<p>Sponsorships are in place for 24 hours and will auto renew every 24 hours.</p>)}
            </>,
        }

        return activities[activityName] || null;
    }

    useEffect(() => {
    },[user]);

    return (
        <div className="border-none flex h-full flex-col items-center justify-center p-4 pt-8 relative">
            <div className="min-h-full">
                {activityPane(section)}
            </div>
        </div>
    )
}