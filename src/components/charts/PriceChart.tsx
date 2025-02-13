import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface PriceChartProps {
  timeFrame?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ timeFrame = '24H' }) => {
  // Generate sample data
  const generateData = () => {
    const data = [];
    const periods = 100;
    let baseValue = 100000;
    
    for (let i = 0; i < periods; i++) {
      const random = Math.random() * 2000 - 1000;
      baseValue = Math.max(99000, Math.min(101000, baseValue + random));
      
      data.push({
        time: new Date(Date.now() - (periods - i) * 15 * 60000).toISOString(),
        price: baseValue,
        volume: Math.random() * 1000000,
      });
    }
    
    return data;
  };

  const data = generateData();
  const priceFormatter = (value: number) => {
    return value.toFixed(6);
  };

  const timeFormatter = (time: string) => {
    const date = new Date(time);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Price Chart */}
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={timeFormatter}
              stroke="#4b5563"
              tick={{ fill: '#9ca3af' }}
              tickLine={{ stroke: '#4b5563' }}
            />
            <YAxis
              dataKey="price"
              tickFormatter={priceFormatter}
              orientation="right"
              stroke="#4b5563"
              tick={{ fill: '#9ca3af' }}
              tickLine={{ stroke: '#4b5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem',
              }}
              itemStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => [`$${priceFormatter(value)}`, 'Price']}
              labelFormatter={timeFormatter}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="time"
              tickFormatter={timeFormatter}
              stroke="#4b5563"
              tick={{ fill: '#9ca3af' }}
              tickLine={{ stroke: '#4b5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem',
              }}
              itemStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
              labelFormatter={timeFormatter}
            />
            <Bar
              dataKey="volume"
              fill="#3b82f6"
              opacity={0.3}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
