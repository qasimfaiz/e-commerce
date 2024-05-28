import React from 'react'
import {Link} from "react-router-dom";
import { Button, Result } from 'antd';
export default function ErrorPage() {
  return (
    <div className='mt-5'> 

<Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={ <Button type="primary"><Link to="/" >Back Home</Link></Button>}/>
    </div>
  )
}
