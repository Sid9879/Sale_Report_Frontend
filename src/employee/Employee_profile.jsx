import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from 'axios';

const InputSkeleton = () => (
    <div className="h-10 bg-gray-200 rounded-md animate-pulse w-full"></div>
);

const SelectSkeleton = () => (
    <div className="h-10 bg-gray-200 rounded-md animate-pulse w-full"></div>
);

export default function Employee_profile() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectKey, setSelectKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Name is required";
        if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
        else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits";
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
        if (!address) newErrors.address = "Address is required";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (!role) newErrors.role = "Please select a role";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitPassword = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const res = await axios.post(`https://sale-report.onrender.com/user/register`, {
                email,
                password,
                address,
                phoneNumber,
                name,
                role
            }, {
                withCredentials: true
            });

            console.log(res.data);

            if (res.data.success) {
                toast.success(res.data.msg || "Registration successful");
                setEmail('');
                setPassword('');
                setPhoneNumber('');
                setName('');
                setAddress('');
                setRole('');
                setErrors({}); 
                setSelectKey(prev => prev + 1); 
            }
        } catch (error) {
            console.error("Registration Error:", error);
            toast.error(error.response?.data?.error || error.response?.data?.msg || "Registration failed");
        }
    };

    return (
        <div className='w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6'>
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg flex flex-col gap-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
                    Register Employee
                </h2>

                {isLoading ? (
                    <>
                        <InputSkeleton />
                        <InputSkeleton />
                        <InputSkeleton />
                        <InputSkeleton />
                        <InputSkeleton />
                        <SelectSkeleton />
                        <div className="h-12 bg-blue-300 rounded-md animate-pulse w-full"></div>
                    </>
                ) : (
                    <>
                        <div className="w-full">
                            <Input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="w-full">
                            <Input
                                type="number" 
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>

                        <div className="w-full">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="w-full">
                            <Input
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>

                        <div className="w-full relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex w-full items-center">
                            <Select key={selectKey} value={role} onValueChange={(value) => setRole(value)}>
                                <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                    <SelectValue placeholder="Select Role" className="text-gray-500" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Employee">Employee</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                        </div>

                        <Button
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 cursor-pointer'
                            onClick={submitPassword}
                            type="submit"
                        >
                            Register
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
