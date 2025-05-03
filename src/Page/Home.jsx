"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const salesData = [
  { name: "Today", sales: 0 },
  { name: "All Sales", sales: 185000 }, // This should also be dynamically fetched
];

export default function Home() {
  const [todaySales, setTodaySales] = useState(0);
  const [allTimeSales, setAllTimeSales] = useState(0);

  useEffect(() => {
    
    fetch("https://sale-report.onrender.com/sales/saletoday")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTodaySales(data.totalAmount);
          salesData[0].sales = data.totalAmount; 
        }
      })
      .catch((error) => {
        console.error("Error fetching today's sales:", error);
      });

    
    fetch("https://sale-report.onrender.com/sales/saleAlltimes") 
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAllTimeSales(data.totalAmount);
          salesData[1].sales = data.totalAmount;
        }
      })
      .catch((error) => {
        console.error("Error fetching all-time sales:", error);
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="grid gap-6 sm:grid-cols-2 max-w-4xl w-[80vw]">
        {/* Today's Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Sales</CardTitle>
            <CardDescription>Sales made today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{todaySales}</div>
          </CardContent>
        </Card>

        {/* All Sales */}
        <Card>
          <CardHeader>
            <CardTitle>All-Time Sales</CardTitle>
            <CardDescription>Total sales till date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{allTimeSales}</div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Sales Comparison</CardTitle>
            <CardDescription>Today vs All-Time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
