import React, { useState } from 'react'
import { Container, Grid, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import SelectLocation from '../components/SelectLocation'
import Nav from '../components/Nav'
import Timeline from '../components/Timeline'
import Button from '../components/Button'
import CustomStore from 'devextreme/data/custom_store'
import { firestore } from '../firebase/config'

import { locations } from '../utils/data'

const Item = styled('div')(() => ({
    marginBottom: '1em',
    width: '100%',
}))

const customDataSource = new CustomStore({
    key: 'id',
    load: () => {
        return firestore
            .collection('events')
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    console.log('No events to load')
                } else {
                    let results = []
                    snapshot.docs.forEach((doc) => {
                        results.push({ id: doc.id, ...doc.data() })
                    })
                    return results
                }
            })
    },
    insert: (values) => {},
})

export default function Booking() {
    const [currentLocation, setCurrentLocation] = useState()
    const handleChange = (selectedOption) => {
        setCurrentLocation(selectedOption)
    }
    const handleClick = () => {
        let res = window.prompt('Vad vill du spara detta som?', '')
        console.log(res)
    }

    return (
        <Container maxWidth="false">
            <Nav id="nav" />
            <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={2}>
                    <Stack>
                        <Item>
                            <SelectLocation
                                locations={locations}
                                handleChange={handleChange}
                                current={currentLocation}
                            />
                        </Item>
                        <Item>
                            <Button
                                variant="contained"
                                handleClick={handleClick}
                            >
                                Spara
                            </Button>
                        </Item>
                    </Stack>
                </Grid>
                <Grid item xs={10}>
                    <Timeline
                        currentLocation={currentLocation}
                        store={customDataSource}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}
