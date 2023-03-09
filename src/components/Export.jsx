import { useState, useRef, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import SelectInput from './SelectInput'
import GetAppIcon from '@mui/icons-material/GetApp'
import usePlansContext from '../hooks/usePlansContext'
import { exportPlan } from '../utils/helpers'
import { CSVLink } from 'react-csv'
import { LoadingButton } from '@mui/lab'
import moment from 'moment'
import OverviewBlock from './OverviewBlock'

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
    <OverviewBlock title="Export">
      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12}>
          <SelectInput
            options={createOptionsArray()}
            placeholder="Planering"
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
    </OverviewBlock>
  )
}

export default Export
