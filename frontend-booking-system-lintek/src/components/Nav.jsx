import React from 'react'
import { makeStyles } from '@mui/styles'
import { Button, AppBar, Toolbar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        color: 'black',
    },
    background: {
        backgroundColor: '#eeeeee',
    },
}))

export default function Nav() {
    const classes = useStyles()
    let navigate = useNavigate()
    return (
        <React.Fragment>
            <AppBar className={classes.background}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Bokningsystem
                    </Typography>
                    <div>
                        <Button
                            color="secondary"
                            size="large"
                            onClick={() => navigate('/')}
                        >
                            Logga ut
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </React.Fragment>
    )
}
