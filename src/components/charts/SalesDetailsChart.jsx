import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import CustomDropdown from "../CustomDropdown";
import { getSalesTrend } from "../../services/api/dashboardService";

const SalesChart = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const data = await getSalesTrend();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[445px] bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-sora font-bold">Sales Details</h2>
          <div className="w-fit">
            <CustomDropdown />
          </div>
        </div>
        <div className="w-full h-[80%] flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-40 bg-gray-100 rounded w-80"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[445px] bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Sales Details</h2>
          <div className="w-fit">
            <CustomDropdown />
          </div>
        </div>
        <div className="w-full h-[80%] flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[445px] bg-white rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sales Details</h2>
        <div className="w-fit">
          <CustomDropdown />
        </div>
      </div>
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BEA355" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#BEA355" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8A8A8A', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8A8A8A', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                borderColor: "#BEA355",
                borderRadius: "8px",
                padding: "10px"
              }}
              itemStyle={{ color: "#FFF" }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
            />
            <Area 
              type="monotone" 
              dataKey="value"
              stroke="#BEA355"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            <Line 
              type="monotone" 
              dataKey="value"
              stroke="#BEA355"
              strokeWidth={2}
              dot={{
                stroke: '#BEA355',
                strokeWidth: 2,
                fill: '#FFF',
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: '#BEA355',
                strokeWidth: 2,
                fill: '#FFF'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
