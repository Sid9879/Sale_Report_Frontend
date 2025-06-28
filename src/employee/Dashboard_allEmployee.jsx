import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';

// Skeleton component for a table row
const TableRowSkeleton = ({ columns, cellsPerRow }) => (
    <TableRow>
        {Array.from({ length: cellsPerRow }).map((_, i) => (
            <TableCell key={i}>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </TableCell>
        ))}
    </TableRow>
);

// Skeleton component for the nested sales table
const SalesTableItemSkeleton = () => (
    <TableCell>
        <table className="w-full text-sm border border-gray-300">
            <thead>
                <tr>
                    <th className="text-left px-2 py-1 border"><div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div></th>
                    <th className="text-left px-2 py-1 border"><div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div></th>
                    <th className="text-left px-2 py-1 border"><div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div></th>
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: 2 }).map((_, i) => ( // Simulate a couple of product rows
                    <tr key={i}>
                        <td className="px-2 py-1 border"><div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div></td>
                        <td className="px-2 py-1 border"><div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div></td>
                        <td className="px-2 py-1 border"><div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </TableCell>
);


export default function Dashboard_allEmployee() {
    let userStore = useSelector((state) => state.user)
    const [sales, setsales] = useState([]);
    const [employee, setemployee] = useState([]);
    const [salesTodayAmount, setsalesTodayAmount] = useState(0) // Initialize with 0 for numerical operations
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    // Loading states for each fetch operation
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [loadingSales, setLoadingSales] = useState(true);


    const fetchEmployee = async () => {
        setLoadingEmployees(true); // Start loading
        try {
            const res = await axios.get(`https://sale-report.onrender.com/user/getall`, {
                withCredentials: true
            })
            setemployee(Array.isArray(res.data.employees) ? res.data.employees : [res.data.employees]);
        } catch (error) {
            console.log(error)
            toast(error.response?.data?.msg || "Error in fetching employee deatils ");
        } finally {
            setLoadingEmployees(false); // End loading
        }
    }
    useEffect(() => {
        // Fetch employees only if userStore.user.email is available
        if (userStore?.user?.email) {
            fetchEmployee();
        } else {
            // If email is not available, stop loading immediately
            setLoadingEmployees(false);
        }
    }, [userStore.user?.email]);


    const updateEmployee = (item) => {
        setSelectedEmployee(item);
        setPhoneNumber(item.phoneNumber || "");
        setPassword("");
    };

    const handleSaveChanges = async () => {
        try {
            const res = await axios.put(
                "https://sale-report.onrender.com/user/updateemployee",
                {
                    email: selectedEmployee.email,
                    phoneNumber,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.msg || "Employee updated");
                setSelectedEmployee(null);
                fetchEmployee();
            } else {
                toast.error(res.data.msg || "Something went wrong");
            }
        } catch (error) {
            console.log("Update Error:", error.response?.status, error.response?.data.msg);
            toast.error(error.response?.data?.msg || "Update failed");
        }
    };

    const deleteEmployee = async (employee) => {
        try {
            const res = await axios.delete(`https://sale-report.onrender.com/user/deleteemployee/${employee._id}`, {
                withCredentials: true
            })
            console.log(res.data);
            if (res.data.success) {
                fetchEmployee()
                toast.success(res.data?.msg || 'Employee Deleted')
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || error.response?.data?.error || "Registration failed");
        }
    }

    useEffect(() => {
        const getTodaySalesData = async () => {
            setLoadingSales(true); // Start loading
            try {
                let getData = await axios.get(`https://sale-report.onrender.com/sales/saleTodayGet`, {
                    withCredentials: true
                })
                setsales(getData.data.sales);
                setsalesTodayAmount(getData.data.totalTodaySales);
            }
            catch (error) {
                toast.error(error.response?.data?.msg || error.response?.data?.error || "Failed to fetch today's sales");
                setsales([]); // Ensure sales is an empty array on error
                setsalesTodayAmount(0); // Ensure total amount is 0 on error
            } finally {
                setLoadingSales(false); // End loading
            }
        }
        getTodaySalesData();
    }, [])

    return (
        <div className='p-4'> {/* Added padding for better spacing */}
            <h1 className='text-center font-bold text-2xl mb-4'>Employee List</h1> 
            <Table className='w-[75vw] mx-auto border rounded-lg shadow-md'> 
                <TableCaption>Your Employee list.</TableCaption>
                <TableHeader>
                    <TableRow className='bg-gray-50'>
                        <TableHead className="w-[100px]">Sr.No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">PhoneNumber</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loadingEmployees ? (
                        // Render skeleton rows while loading
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRowSkeleton key={i} cellsPerRow={5} />
                        ))
                    ) : employee.length > 0 ? (
                        // Render actual employee data if available
                        employee.map((item, i) => (
                            <TableRow key={item._id || i}> {/* Use item._id if available, fallback to index */}
                                <TableCell className="font-medium">{i + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.phoneNumber}</TableCell>
                                <TableCell className="text-right px-2">
                                    <div className="flex gap-2 justify-end">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" onClick={() => updateEmployee(item)}>Edit Profile</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit profile</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your profile here. Click save when you're done.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="phone" className="text-right">PhoneNumber</Label>
                                                        <Input
                                                            id="phone"
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="password" className="text-right">Password</Label>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger className='bg-red-500 hover:bg-red-600 text-white w-20 rounded-md font-bold py-2 px-4'>Delete</AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete employee account
                                                        and remove him/her data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteEmployee(item)} >Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-gray-500">No employees found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow className='bg-gray-50'>
                        <TableCell colSpan={3}>No.of Employees</TableCell>
                        <TableCell className="text-end font-semibold">{employee.length}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            {/* show today sales */}

            <h1 className='text-center font-bold text-2xl mt-7 mb-4'>Today's Sales</h1>
            <Table className='w-[75vw] mx-auto border rounded-lg shadow-md'>
                <TableCaption>Daily sales report.</TableCaption>
                <TableHeader>
                    <TableRow className='bg-gray-50'>
                        <TableHead className="w-[100px]">Sr.No.</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Products & Prices</TableHead> {/* Renamed for clarity */}
                        <TableHead className="text-right">Total Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loadingSales ? (
                        // Render skeleton rows for sales while loading
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div></TableCell>
                                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div></TableCell>
                                <SalesTableItemSkeleton />
                                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 ml-auto"></div></TableCell>
                            </TableRow>
                        ))
                    ) : sales.length > 0 ? (
                        // Render actual sales data if available
                        sales.map((sale, index) => (
                            <React.Fragment key={sale._id}>
                                <TableRow className="bg-white hover:bg-gray-50"> {/* Added hover effect */}
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{sale.customerId.name}</TableCell>
                                    <TableCell>
                                        <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="text-left px-2 py-1 border border-gray-200">Product Name</th>
                                                    <th className="text-left px-2 py-1 border border-gray-200">Quantity</th>
                                                    <th className="text-left px-2 py-1 border border-gray-200">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sale.products.map((item, i) => (
                                                    <tr key={item._id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="px-2 py-1 border border-gray-200 truncate max-w-[150px]">{item.title}</td> {/* Increased max-width */}
                                                        <td className="px-2 py-1 border border-gray-200">{item.quantity}</td>
                                                        <td className="px-2 py-1 border border-gray-200">₹{item.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-lg">₹{sale.totalAmount}</TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))
                    ) : (
                        // Message if no sales are found today after loading
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">No sales recorded for today.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow className='bg-gray-50'>
                        <TableCell colSpan={3} className="font-bold text-lg">Total Sales Today</TableCell>
                        <TableCell className="text-right font-bold text-lg text-green-600">₹{salesTodayAmount}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}
