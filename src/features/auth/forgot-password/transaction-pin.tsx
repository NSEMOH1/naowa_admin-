import { Box, Text, Input, FormControl  } from '@chakra-ui/react';
import { useState } from 'react';

export const TransactionPin = () => {
    const [pin, setPin] = useState('');

    return (
        <Box>
            <Text fontSize="md" color="gray.600" textAlign="center">
                Enter your transaction pin
            </Text>
            <FormControl fontWeight='light' mt={3}>
                <Input
                    bg='white'
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter your pin"
                />
            </FormControl>
        </Box>
    );
};