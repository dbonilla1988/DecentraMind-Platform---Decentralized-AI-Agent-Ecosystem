import React, { useState } from 'react';
import { Box, Typography, Paper, LinearProgress, IconButton, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorageIcon from '@mui/icons-material/Storage';

const uploadAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const StorageContainer = styled(Paper)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    border: '1px solid rgba(0, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
}));

const UploadZone = styled(Box)(({ theme }) => ({
    border: '2px dashed rgba(0, 255, 255, 0.3)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        borderColor: '#00ffff',
        background: 'rgba(0, 255, 255, 0.05)',
        '& .MuiSvgIcon-root': {
            animation: `${uploadAnimation} 1s infinite`,
        }
    }
}));

interface StorageFile {
    name: string;
    size: string;
    progress: number;
    status: 'uploading' | 'stored' | 'failed';
}

const DecentralizedStorage: React.FC = () => {
    const [files, setFiles] = useState<StorageFile[]>([
        { name: 'AI_Model_v1.bin', size: '2.3 GB', progress: 100, status: 'stored' },
        { name: 'Training_Data.json', size: '156 MB', progress: 75, status: 'uploading' },
    ]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        // Implement file upload logic
    };

    return (
        <StorageContainer>
            <Typography
                variant="h5"
                sx={{
                    color: '#00ffff',
                    mb: 3,
                    textShadow: '0 0 10px rgba(0,255,255,0.5)'
                }}
            >
                Decentralized Storage
            </Typography>

            <UploadZone
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <CloudUploadIcon
                    sx={{
                        fontSize: 48,
                        color: '#00ffff',
                        mb: 2
                    }}
                />
                <Typography sx={{ color: '#fff' }}>
                    Drag & Drop Files to Upload
                </Typography>
                <Typography variant="caption" sx={{ color: '#fff', opacity: 0.7 }}>
                    or click to select files
                </Typography>
            </UploadZone>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                    Stored Files
                </Typography>
                {files.map((file, index) => (
                    <Box
                        key={index}
                        sx={{
                            background: 'rgba(0,255,255,0.05)',
                            p: 2,
                            borderRadius: 2,
                            mb: 2
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: '#fff' }}>
                                {file.name}
                            </Typography>
                            <Typography sx={{ color: '#fff', opacity: 0.7 }}>
                                {file.size}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={file.progress}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(0,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                                    borderRadius: 4,
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#fff', opacity: 0.7 }}>
                                {file.status.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#00ffff' }}>
                                {`${file.progress}%`}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </StorageContainer>
    );
};

export default DecentralizedStorage; 