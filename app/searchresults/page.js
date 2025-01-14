'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import Resultcard from '@/components/resultcard'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function SearchResults() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });


  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [n_query, SetNQuery] = useState("")
  const router = useRouter();

  const handleSearch = (e) => {
    if (n_query) {
      router.push(`/searchresults?q=${n_query}`);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      }
    };

    fetchResults();
  }, [query]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    redirect('/');
  }

  return (
    <div>
      <Navbar />

      <div className=" bg-gradient-to-br from-primary-70 to-primary-100 flex justify-center p-4 sm:p-7 md:p-9">
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
                id="n_query"
                type="text"
                value={n_query}
                onChange={(e) => {
                  SetNQuery(e.target.value);
                }}
                required
              />
            </form>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 ml-14">Search Results for "{query}"</h1>
        {results.length > 0 ? (
          <div className="flex justify-center items-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-7">
              {results.map((result, index) => (
                <div key={index} className="flex justify-center">
                  <Resultcard name={result.name} image={result.image_path} object={result} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>

    </div >
  );
}
