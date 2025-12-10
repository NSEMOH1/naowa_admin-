import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import AccountManagementCards from "../../features/account-management/cards";
import AdminUserForm from "../../features/account-management/form";

const AccountManagement = () => {
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isAddAdmin, setIsAddAdmin] = useState(false);

  const handleAddAdmin = () => {
    setIsAddAdmin(true);
  };

  const handleCreateAccountClick = () => {
    setIsCreateAccountOpen(true);
  };

  const closeCreateAccountModal = () => {
    setIsCreateAccountOpen(false);
  };

  if (isAddAdmin) {
    return <AdminUserForm />;
  }

  return (
    <div>
      <AccountManagementCards
        onAddAdmin={handleAddAdmin}
        onCreateAccountClick={handleCreateAccountClick}
      />

      <Modal isOpen={isCreateAccountOpen} onClose={closeCreateAccountModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Account Management</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col gap-4">
            <FormControl>
              <FormLabel>Management Account Name</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Management Account Number</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Account Description</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Account Type</FormLabel>
              <Select>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Account Balance</FormLabel>
              <Input type="text" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={closeCreateAccountModal}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={closeCreateAccountModal}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AccountManagement;
