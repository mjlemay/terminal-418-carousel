import LuckyCat from '../svgs/luckycat';
import BadgeScan from '../svgs/badgeScan';
import Avatar from './avatar';
import CloseButton from './closeButton';
import { AppProviderValues } from '../lib/types';
import { useContext } from 'react';
import { Context } from '../lib/appContext';
import StateBlockRow from './statblockRow';

  export default function userScreen():JSX.Element {
    const { state }: AppProviderValues = useContext(Context);
    const { user, logs } = state;
    const uid: string | null = user ? user.uid: 'error';
    const logCount = logs ? logs.length : 0;
    const userLogCount = logs ? logs.filter((log) => log.scan_id === uid).length : 0;
  
    return (
      <section className="border-none flex h-full flex-col items-center justify-center p-4 pt-8 relative">
        <h2 className="cyberpunk">WELCOME TECHNICIAN</h2>
        <div className="flex flex-row min-w-full p-4 gap-8">
            <div className="basis-1/2">
                <StateBlockRow icon={<LuckyCat />} title="LUCKYCAT STANDING" value={5} goal={10} />
                <StateBlockRow icon={<BadgeScan />} title="TECHNICIAN SCANS" value={userLogCount} goal={logCount} />
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
                    <CloseButton />
                </div>
            </div>
        </div>
      <hr className="cyberpunk" />
      </section>
    )
  }