'use client';
import { countBy } from "lodash";
import moment from "moment";
import { Area, ComposedChart, ResponsiveContainer, XAxis, YAxis, Legend, Line, ReferenceLine } from "recharts";
import { useContext } from "react";
import { Context } from "../lib/appContext";
import { AppProviderValues } from "../lib/types";


  const dailyGoals:any = {
    Mon: 0,
    Tue: 10,
    Wed: 100,
    Thu: 250,
    Fri: 500,
    Sat: 800,
    Sun: 1000,
  }
  
  export default function Charts():JSX.Element {
    const { 
      state
    }: AppProviderValues = useContext(Context);
    const { logs } = state;

    const lastFiveDays = () => {
      const calDate = (isoDate: string) => {
        const adjustedDate = moment(isoDate).add(-7, 'hours').format('YYYY-MM-DD');
        return adjustedDate;
      }
    const today = moment();
    const minusOne = moment().add(-1, 'days');
    const minusTwo = moment().add(-2, 'days');
    const minusThree = moment().add(-3, 'days');
    const minusFour = moment().add(-4, 'days');
    const clonedData = JSON.parse(JSON.stringify(logs));
    const simpleData = clonedData.map((datum:any) => {
      datum.created_at = calDate(datum.created_at);
      return datum;
    });
    const dayData = countBy(simpleData, 'created_at');


    return [
      {
        day: minusFour.format('ddd'),
        scans: dayData[minusFour.format('YYYY-MM-DD')] || 0,
        goal: dailyGoals[minusFour.format('ddd')],
      },
      {
        day: minusThree.format('ddd'),
        scans: dayData[minusThree.format('YYYY-MM-DD')] || 0,
        goal: dailyGoals[minusThree.format('ddd')],
      },
      {
        day: minusTwo.format('ddd'),
        scans: dayData[minusTwo.format('YYYY-MM-DD')] || 0,
        goal: dailyGoals[minusTwo.format('ddd')],
      },
      {
        day: minusOne.format('ddd'),
        scans: dayData[minusOne.format('YYYY-MM-DD')] || 0,
        goal: dailyGoals[minusOne.format('ddd')],
      },
      {
        day: today.format('ddd'),
        scans: dayData[today.format('YYYY-MM-DD')] || 0,
        goal: dailyGoals[today.format('ddd')],
      },
    ]
};

    return (
      <section className="cyberpunk border-none flex h-full flex-col items-center justify-center">
          <h2 className="cyberpunk">Daily Scans</h2>
          <ResponsiveContainer width="100%" height={400} className="pt-4">
            <ComposedChart data={lastFiveDays()}>
              <XAxis dataKey="day" stroke="#00e6df" />
              <YAxis stroke="#00e6df" />
              <Legend />
              <ReferenceLine y={1000} stroke="#c1ff72" />
              <Line type="monotone" dataKey="goal" stroke="#c1ff72" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="scans" stroke="#fa66f7" fill="#fa66f7" />
            </ComposedChart>
          </ResponsiveContainer>
      </section>
    )
  }