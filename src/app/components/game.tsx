'use client';
import { countBy } from "lodash";
import Avatar from "./avatar";
import { ResponsiveContainer, Label, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useContext } from "react";
import { Context } from "../lib/appContext";
import { AppProviderValues } from "../lib/types";

const colors = ["#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72", "#c1ff72"];

export default function Game():JSX.Element {
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
        topTenUsers = topTenUsers.slice(0, 10);
      }
      return topTenUsers;
    }

    const data = topScanners();
  
    const getPath = (x:any, y:any, width:any, height:any) => {
      return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
      ${x + width / 2}, ${y}
      C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
      Z`;
    };
    
    const TriangleBar = (props:any) => {
      const { fill, x, y, width, height } = props;
    
      return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };

    const renderCustomizedLabel = (props:any) => {
      const { x, y, payload } = props;
      const { value } = payload;
      return (
        <g  height={100}>
          <foreignObject x={x - 25} y={y} width={100} height={100}>
            <Avatar seed={value} size={50} style={{marginLeft: '-25px'}} />
          </foreignObject>
        </g>
      );
    };
    

    return (
      <section className="cyberpunk border-none flex h-full flex-col items-center justify-center">
          <h2 className="cyberpunk">Top Technicians</h2>
          <ResponsiveContainer width="100%" height={400} className="pt-4">
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
      </section>
    )
  }