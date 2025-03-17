import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

interface ChatHistoryProps {
    agentId: string;
    history: {
        query: string;
        response: {
            text: string;
            confidence: number;
            timestamp: string;
        };
    }[];
    color: string;
}

const ChatHistory = ({ agentId, history, color }: ChatHistoryProps) => {
    return (
        <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
            {history.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Paper
                        elevation={1}
                        sx={{
                            p: 2,
                            mb: 2,
                            bgcolor: 'background.default',
                            borderLeft: `4px solid ${color}`
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" display="block">
                            Query: {item.query}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {item.response.text}
                        </Typography>
                        <Box sx={{
                            mt: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="caption" color="text.secondary">
                                {item.response.timestamp}
                            </Typography>
                            <Typography variant="caption"
                                sx={{
                                    color: color,
                                    fontWeight: 'bold'
                                }}
                            >
                                Confidence: {Math.round(item.response.confidence)}%
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            ))}
        </Box>
    );
};

export default ChatHistory; 