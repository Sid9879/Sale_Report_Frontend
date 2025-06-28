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


const SkeletonText = () => (
    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
);

const CardContentSkeleton = () => (
    <div className="space-y-3"> 
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div> 
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div> 
    </div>
);

const BarChartSkeleton = () => (
    <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading Chart...</div>
    </div>
);


export default function Home() {
    const [todaySales, setTodaySales] = useState(0);
    const [allTimeSales, setAllTimeSales] = useState(0);
    const [loadingTodaySales, setLoadingTodaySales] = useState(true);
    const [loadingAllTimeSales, setLoadingAllTimeSales] = useState(true);

    const [salesData, setSalesData] = useState([
        { name: "Today", sales: 0 },
        { name: "All Sales", sales: 0 },
    ]);

    useEffect(() => {
        // Fetch Today's Sales
        setLoadingTodaySales(true);
        fetch("https://sale-report.onrender.com/sales/saletoday")
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setTodaySales(data.totalAmount);
                    setSalesData(prevData => {
                        const newData = [...prevData];
                        newData[0].sales = data.totalAmount;
                        return newData;
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching today's sales:", error);
                setTodaySales(0); 
            })
            .finally(() => {
                setLoadingTodaySales(false);
            });

        setLoadingAllTimeSales(true);
        fetch("https://sale-report.onrender.com/sales/saleAlltimes")
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setAllTimeSales(data.totalAmount);
                    setSalesData(prevData => {
                        const newData = [...prevData];
                        newData[1].sales = data.totalAmount;
                        return newData;
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching all-time sales:", error);
                setAllTimeSales(0);
            })
            .finally(() => {
                setLoadingAllTimeSales(false);
            });
    }, []);

    const loadingChart = loadingTodaySales || loadingAllTimeSales;

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="grid gap-6 sm:grid-cols-2 max-w-4xl w-[80vw]">
                <Card className="rounded-lg shadow-lg">
                    <CardHeader>
                        <CardTitle>Today's Sales</CardTitle>
                        <CardDescription>Sales made today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingTodaySales ? (
                            <CardContentSkeleton />
                        ) : (
                            <div className="text-3xl font-bold text-green-600">₹{todaySales}</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="rounded-lg shadow-lg">
                    <CardHeader>
                        <CardTitle>All-Time Sales</CardTitle>
                        <CardDescription>Total sales till date</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingAllTimeSales ? (
                            <CardContentSkeleton />
                        ) : (
                            <div className="text-3xl font-bold text-blue-600">₹{allTimeSales}</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="sm:col-span-2 rounded-lg shadow-lg">
                    <CardHeader>
                        <CardTitle>Sales Comparison</CardTitle>
                        <CardDescription>Today vs All-Time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {loadingChart ? (
                            <BarChartSkeleton />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
                                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
