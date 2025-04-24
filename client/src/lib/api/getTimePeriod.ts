import axios from "axios"
interface TimePeriod {
    year: string
}

export const getTimePeriod = async () => {
    try {
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_GET_API}`, {
            headers:{
                Permission: process.env.NEXT_PUBLIC_PERMISSION
            }
        })
        if (data) {
            const formattedPeriod = data?.data.sort((a: TimePeriod, b: TimePeriod) => {
                const yearA = parseInt(a.year.split("/")[0])
                const yearB = parseInt(b.year.split("/")[0])

                return yearB - yearA
            })

            return formattedPeriod
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error)
            return []
        }
        return []
    }
}