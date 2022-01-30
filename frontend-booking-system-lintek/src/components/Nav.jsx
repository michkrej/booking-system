import { Fragment } from 'react'
import { makeStyles } from '@mui/styles'
import { Button, AppBar, Toolbar, Typography, Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import heart from '../images/LinTek_hjarta.png'

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    color: 'black'
  },
  background: {
    backgroundColor: '#eeeeee'
  }
}))

export default function Nav() {
  const classes = useStyles()
  let navigate = useNavigate()
  return (
    <Fragment>
      <AppBar className={classes.background}>
        <Toolbar>
          <img src={heart} style={{ width: '40px' }} />

          <Typography variant="h6" className={classes.title} ml={2}>
            LinTeks system för bokningsplanering
          </Typography>
          <div>
            <Button color="secondary" size="large" onClick={() => navigate('/')}>
              Logga ut
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Fragment>
  )
}
