import { useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Box, Typography, Paper, Grid, Divider } from '@mui/material'
import SelectInput from './SelectInput'
import SearchIcon from '@mui/icons-material/Search'

const CollisionsOverview = ({ plans }) => {
    const [startCollision, setStartCollison] = useState('')
    const [endCollision, setEndCollision] = useState('')

    const handleStartCollison = (option) => {
        setStartCollison(option)
    }
    const handleEndCollision = (option) => {
        setEndCollision(option)
    }
    return (
        <Paper sx={{ padding: 2, marginTop: 2 }}>
            <Box>
                <Typography variant="h6">Hitta krockar</Typography>
                <Divider />
                <Box component="form">
                    <Grid container spacing={2}>
                        <Grid item xs={12} mt={2}>
                            <SelectInput
                                options={plans}
                                handleChange={handleStartCollison}
                                placeholder="Din plan"
                                value={startCollision}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SelectInput
                                options={plans}
                                handleChange={handleEndCollision}
                                placeholder="Publika planer"
                                value={endCollision}
                                multiple={true}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        startIcon={<SearchIcon />}
                    >
                        Hitta
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}

CollisionsOverview.propTypes = { plans: PropTypes.array }

export default CollisionsOverview
