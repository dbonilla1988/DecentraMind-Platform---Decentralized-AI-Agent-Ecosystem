import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

interface Notification {
    id: string;
    type: 'bid' | 'sale' | 'auction' | 'info';
    message: string;
    timestamp: Date;
    read: boolean;
}

const NotificationBell = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    background: 'rgba(10, 10, 31, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0,255,255,0.1)',
    '&:hover': {
        background: 'rgba(0,255,255,0.1)',
    }
}));

const NotificationPanel = styled(Box)(({ theme }) => ({
    position: 'fixed',
    right: theme.spacing(3),
    bottom: theme.spacing(12),
    width: 300,
    maxHeight: 400,
    overflowY: 'auto',
    background: 'rgba(10, 10, 31, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(0,255,255,0.1)',
    padding: theme.spacing(2),
}));

export const NotificationContext = React.createContext<{
    addNotification: (message: string, type: 'bid' | 'sale' | 'auction' | 'info') => void;
}>({
    addNotification: () => { },
});

export const NotificationSystem: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPanel, setShowPanel] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

    const addNotification = (message: string, type: 'bid' | 'sale' | 'auction' | 'info') => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            type,
            message,
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
        setCurrentNotification(newNotification);
    };

    return (
        <>
            <NotificationBell
                onClick={() => setShowPanel(!showPanel)}
                sx={{ color: '#00ffff' }}
            >
                <NotificationsIcon />
                {notifications.filter(n => !n.read).length > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: '#ff0000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                        }}
                    >
                        {notifications.filter(n => !n.read).length}
                    </Box>
                )}
            </NotificationBell>

            {showPanel && (
                <NotificationPanel>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ color: '#fff' }}>Notifications</Typography>
                        <IconButton
                            size="small"
                            onClick={() => setShowPanel(false)}
                            sx={{ color: '#fff' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {notifications.map(notification => (
                        <Box
                            key={notification.id}
                            sx={{
                                p: 1,
                                mb: 1,
                                borderRadius: 1,
                                background: notification.read ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,255,0.1)',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setNotifications(prev =>
                                    prev.map(n =>
                                        n.id === notification.id ? { ...n, read: true } : n
                                    )
                                );
                            }}
                        >
                            <Typography sx={{ color: '#fff' }}>
                                {notification.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                {notification.timestamp.toLocaleTimeString()}
                            </Typography>
                        </Box>
                    ))}
                </NotificationPanel>
            )}

            <Snackbar
                open={!!currentNotification}
                autoHideDuration={6000}
                onClose={() => setCurrentNotification(null)}
            >
                <Alert
                    severity={
                        currentNotification?.type === 'sale' ? 'success' :
                            currentNotification?.type === 'bid' ? 'info' :
                                currentNotification?.type === 'auction' ? 'warning' : 'info'
                    }
                    sx={{ width: '100%' }}
                >
                    {currentNotification?.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default NotificationSystem; 