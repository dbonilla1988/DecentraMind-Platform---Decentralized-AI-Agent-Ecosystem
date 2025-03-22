import React from 'react';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import TokenCreator from '../components/TokenCreator';

const TokenCreatorPage = () => {
    return (
        <Layout>
            <Container maxWidth="xl">
                <TokenCreator />
            </Container>
        </Layout>
    );
};

export default TokenCreatorPage; 