import Image from 'next/image'
import Terminal418 from '../svgs/terminal418';
import Avatar from './avatar';

interface  SummaryProps {
    children?: React.ReactNode;
  }
  
  export default function Summary(props:SummaryProps):JSX.Element {
    const { children } = props;
  
    return (
      <section className="border-none flex h-full flex-col items-center justify-center p-4">
        <h2 className="cyberpunk">TERMINAL OVERVIEW</h2>
        <div className="flex flex-row min-w-full p-4">
            <div className="basis-1/2">
                <Terminal418 />
            </div>
            <div className="basis-1/2">
                <h3 className="cyberpunk">TECHNICAINS NEEDED</h3>
                <p className="cyberpunk m-4">
                    We need help to activate the foundry!<br /><br />
                    Please help us reach our quota by scanning your <b>Neofob</b> regularly.<br /><br />
                    An AI bot will do the rest!
                </p>
                <h3 className="cyberpunk">AI BOTS</h3>
                <div className="flex flex-row m-4 gap-4">
                    <Avatar seed='Mike' />
                    <Avatar seed='Dominic' />
                    <Avatar seed='Kaela' />
                </div>
            </div>
        </div>
      <hr className="cyberpunk" />
      {children}
      </section>
    )
  }