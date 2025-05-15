'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import Link from "next/link";


export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const router = useRouter();
  //const { data: session } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error message

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      const updatedSession = await getSession(); // Fetch the updated session
      // const userAddition = await fetch(`/api/add/users`, {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ "email": email })
      // })
      if (updatedSession?.user?.title === 'user') {
        router.push(`/home`);
      } else if (updatedSession?.user?.title === 'admin') {
        router.push(`/admin_home`);
      }
    } else {
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter leading-tight subpixel-antialiased">
              Welcome to BIMS
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground subpixel-antialiased">
              Bovay Inventory Management System
            </p>
          </div>
          {/* Error Message Banner */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
              {errorMessage}
            </div>
          )}
          <form className="space-y-3 sm:space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1 sm:space-y-2 ">
              <Label className="subpixel-antialiased" htmlFor="email">Email (@cornell.edu)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label className="subpixel-antialiased" htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Link href="/signup">
                <p className="text-right text-sm text-blue-800 subpixel-antialiased underline">
                  Sign Up
                </p>
              </Link>
            </div>
            <Button className="w-full subpixel-antialiased">Sign In</Button>
          </form>
        </div>
      </motion.div >
    </div >
  );
}
