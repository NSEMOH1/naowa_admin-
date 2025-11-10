import { fetchMembers } from "../../api/members";
import type { DashboardCard } from "../../lib/types";

export const updateDashboardCards = async (icons: {
  User: any;
  Box: any;
  ChartNoAxesCombined: any;
  History: any;
}): Promise<DashboardCard[]> => {
  try {
    const allMembers = await fetchMembers({ limit: 1000 });

    const totalMembers = allMembers.pagination.totalMembers;
    const approvedMembers = allMembers.users.filter(
      (member) => member.status === "APPROVED"
    ).length;
    const rejectedMembers = allMembers.users.filter(
      (member) => member.status === "REJECTED"
    ).length;
    const pendingMembers = allMembers.users.filter(
      (member) => member.status === "PENDING"
    ).length;

    return [
      {
        id: 1,
        title: "Total Members",
        icon: icons.User,
        count: totalMembers.toLocaleString(),
        color: "#8280FF",
        percentage: "8.5%",
      },
      {
        id: 2,
        title: "Approved Members",
        icon: icons.Box,
        count: approvedMembers.toLocaleString(),
        color: "#FEC53D",
        percentage: "1.5%",
      },
      {
        id: 3,
        title: "Rejected Members",
        icon: icons.ChartNoAxesCombined,
        count: rejectedMembers.toLocaleString(),
        color: "#4AD991",
        percentage: "4.3%",
      },
      {
        id: 4,
        title: "Total Pending",
        icon: icons.History,
        count: pendingMembers.toLocaleString(),
        color: "#FF9066",
        percentage: "1.8%",
      },
    ];
  } catch (error) {
    console.error("Error updating dashboard cards:", error);
    // Return original static data as fallback
    return [
      {
        id: 1,
        title: "Total Members",
        icon: icons.User,
        count: "0",
        color: "#8280FF",
        percentage: "8.5%",
      },
      {
        id: 2,
        title: "Approved Members",
        icon: icons.Box,
        count: "0",
        color: "#FEC53D",
        percentage: "1.5%",
      },
      {
        id: 3,
        title: "Rejected Members",
        icon: icons.ChartNoAxesCombined,
        count: "0",
        color: "#4AD991",
        percentage: "4.3%",
      },
      {
        id: 4,
        title: "Total Pending",
        icon: icons.History,
        count: "0",
        color: "#FF9066",
        percentage: "1.8%",
      },
    ];
  }
};
