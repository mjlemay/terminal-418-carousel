'use client';
import { countBy } from "lodash";
import moment from "moment";
import { 
    Area, 
    ComposedChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Legend,
    Line,
    Label,
    BarChart,
    Bar,
    Cell,
    ReferenceLine,
    CartesianGrid
 } from "recharts";
import { useContext } from "react";
import { Context } from "../lib/appContext";
import { AppProviderValues } from "../lib/types";
import Avatar from "./avatar";


const colors = ["#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72", "#c1ff72"];
const dailyGoals: any = {
    Mon: 0,
    Tue: 10,
    Wed: 100,
    Thu: 250,
    Fri: 500,
    Sat: 800,
    Sun: 1000,
}

export default function ScanSlide(): JSX.Element {
    const {
        state
    }: AppProviderValues = useContext(Context);
    const { logs } = state;

        const topScanners = () => {
          let topTenUsers = [];
          const userData = countBy(logs, 'scan_id');
          let cloneUsers = JSON.parse(JSON.stringify(userData));
          for (let [key, value] of Object.entries(cloneUsers)) {
            topTenUsers.push({name: key, value});
          }
          topTenUsers.sort((a:any, b:any) => parseFloat(b.value) - parseFloat(a.value));
          if (topTenUsers && topTenUsers.length >= 11) {
            topTenUsers = topTenUsers.slice(0, 25);
          }
          return topTenUsers;
        }
    
        const data = topScanners();
    
        const getPath = (x: number, y: number, width: number, height: number) => {
          return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
          ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
          Z`;
        };
        
        const TriangleBar = (props: any) => {
          const { fill, x, y, width, height } = props;
        
          return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
        };
    
        const renderCustomizedLabel = (props: any) => {
          const { x, y, payload } = props;
          const { value } = payload;
          return (
            <g  height={100}>
              <foreignObject x={x - 25} y={y} width={100} height={100}>
                <Avatar seed={value} size={50} />
              </foreignObject>
            </g>
          );
        };

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
        const simpleData = clonedData.map((datum: any) => {
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
            <div className="w-full h-full p-4">
            <h2 className="cyberpunk">Daily Scans</h2>
            <ResponsiveContainer width="100%" height={300} className="pt-4">
                <ComposedChart data={lastFiveDays()}>
                    <XAxis dataKey="day" stroke="#00e6df" />
                    <YAxis stroke="#00e6df" />
                    <Legend />
                    <ReferenceLine y={1000} stroke="#c1ff72" />
                    <Line type="monotone" dataKey="goal" stroke="#c1ff72" strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="scans" stroke="#fa66f7" fill="#fa66f7" />
                </ComposedChart>
            </ResponsiveContainer>
            <h2 className="cyberpunk">Top Technicians</h2>
            <ResponsiveContainer width="100%" height={300} className="pt-4">
                <BarChart data={data}>
                    <Label value={renderCustomizedLabel as unknown as string} offset={0} position="insideBottom" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} height={50} tick={renderCustomizedLabel}></XAxis>
                    <YAxis stroke="#00e6df" />
                    <Bar type="monotone" dataKey="value" stroke="#ffffff" fill="#fa66f7" shape={<TriangleBar />} label={{ position: 'top' }}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            </div>
        </section>
    )
}