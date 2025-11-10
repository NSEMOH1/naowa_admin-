import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import { CheckCircle, XCircle } from "lucide-react";

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: "success" | "error";
    title: string;
    message: string;
}

export default function ActionModal({
    isOpen,
    onClose,
    status,
    title,
    message
}: ActionModalProps) {
    const iconColor = useColorModeValue(
        status === "success" ? "green" : "red",
        status === "success" ? "green" : "red"
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody className="flex flex-col items-center p-6">
                    {status === "success" ? (
                        <CheckCircle size={48} color={iconColor} />
                    ) : (
                        <XCircle size={48} color={iconColor} />
                    )}
                    <Text mt={4} textAlign="center">{message}</Text>
                    <Button
                        colorScheme={status === "success" ? "green" : "red"}
                        mt={6}
                        onClick={onClose}
                        mb={6}
                    >
                        Close
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}