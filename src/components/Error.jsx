import React from 'react'

const Error = ({errMessage}) => {
  return (
    <span className='text-sm text-red-400 ml-1'>
      {errMessage}
    </span>
  )
}

export default Error
