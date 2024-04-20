'use client';
import { Scan } from "../lib/types";
import Avatar from "./avatar";
import DateRelative from "./dateRelative";

interface RecentsProps {
  children?: React.ReactNode;
  scans?: Scan[];
}

export default function Recents(props:RecentsProps):JSX.Element {
  const { children, scans = [] } = props;

  const recentScans = () => {
    let top:Scan[] = [];
    let cloneScans = JSON.parse(JSON.stringify(scans));
    if (cloneScans && cloneScans.length >= 21) {
      top = cloneScans.slice(0, 21);
    } else {
      top = cloneScans;
    }
    return top;
  }

  return (
    <section className="cyberpunk border-none flex h-full flex-col items-center justify-center" >
      <h2 className="cyberpunk">Most Recent Technicians</h2>
      <div className="grid grid-flow-col gap-4 grid-rows-3 pt-4">
        {recentScans && recentScans().map(scan => {
          return (
            <div className="flex flex-col flex-wrap" key={`scan_${scan.created_at}`}>
              <Avatar seed={scan.raw_value} />
              <DateRelative timeStamp={scan.created_at} />
            </div>
          )
        })}
      </div>

    </section>
  )
}