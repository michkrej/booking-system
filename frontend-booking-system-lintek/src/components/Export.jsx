import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material'
import SelectInput from './SelectInput'
import GetAppIcon from '@mui/icons-material/GetApp'

const Export = ({ plans }) => {
  const [checked, setChecked] = useState(false)
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6">Export</Typography>
      <Divider />
      <Box component="form" mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput options={plans} placeholder="Dina planer" multiple />
          </Grid>
          {checked && (
            <Grid item xs={12}>
              <SelectInput options={plans} placeholder="Publika planer" multiple />
            </Grid>
          )}
        </Grid>
        <FormControlLabel
          label="Jag vill exportera krockar"
          control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
          sx={{ marginTop: 1 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
          startIcon={<GetAppIcon />}
        >
          Exportera
        </Button>
      </Box>
    </Paper>
  )
}

Export.propTypes = {
  plans: PropTypes.array.isRequired
}

export default Export
