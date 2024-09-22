import React, { useState } from 'react'

const usefetch = (cb,options={}) => {
    const [data,setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading,setLoading] = useState(null);
    // console.log("options: ",options)

    const fn = async (...args) => {
        
        setLoading(true);
        setError(null);

        try {
            const response = await cb(options,...args);           
            setData(response);
        } catch (error) {
            setError(error)
        } finally{
            setLoading(false);
        }
    }
    return {
        data,
        loading,
        error,
        fn
    }

}

export default usefetch
