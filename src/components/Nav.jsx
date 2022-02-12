import { makeStyles } from '@mui/styles'
import { Button, AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import useLogout from '../hooks/useLogout'

import heart from '../images/LinTek_hjarta.png'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
    color: 'black'
  },
  background: {
    backgroundColor: '#eeeeee'
  }
})

export default function Nav() {
  const { logout } = useLogout()
  const navigate = useNavigate()
  const classes = useStyles()

  return (
    <>
      <AppBar className={classes.background}>
        <Toolbar>
          <img src={heart} style={{ width: '40px', marginRight: '1em' }} />
          <Typography variant="h6" className={classes.title}>
            Bokningssystem
          </Typography>
          <Box>
            <Button onClick={() => navigate('/overview')}>Översikt</Button>
            <IconButton size="large" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  )
}
