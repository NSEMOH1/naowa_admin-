import { Card, CardBody } from "@chakra-ui/react";
import {
  TrendingUpDownIcon,
  User,
  Box,
  ChartNoAxesCombined,
  History,
} from "lucide-react";
import { useState, useEffect } from "react";
import { updateDashboardCards } from "./data";
import Loader from "../../components/loader";

interface DashboardCard {
  id: number;
  title: string;
  icon: any;
  count: string;
  color: string;
  percentage: string;
}

export default function DashboardCards() {
  const [cards, setCards] = useState<DashboardCard[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const updatedCards = await updateDashboardCards({
          User,
          Box,
          ChartNoAxesCombined,
          History,
        });
        setCards(updatedCards);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    console.error("Dashboard cards error:", error);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards?.map((data) => (
        <Card
          key={data.id}
          className="w-full transition-all duration-300 ease-in-out hover:border-black hover:border-2 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        >
          <CardBody className="shadow-lg">
            <div className="flex justify-between items-center gap-6">
              <div>
                <p className="text-sm text-gray-600">{data.title}</p>
                <p className="text-2xl font-bold">{data.count}</p>
              </div>
              <div
                className="p-2 rounded-lg transition-transform duration-300 hover:scale-110"
                style={{ background: data.color }}
              >
                <data.icon size={20} color="white" />
              </div>
            </div>
            <p className="flex items-center gap-2 pt-4 text-sm text-gray-500">
              <TrendingUpDownIcon size={16} color="#38A169" />
              <span>{data.percentage} Up from yesterday</span>
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
