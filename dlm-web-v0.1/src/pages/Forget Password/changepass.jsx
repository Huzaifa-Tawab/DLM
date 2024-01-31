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
    <CommingSoon/>
  )
        }  />
  )
    }

export default ChangePassword