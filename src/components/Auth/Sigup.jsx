import React, { use, useState } from 'react'
import "./Signup.css"
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { BsFillCartCheckFill,BsPaypal,BsSend,BsClockHistory} from 'react-icons/bs'

function Signup() {
      const [feedback,setFeedback]=useState("")
    const[username, setName]=useState()
    const[email, setEmail]=useState()
    const[password, setPassword]=useState()
    const navigate=useNavigate()

    const handleSubmit=(e)=>{
        e.preventDefault()

        axios.post("https://mpesa-trunsuction-management-system.onrender.com/register",
            {username,email,password}
        )
        .then((res)=>{
          if(res.data==="oky"){
            console.log(res)
             setFeedback("Account created successfully...");

             setTimeout(() => {
         navigate('/login');
        },3000);
          }           
          else {
            setFeedback("Network error ,try again")
                setTimeout(()=>{setFeedback("")},4000)
          
          }         
        })
        
      .catch((error) => {
         if(error.response&& error.response.data){

          const errorMessage=error.response.data.message ||error.response.data;
          setFeedback(errorMessage);

         }else{
          setFeedback("connection error, please try again")
         }
         
         setTimeout(() => { setFeedback("") }, 4000);
    
        });
      
     

    }
  return (
   <>
<div className="sigup-container">

<div className="side-container"  >  
    
    <div className="actions">
  <h2>Fast. Secure. Convenient</h2>

  <p className="action-description">
    Make payments and track your transactions
    securely from one place.
  </p>

  <h4><BsPaypal /> Pay Bills</h4>
  <h4><BsSend /> Send Money</h4>
  <h4><BsFillCartCheckFill /> Buy Goods</h4>
  <h4><BsClockHistory /> View Transaction History</h4>
</div>

</div>

   <div className="form">

    <form   onSubmit={handleSubmit} >
   <div className="form-container">
    <h1>Create account</h1>
  <input
  type="text"
  id="name"
  placeholder="Enter Full Name"
  required
  onChange={(e) => setName(e.target.value)}
/>

<input
  type="email"
  id="email"
  placeholder="Enter Email"
  required
  onChange={(e) => setEmail(e.target.value)}
/>

<input
  type="password"
  id="password"
  placeholder="Enter Password"
  required
  onChange={(e) => setPassword(e.target.value)}
/>
  
     <button type='submit'>Create Account</button>

  
     <h3 >Already have an account? 
     <Link  className='inf' to='/login'>
     <span>  login</span>
     </Link>

     </h3>

   
       {feedback && (
    <p className={feedback.includes("successfully") ? "success" : "error"}>
        {feedback}
    </p>
     )}

    </div>

    </form>
    </div>
      
      </div>
    
   </>
  )
}

export default Signup