"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import axios from "axios";

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null); // Initialize as null to clearly indicate no data yet
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const getYourProfile = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const res = await axios.get(`https://sale-report.onrender.com/user/getProfile`, {
        withCredentials: true
      });
      console.log(res.data);
      setProfileData(res.data.getProfile);
    } catch (error) {
      console.error("Error fetching profile:", error); // Use console.error for errors
      // You might want to add a toast/error message here if `sonner` is available
    } finally {
      setIsLoading(false); // Set loading to false after fetch completes
    }
  };

  useEffect(() => {
    getYourProfile();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 w-[80vw] p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {isLoading ? (
          // Skeleton UI
          <>
            <div className="bg-blue-600 p-4 text-white text-center animate-pulse">
              <div className="h-8 bg-blue-400 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-6 bg-blue-400 rounded w-1/2 mx-auto"></div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => ( // Render 6 skeleton cards
                  <Card key={index} className="rounded-lg shadow-sm animate-pulse">
                    <CardHeader>
                      <div className="h-5 bg-gray-300 rounded w-3/5 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-5 bg-gray-300 rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Actual Profile Content
          <>
            <div className="bg-blue-600 p-4 text-white text-center rounded-t-lg">
              <h1 className="text-3xl font-bold">{profileData?.name || 'N/A'}</h1>
              <p className="text-xl">{profileData?.role || 'N/A'}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle>Email</CardTitle>
                    <CardDescription>Your registered email address</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold">{profileData?.email || 'N/A'}</div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle>Phone Number</CardTitle>
                    <CardDescription>Your phone number</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold">{profileData?.phoneNumber || 'N/A'}</div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle>Address</CardTitle>
                    <CardDescription>Your registered address</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold">{profileData?.address || 'N/A'}</div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle>Role</CardTitle>
                    {/* Fixed: Removed the erroneous closing </CardDescription> tag */}
                    <CardDescription>Your role in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold">{profileData?.role || 'N/A'}</div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle>Admin Status</CardTitle>
                    <CardDescription>Is the user an admin?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold">
                      {profileData?.isAdmin !== undefined ? (profileData.isAdmin ? "Yes" : "No") : 'N/A'}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Your login password (masked for security)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold">********</div> {/* Always mask password */}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
