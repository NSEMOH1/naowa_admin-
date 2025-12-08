import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";

interface Bank {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  banks: Bank[];
  value: string;
  onChange: (bankName: string, bankCode: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  loading?: boolean;
  error?: string | null;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  banks,
  value,
  onChange,
  label,
  placeholder = "Search bank...",
  required = false,
  loading = false,
  error = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [visibleCount, setVisibleCount] = useState(50);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredBanks = useMemo(() => {
    if (!searchTerm.trim()) {
      return banks.slice(0, visibleCount);
    }
    const term = searchTerm.toLowerCase();
    return banks
      .filter((bank) => bank.label.toLowerCase().includes(term))
      .slice(0, visibleCount);
  }, [banks, searchTerm, visibleCount]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

    if (bottom && visibleCount < filteredBanks.length) {
      setVisibleCount((prev) => Math.min(prev + 50, banks.length));
    }
  };

  const handleSelect = (bank: Bank) => {
    setDisplayValue(bank.label);
    setSearchTerm("");
    setIsOpen(false);
    setVisibleCount(50);
    onChange(bank.label, bank.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setDisplayValue(value);
    setIsOpen(true);
    setVisibleCount(50);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        if (value) {
          setDisplayValue(value);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  if (loading) {
    return (
      <FormControl>
        <FormLabel fontSize={13}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </FormLabel>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          p={2}
          bg="white"
          borderRadius="md"
        >
          <Spinner size="sm" />
          <Text fontSize={13}>Loading banks...</Text>
        </Box>
      </FormControl>
    );
  }

  if (error) {
    return (
      <FormControl>
        <FormLabel fontSize={13}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </FormLabel>
        <Box p={2} bg="white" borderRadius="md">
          <Text fontSize={13} color="red.500">
            {error}
          </Text>
        </Box>
      </FormControl>
    );
  }

  return (
    <FormControl position="relative">
      <FormLabel fontSize={13}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        fontSize={13}
        bg="white"
        autoComplete="off"
      />
      {isOpen && filteredBanks.length > 0 && (
        <Box
          ref={listRef}
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          mt={1}
          maxH="300px"
          overflowY="auto"
          zIndex={1000}
          boxShadow="lg"
          onScroll={handleScroll}
        >
          <List>
            {filteredBanks.map((bank) => (
              <ListItem
                p={3}
                cursor="pointer"
                fontSize={13}
                _hover={{ bg: "gray.100" }}
                onClick={() => handleSelect(bank)}
                borderBottom="1px solid"
                borderColor="gray.100"
              >
                {bank.label}
              </ListItem>
            ))}
            {visibleCount < banks.length && !searchTerm && (
              <ListItem p={2} textAlign="center" fontSize={12} color="gray.500">
                Scroll for more...
              </ListItem>
            )}
          </List>
        </Box>
      )}
      {isOpen && filteredBanks.length === 0 && searchTerm && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          mt={1}
          p={3}
          zIndex={1000}
          boxShadow="lg"
        >
          <Text fontSize={13} color="gray.500">
            No banks found
          </Text>
        </Box>
      )}
    </FormControl>
  );
};
