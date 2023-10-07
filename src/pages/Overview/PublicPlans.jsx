import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePlansContext from '../../hooks/context/usePlansContext'
import { Button, Tab, Tabs } from '@mui/material'
import { formatCollisions } from '../../utils/helpers'
import Comment from '../../components/Comment'
import { committees, kårer } from '../../data/committees'
import OverviewBlock from './OverviewBlock'
import PublicPlanList from './PublicPlansList'
import { TabContext, TabPanel } from '@mui/lab'
import PublicPlanListElement from './PublicPlansListElement'

const PublicPlans = () => {
  const { publicPlans = [] } = usePlansContext()
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState(Object.keys(kårer).length.toString())

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue.toString())
  }

  return (
    <OverviewBlock title={'Publika planeringar'}>
      {publicPlans.length < 0 && (
        <Comment align="center">Här kommer det du att se allas publika planeringar</Comment>
      )}
      <TabContext value={currentTab}>
        <Tabs value={currentTab} onChange={handleChange}>
          <Tab label="Alla" value={Object.keys(kårer).length.toString()} />
          {Object.keys(kårer).map((kår, i) => (
            <Tab key={kår} label={kår} value={i.toString()} />
          ))}
        </Tabs>
        <TabPanel value={Object.keys(kårer).length.toString()}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/allEvents/${formatCollisions(publicPlans)}`)}
          >
            Se samtliga fadderiers planeringar
          </Button>
          {publicPlans.map((plan) => (
            <PublicPlanListElement key={plan.id} plan={plan} kårCommittees={committees} />
          ))}
        </TabPanel>
        {Object.entries(kårer).map(([kår, committees], i) => (
          <TabPanel key={kår} value={i.toString()}>
            <PublicPlanList key={kår} kår={kår} kårCommittees={committees} plans={publicPlans} />
          </TabPanel>
        ))}
      </TabContext>
    </OverviewBlock>
  )
}

export default PublicPlans
