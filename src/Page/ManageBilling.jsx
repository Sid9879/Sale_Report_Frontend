import axios from 'axios'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ManageBilling() {

  const [formData, setformData] = useState({
    companyName:"",
    title:"",
    invoiceNo:"",
    invoiceDate:"",
    dueDate:"",
    productDescription:"",
    hsnCode:"",
    oty:"",
    packageSize:"",
    unitPrice:"",
    gst:"",
    totalAmount:""
  });
  
  const addProducts =async()=>{
    const res = await axios.post(`https://sale-report.onrender.com/bill/addbillings`,{
formData
    },{
      withCredentials:true
    })
  }
  return (
    <div>
      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Save Billing</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">CompanyName</Label>
              <Input id="companyName" placeholder="Company Name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="name" placeholder="Name of the product" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="invoiceNo">InvoiceNo</Label>
              <Input  id="invoiceNo" placeholder="InvoiceNo" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="invoiceDate">InvoiceDate</Label>
              <Input type='text' id="invoiceDate" placeholder="InvoiceDate" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" placeholder="Due Date" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="productDescription">Product Description</Label>
              <Input id="productDescription" placeholder="Product Description" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="hsnCode">HSN Code</Label>
              <Input id="hsnCode" placeholder="HSN Code" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="oty">Oty</Label>
              <Input type='number' id="oty" placeholder="Oty" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="packageSize">Package Size</Label>
              <Input id="packageSize" placeholder="Package Size" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="unitPrice">Unit Price</Label>
              <Input type='number' id="unitPrice" placeholder="Unit Price" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="gst">Gst%</Label>
              <Input type='number' id="gst" placeholder="Gst" />
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="totalAmount">Total Amount%</Label>
              <Input type='number' id="totalAmount" placeholder="Total Amount" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
    </div>
  )
}
