import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import heart from '../images/LinTek_hjarta.png'

export default function Login() {
    const { loginWithRedirect, user, isAuthenticated } = useAuth0()
    let navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        loginWithRedirect()
    }

    React.useEffect(() => {
        console.log(user)
        if (isAuthenticated) {
            console.log(user)
            navigate('/booking')
        }
    }, [isAuthenticated])

    React.useEffect(async () => {
        console.log(user)
        if (isAuthenticated) {
            if (user['https://myapp.example.com/is_new']) {
                console.log("I'm in")
                const result = await axios('http://localhost:4000/hello')
                console.log(result.data)
                let fadderiNamn = prompt('Vilket fadderi tillhör du?', '')
                axios
                    .get('http://localhost:4000/user', {
                        id: user.sub.split('|')[1],
                        fadderi: fadderiNamn,
                    })
                    .then((response) => {
                        console.log(response)
                        navigate('/booking')
                    })
            }
        }
    }, [user])

    return (
        <Container component="div" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'white' }} variant="square">
                    <img src={heart} style={{ width: '100%' }} />
                </Avatar>
                <Typography
                    component="h2"
                    variant="h5"
                    sx={{ mt: 1, textAlign: 'center' }}
                >
                    LinTeks bokningsystem för mottagningen 2022
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1, textAlign: 'center' }}
                >
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Logga in
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
