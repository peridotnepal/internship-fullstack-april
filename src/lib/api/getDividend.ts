import axios from "axios"

export const getDividend = async (payload: string) => {
    try {
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_POST_API}`, {
            period: payload
        }, {
            headers:{
                Permission: process.env.NEXT_PUBLIC_PERMISSION
            }
        })

        // console.log(data?.data)

        return (data?.data) ? data?.data : []
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error)
            return []
        }
        return []
    }
}