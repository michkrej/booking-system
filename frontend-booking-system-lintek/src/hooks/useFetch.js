import { useState, useEffect } from 'react'

const useFetch = ({ url }) => {
    const [data, setData] = useState()
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState()

    useEffect(
        (url) => {
            const controller = new AbortController()
            const fetchData = async () => {
                setIsPending(true)

                try {
                    const res = await fetch(url, { signal: controller.signal })
                    if (!res.ok) {
                        throw new Error(res.statusText)
                    }
                    const json = await res.json

                    setData(json)
                    setIsPending(false)
                    setError(undefined)
                } catch (e) {
                    if (e.name === 'AbortError') {
                        console.log('Fetch was aborted')
                    } else {
                        setError('Could not fetch data')
                        console.log(e.message)
                        setIsPending(false)
                    }
                }
            }

            fetchData()

            return () => {
                controller.abort()
            }
        },
        [url]
    )

    return { data, isPending }
}

export default useFetch
