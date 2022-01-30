import { makeStyles } from '@mui/styles'
import { Button, AppBar, Toolbar, Typography, Avatar } from '@mui/material'
import useLogout from '../hooks/useLogout'

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
  const { logout } = useLogout()
  const classes = useStyles()

  return (
    <>
      <AppBar className={classes.background}>
        <Toolbar>
          <img src={heart} style={{ width: '40px' }} />
          <Typography variant="h6" className={classes.title}>
            Bokningsystem
          </Typography>
          <div>
            <Button color="secondary" size="large" onClick={logout}>
              Logga ut
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  )
}
