import transactionIcon from "../../assets/transaction.svg";

export const TransactionIcon = ({ className }: { className?: string }) => (
    <img className={className} src={transactionIcon} alt="Transaction" />
);