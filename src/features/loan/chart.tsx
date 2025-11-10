import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from 'recharts';

const data = [
    { month: 'Jan', capital: 1500000, profit: 3200000 },
    { month: 'Feb', capital: 11800000, profit: 2800000 },
    { month: 'Mar', capital: 13200000, profit: 18100000 },
    { month: 'Apr', capital: 14500000, profit: 3800000 },
    { month: 'May', capital: 15200000, profit: 4500000 },
    { month: 'Jun', capital: 6800000, profit: 25200000 },
    { month: 'Jul', capital: 17500000, profit: 5800000 },
    { month: 'Aug', capital: 18200000, profit: 16200000 },
    { month: 'Sep', capital: 19500000, profit: 7100000 },
    { month: 'Oct', capital: 2000000, profit: 17800000 },
    { month: 'Nov', capital: 22500000, profit: 8500000 },
    { month: 'Dec', capital: 2000000, profit: 9200000 },
];

// Format numbers as ₦Xk
const formatCurrency = (value: number) => {
    if (value >= 1000000) {
        return `₦${(value / 1000000).toFixed(1)}M`;
    }
    return `₦${(value / 1000).toFixed(0)}k`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
                <p className="font-semibold">{label}</p>
                <p className="text-[#2D9CDB]">
                    Capital: {formatCurrency(payload[0].value)}
                </p>
                <p className="text-[#00B69B]">
                    Profit: {formatCurrency(payload[1].value)}
                </p>
            </div>
        );
    }
    return null;
};

export const LoanChart = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <p className="text-xl font-semibold">Revenue</p>
                <div className="flex gap-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#2D9CDB] mr-2"></div>
                        <span className="text-sm">Capital</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#00B69B] mr-2"></div>
                        <span className="text-sm">Profit</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2D9CDB" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#2D9CDB" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00B69B" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#00B69B" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={value => formatCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => (
                        <span className="text-xs">
                            {value === 'capital' ? 'Capital' : 'Profit'}
                        </span>
                    )} />
                    <ReferenceLine y={0} stroke="#000" />

                    <Area
                        type="monotone"
                        dataKey="capital"
                        stroke="#2D9CDB"
                        fillOpacity={1}
                        fill="url(#colorCapital)"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#00B69B"
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};