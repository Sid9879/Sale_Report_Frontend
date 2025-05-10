import React, { useEffect, useState } from 'react'
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
  import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent} from "@/components/ui/card"
export default function Products() {
  const [isVisible, setIsVisible] = useState(false);
        const [search, setsearch] = useState('');
            const [fetchProduct, setfetchProduct] = useState([]);

            const handleScroll = () => {
              if (window.scrollY >0) {
                setIsVisible(true);
              } else {
                setIsVisible(false); 
              }
            };
          
            // Scroll to top function
            const scrollToTop = () => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            };
          
            // Add scroll event listener
            useEffect(() => {
              window.addEventListener("scroll", handleScroll);
              return () => {
                window.removeEventListener("scroll", handleScroll);
              };
            }, []);     
    
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
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-2 right-8 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition h-12 w-12"
        >
          ↑
        </button>
      )}
      
    </div>
  )
}
