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

// Skeleton component for a table row
const TableRowSkeleton = ({ cellsPerRow }) => (
    <TableRow>
        {Array.from({ length: cellsPerRow }).map((_, i) => (
            <TableCell key={i}>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            </TableCell>
        ))}
    </TableRow>
);

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
    const [loadingProducts, setLoadingProducts] = useState(true); // New loading state

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
            // Reset form and mode
            setProductData({ title: '', composition: '', quantity: '', size: '', price: '', category: '', discount: '' });
            setEditMode(false);
            setEditId(null);
            getProducts(); // Refresh products
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.msg || "Error occurred");
        }
    };

    const handleDelete = async (product) => {
        try {
            const res = await axios.delete(`https://sale-report.onrender.com/product/deleteItem/${product._id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast(res.data.msg || 'Product deleted');
                getProducts(); // Refresh products
            }
        } catch (error) {
            toast(error.response?.data?.msg || 'Error in deleting products');
        }
    };

    const getProducts = async () => {
        setLoadingProducts(true); // Start loading
        try {
            const res = await axios.get(`https://sale-report.onrender.com/product/getAllItem`, {
                withCredentials: true
            });
            setfetchProduct(Array.isArray(res.data.getAll) ? res.data.getAll : [res.data.getAll]);
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error in fetching products');
            setfetchProduct([]); // Ensure it's an empty array on error
        } finally {
            setLoadingProducts(false); // End loading
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const Searchproducts = fetchProduct.filter((products) => products.title.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className='flex flex-col justify-center items-center bg-gray-50 min-h-screen p-4'> {/* Added min-h-screen and padding */}
            <Card className="w-full max-w-xl mt-2 rounded-lg shadow-md"> {/* Added shadow and rounded corners */}
                <CardContent className="py-4">
                    <form>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col w-full gap-2">
                                <Input
                                    onChange={(e) => setsearch(e.target.value)}
                                    id="search" // Changed ID to be more specific
                                    placeholder="Search product by name"
                                    className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="flex justify-center items-center w-[80vw] mb-4 mt-4"> {/* Adjusted margin */}
                <Dialog onOpenChange={(open) => { // Reset form when dialog closes
                    if (!open) {
                        setEditMode(false);
                        setEditId(null);
                        setProductData({ title: '', composition: '', quantity: '', size: '', price: '', category: '', discount: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 shadow-sm">
                            {editMode ? "Edit Product" : "Add Products"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white text-gray-900 rounded-lg shadow-lg"> {/* Adjusted background and text color */}
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">{editMode ? "Edit Product" : "Add Products"}</DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {editMode ? "Edit and save changes to your product." : "Add your products here. Click save when you're done."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {['title', 'composition', 'quantity', 'size', 'price', 'discount'].map(field => (
                                <div key={field} className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor={field} className="text-right text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                                    <Input
                                        type={field === 'quantity' || field === 'price' || field === 'discount' ? 'number' : 'text'}
                                        id={field}
                                        value={productData[field] || ''}
                                        onChange={(e) => setProductData({ ...productData, [field]: field === 'quantity' || field === 'price' || field === 'discount' ? Number(e.target.value) : e.target.value })}
                                        className="col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="Category" className="text-right text-gray-700">Category</Label>
                                <Select value={productData.category} onValueChange={(value) => setProductData({ ...productData, category: value })}>
                                    <SelectTrigger className="w-full col-span-3 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"> {/* Adjusted width */}
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
                            <Button onClick={saveProduct} className="cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 shadow-sm" type="submit">
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table className="w-[80vw] mx-auto border rounded-lg shadow-md bg-white"> {/* Centered and styled table */}
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
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
                    {loadingProducts ? (
                        // Render skeleton rows while loading
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRowSkeleton key={i} cellsPerRow={9} />
                        ))
                    ) : Searchproducts.length > 0 ? (
                        // Render actual product data if available
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
                                <TableCell className="flex gap-2">
                                    <Button
                                        className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-3 py-1 shadow-sm"
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
                                            <Button className="cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 shadow-sm">Delete</Button>
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
                        ))
                    ) : (
                        // Message if no products are found after loading
                        <TableRow>
                            <TableCell className='text-center text-gray-500 py-4' colSpan={9}>No products found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-gray-50">
                        {loadingProducts ? (
                            <TableCell colSpan={9}>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                            </TableCell>
                        ) : (
                            <>
                                <TableCell colSpan={1}>Total Items</TableCell>
                                <TableCell>{Searchproducts.length}</TableCell>
                                <TableCell colSpan={7}></TableCell> {/* Span remaining cells for alignment */}
                            </>
                        )}
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
