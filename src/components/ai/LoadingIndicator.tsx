import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingIndicator = ({ agentName }: { agentName: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2
            }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                    {agentName} is processing...
                </Typography>
            </Box>
        </motion.div>
    );
};

export default LoadingIndicator; 