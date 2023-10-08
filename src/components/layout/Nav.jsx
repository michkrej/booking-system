import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'

import useLogout from '../../hooks/user/useLogout'
import { pages } from '../../CONSTANTS'

export default function Nav() {
  const { logout } = useLogout()
  const navigate = useNavigate()

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
        }}
      >
        <Toolbar>
          <img src={'./assets/LUST.png'} style={{ width: '120px', marginRight: '1em' }} />
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
              paddingLeft: 8
            }}
          >
            {pages.map(({ url, name }) => (
              <Button key={name} onClick={() => navigate(`/${url}`)}>
                {name}
              </Button>
            ))}
            <Button
              target="_blank"
              href="https://www.linkoping.se/contentassets/a932eff8fb1d46ab9ccf9d24322626c6/lkpg_tradgardsforeningen_folder_kartbild.pdf?49b5ff"
            >
              Karta Trädgårdsföreningen
            </Button>
          </Box>
          <Button target="_blank" href="https://youtu.be/9RDlhOWRlGY">
            Instruktionsvideo
          </Button>
          <Button target="_blank" href="https://forms.gle/tW28rpuNSWfQHNCq5">
            Feedback
          </Button>
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
