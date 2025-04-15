import BadgeScan from '../svgs/badgeScan';
import ActionButton from './actionButton';
import { AppProviderValues } from '../lib/types';
import { useContext, useState } from 'react';
import { Context } from '../lib/appContext';
import ValueSelectorRow from './valueSelectorRow';
import Endline from '../svgs/endline';
import Helix from '../svgs/helix';
import Reboot from '../svgs/reboot';
import FourEighteenCollective from '../svgs/418collective';
import { allianceArray } from '../lib/constants';


const DEVICE_NAME = process.env.NEXT_PUBLIC_DEVICE_NAME || 'unknown_terminal';

export default function UserDrawer(): JSX.Element {
    const {
        state,
        getUser = () => { },
        getTiles = () => { },
    }: AppProviderValues = useContext(Context);
    const { user, logs, selectedTile } = state;
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


    const updateFactoryTile = async (isPowered: string, poweredBy: string)  => {
        const tileName = selectedTile;
        const mapName= DEVICE_NAME;
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
                console.log(`Tile ${selectedTile} created successfully:`, data);
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
            pip: <>
                <h2 className="cyberpunk mb-4">SELECTED TILE</h2>
                <p>Postion: {selectedTile}</p>
                <ActionButton selected={activity === 'config'} handleClick={() => updateFactoryTile('true', user?.meta?.alliance || 'default')}>ACTIVATE</ActionButton>
                <ActionButton selected={activity === 'config'} handleClick={() => updateFactoryTile('false', 'default')}>DEACTIVATE</ActionButton>
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
        <div className="border-none flex h-full flex-col items-center justify-center p-4 pt-8 relative">
            <div className="min-h-full">
                {activityPane(activity)}
                <div className="flex flex-row m-4 gap-4">
                    <ActionButton selected={activity === 'pip'} handleClick={() => setActivity('pip')}>PERFORMANCE IMPROVEMENT</ActionButton>
                    <ActionButton selected={activity === 'config'} handleClick={() => setActivity('config')}>SELECT SPONSOR</ActionButton>
                </div>
            </div>
        </div>
    )
}