import React, { useEffect, useState } from "react";
import { BsBoxFill } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi2";
import { MdTrendingUp } from "react-icons/md";
import { RiLineChartLine } from "react-icons/ri";
import { getTotalPending, getTotalSales, getTotalOrders, getTotalUsers } from '../services/api/dashboardService';

const DashboardCards = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [users, orders, salesResponse, pending] = await Promise.all([
        getTotalUsers(),
        getTotalOrders(),
        getTotalSales(),
        getTotalPending()
      ]);

      setStats([
        {
          title: "Total Users",
          value: users.toLocaleString(),
          icon: <HiUsers className="text-yellow-600 text-3xl" />,
          percentage: "8.5%",
          trend: "Up from yesterday",
          trendClass: "text-[#00B69B]",
          trendIcon: <MdTrendingUp />
        },
        {
          title: "Total Orders",
          value: orders.toLocaleString(),
          icon: <BsBoxFill className="text-yellow-600 text-3xl" />,
          percentage: "1.3%",
          trend: "Up from past week",
          trendClass: "text-[#00B69B]",
          trendIcon: <MdTrendingUp />
        },
        {
          title: "Total Sales",
          value: `$${salesResponse.sale.toLocaleString()}`,
          icon: <RiLineChartLine className="text-yellow-600 text-3xl" />,
          percentage: '4.3%',
          trend: "Up from yesterday",
          trendClass: "text-[#00B69B]",
          trendIcon: <MdTrendingUp />
        },
        {
          title: "Total Pending",
          value: `$${pending.toLocaleString()}`,
          icon: <FaClockRotateLeft className="text-yellow-600 text-3xl" />,
          percentage: "1.8%",
          trend: "Up from yesterday",
          trendClass: "text-[#00B69B]",
          trendIcon: <MdTrendingUp />
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-3">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="p-3 bg-gray-200 rounded-2xl h-12 w-12"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32 mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm text-[#202224]">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className="p-3 bg-[#BEA3550F] rounded-2xl">{stat.icon}</div>
          </div>
          <p className={`text-sm mt-4 ${stat.trendClass} mt-2 flex items-center gap-2`}>
            <span className="flex items-center gap-1">{stat.trendIcon} {stat.percentage}</span>
            <span className="text-[#202224]">{stat.trend}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
