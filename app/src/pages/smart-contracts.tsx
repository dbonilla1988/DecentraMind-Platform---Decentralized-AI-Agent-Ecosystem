import React from 'react';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import SmartContractsPanel from '../components/SmartContractsPanel';

const SmartContractsPage = () => {
    return (
        <Layout>
            <Container maxWidth="xl">
                <SmartContractsPanel />
            </Container>
        </Layout>
    );
};

export default SmartContractsPage; 