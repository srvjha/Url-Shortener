import React from 'react'
import { PieChart, Pie,ResponsiveContainer, Cell } from "recharts";


const DeviceStats = ({stats}) => {

    const deviceCount = stats.reduce((acc,item)=>{
        if(!acc[item.device]){
            acc[item.device] = 0
        }
        acc[item.device] ++;
        return acc
    },{});

    const result = Object.keys(deviceCount).map((device)=>({
        device,
        count:deviceCount[device]
    }))
   const colors = [
    '#0088FE',
    '#FFBB33',
    '#6699cc',
    '#FF99CC',
    '#CC33CC',
   ]

  return (
    <div style={{ width:"100%",height:300 }}>
    <ResponsiveContainer>
    <PieChart width={700} height={400}>
    <Pie
      data={result}
       labeline={false} 
       label={({device,percent})=>`${device}:${(percent * 100).toFixed(0)}%`}
       dataKey="count"
       >
        
        {result.map((entry,index)=>(
            <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
            />
        ))}

    </Pie>
  </PieChart>
  </ResponsiveContainer>
  </div>
);
}

export default DeviceStats
