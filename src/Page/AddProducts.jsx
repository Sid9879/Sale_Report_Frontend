import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card"

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
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import axios from "axios";
import { toast } from "sonner";

export default function AddProducts() {
  const [search, setsearch] = useState('');
  const [productData, setProductData] = useState({
    title: '',
    composition: '',
    quantity: '',
    size: '',
    price: '',
    category: '',
    discount: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fetchProduct, setfetchProduct] = useState([]);

  const saveProduct = async () => {
    try {
      if (editMode) {
        const res = await axios.put(`https://sale-report.onrender.com/product/updateItem/${editId}`, productData, {
          withCredentials: true,
        });
        if (res.data.success) toast.success(res.data.msg || "Product updated successfully");
      } else {
        const res = await axios.post("https://sale-report.onrender.com/product/addItem", productData, {
          withCredentials: true,
        });
        if (res.data.success) 
          toast.success(res.data.msg || "Product added successfully");
      }
      setProductData({ title: '', composition: '', quantity: '', size: '', price: '', category: '', discount: '' });
      setEditMode(false);
      setEditId(null);
      getProducts();
    } catch (error) {
      toast.error(error.response.data?.error||error.response?.data?.msg || "Error occurred");
    }
  };

  const handleDelete = async (product) => {
    try {
      const res = await axios.delete(`https://sale-report.onrender.com/product/deleteItem/${product._id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        toast(res.data.msg || 'Product deleted');
        getProducts();
      }
    } catch (error) {
      toast(error.response?.data?.msg || 'Error in deleting products');
    }
  };

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

  return (
    <div className='flex flex-col justify-center items-center bg-gray-300'>
         <Card className="w-full max-w-xl mt-2">
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
      <div className="flex justify-center items-center w-[80vw] mb-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">{editMode ? "Edit Product" : "Add Products"}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-gray-500">
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Product" : "Add Products"}</DialogTitle>
              <DialogDescription>
                {editMode ? "Edit and save changes to your product." : "Add your products here. Click save when you're done."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {['title', 'composition', 'quantity', 'size', 'price', 'discount'].map(field => (
                <div key={field} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field} className="text-right">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input
                    type={field === 'quantity' || field === 'price' || field === 'discount' ? 'number' : 'text'}
                    id={field}
                    value={productData[field] || ''}
                    onChange={(e) => setProductData({ ...productData, [field]: field === 'quantity' || field === 'price' || field === 'discount' ? Number(e.target.value) : e.target.value })}
                    className="col-span-3"
                  />
                </div>
              ))}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Category" className="text-right">Category</Label>
                <Select value={productData.category} onValueChange={(value) => setProductData({ ...productData, category: value })}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='Seed'>Seed</SelectItem>
                      <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                      <SelectItem value="Pesticides">Pesticides</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={saveProduct} className="cursor-pointer" type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr.No.</TableHead>
            <TableHead>Title</TableHead>
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
              <TableCell className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    setEditMode(true);
                    setEditId(item._id);
                    setProductData({
                      title: item.title,
                      composition: item.composition,
                      quantity: item.quantity,
                      size: item.size,
                      price: item.price,
                      category: item.category,
                      discount: item.discount,
                    });
                  }}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="cursor-pointer" variant="outline">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. This will permanently delete the product.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
           {Searchproducts.length>0&&<TableCell colSpan={1}>Total Items</TableCell>}
            {Searchproducts.length>0? <TableCell>{Searchproducts.length}</TableCell>:
                         <TableCell className='text-center' colSpan={8}>No Products found</TableCell>}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
