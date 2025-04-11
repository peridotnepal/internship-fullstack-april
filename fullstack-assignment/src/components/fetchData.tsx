'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FetchData = ({setData}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}`, {
        headers: {
          Permission: `2021D@T@f@RSt6&%2-D@T@`
        }
      });
      if (!response) {
        console.log("no response");
        setError("No response received");
        setLoading(false);
        return;
      }
      setData(response.data.data); // Use the setData function passed from the parent
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error fetching data</p>;
  }

  return null; // This component might not need to render anything itself

};

export default FetchData;