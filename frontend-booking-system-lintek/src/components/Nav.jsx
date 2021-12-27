import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import green from '@material-ui/core/colors/green'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../App'

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        color: 'black',
    },
}))

import heart from '../images/LinTek_hjarta.png'
import { Button, Menu, MenuItem } from '@mui/material'

export default function Nav() {
    const classes = useStyles()
    return (
        <React.Fragment>
            <AppBar style={{ backgroundColor: '#eeeeee' }}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Bokningsystem
                    </Typography>
                    <div>
                        <Button color="secondary" size="large">
                            Logga ut
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </React.Fragment>
    )
}
