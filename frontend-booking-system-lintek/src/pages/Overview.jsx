import { useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material'
import Nav from '../components/Nav'
import Export from '../components/Export'
import PlanOverview from '../components/PlanOverview'
import CollisionsOverview from '../components/CollisionsOverview'

const plans = [
    {
        value: 1,
        label: 'Normal-p',
    },
    {
        value: 2,
        label: 'Covid-p',
    },
]

const Overview = () => {
    return (
        <Container>
            <Nav />
            <Typography variant="h4" align="center" mt={8}>
                Hej NAME, <br /> välkommen till systemet för bokningsplanering!
            </Typography>
            <Box mt={6}>
                <Grid container maxWidth="xs" spacing={2}>
                    <Grid item md={6} xs={12}>
                        <PlanOverview plans={plans} />
                        <CollisionsOverview plans={plans} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Export plans={plans} />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Overview
