import React from 'react';
import { Container } from '@mui/material';
import Layout from '../components/Layout';
import DecentralizedStorage from '../components/DecentralizedStorage';

const StoragePage = () => {
    return (
        <Layout>
            <Container maxWidth="xl">
                <DecentralizedStorage />
            </Container>
        </Layout>
    );
};

export default StoragePage; 