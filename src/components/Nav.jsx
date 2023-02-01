import LogoutIcon from '@mui/icons-material/Logout'
import useLogout from '../hooks/useLogout'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'

import heart from '../images/LinTek_hjarta.png'
import { useNavigate } from 'react-router-dom'
import useAuthContext from '../hooks/useAuthContext'

export default function Nav() {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const navigate = useNavigate()

  return (
    <>
      <AppBar sx={{ backgroundColor: '#eeeeee' }}>
        <Toolbar>
          <img src={heart} style={{ width: '40px', marginRight: '1em' }} />
          <Typography
            variant="h6"
            onClick={() => navigate('/overview')}
            sx={{ cursor: 'pointer', flexGrow: 1, color: 'black' }}
          >
            Bokningsplanering
          </Typography>
          <Box>
            {user.admin && <Button onClick={() => navigate('/admin')}>Admin</Button>}
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
