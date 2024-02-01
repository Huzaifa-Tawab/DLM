import React, { useState } from 'react'
import Loader from '../../components/loader/Loader'
import CommingSoon from '../Commingsoon'
import SideBar from '../../components/Sidebar/sidebar'
import './changepass.css'

function ChangePassword() {
    const [isLoading, setisLoading] = useState(false)
  return (
    <SideBar
    element={
      isLoading ? (
        <Loader/>
      ) : (
   <>
   <div className="change-pass">
    <div className="pass-input">
      <label htmlFor="">Current Password</label>
      <input type="password" placeholder='Current Password'/>
      <label htmlFor="">New Password</label>
      <input type="password" placeholder='New Password'/>
      <label htmlFor="">Re-Enter New Password</label>
      <input type="password" placeholder='Re-Enter New Password'/>
    </div>
   </div>
   </>
  )
        }  />
  )
    }

export default ChangePassword