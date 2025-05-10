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

  export default function Dashboard_allEmployee() {
    let userStore = useSelector((state)=>state.user)
    console.log(userStore)
    const [employee, setemployee] = useState([]);
    console.log(employee)
    const [selectedEmployee, setSelectedEmployee] = useState(null);
const [phoneNumber, setPhoneNumber] = useState("");
const [password, setPassword] = useState("");


    const fetchEmployee = async ()=>{
        try {
            const res = await axios.get(`https://sale-report.onrender.com/user/getall`,{
                withCredentials: true
            })
            setemployee(Array.isArray(res.data.employees) ? res.data.employees : [res.data.employees]);
        } catch (error) {
            console.log(error)
      toast(error.response?.data?.msg || "Error in fetching employee deatils ");
        }
    }
    useEffect(() => {
        if (userStore?.user?.email) {
          fetchEmployee();
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

      const deleteEmployee = async(employee)=>{
        try {
          const res = await axios.delete( `https://sale-report.onrender.com/user/deleteemployee/${employee._id}`,{
            withCredentials:true
          })
          console.log(res.data);
          if(res.data.success){
            fetchEmployee()
            toast.success(res.data?.msg || 'Employee Deleted')
          }
        } catch (error) {
               toast.error(error.response?.data?.msg || error.response?.data?.error || "Registration failed");
        }
      }
  return (
    <div>
      <Table className='w-[80vw]'>
      <TableCaption>Your Employee list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Sr.No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">PhoneNumber</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employee.map((item,i) => (
          <TableRow key={i+1}>
            <TableCell className="font-medium">{i+1}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phoneNumber}</TableCell>
            <TableCell className="text-right px-2">
            <div className="flex gap-2 justify-end">
    {/* <Dialog>
      <DialogTrigger asChild>
        <Button onClick = {()=>updateEmployee(item)} >Edit Profile</Button>
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
            <Label htmlFor="name" className="text-right">
              PhoneNumber
            </Label>
            <Input id="name" value="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Password
            </Label>
            <Input id="username" value="" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog> */}

<Dialog>
  <DialogTrigger asChild>
    <Button onClick={() => updateEmployee(item)}>Edit Profile</Button>
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
  <AlertDialogTrigger  className= 'bg-black text-white w-20 rounded-md font-bold'>Delete</AlertDialogTrigger>
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
      <AlertDialogAction onClick={()=>deleteEmployee(item)} >Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  </div>
            </TableCell>
          </TableRow>

        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>No.of Employees</TableCell>
          <TableCell className="text-end">{employee.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
   

    </div>
  )
}
