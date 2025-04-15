import axios from "axios"

export const getTimePeriod = async () => {
    try {
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_GET_API}`, {
            headers:{
                Permission: process.env.NEXT_PUBLIC_PERMISSION
            }
        })
        console.log(data?.data)
        return (data?.data) ? data?.data : []
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error)
            return []
        }
        return []
    }
}