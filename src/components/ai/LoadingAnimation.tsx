import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            p: 2
        }}>
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity
                }}
            >
                <CircularProgress size={24} />
            </motion.div>
            <Typography
                variant="caption"
                sx={{ mt: 1 }}
            >
                Processing query...
            </Typography>
        </Box>
    );
};

export default LoadingAnimation; 