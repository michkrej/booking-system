import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import lintek from '../images/lintek.png'

export default function Footer() {
    return (
        <Box
            id="footer"
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 5,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
                width: '100%',
            }}
        >
            <Container
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <img src={lintek} style={{ width: '30%' }} />
                <Typography variant="body1" pt={1}>
                    Skapad av Michelle Krejci
                </Typography>
            </Container>
        </Box>
    )
}
