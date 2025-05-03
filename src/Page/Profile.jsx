"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function UserProfile() {
  const [profileData, setprofileData] = useState('');
 

  const getYourProfile = async()=>{
    try {
      const res = await axios.get(`https://sale-report.onrender.com/user/getProfile`,{
        withCredentials:true
      })
      console.log(res.data)
      setprofileData(res.data.getProfile)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
     getYourProfile()
  },[])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 w-[80vw] p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white text-center">
          <h1 className="text-3xl font-bold">{profileData?.name}</h1>
          <p className="text-xl">{profileData.role}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>Your registered email address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold">{profileData.email}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phone Number</CardTitle>
                <CardDescription>Your phone number</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold">{profileData.phoneNumber}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Your registered address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold">{profileData.address}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role</CardTitle>
                <CardDescription>Your role in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold">{profileData.role}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Status</CardTitle>
                <CardDescription>Is the user an admin?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold">{profileData.isAdmin ? "Yes" : "No"}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Your login password (masked for security)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold">{profileData.password}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
