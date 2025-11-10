import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../lib/routes';

const reports = [
    { name: "Financial Report", value: 0, color: "#1E17DB", bg: "#8280FF", route: routes.reports.financial },
    { name: "IPPIS Report", value: 0, color: "#A6039F", bg: "#FFDDFD", route: routes.reports.ippis },
    { name: "Monthly Deduction Report", value: 0, color: "#FEC53D", bg: "#FFDDFD", route: routes.reports.deduction },
    { name: "Loan Repayment Report", value: 0, color: "#1E17DB", bg: "#8280FF", route: routes.reports.repayment },
    { name: "Dividend Report", value: 0, color: "#A6039F", bg: "#FFDDFD", route: routes.reports.dividend },
    { name: "Interest Report", value: 0, color: "#FEC53D", bg: "#FFDDFD", route: routes.reports.interest },
]

const Report = () => {
    const navigate = useNavigate()
    return (
        <div>
            <p className='font-semibold text-xl'>Report Overview</p>
            <div className='grid grid-cols-3 gap-8 mt-10'>
                {
                    reports.map((data) => (
                        <div className='bg-gray-100 p-4 rounded-lg cursor-pointer' onClick={() => navigate(data.route)}>
                            <div className='flex justify-between'>
                                <p className='font-semibold'>{data.name}</p>
                                <div className='rounded-full p-2' style={{ background: data.bg }}>
                                    <FileText size={15} color={data.color} />
                                </div>
                            </div>
                            <p className='font-bold text-3xl pt-7'>{data.value}</p>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default Report