import React from 'react'
import { Link } from 'react-router-dom'
import "./Main.css"

function Main() {
  return (
    <div className='row'>
        <div className="col-6 first">
            <h1 className='ms-5 mt-5' style={{fontWeight:'700',fontSize:'35px'}}>Headline</h1>
            <h5 className='ms-5 mt-3' style={{color:'#9A9A9A'}}>Sample Text</h5>
            <p className='ms-5 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis voluptate quidem illum eos vero nostrum enim beatae ipsum nemo! Quibusdam, officia magni quis provident expedita laboriosam rem facilis praesentium fugiat amet consectetur deleniti corporis? Iste nemo, necessitatibus aperiam velit ullam vel quam neque laudantium excepturi molestias blanditiis soluta nobis voluptatum dolor assumenda debitis, rerum vero illo praesentium deserunt repudiandae. Tenetur earum velit fugit omnis. Assumenda fugit ducimus ipsum accusamus necessitatibus sapiente quis pariatur veniam repudiandae expedita alias, illum ab excepturi.</p>
           <Link to="/login"> <button type="button" className="btn button ms-5">  Get Started</button></Link>
        </div>
        <div className="col-6 second">
            <img src="Bank.jpg" className='bank' alt="" />
        </div>
    </div>
  )
}

export default Main