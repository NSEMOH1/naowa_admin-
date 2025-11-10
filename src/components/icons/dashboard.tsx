import dashboardIcon from "../../assets/dashboard.svg";

export const DashboardIcon = ({ className }: { className?: string }) => (
    <img className={className} src={dashboardIcon} alt="Dashboard" />
);