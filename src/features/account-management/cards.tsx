import { Card, CardBody } from "@chakra-ui/react";
import { TrendingUpDownIcon, User, Wifi, FolderSync } from "lucide-react";
import { useUsersData } from "../../hooks/useUser";
import { useMembersData } from "../../hooks/useMember";
import { useEffect } from "react";

interface AdminUserCardsProps {
    onAddAdmin?: () => void;
    onCreateAccountClick?: () => void;
}

export default function AccountManagementCards({
    onAddAdmin,
    onCreateAccountClick
}: AdminUserCardsProps) {
    const { users, loading: usersLoading, loadUsers } = useUsersData();
    const { members, loadMembers } = useMembersData()

    useEffect(() => {
        loadMembers(),
            loadUsers()
    }, [])

    const totalAdmins = users.filter(user =>
        ['ADMIN', 'SUPER_ADMIN'].includes(user.role)
    ).length;

    const activeAdmins = users.filter(user =>
        ['ADMIN', 'SUPER_ADMIN'].includes(user.role) &&
        user.status === 'ACTIVE'
    ).length;


    const accountManagementCards = [
        {
            id: 1,
            title: "Total Number of Admins",
            icon: User,
            count: usersLoading ? "..." : totalAdmins.toString(),
            color: "#8280FF",
            percentage: "0%",
        },
        {
            id: 2,
            title: "Active Admins",
            icon: Wifi,
            count: usersLoading ? "..." : activeAdmins.toString(),
            color: "#FEC53D",
            percentage: "0%",
        },
        {
            id: 3,
            title: "+ Add Admin",
            icon: FolderSync,
            color: "#00B69B",
        },
        {
            id: 4,
            title: "+ Create Account",
            icon: FolderSync,
            color: "#00B69B",
        },
        {
            id: 5,
            title: "Total Number of Accounts",
            icon: User,
            count: members.length,
            color: "#8280FF",
        },
    ];

    const isSpecialCard = (id: number) => [3, 4].includes(id);

    const handleCardClick = (id: number) => {
        if (id === 3 && onAddAdmin) {
            onAddAdmin();
        } else if (id === 4 && onCreateAccountClick) {
            onCreateAccountClick();
        }
    };

    if (usersLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {[1, 2, 3, 4, 5].map((id) => (
                    <Card key={id}>
                        <CardBody>
                            <div className="animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                                {!isSpecialCard(id) && (
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {accountManagementCards.map((data, index) => {
                const specialCard = isSpecialCard(data.id);

                return (
                    <Card
                        key={index}
                        className={`w-full ${specialCard ? 'special-card cursor-pointer' : ''}`}
                        borderColor="gray.200"
                        onClick={() => specialCard && handleCardClick(data.id)}
                        _hover={specialCard ? { transform: 'translateY(-2px)', shadow: 'md' } : undefined}
                    >
                        <CardBody>
                            <div className="flex justify-between items-center gap-6">
                                <div>
                                    <p className={`text-sm ${specialCard ? 'text-xl font-bold text-[#00B69B]' : 'text-gray-600'}`}>
                                        {data.title}
                                    </p>
                                    <p className={`text-2xl font-bold ${specialCard ? 'text-blue-600' : ''}`}>
                                        {data.count}
                                    </p>
                                </div>
                                <div
                                    className={`p-2 rounded-full ${specialCard ? 'p-3' : ''}`}
                                    style={{ background: data.color }}
                                >
                                    <data.icon size={specialCard ? 24 : 20} color="white" />
                                </div>
                            </div>
                            {specialCard ? (
                                <p className="pt-4 text-xs">
                                    {data.id === 3
                                        ? "Help customers with complaints and questions"
                                        : "Manage account settings and configurations"}
                                </p>
                            ) : (
                                <p className="flex items-center gap-2 pt-4 text-sm text-gray-500">
                                    <TrendingUpDownIcon
                                        size={16}
                                        color="#38A169"
                                    />
                                    <span>{data.percentage} Up from yesterday</span>
                                </p>
                            )}
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}