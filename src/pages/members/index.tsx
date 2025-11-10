import EmployeesTable from '../../features/employees';

const Employees = () => {
    return (
        <div>
            <div className='flex justify-between items-center'>
                <p className='text-2xl font-bold'>Members</p>
            </div>
            <EmployeesTable />
        </div>
    )
}

export default Employees