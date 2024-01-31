import React, { useState } from 'react'
import Loader from '../../components/loader/Loader'
import CommingSoon from '../Commingsoon'
import SideBar from '../../components/Sidebar/sidebar'
import './editprofile.css'

function EditProfile() {
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

export default EditProfile