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

export default function Nav() {
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
            sx={{ cursor: 'pointer', color: 'black' }}
          >
            Bokningsplanering
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center'
            }}
          >
            <Button onClick={() => navigate('/overview')}>Översikt</Button>
            <Button
              target="_blank"
              href="https://www.linkoping.se/contentassets/a932eff8fb1d46ab9ccf9d24322626c6/lkpg_tradgardsforeningen_folder_kartbild.pdf?49b5ff"
            >
              Karta Trädgårsföreningen
            </Button>
          </Box>
          <Box>
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
