import { Box, Text, Input, FormControl, FormLabel } from '@chakra-ui/react';
import { useState } from 'react';

export const SecurityQuestion = () => {
    const [answer, setAnswer] = useState('');

    return (
        <Box>
            <Text fontSize="md" color="gray.600" textAlign="center">
                Answer your security question
            </Text>
            <FormControl fontWeight='light' mt={3}>
                <FormLabel>What is your pet name</FormLabel>
                <Input
                    bg='white'
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                />
            </FormControl>
            <FormControl fontWeight='light' mt={3}>
                <FormLabel>What is your favourite colour</FormLabel>
                <Input
                    bg='white'
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                />
            </FormControl>
        </Box>
    );
};