import { Badge, Box, useToast } from "@chakra-ui/react";
import type { Member } from "../../lib/types";
import { Logo } from "../../components/icons/logo";
import api from "../../api";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-lg">{value}</p>
  </div>
);

export default function UserDetailsView({ data }: { data: Member }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<Member>();
//   const {
//     isOpen: isAcceptOpen,
//     onOpen: onAcceptOpen,
//     onClose: onAcceptClose,
//   } = useDisclosure();

//   const {
//     isOpen: isRejectOpen,
//     onOpen: onRejectOpen,
//     onClose: onRejectClose,
//   } = useDisclosure();

  const getDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/members/${data.id}`);
      setMember(res.data.user);
    } catch (e) {
      console.error(e);
      toast({ title: "Error getting details", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

//   const handleAccept = async () => {
//     try {
//       await api.get(`/api/members/${data.id}/approve`);
//       toast({ title: "Member Approved Successfully", status: "success" });
//       onAcceptOpen();
//     } catch (err) {
//       let errorMessage = "Approval Failed";
//       if (typeof err === "object" && err !== null && "response" in err) {
//         const response = (err as any).response;
//         if (response && response.data && response.data.message) {
//           errorMessage = response.data.message;
//         }
//       }
//       toast({
//         title: "Error",
//         description: errorMessage,
//         status: "error",
//       });
//     }
//   };

//   const handleReject = async () => {
//     try {
//       await api.get(`/api/members/${data.id}/reject`);
//       toast({ title: "Member Rejected Successfully", status: "success" });
//       onRejectOpen();
//     } catch (err) {
//       let errorMessage = "Rejection Failed";
//       if (typeof err === "object" && err !== null && "response" in err) {
//         const response = (err as any).response;
//         if (response && response.data && response.data.message) {
//           errorMessage = response.data.message;
//         }
//       }
//       toast({
//         title: "Error",
//         description: errorMessage,
//         status: "error",
//       });
//     }
//   };

  if (loading) {
    return <Loader />
  }

  return (
    <Box bg="white" borderRadius="lg" boxShadow="md">
      <div className="bg-[#2D9CDB] text-white p-4 rounded-t-lg">
        <p className="font-semibold">User Details</p>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem label="Full Name" value={`${member?.full_name}`} />
            <DetailItem label="Phone Number" value={member?.phone} />
            <DetailItem label="Occupation" value={member?.occupation} />
            <DetailItem label="Marital Status" value={member?.marital_status} />
            <DetailItem label="Spouse Name" value={member?.spouse_name || "N/A"} />
            <DetailItem label="Place Of Work" value={member?.place_of_work} />
            <DetailItem label="State Of Origin" value={member?.state_of_origin} />
            <DetailItem
              label="Email"
              value={
                <a
                  href={`mailto:${member?.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {member?.email}
                </a>
              }
            />
            <DetailItem
              label="Status"
              value={
                <Badge
                  colorScheme={
                    data.status === "APPROVED"
                      ? "green"
                      : data.status === "PENDING"
                      ? "yellow"
                      : "red"
                  }
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {member?.status}
                </Badge>
              }
            />
          </div>
          <div>
            <Logo />
          </div>
        </div>
      </div>

      {/* <ActionModal
        isOpen={isAcceptOpen}
        onClose={onAcceptClose}
        status="success"
        title="User Approved"
        message={`${data.full_name} has been successfully approved.`}
      />

      <ActionModal
        isOpen={isRejectOpen}
        onClose={onRejectClose}
        status="error"
        title="User Rejected"
        message={`${data.full_name} has been rejected.`}
      /> */}
    </Box>
  );
}
