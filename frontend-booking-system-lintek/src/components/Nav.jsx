import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Button } from '@mui/material'
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
