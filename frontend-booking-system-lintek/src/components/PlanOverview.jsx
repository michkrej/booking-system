import { useState } from 'react';
import PropTypes from 'prop-types'
import {
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
    Paper,
    Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const PlanOverview = ({ plans }) => {
    const [checked, setChecked] = useState([])
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
    return (
        <Paper sx={{ padding: 2 }}>
            <Box>
                <Typography variant="h6">Planeringar</Typography>
                <Divider />
                <List>
                    {plans.map((plan) => {
                        return (
                            <ListItem
                                key={plan.value}
                                secondaryAction={
                                    <>
                                        <Checkbox
                                            edge="end"
                                            onChange={handleToggle(plan.value)}
                                            checked={
                                                checked.indexOf(plan.value) !==
                                                -1
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
                                <ListItemText>{plan.label}</ListItemText>
                            </ListItem>
                        )
                    })}
                </List>
                <Button variant="contained" startIcon={<AddIcon />} fullWidth>
                    Skapa ny
                </Button>
            </Box>
        </Paper>
    )
}

PlanOverview.propTypes = {
    plans: PropTypes.array.isRequired,
}

export default PlanOverview
