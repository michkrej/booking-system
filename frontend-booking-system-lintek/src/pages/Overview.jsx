import React, { useState } from 'react'
import {
    Avatar,
    Button,
    TextField,
    Box,
    Typography,
    Container,
    Grid,
    Link,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
    Switch,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Nav from '../components/Nav'
import SelectInput from '../components/SelectInput'

const plans = [
    {
        value: 1,
        label: 'Normal-p',
    },
    {
        value: 2,
        label: 'Covid-p',
    },
]

const Overview = () => {
    const [checked, setChecked] = useState([])
    const [startCollision, setStartCollison] = useState('')
    const [endCollision, setEndCollision] = useState('')

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
    }

    const handleStartCollison = (option) => {
        setStartCollison(option)
    }
    const handleEndCollision = (option) => {
        setEndCollision(option)
    }

    return (
        <Container>
            <Nav />
            <Box mt={8}>
                <Grid container maxWidth="xs" spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Paper sx={{ padding: 2 }}>
                            <Box>
                                <Typography variant="h5">
                                    Planeringar
                                </Typography>
                                <List>
                                    {plans.map((plan) => {
                                        return (
                                            <ListItem
                                                key={plan.value}
                                                secondaryAction={
                                                    <>
                                                        <Switch
                                                            edge="end"
                                                            onChange={handleToggle(
                                                                plan.value
                                                            )}
                                                            checked={
                                                                checked.indexOf(
                                                                    plan.value
                                                                ) !== -1
                                                            }
                                                        />
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </>
                                                }
                                            >
                                                <ListItemText>
                                                    {plan.label}
                                                </ListItemText>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Box>
                        </Paper>
                        <Paper sx={{ padding: 2, marginTop: 2 }}>
                            <Box>
                                <Typography variant="h5">
                                    Hitta krockar
                                </Typography>
                                <Box component="form">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} mt={2}>
                                            <SelectInput
                                                options={plans}
                                                handleChange={
                                                    handleStartCollison
                                                }
                                                placeholder="Din plan"
                                                value={startCollision}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SelectInput
                                                options={plans}
                                                handleChange={
                                                    handleEndCollision
                                                }
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
                                    >
                                        Hitta
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h5">Exportera</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Overview
