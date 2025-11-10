import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const LoanBalanceDashboard = () => {
    const data = [
        { name: 'Regular Loan', value: 500000, percentage: 30, color: '#20B2AA' },
        { name: 'Commodity Loan', value: 63000, percentage: 43, color: '#FF69B4' },
        { name: 'Housing Loan', value: 400000, percentage: 52, color: '#FFA500' },
        { name: 'Emergency Loan', value: 100000, percentage: 32, color: '#9370DB' }
    ];

    const totalBalance = data.reduce((sum, item) => sum + item.value, 0);

    const renderCustomizedLabel = () => {
        return (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-8" fontSize="10" fill="#999" fontWeight="400">
                    Total balance
                </tspan>
                <tspan x="50%" dy="18" fontSize="14" fill="#333" fontWeight="600">
                    ₦{totalBalance.toLocaleString()}
                </tspan>
            </text>
        );
    };

    return (
        <div className="bg-[#F2F7FA] rounded-lg border border-gray-200 p-6 max-w-sm mx-auto shadow-sm">
            <div className="relative mb-6">
                <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={450}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        {renderCustomizedLabel()}
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 pointer-events-none">
                    {/* These would need to be positioned manually based on your exact requirements */}
                    <div className="absolute top-6 left-8 text-xs font-medium">40%</div>
                    <div className="absolute top-6 right-8 text-xs font-medium">47%</div>
                    <div className="absolute bottom-12 left-6 text-xs font-medium">23%</div>
                    <div className="absolute bottom-12 right-6 text-xs font-medium">20%</div>
                </div>
            </div>

            <div className="space-y-4">

                <div className="flex justify-between items-center border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">Status</span>
                    <span className="text-xs font-medium text-gray-500">Amount</span>
                    <span className="text-xs font-medium text-gray-500">%</span>
                </div>

                {data.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2 flex-1">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-xs text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-xs text-gray-700 font-medium min-w-[70px] text-right">
                            {item.value.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-700 font-medium min-w-[35px] text-right">
                            {item.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoanBalanceDashboard;