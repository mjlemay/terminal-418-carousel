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
import { allianceArray, authWords1, authWords2 } from '../lib/constants';
import StateBlockRow from './statblockRow';
import OneStar from '../svgs/onestar';
import Baudot from 'next/font/local';
import { shuffle } from 'lodash';
import IconFactory from '../svgs/iconFactory';


const DEVICE_NAME = process.env.NEXT_PUBLIC_DEVICE_NAME || 'unknown_terminal';

const baudot = Baudot({
    src: [
        { path: '../fonts/Baudot-Regular.ttf', weight: '400', },
    ]
});

type UserDrawerProps = {
    section: string;
    onDrawerSelect?: (section: string) => void;
}

export default function UserDrawer({ section = 'pip', onDrawerSelect = () => { } }: UserDrawerProps): JSX.Element {
    const {
        state,
        getUser = () => { },
        getTiles = () => { },
        setSelectedTile = () => { },
    }: AppProviderValues = useContext(Context);
    const { user, logs, selectedTile } = state;
    const uid: string | null = user ? user.uid : 'error';
    const logCount = logs ? logs.length : 0;
    const userLogCount = logs ? logs.filter((log) => log.scan_id === uid).length : 0;
    let userMeta = user ? user.meta : null;
    const alliance = userMeta ? userMeta.alliance : null;
    const activations = userMeta ? userMeta.activations : 0;
    const lastSponsored = userMeta ? userMeta.lastSponsored : null;
    const lastTiled = userMeta ? userMeta.lastTiled : null;
    const lastAuth = userMeta ? userMeta.lastAuth : null;
    const allianceIndex = alliance ? allianceArray.indexOf(alliance) : -1;
    const [selector, setSelector] = useState(allianceIndex);
    const [softLock, setSoftLock] = useState(false);
    const [softAuthLock, setSoftAuthLock] = useState(false);
    const [successfullyActivated, setSuccessfullyActivated] = useState(false);
    const [successfullyTiled, setSuccessfullyTiled] = useState(false);
    const allianceIsLocked = (timestamp: string | null) => {
        return timestamp
            && moment().isAfter(moment(timestamp).add(1, 'minutes'))
            && moment().isBefore(moment(timestamp).add(1, 'day'));
    };
    let allianceToBeLocked = (timestamp: string | null) => {
        return timestamp && moment().isBefore(moment(timestamp).add(1, 'minutes'))
    };
    let tileLocked = (timestamp: string | null) => {
        return timestamp && moment().isBefore(moment(timestamp).add(1, 'hour'))
    };
    const authIndex = () => {
        const startTime = moment().startOf('isoWeek');
        const endTime = moment();
        const duration = moment.duration(endTime.diff(startTime));
        return Math.floor(duration.as('hours'));
    }

    const authPhrase = () => {
        const authArray = DEVICE_NAME === 'terminal_418_a' ? authWords1 : authWords2;
        return authArray[authIndex()];
    }
    const validAuthPhrase = () => {
        const authArray = DEVICE_NAME === 'terminal_418_a' ? authWords2 : authWords1;
        return authArray[authIndex()];
    }

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
        setSelectedTile('');
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
        }
        else {
            console.error('Error updating alliance:', data);
        }
        getUser(uid as string);
    }

    const updateUserActivations = async () => {
        const now = moment();
        const oldMeta = user?.meta || {};
        let activations: number = userMeta ? parseInt(userMeta.activations, 10) : 0;
        if (activations === null || typeof activations === 'undefined') {
            activations = 0;
        }
        const newActivations = activations + 1;
        const meta = JSON.stringify({ ...oldMeta, activations: newActivations, lastAuth: now.format() });
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
        }
        else {
            console.error('Error updating alliance:', data);
        }
        getUser(uid as string);
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
            }
            else {
                console.error(`Error creating tile ${selectedTile}`, data);
            }
            getUser(uid as string);
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
        setSelectedTile('');
        setSuccessfullyTiled(true);
        setTimeout(() => {
            setSuccessfullyTiled(false);
            updateUserActivations();
        }
        , 15000);
        setSoftLock(true);
        getTiles();
    }

    const checkActivations = async (word: string) => {
        const correctPhrase = validAuthPhrase();
        setSoftAuthLock(true);
        if (word === correctPhrase) {
            setSuccessfullyActivated(true);
            setTimeout(() => {
                setSuccessfullyActivated(false);
                updateUserActivations();
            }
                , 15000);
        } else {
            updateUserLastCLick('lastAuth');
        }
    }

    const authOptions = () => {
        const choiceArray = [authWords1[authIndex() - 2], authWords1[authIndex()], authWords2[authIndex()], authWords2[authIndex() - 1]];
        const shuffledArray = shuffle(choiceArray);
        return shuffledArray.map((word, index) => (
            <ActionButton key={`${index}_${word}`} value={word} handleClick={() => checkActivations(`${word}`)}>{word}</ActionButton>
        ));

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
                    {!tileLocked(lastAuth) && !softAuthLock && authOptions()}
                    {successfullyActivated && (
                        <div className='border-2 border-teal rounded-lg p-4 m-4 text-center text-2xl'>
                            <h3>AUTHENTICATION SUCCESSFUL</h3>
                            <OneStar />
                        </div>
                    )}
                    {(tileLocked(lastAuth) || softAuthLock) && (
                        <p>Authentication attempted. Cool down is 1 hour.</p>
                    )}
                </div>
            </>,
            auth: <>
                <h2 className="cyberpunk mb-4">AUTHENTICATE TERMINAL</h2>
                <div className="flex flex-col m-4 gap-4">
                    <p>PLEASE DELIVER THIS PHRASE TO ANOTHER TERMINAL TO SYNC</p>
                    <div
                        className='border-2 border-teal rounded-lg p-4 m-4 text-center text-2xl'
                        data-augmented-ui="tl-clip tr-clip br-clip-x bl-clip both"
                    >
                        <h3>{authPhrase()}</h3>
                    </div>
                </div>
            </>,
            factoryGame: <>
                <h2 className="cyberpunk mb-4">SELECTED TILE</h2>
                <div className="p-4">
                    <h4>{selectedTile ? selectedTile : 'NO TILE SELECTED'}</h4>
                </div>
                {(softLock || tileLocked(lastTiled) && !successfullyTiled) && (<p>⇐ COOLDOWN FOR 1 HOUR ⇒</p>)}
                {!user?.meta?.alliance && (<p>Activation not Sponsored.<br />Please Select a sponsor.</p>)}
                <div style={{ opacity: selectedTile ? 1 : 0.5 }} className='p=2'>
                    {!tileLocked(lastTiled) && !softLock && user?.meta?.alliance && (<ActionButton handleClick={() => updateFactoryTile('true', user?.meta?.alliance || 'default')}>ACTIVATE</ActionButton>)}
                    {!tileLocked(lastTiled) && !softLock && user?.meta?.alliance && (<ActionButton handleClick={() => updateFactoryTile('false', 'default')}>DEACTIVATE</ActionButton>)}
                </div>
                <span className={`${baudot.className} text-2xs text-right pr-2 text-teal`}>{lastTiled}</span>
                {successfullyTiled && (
                        <div className='border-2 border-teal rounded-lg p-4 m-4 text-center text-2xl'>
                            <h3>TILE POWERED NEXT CYCLE</h3>
                            <div className='max-w-[100px]'><IconFactory /></div>
                        </div>
                    )}
            </>,
            sponsor: <>
                <h2 className="cyberpunk mb-4">SELECT SPONSOR</h2>
                <div className='flex flex-col items-center justify-center'>
                    {allianceToBeLocked(lastSponsored) && (<p>⇐ Locks in 10 mins for 24hrs ⇒</p>)}
                </div>
                <div>
                    {selector == -1 && <FourEighteenCollective width="100%" />}
                    {selector == 0 && <Endline width="100%" />}
                    {selector == 1 && <Helix width="100%" />}
                    {selector == 2 && <Reboot width="100%" />}
                </div>
                {!allianceIsLocked(lastSponsored) && (
                    <ValueSelectorRow selectedIndex={selector} clickHandler={(num) => updateUserAlliance(num)}>
                        <span><Endline width="100%" /></span>
                        <span><Helix width="100%" /></span>
                        <span><Reboot width="100%" /></span>
                    </ValueSelectorRow>
                )}
                {allianceIsLocked(lastSponsored) && (<p>Sponsorships are in place for 24 hours and will auto renew every 24 hours.</p>)}
                {allianceToBeLocked(lastSponsored) && (
                    <ActionButton handleClick={() => onDrawerSelect('factoryGame')}>FACTORY POWER</ActionButton>
                )}
            </>,
        }

        return activities[activityName] || null;
    }

    useEffect(() => {
        if (user) {
            userMeta = user ? user.meta : null;
        }
    }, [user]);

    return (
        <div className="border-none flex h-full flex-col items-center justify-center p-4 pt-8 relative">
            <div className="min-h-full">
                {activityPane(section)}
            </div>
        </div>
    )
}