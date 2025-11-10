import LoanCards from "../../features/loan/cards"
// import { LoanChart } from "../../features/loan/chart"
import LoanTable from "../../features/loan/loanTable"

const Loan = () => {
    return (
        <div className="w-full gap-4 mt-4">
            <LoanCards />
            {/* <div className="mt-6">
                <LoanChart />
            </div> */}
            <LoanTable />
        </div>
    )
}

export default Loan