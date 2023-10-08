import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import { Paper, Tab, Tabs } from '@mui/material'
import { TabContext } from '@mui/lab'
import { motion, AnimatePresence } from 'framer-motion'

import Nav from '../../components/layout/Nav'
import UserPlans from './UserPlans'
import PlanCollisions from './PlanCollisions'
import PublicPlans from './PublicPlans'
import PlanExport from './PlanExport'
import SettingsAdmin from './SettingsAdmin'
import useAuthContext from '../../hooks/context/useAuthContext'
import useGetPlans from '../../hooks/plan/useGetPlans'
import useChangeUsername from '../../hooks/user/useChangeUsername'
import { getActiveYear, getYears } from '../../utils/helpers'
import { committees, kårer } from '../../data/committees'

const item = {
  hidden: { opacity: 0, transiton: { duration: 0.2 } },
  show: { opacity: 1, transiton: { duration: 0.2 } }
}

const Overview = () => {
  const [currentYear, setCurrentYear] = useState(getActiveYear())
  const years = getYears()

  const { user } = useAuthContext()
  const { username, changeUsername } = useChangeUsername()

  const { isPending } = useGetPlans(currentYear)

  const defaultActiveTab = years.findIndex((year) => year === currentYear).toString()
  const [currentTab, setCurrentTab] = useState(defaultActiveTab)

  const handleTabChange = (_, yearIndex) => {
    setCurrentTab(yearIndex.toString())
    setCurrentYear(years[parseInt(yearIndex)])
  }

  const userKår = Object.entries(kårer).find(([_, committees]) => {
    return committees.find((committee) => committee.id === user.committeeId)
  })[0]

  const userIsAdmin = user.admin

  return (
    <Container maxWidth="xl">
      <Nav />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <>
          <Typography variant="h4" align="center" mt={8}>
            Hej {username}
            <Box sx={{ display: 'inline' }}>
              <IconButton size="small" onClick={changeUsername} sx={{ marginBottom: 3 }}>
                <EditIcon fontSize="1" />
              </IconButton>
            </Box>
            ,
            <br /> välkommen till systemet för bokningsplanering!
          </Typography>
          <Typography variant="h6" align="center" mt={2}>
            {userIsAdmin
              ? 'Du är admin!'
              : !userIsAdmin &&
                `Du tillhör kåren ${userKår} och fadderiet ${
                  committees.find((committee) => committee.id === user.committeeId).text
                }`}
          </Typography>
          <Box mt={4}>
            <TabContext value={currentTab}>
              {user.admin && <SettingsAdmin />}
              <Tabs value={currentTab} onChange={handleTabChange}>
                {years.map((year, index) => (
                  <Tab label={year} value={index.toString()} key={year} />
                ))}
              </Tabs>

              <Paper
                elevation={0}
                variant="outlined"
                sx={{ padding: '2rem', minHeight: '60vh', height: '100%' }}
              >
                <AnimatePresence mode="wait">
                  {!isPending ? (
                    <motion.div
                      key="overviewGrid"
                      variants={item}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid item md={6} xs={12}>
                          <UserPlans year={currentYear} />
                          <PlanCollisions year={currentYear} />
                          <PlanExport year={currentYear} />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <PublicPlans year={currentYear} />
                        </Grid>
                      </Grid>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Paper>
            </TabContext>
          </Box>
        </>
      </Box>
    </Container>
  )
}

export default Overview
