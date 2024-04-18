'use client';
import { useEffect } from "react";
import { Scan } from "../lib/types";
import { countBy } from "lodash";
import moment from "moment";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";


interface ChartProps {
    children?: React.ReactNode;
    scans?: Scan[];
  }
  
  export default function Charts(props:ChartProps):JSX.Element {
    const { children, scans } = props;

    useEffect(() => {
      console.log('scans', scans);
    }, [scans]);

    const uniqueScanCountsData = () => {
      const pieData = countBy(scans, 'raw_value');
      return pieData; 
  };

  const lastFiveDays = () => {
    const calDate = (isoDate: string) => {
      const adjustedDate = moment(isoDate).add(-7, 'hours').format('YYYY-MM-DD');
      console.log(isoDate, adjustedDate);
      return adjustedDate;
    }
    const today = moment();
    const minusOne = moment().add(-1, 'days');
    const minusTwo = moment().add(-2, 'days');
    const minusThree = moment().add(-3, 'days');
    const minusFour = moment().add(-4, 'days');
    const clonedData = JSON.parse(JSON.stringify(scans));
    const simpleData = clonedData.map((datum:any) => {
      datum.created_at = calDate(datum.created_at);
      return datum;
    });
    const dayData = countBy(simpleData, 'created_at');

    console.log('simpleData', simpleData);

    return [
      {
        day: minusFour.format('ddd'),
        value: dayData[minusFour.format('YYYY-MM-DD')] || 0
      },
      {
        day: minusThree.format('ddd'),
        value: dayData[minusThree.format('YYYY-MM-DD')] || 0
      },
      {
        day: minusTwo.format('ddd'),
        value: dayData[minusTwo.format('YYYY-MM-DD')] || 0
      },
      {
        day: minusOne.format('ddd'),
        value: dayData[minusOne.format('YYYY-MM-DD')] || 0
      },
      {
        day: today.format('ddd'),
        value: dayData[today.format('YYYY-MM-DD')] || 0
      },
    ]
};

    return (
      <section className="cyberpunk border-none flex h-full flex-col items-center justify-center">
          <h2 className="cyberpunk">Daily Scans</h2>
          <ResponsiveContainer width="100%" height={400} className={"pt-4"}>
            <AreaChart data={lastFiveDays()}>
              <XAxis dataKey="day" stroke="#00e6df" />
              <YAxis stroke="#00e6df" />
              <Area type="monotone" dataKey="value" stroke="#ffffff" fill="#fa66f7" />
            </AreaChart>
          </ResponsiveContainer>
      </section>
    )
  }