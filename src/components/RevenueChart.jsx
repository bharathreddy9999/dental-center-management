import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function RevenueChart({ data }) {
  const { isDarkMode } = useTheme();
  const [animatedData, setAnimatedData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure data has the correct structure and provide fallback
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [
        { month: 'Jan', revenue: 25000 },
        { month: 'Feb', revenue: 32000 },
        { month: 'Mar', revenue: 28000 },
        { month: 'Apr', revenue: 35000 },
        { month: 'May', revenue: 42000 },
        { month: 'Jun', revenue: 38000 },
      ];
    }
    
    return data.map(item => ({
      month: item.month || item.label || 'Unknown',
      revenue: Number(item.revenue || item.value || 0)
    }));
  }, [data]);

  // Animate data loading
  useEffect(() => {
    if (chartData.length > 0) {
      setIsLoading(true);
      
      // Start with zero values
      const zeroData = chartData.map(item => ({ ...item, revenue: 0 }));
      setAnimatedData(zeroData);
      
      // Animate to real values with staggered delay
      setTimeout(() => {
        chartData.forEach((item, index) => {
          setTimeout(() => {
            setAnimatedData(prev => 
              prev.map((prevItem, prevIndex) => 
                prevIndex === index ? { ...item } : prevItem
              )
            );
          }, index * 150); // Staggered animation
        });
      }, 300);
      
      // Mark loading complete
      setTimeout(() => {
        setIsLoading(false);
      }, 300 + chartData.length * 150);
    }
  }, [chartData]);

  // Custom bar colors with hover effects
  const getBarColor = (index) => {
    const baseColor = isDarkMode ? '#f59e0b' : '#d97706';
    const hoverColor = isDarkMode ? '#fbbf24' : '#f59e0b';
    return hoveredIndex === index ? hoverColor : baseColor;
  };

  // Custom tooltip with animations
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          animate-fade-in-up transform transition-all duration-300
          ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'}
          border rounded-lg shadow-xl p-4 backdrop-blur-sm
        `}>
          <p className="font-medium text-sm mb-2">{`Month: ${label}`}</p>
          <p className={`text-lg font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
            ₹{payload[0].value.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'} animate-pulse`}></div>
            <span className="text-xs opacity-75">Revenue</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative w-full h-80 transition-all duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <div className={`
              animate-spin rounded-full h-8 w-8 border-b-2 
              ${isDarkMode ? 'border-amber-400' : 'border-amber-600'}
            `}></div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Loading chart data...
            </p>
          </div>
        </div>
      )}
      
      {/* Chart Stats Summary */}
      {!isLoading && animatedData.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-4 text-center">
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ₹{Math.max(...animatedData.map(d => d.revenue)).toLocaleString()}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Peak Revenue
            </div>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ₹{Math.round(animatedData.reduce((sum, d) => sum + d.revenue, 0) / animatedData.length).toLocaleString()}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Average
            </div>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              ₹{animatedData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Total Revenue
            </div>
          </div>
        </div>
      )}
      
      {/* Chart container with smooth transitions */}
      <div className="animate-slide-in-up transition-all duration-700 ease-out">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={animatedData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Animated Grid */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#f3f4f6'}
              className="animate-fade-in"
              style={{
                transition: 'all 0.3s ease'
              }}
            />
            
            {/* X-Axis with smooth transitions */}
            <XAxis 
              dataKey="month" 
              tick={{ 
                fontSize: 12, 
                fill: isDarkMode ? '#cbd5e1' : '#64748b',
                transition: 'all 0.3s ease'
              }}
              className="transition-all duration-300"
              height={60}
            />
            
            {/* Y-Axis with smooth transitions and better formatting */}
            <YAxis 
              tick={{ 
                fontSize: 12, 
                fill: isDarkMode ? '#cbd5e1' : '#64748b',
                transition: 'all 0.3s ease'
              }}
              className="transition-all duration-300"
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              width={80}
            />
            
            {/* Enhanced Tooltip */}
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                fill: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.3)',
                transition: 'all 0.2s ease'
              }}
            />
            
            {/* Animated Bars */}
            <Bar 
              dataKey="revenue" 
              radius={[8, 8, 0, 0]}
              onMouseEnter={(data, index) => setHoveredIndex(index)}
              style={{
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                transition: 'all 0.3s ease'
              }}
            >
              {animatedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(index)}
                  style={{
                    transition: 'all 0.3s ease',
                    transformOrigin: 'bottom center'
                  }}
                  className={hoveredIndex === index ? 'animate-pulse-slow' : ''}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Subtle glow effect for the chart container */}
      <div className={`
        absolute inset-0 -z-10 rounded-lg transition-all duration-500
        ${isDarkMode ? 'bg-gradient-to-br from-amber-900/10 to-yellow-900/5' : 'bg-gradient-to-br from-amber-100/20 to-yellow-100/10'}
        ${!isLoading ? 'animate-float' : ''}
      `}></div>
    </div>
  );
} 