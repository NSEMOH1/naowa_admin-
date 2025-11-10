import loanIcon from "../../assets/loan.svg";

export const LoanIcon = ({ className }: { className?: string }) => (
    <img className={className} src={loanIcon} alt="Loan" />
);