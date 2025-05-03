import React, { useState } from 'react';
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

export default function Employee_profile() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectKey, setSelectKey] = useState(0); // 🆕 added to reset Select

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
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
    console.log(
      email,
      phoneNumber,
      address,
      name,
      role

    )
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
        toast(res.data.msg || "Registration successful");
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setName('');
        setAddress('');
        setRole('');
        setSelectKey(prev => prev + 1); // 🆕 Reset Select after success
      }
    } catch (error) {
      console.log(error);
      toast(error.response?.data?.error || error.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className='w-[80vw] h-[90vh] flex flex-col gap-4 items-center justify-center bg-gray-300'>
      <div className="w-full max-w-sm">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-Gray-500 text-center mb-6">
          Register Employee
        </h2>
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="w-full max-w-sm">
        <Input type="number" placeholder="Phone Number" minlength={10} maxlenght={10} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
      </div>

      <div className="w-full max-w-sm">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="w-full max-w-sm">
        <Input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div className="w-full max-w-sm relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute top-2.5 right-3 text-sm text-gray-500"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Select key={selectKey} onValueChange={(value) => setRole(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Employee">Employee</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>

      <Button className='cursor-pointer' onClick={submitPassword} type="submit">
        Register
      </Button>
    </div>
  );
}
