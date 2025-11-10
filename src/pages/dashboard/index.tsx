import DashboardCards from "../../features/dashboard/cards"
import DashboardChart from "../../features/dashboard/chart"
import DashboardTable from "../../features/dashboard/dashboardTable"

const Dashboard = () => {

    return (
        <div className="w-full gap-4 mt-4">
            <DashboardCards />
            <div className="flex w-full gap-4 p-0 m-0">
                <div className="w-[100vw]">
                    <DashboardChart />
                </div>
            </div>
            <DashboardTable />
        </div>
    )
}

export default Dashboard