
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressData {
  name: string;
  peso: number;
}

const data: ProgressData[] = [
  { name: 'Semana 1', peso: 80 },
  { name: 'Semana 2', peso: 79.5 },
  { name: 'Semana 3', peso: 79 },
  { name: 'Semana 4', peso: 78 },
  { name: 'Semana 5', peso: 77.8 },
  { name: 'Semana 6', peso: 77 },
];

const ProgressChart: React.FC = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#4b5563" />
          <YAxis stroke="#4b5563" domain={['dataMin - 2', 'dataMax + 2']}/>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#84cc16',
              backdropFilter: 'blur(2px)',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="peso" stroke="#84cc16" strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
