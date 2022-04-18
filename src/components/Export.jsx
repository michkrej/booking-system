import { useState, useRef, useEffect } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import SelectInput from './SelectInput'
import GetAppIcon from '@mui/icons-material/GetApp'
import usePlansContext from '../hooks/usePlansContext'
import { exportPlan } from '../utils/helpers'
import { CSVLink } from 'react-csv'

const Export = () => {
  const [checked, setChecked] = useState(false)
  const [chosenPlan, setChosenPlan] = useState()
  const [csvData, setCsvData] = useState([])
  const csvInstance = useRef(null)
  const { plans, publicPlans } = usePlansContext()

  useEffect(() => {
    if (csvData && csvInstance && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click()
        setCsvData([])
      })
    }
  }, [csvData])

  const handleChange = (e) => {
    setChosenPlan(e)
  }

  const fetchData = () => {
    exportPlan(chosenPlan).then((response) => setCsvData(response))
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
              options={[...plans, ...publicPlans]}
              placeholder="Plan"
              handleChange={handleChange}
              value={chosenPlan}
            />
          </Grid>
          {checked && (
            <Grid item xs={12}>
              <SelectInput options={publicPlans} placeholder="Publika planer" multiple />
            </Grid>
          )}
        </Grid>
        {/*         <FormControlLabel
          label="Jag vill exportera krockar"
          control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
          sx={{ marginTop: 1 }}
        /> */}
        <div
          onClick={() => {
            fetchData()
          }}
        >
          <Button fullWidth variant="contained" sx={{ mt: 1 }} startIcon={<GetAppIcon />}>
            Exportera
          </Button>
        </div>
        {csvData.length > 0 ? (
          <CSVLink data={csvData} filename={chosenPlan.label || 'export.csv'} ref={csvInstance} />
        ) : undefined}
      </Box>
    </Paper>
  )
}

export default Export
