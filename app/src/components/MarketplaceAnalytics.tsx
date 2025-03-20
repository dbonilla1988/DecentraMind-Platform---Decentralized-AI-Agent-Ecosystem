import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';

const AnalyticsCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    border: '1px solid rgba(0,255,255,0.1)',
}));

interface TradeHistory {
    timestamp: number;
    price: number;
    volume: number;
}

const MarketplaceAnalytics: React.FC = () => {
    const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
    const [marketMetrics, setMarketMetrics] = useState({
        totalVolume: 0,
        averagePrice: 0,
        activeAuctions: 0
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            const newDataPoint = {
                timestamp: Date.now(),
                price: Math.random() * 100 + 50,
                volume: Math.random() * 1000
            };
            setTradeHistory(prev => [...prev.slice(-30), newDataPoint]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
                Market Analytics
            </Typography>
            <Grid container spacing={3}>
                {/* Price Chart */}
                <Grid item xs={12} md={8}>
                    <AnalyticsCard>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                            Price History
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={tradeHistory}>
                                <XAxis
                                    dataKey="timestamp"
                                    tick={{ fill: '#fff' }}
                                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                                />
                                <YAxis tick={{ fill: '#fff' }} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(10, 10, 31, 0.9)',
                                        border: '1px solid rgba(0,255,255,0.3)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#00ffff"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </AnalyticsCard>
                </Grid>

                {/* Market Metrics */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <AnalyticsCard>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TrendingUpIcon sx={{ color: '#00ffff', mr: 1 }} />
                                    <Typography sx={{ color: '#fff' }}>
                                        Total Volume
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ color: '#00ffff' }}>
                                    {marketMetrics.totalVolume.toFixed(2)} SOL
                                </Typography>
                            </AnalyticsCard>
                        </Grid>
                        <Grid item xs={12}>
                            <AnalyticsCard>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <ShowChartIcon sx={{ color: '#00ffff', mr: 1 }} />
                                    <Typography sx={{ color: '#fff' }}>
                                        Average Price
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ color: '#00ffff' }}>
                                    {marketMetrics.averagePrice.toFixed(2)} SOL
                                </Typography>
                            </AnalyticsCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MarketplaceAnalytics; 