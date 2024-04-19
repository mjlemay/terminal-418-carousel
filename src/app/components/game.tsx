'use client';
import { Scan } from "../lib/types";
import { countBy } from "lodash";
import Avatar from "./avatar";
import { ResponsiveContainer, Label, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';


const colors = ["#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72","#c1ff72", "#c1ff72"];

interface GameProps {
    scans?: Scan[];
}
  
  export default function Game(props:GameProps):JSX.Element {
    const { scans = [] } = props;

    const topScanners = () => {
      let topTenUsers = [];
      const userData = countBy(scans, 'raw_value');
      let cloneUsers = JSON.parse(JSON.stringify(userData));
      for (let [key, value] of Object.entries(cloneUsers)) {
        topTenUsers.push({name: key, value});
      }
      console.log('topTenUsers', topTenUsers);
      topTenUsers.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
      if (topTenUsers && topTenUsers.length >= 11) {
        topTenUsers = topTenUsers.slice(0, 11);
      }
      return topTenUsers;
    }

    const data = topScanners();
  

    const getPath = (x, y, width, height) => {
      return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
      ${x + width / 2}, ${y}
      C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
      Z`;
    };
    
    const TriangleBar = (props) => {
      const { fill, x, y, width, height } = props;
    
      return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };

    const renderCustomizedLabel = (props) => {
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
            <BarChart data={data} label={renderCustomizedLabel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} height={50} tick={renderCustomizedLabel}></XAxis>
              <YAxis stroke="#00e6df" />
              <Bar type="monotone" dataKey="value" stroke="#ffffff" fill="#fa66f7" shape={<TriangleBar />} label={{ position: 'top' }}> />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
              ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
      </section>
    )
  }