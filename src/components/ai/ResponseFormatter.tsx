import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

interface ResponseFormatterProps {
    agentId: string;
    response: {
        text: string;
        confidence: number;
        timestamp: string;
    };
    color: string;
}

const ResponseFormatter = ({ agentId, response, color }: ResponseFormatterProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    mt: 2,
                    borderLeft: `4px solid ${color}`,
                    backgroundColor: 'background.paper'
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                    >
                        {response.timestamp}
                    </Typography>
                    <Typography variant="body1">
                        {response.text}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Confidence:
                    </Typography>
                    <Box sx={{ flex: 1, mx: 1, bgcolor: 'background.default' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${response.confidence}%` }}
                            style={{
                                height: 4,
                                backgroundColor: color,
                                borderRadius: 2
                            }}
                        />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {Math.round(response.confidence)}%
                    </Typography>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default ResponseFormatter; 