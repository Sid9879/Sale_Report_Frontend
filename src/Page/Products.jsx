import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn/ui table components
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui input component
import axios from "axios";
import { toast } from "sonner"; // Assuming sonner for toasts
import { Card, CardContent } from "@/components/ui/card"; // Assuming shadcn/ui card components

export default function Products() {
  const [isVisible, setIsVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [fetchProduct, setFetchProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  // Handle scroll to top button visibility
  const handleScroll = () => {
    if (window.scrollY > 0) {
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

  // Fetch products data
  const getProducts = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const res = await axios.get(`https://sale-report.onrender.com/product/getAllItem`, {
        withCredentials: true
      });
      // Ensure data is always an array
      setFetchProduct(Array.isArray(res.data.getAll) ? res.data.getAll : [res.data.getAll]);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error in fetching products');
      setFetchProduct([]); // Clear products on error
    } finally {
      setIsLoading(false); // Set loading to false after fetch completes (success or error)
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Filter products based on search input
  const Searchproducts = fetchProduct.filter((products) =>
    products.title.toLowerCase().includes(search.toLowerCase())
  );

  // Number of columns for the skeleton table
  const numberOfColumns = 8; // Sr.No., Name, Composition, Quantity, Size, Price, Category, Discount

  return (
    <div className='flex flex-col justify-center items-center bg-gray-300'>
      {/* Search Card */}
      <Card className="w-full max-w-xl mt-2 rounded-lg shadow-md">
        <CardContent className="py-4">
          <form>
            <div className="flex items-center gap-4">
              <div className="flex flex-col w-full gap-2">
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  id="search-product"
                  placeholder="Search product by name"
                  className="rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Conditionally render Skeleton UI or Actual Table */}
      {isLoading ? (
        // Skeleton Table UI
        <div className="w-[79vw] mt-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            {/* Table Header Skeleton */}
            <div className={`grid grid-cols-${numberOfColumns} gap-4 px-6 py-3 bg-gray-50 rounded-t-lg animate-pulse`}>
              {Array.from({ length: numberOfColumns }).map((_, colIndex) => (
                <div key={colIndex} className="h-6 bg-gray-300 rounded"></div>
              ))}
            </div>

            {/* Table Body Skeleton Rows */}
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, rowIndex) => ( // Show 5 skeleton rows
                <div key={rowIndex} className={`grid grid-cols-${numberOfColumns} gap-4 px-6 py-4 animate-pulse`}>
                  {Array.from({ length: numberOfColumns }).map((_, cellIndex) => (
                    <div key={cellIndex} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Actual Table Content
        <Table className='ml-2 mt-2 w-[79vw] bg-white rounded-lg shadow-md overflow-hidden'>
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
            {Searchproducts.length > 0 ? (
              Searchproducts.map((item, i) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell className='text-center py-4 text-gray-500' colSpan={numberOfColumns}>
                  No Products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              {Searchproducts.length > 0 && <TableCell colSpan={1}>Total Items</TableCell>}
              {Searchproducts.length > 0 ?
                <TableCell>{Searchproducts.length}</TableCell> :
                null
              }
              {Searchproducts.length === 0 && <TableCell className='text-center' colSpan={numberOfColumns -1}>No Products found</TableCell>}
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
