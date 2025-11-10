import { Avatar, Badge, Card, CardBody } from "@chakra-ui/react";
import DataTable from "../../components/table";
import { useEffect, useState } from "react";
import { LibraryBig, TrendingUpDownIcon } from "lucide-react";
import { fetchSavings } from "../../api/savings";
import type { Savings, SavingsResponse } from "../../lib/types";
import Loader from "../../components/loader";

interface FormattedSavings {
  id: string | number;
  name: string;
  serviceNumber: string;
  email: string;
  phone: string;
  savingsType: string;
  amount: number;
}

const Savings = () => {
  const [savings, setSavings] = useState<FormattedSavings[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSavings = async () => {
      try {
        const response: SavingsResponse = await fetchSavings();

        const formattedSavings = response.savings.map((saving: Savings) => ({
          id: saving.id,
          name:
            `${saving.member?.first_name || ""} ${
              saving.member?.last_name || ""
            }`.trim() || "N/A",
          serviceNumber: saving.reference || "N/A",
          email: saving.member?.email || "N/A",
          phone: saving.member?.phone || "N/A",
          savingsType: saving.category?.name || "Normal",
          amount: parseFloat(saving.amount) || 0,
        }));

        setSavings(formattedSavings);
        setTotalAmount(response.total || 0);
      } catch (error) {
        console.error("Error fetching savings:", error);
        setError("Failed to load savings.");
      } finally {
        setLoading(false);
      }
    };

    loadSavings();
  }, []);

  if (loading)
    return (
      <p>
        <Loader />
      </p>
    );
  if (error) return <p>{error}</p>;

  const savingsColumns = [
    {
      title: "Name",
      dataIndex: "name" as const,
      key: "name",
      render: (name: string) => (
        <span className="flex items-center gap-2 font-medium">
          <Avatar name={name} size="sm" /> {name}
        </span>
      ),
    },
    {
      title: "Service Number",
      dataIndex: "serviceNumber" as const,
      key: "serviceNumber",
    },
    {
      title: "Email",
      dataIndex: "email" as const,
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone" as const,
      key: "phone",
    },
    {
      title: "Savings Type",
      dataIndex: "savingsType" as const,
      key: "savingsType",
      render: (type: string) => (
        <Badge
          colorScheme={type === "Normal" ? "blue" : "green"}
          px={3}
          py={1}
          borderRadius="full"
        >
          {type}
        </Badge>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount" as const,
      key: "amount",
      render: (amount: number) => (
        <span className="font-semibold">₦{amount.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="mt-10">
      <Card className="w-[300px] transition-all mb-10 duration-300 ease-in-out hover:border-black hover:border-2 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        <CardBody className="shadow-lg">
          <div className="flex justify-between items-center gap-6">
            <div>
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold">
                ₦{totalAmount.toLocaleString()}
              </p>
            </div>
            <div
              className="p-2 rounded-lg transition-transform duration-300 hover:scale-110"
              style={{ background: "#9F7AEA" }}
            >
              <LibraryBig size={20} color="white" />
            </div>
          </div>
          <p className="flex items-center gap-2 pt-4 text-sm text-gray-500">
            <TrendingUpDownIcon size={16} color="#38A169" />
            <p>from yesterday</p>
          </p>
        </CardBody>
      </Card>
      <DataTable
        data={savings}
        columns={savingsColumns}
        rowKey="id"
        tableHeaderBg="#F1F4F9"
        tableHeaderColor="black"
      />
    </div>
  );
};

export default Savings;
