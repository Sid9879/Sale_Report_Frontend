"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Customers() {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const saveCustomer = async () => {
    try {
      const formattedData = {
        ...customerData,
        name: customerData.name.charAt(0).toUpperCase() + customerData.name.slice(1),
        address: customerData.address.toUpperCase()
      };

      if (editMode) {
        const res = await axios.put(`https://sale-report.onrender.com/customer/customerUp/${editId}`, formattedData, {
          withCredentials: true,
        });
        if (res.data.success) toast.success(res.data.msg || "Customer updated successfully");
      } else {
        const res = await axios.post("https://sale-report.onrender.com/customer/registerCustomer", formattedData, {
          withCredentials: true,
        });
        if (res.data.success) toast.success(res.data.msg || "Customer added successfully");
      }
      setCustomerData({ name: '', email: '', phoneNumber: '', address: '' });
      setEditMode(false);
      setEditId(null);
      getCustomers();
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.msg || "Error occurred");
    }
  };

  const handleDelete = async (customer) => {
    try {
      const res = await axios.delete(`https://sale-report.onrender.com/customer/delete/${customer._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast(res.data.msg || "Customer deleted");
        getCustomers();
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error deleting customer");
    }
  };

  const getCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`https://sale-report.onrender.com/customer/getAllCustomer`, {
        withCredentials: true,
      });
      setCustomers(Array.isArray(res.data.getAll) ? res.data.getAll : []);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error fetching customers");
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const filterCustomer = customers.filter((item) =>
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.phoneNumber?.toString().includes(search) ||
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const numberOfTableColumns = 6;

  return (
    <div className="flex flex-col justify-center items-center gap-2 bg-amber-50 p-4 sm:p-6 lg:p-8">
      {/* Search Card */}
      <Card className="w-full max-w-xl md:max-w-2xl lg:max-w-4xl mt-2 rounded-lg shadow-md">
        <CardContent className="py-4">
          <form>
            <div className="flex items-center gap-4">
              <div className="flex flex-col w-full gap-2">
                {isLoading ? (
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <Input onChange={(e) => setSearch(e.target.value)} id="search-customer" placeholder="Search by Customer Name, Email or Phone number" />
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      
      <div className="flex justify-center items-center w-full max-w-5xl mb-2">
        {isLoading ? (
          <div className="h-10 w-36 bg-blue-300 rounded animate-pulse"></div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">{editMode ? "Edit Customer" : "Add Customer"}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-lg p-6 shadow-xl">
              <DialogHeader>
                <DialogTitle>{editMode ? "Edit Customer" : "Add Customer"}</DialogTitle>
                <DialogDescription>
                  {editMode ? "Edit and save changes to your customer." : "Add your customers here. Click save when you're done."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {['name', 'email', 'phoneNumber', 'address'].map(field => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={field} className="text-right">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      type={field === 'phoneNumber' ? 'number' : 'text'}
                      id={field}
                      value={customerData[field] || ''}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          [field]: field === 'phoneNumber' ? Number(e.target.value) : e.target.value
                        })
                      }
                      className="col-span-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={saveCustomer} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2" type="submit">
                  {editMode ? 'Save changes' : 'Add Customer'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <h1 className="text-gray-900 font-medium mb-3">List of your customer</h1>

      {isLoading ? (
        
        <div className="w-full  bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px] md:min-w-full divide-y divide-gray-200"> {/* Min-width for table content to prevent squishing */}
            
              <div className={`grid grid-cols-${numberOfTableColumns} gap-4 px-6 py-3 bg-gray-50 rounded-t-lg animate-pulse`}>
                {Array.from({ length: numberOfTableColumns }).map((_, colIndex) => (
                  <div key={colIndex} className="h-6 bg-gray-300 rounded"></div>
                ))}
              </div>

            
              <div className="divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <div key={rowIndex} className={`grid grid-cols-${numberOfTableColumns} gap-4 px-6 py-4 animate-pulse`}>
                    {Array.from({ length: numberOfTableColumns }).map((_, cellIndex) => (
                      <div key={cellIndex} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table className='min-w-[700px] md:min-w-full divide-y divide-gray-200'>
              <TableCaption className="text-black text-xl">***End***</TableCaption>
              <TableHeader><TableRow>
                <TableHead className="whitespace-nowrap">Sr.No.</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Phone Number</TableHead>
                <TableHead className="whitespace-nowrap">Address</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filterCustomer.length > 0 ? (
                  filterCustomer.map((item, i) => (
                    <TableRow key={item._id}>
                      <TableCell className="whitespace-nowrap">{i + 1}</TableCell>
                      <TableCell className="whitespace-nowrap">{item.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{item.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{item.phoneNumber}</TableCell>
                      <TableCell className="whitespace-nowrap">{item.address?.slice(0, 60)}{item.address?.length > 60 ? '...' : ''}</TableCell>
                      <TableCell className="flex gap-2 whitespace-nowrap">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                className='cursor-pointer'
                                variant="outline"
                                onClick={() => {
                                    setEditMode(true);
                                    setEditId(item._id);
                                    setCustomerData({
                                    name: item.name,
                                    email: item.email,
                                    phoneNumber: item.phoneNumber,
                                    address: item.address,
                                    });
                                }}
                                >
                                Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white rounded-lg p-6 shadow-xl">
                                <DialogHeader>
                                    <DialogTitle>Edit Customer</DialogTitle>
                                    <DialogDescription>
                                        Edit and save changes to your customer.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {['name', 'email', 'phoneNumber', 'address'].map(field => (
                                        <div key={field} className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={field} className="text-right">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </Label>
                                        <Input
                                            type={field === 'phoneNumber' ? 'number' : 'text'}
                                            id={field}
                                            value={customerData[field] || ''}
                                            onChange={(e) =>
                                            setCustomerData({
                                                ...customerData,
                                                [field]: field === 'phoneNumber' ? Number(e.target.value) : e.target.value
                                            })
                                            }
                                            className="col-span-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        </div>
                                    ))}
                                </div>
                                <DialogFooter>
                                    <Button onClick={saveCustomer} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2" type="submit">
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="cursor-pointer">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the customer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Link to='/saleProducts' state={item} className='flex justify-center items-center cursor-pointer border-2 rounded-md w-18 h-9 font-medium text-sm'>Add Sale</Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className='text-center py-4 text-gray-500' colSpan={numberOfTableColumns}>
                      No Customer found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter><TableRow>
                  {filterCustomer.length > 0 && <TableCell colSpan={1} className="whitespace-nowrap">Total Customers</TableCell>}
                  {filterCustomer.length > 0 ?
                    <TableCell className="whitespace-nowrap">{filterCustomer.length}</TableCell> :
                    <TableCell className='text-center' colSpan={numberOfTableColumns -1}>No Customer found</TableCell>}
                </TableRow></TableFooter>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
