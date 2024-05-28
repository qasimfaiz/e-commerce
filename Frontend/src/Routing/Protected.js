import React from 'react'
import { Navigate } from 'react-router-dom'

const  Protected = ({children , user}) => {
  if(!user){
    return <Navigate to='/Login' />
  }
  return children;
};

export default Protected