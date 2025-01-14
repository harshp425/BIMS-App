'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbar";
import Objectcard from "@/components/objectcard";
import { GoArrowRight } from "react-icons/go";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  const [query, SetQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);


  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(`/api/getAll`);
      const data = await res.json();
      setItems(data);
      setAllItems(data);
    };
    fetchResults();
  }, []);

  const handleSearch = (e) => {
    if (query) {
      router.push(`/searchresults?q=${query}`);
    }
  };
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    redirect('/');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className=" bg-gradient-to-br from-primary-70 to-primary-100 flex justify-center p-4 sm:p-7 md:p-9">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-9 space-y-6 w-full max-w-4xl">
            <div className="text-center space-y-4">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tighter leading-tight max-w-md mx-auto">
                Bovay Inventory Management System
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch()
                }}
                className="space-y-4"
              >
                <Input
                  className="w-full sm:w-3/4 mx-auto"
                  placeholder="Search for anything in Bovay"
                  id="query"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    SetQuery(e.target.value);
                  }}
                  required
                />
              </form>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="flex justify-center items-center h-full w-full p-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((result, index) => (
            <li key={index} className="flex justify-center">
              <Objectcard
                name={result.name}
                image={result.image_path}
                object={result}
              />
            </li>
          ))}
        </ul>
      </div>

    </motion.div >

  );
}
