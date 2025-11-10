import withdrawalIcon from "../../assets/withdrawal.svg";

export const WithrawalIcon = ({ className }: { className?: string }) => (
    <img className={className} src={withdrawalIcon} alt="withdrawal" />
);