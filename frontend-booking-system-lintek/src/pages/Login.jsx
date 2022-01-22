import * as React from 'react'
import {
    Avatar,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Container,
} from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

import heart from '../images/LinTek_hjarta.png'

export default function Login() {
    const { loginWithRedirect, user } = useAuth0()
    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        loginWithRedirect()
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        })
    }

    console.log(user)

    return (
        <Container component="div" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'white' }} variant="square">
                    <img src={heart} style={{ width: '100%' }} />
                </Avatar>
                <Typography component="h2" variant="h5">
                    Logga in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
