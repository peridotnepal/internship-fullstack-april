import Navbar from '@/components/Navbar'
import FuelPriceDownloader from '@/components/petroliumDownload'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
       <FuelPriceDownloader />
    </div>
  )
}

export default page
