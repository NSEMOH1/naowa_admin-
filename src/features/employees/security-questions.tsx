import { Box, Text, Select, Input, FormControl, FormLabel, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface SecurityQuestionsProps {
    onSecurityDataChange?: (data: { question: string; answer: string }) => void;
    onValidationChange?: (isValid: boolean) => void;
    initialData?: {
        question: string;
        answer: string;
    };
}

export const SecurityQuestions = ({
    onSecurityDataChange,
    onValidationChange,
    initialData = { question: '', answer: '' },
}: SecurityQuestionsProps) => {
    const [question, setQuestion] = useState(initialData.question);
    const [answer, setAnswer] = useState(initialData.answer);

    const securityQuestionOptions = [
        "What was your first pet's name?",
        "What city were you born in?",
        "What is your mother's maiden name?",
        "What was the name of your first school?",
        "What was your childhood nickname?",
        "What is the name of your favorite childhood friend?"
    ];

    useEffect(() => {
        if (onSecurityDataChange) {
            onSecurityDataChange({ question, answer });
        }
    }, [question, answer, onSecurityDataChange]);


    const handleQuestionChange = (value: string) => {
        setQuestion(value);
    };

    const handleAnswerChange = (value: string) => {
        setAnswer(value);
    };

    return (
        <Box>
            <VStack spacing={4} align="center" mb={6}>
                <Text fontSize="3xl" fontWeight="bold" color="#982323">
                    Security Question
                </Text>
                <Text fontSize="md" color="gray.600" textAlign="center">
                    Please provide a security question and answer
                </Text>
            </VStack>
            <FormControl isRequired mb={4} fontWeight='light'>
                <FormLabel>
                    Select a security question
                    <span style={{ color: 'red' }}>*</span>
                </FormLabel>
                <Select
                    placeholder="Choose one..."
                    value={question}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                    bg='white'
                >
                    {securityQuestionOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <FormControl isRequired fontWeight='light'>
                <FormLabel>
                    Your answer
                    <span style={{ color: 'red' }}>*</span>
                </FormLabel>
                <Input
                    bg='white'
                    type="text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Enter your answer"
                />
            </FormControl>
        </Box>
    );
};