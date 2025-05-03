import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
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
  const [search, setsearch] = useState('');

  const saveCustomer = async () => {
    try {
      const formattedData = {
        ...customerData,
        name: customerData.name.charAt(0).toUpperCase() + customerData.name.slice(1),
        address : customerData.address.toUpperCase()
      }
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
      toast.error(error.response?.data?.error  || error.response?.data?.msg  || "Error occurred" );
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
    try {
      const res = await axios.get(`https://sale-report.onrender.com/customer/getAllCustomer`, {
        withCredentials: true,
      });
      // console.log(res.data)
      setCustomers(Array.isArray(res.data.getAll) ? res.data.getAll : []);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error fetching customers");
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const filterCustomer = customers.filter((item)=>item.email.toLowerCase().includes(search.toLowerCase()) || item.phoneNumber.toString().includes(search) || item.name.toLowerCase().includes(search.toLowerCase())
)


  return (
    <div className="flex flex-col justify-center items-center gap-2 bg-amber-50">
       <Card className="w-full max-w-xl mt-2">
      <CardContent className="py-4">
        <form>
          <div className="flex items-center gap-4">
            <div className="flex flex-col w-full gap-2">
              <Input onChange={(e)=>setsearch(e.target.value)} id="email" placeholder="Search by Customer Name, Email or Phonenumber" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
      <div className="flex justify-center items-center w-[80vw] mb-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">{editMode ? "Edit Customer" : "Add Customer"}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-gray-500">
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
        // disabled={editMode && field === 'name'}
        onChange={(e) =>
          setCustomerData({
            ...customerData,
            [field]: field === 'phoneNumber' ? Number(e.target.value) : e.target.value
          })
        }
        className="col-span-3"
      />
    </div>
  ))}
</div>

            <DialogFooter>
              <Button onClick={saveCustomer} className="cursor-pointer" type="submit">
               { editMode ? 'Save changes':'Add Customer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
 <h1 className="text-gray-900 font-medium mb-3">List of your customer</h1>
      <Table>
        <TableCaption className="text-black text-xl">***End***</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sr.No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCustomer.map((item, i) => (
            <TableRow key={item._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.phoneNumber}</TableCell>
              <TableCell>{item.address.slice(0,60)}</TableCell>
              <TableCell className="flex gap-2">
                <Button className='cursor-pointer'
                  variant="outline"
                  onClick={() => {
                    setEditMode(true);
                    setEditId(item._id);
                    setCustomerData({
                      name: item.name,
                      email: item.email,
                      phoneNumber: item.phoneNumber,
                      addedBy: item.addedBy,
                      address: item.address,
                    });
                  }}
                >
                  Edit
                </Button>
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
                <Link to ='/saleProducts' state={item} className='flex justify-center items-center cursor-pointer border-2 rounded-md w-18 h-9 font-medium  text-sm' >Add Sale</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1}>Total Customers</TableCell>
            <TableCell>{filterCustomer.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
