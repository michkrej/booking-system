import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import SelectInput from './SelectInput'
import GetAppIcon from '@mui/icons-material/GetApp'
import usePlansContext from '../hooks/usePlansContext'
import { exportPlan } from '../utils/helpers'
import { CSVLink } from 'react-csv'
import { LoadingButton } from '@mui/lab'
import moment from 'moment'

const Export = () => {
  const [chosenPlans, setChosenPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [csvData, setCsvData] = useState([])
  const csvInstance = useRef(null)
  const { plans = [], publicPlans = [] } = usePlansContext()

  useEffect(() => {
    if (csvData && csvInstance && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click()
        setCsvData([])
      })
    }
  }, [csvData])

  const getCSVData = () => {
    setLoading(!loading)
    setError('')
    exportPlan(chosenPlans)
      .then((csv) => {
        setCsvData(csv)
      })
      .catch((err) => {
        setError(err.message)
      })
    setLoading(false)
  }

  const createOptionsArray = () => {
    const userPlanIds = plans.map((plan) => plan.id)
    const filteredPublicPlans = publicPlans.filter(({ id }) => !userPlanIds.includes(id))
    return [...plans, ...filteredPublicPlans]
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
        Export
      </Typography>
      <Divider />
      <Box component="form" mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput
              options={createOptionsArray()}
              placeholder="Plan"
              handleChange={setChosenPlans}
              value={chosenPlans}
              multiple
            />
          </Grid>
        </Grid>
        {error && <div>{error}</div>}
        <LoadingButton
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
          startIcon={<GetAppIcon />}
          disabled={chosenPlans.length === 0}
          loading={loading}
          onClick={getCSVData}
        >
          Exportera
        </LoadingButton>
        {csvData.length > 0 && (
          <CSVLink
            data={csvData}
            filename={`${moment(new Date()).format('DDMMYYYY')}_${chosenPlans
              .map(({ label }) => label)
              .join('_')}`}
            ref={csvInstance}
          />
        )}
      </Box>
    </Paper>
  )
}

export default Export
