import React, { useState ,useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button";


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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent ,
  CardHeader,
  CardTitle, } from "@/components/ui/card"

export default function ProductSale() {
    const location = useLocation();
    let details = location.state;
    const navigate = useNavigate();

    const [fetchProduct, setfetchProduct] = useState([]);
    const [search, setsearch] = useState('');
    const [todaySale, settodaySale] = useState([]);
    console.log(todaySale)
    const [salesId, setsalesId] = useState('');
    const [Amount, setAmount] = useState('');

    const getProducts = async () => {
        try {
          const res = await axios.get(`https://sale-report.onrender.com/product/getAllItem`, {
            withCredentials: true
          });
          setfetchProduct(Array.isArray(res.data.getAll) ? res.data.getAll : [res.data.getAll]);
        } catch (error) {
          toast.error(error.response?.data?.msg || 'Error in fetching products');
        }
      };
    
      useEffect(() => {
        getProducts();
      }, []);

      const Searchproducts = fetchProduct.filter((products)=>products.title.toLowerCase().includes(search.toLowerCase()))

      const createSales = async(products)=>{
       try {
        let res = await axios.post(`https://sale-report.onrender.com/sales/create/${products._id}/${details._id}`,{},{
          withCredentials:true,
        })
        console.log(res.data)
        if(res.data.success){
          getProducts();
          getCustomerSaleToday()
        }
        toast(res.data.msg || 'Add successfully');
       } catch (error) {
        toast.error(error.response?.data.msg || error.response?.data?.error || 'Error in adding products')
       }
      }
  const getCustomerSaleToday = async () => {
    try {
      const res = await axios.get(`https://sale-report.onrender.com/sales/sale/today/${details._id}`, {
        withCredentials: true
      });
  
      if (res.data?.products?.length > 0) {
        setsalesId(res.data.saleId);
        settodaySale(Array.isArray(res.data.products) ? res.data.products : (res.data.products ? [res.data.products] : []));

        setAmount(res.data.totalAmount);
      } else {
        setsalesId('');
        settodaySale([]);
        setAmount(0);
      }
    } catch (error) {
      settodaySale([]);
      setsalesId('');
      setAmount(0);
      toast.error(error.response?.data?.msg || error.response?.data?.error || 'Internal Error');
    }
  };
  
  useEffect(()=>{
    getCustomerSaleToday();
  },[])

  const lesssales= async (items)=>{
    // console.log(items)
    try {
      const res = await axios.put( `https://sale-report.onrender.com/sales/reduce/${salesId}/${items.productId}`,{},{
        withCredentials:true
      })
      console.log(res.data)
      if(res.data.success){
        getCustomerSaleToday()
        getProducts()
      }
    } catch (error) {
      console.log(error)
      toast(error.response?.data.msg|| error.response.data?.error || 'Internal Error')
    }
  }
  const customerUpdate = async(items)=>{
    console.log(items)
    try {
      let res = await axios.post(`https://sale-report.onrender.com/sales/create/${items.productId}/${details._id}`,{},{
        withCredentials:true,
      })
      // console.log(res.data)
      if(res.data.success){
        getProducts();
        getCustomerSaleToday()
      }
      toast(res.data.msg || 'Add successfully');
     } catch (error) {
      toast.error(error.response?.data.msg || error.response?.data?.error || 'Error in adding products')
     }
  }

  const handlePrint = () => {
    navigate('/print', {
      state: {
        todaySale,
        Amount,
        customer: details
      }
    });
  };

  const deleteItems = async () => {
    // const productIds = todaySale.map(item => item.productId);
    try {
      const res = await axios.delete(
        `https://sale-report.onrender.com/sales/saleItem/${details._id}`,
        {
          withCredentials: true
        }
      );
      console.log(res.data)
      console.log("res.data:", res.data);
console.log("res.data.success:", res.data.success);
console.log("Type of res.data.success:", typeof res.data.success);

      if (res.data?.success) {
        getProducts();
        getCustomerSaleToday()
        toast.success(res.data.msg || 'Sales Deleted');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || 'Internal Error');
    }
 
  };
  
  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-200'>
      <h1 className='text-center text-xl '>Customer Details</h1>
        {/* customer fetch details */}
        <Card className="w-[350px] mb-2">
  <CardHeader>
    <CardTitle>Customer Details</CardTitle>
  </CardHeader>
  <CardContent>
    <form>
      <div className="flex w-full gap-4"> {/* Changed to flex row */}
        <div className="flex flex-col space-y-1.5 w-1/2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={details?.name} disabled placeholder="Name" />
        </div>
        <div className="flex flex-col space-y-1.5 w-1/2">
          <Label htmlFor="phoneNumber">Mobile No.</Label>
          <Input disabled value={details?.phoneNumber} type="number" id="phoneNumber" />
        </div>
      </div>
    </form>
  </CardContent>
</Card>

{/* fetched customer today sale */}
<Table className='ml-2 mt-2 w-[79vw]'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr.No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Actions</TableHead>
           <TableHead>
           <center>
            <Button onClick={handlePrint} className='mt-4 bg-blue-600 hover:bg-blue-700'>
              Print
            </Button>
          </center>
           </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todaySale.map((item, i) => (
            <TableRow key={item._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell>₹{item.price * item.quantity}</TableCell>


              <TableCell className="flex gap-2 ">
              <Button onClick={()=>customerUpdate(item)} className='cursor-pointer'>
                  +
                </Button>
                <Button onClick={()=>lesssales(item)} className='cursor-pointer'>
                  -
                </Button>
              </TableCell>
            </TableRow>

          ))}
        

        </TableBody>
        
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total Amount</TableCell>
            <TableCell>₹{Amount}</TableCell>
            <TableCell>
  {todaySale.length > 0 && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='cursor-pointer' variant="outline">
          Delete Sale
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all sale items for this customer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction className='cursor-pointer' onClick={deleteItems}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )}
</TableCell>

          </TableRow>
        </TableFooter>
      </Table>
{/* end */}



      <Card className="w-full max-w-xl">
      <CardContent className="py-4">
        <form>
          <div className="flex items-center gap-4">
            <div className="flex flex-col w-full gap-2">
              <Input onChange={(e)=>setsearch(e.target.value)} id="email" placeholder="Search product by name" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
   <center> <h1 className='text-xl mt-2'>Products Lists</h1></center>
      <Table className='ml-2 mt-2 w-[79vw]'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr.No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Composition</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Searchproducts.map((item, i) => (
            <TableRow key={item._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.composition}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>₹{item.discount}</TableCell>
              <TableCell className="flex gap-2 ">
                <Button onClick={()=>createSales(item)} className='cursor-pointer'>
                  Add Sales
                </Button>
              </TableCell>
             
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Total Items</TableCell>
            <TableCell>{Searchproducts.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  
  )
}
