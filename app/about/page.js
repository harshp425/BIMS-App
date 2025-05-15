'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function About() {

  // Define all hooks at the top level first
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  const [nn_query, SetNNQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const router = useRouter();


  useEffect(() => {
    // Retrieve the tool object from session storage
    const storedTool = sessionStorage.getItem('tool');
    if (storedTool) {
      setSelectedTool(JSON.parse(storedTool));
    }
  }, []);

  const handleSearch = (e) => {
    if (nn_query) {
      router.push(`/searchresults?q=${nn_query}`);
    }
  };

  // Then handle loading/error states
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // Then handle loading/error states
  if (status === "unauthenticated") {
    redirect('/');
  }

  return (
    <div>
      <Navbar />

      {/* Search Section */}
      <div className=" bg-gradient-to-br from-primary-70 to-primary-100 flex justify-center p-4 sm:p-7 md:p-9">
        <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-9 space-y-6 w-full max-w-4xl">
          <div className="text-center space-y-4">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tighter leading-tight max-w-md mx-auto">
              Bovay Inventory Management System
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="space-y-4"
            >
              <Input
                className="w-full sm:w-3/4 mx-auto"
                placeholder="Search for anything in Bovay"
                id="nn_query"
                type="text"
                value={nn_query}
                onChange={(e) => {
                  SetNNQuery(e.target.value);
                }}
                required
              />
            </form>
          </div>
        </div>
      </div>

      {/* Tool Details Section */}
      {selectedTool && (
        <div className="flex flex-col md:flex-row justify-center items-start p-6 sm:p-10 md:p-14">
          {/* Left Section: Tool Name and Image */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/2 space-y-4">
            {/* Tool Name */}
            <h2 className="text-2xl font-bold">{selectedTool.name}</h2>
            {/* Tool Image */}
            <img
              src={selectedTool.image_path === '' || !selectedTool.image_path ? '/images/default.jpg' : selectedTool.image_path}
              alt={selectedTool.name}
              className="w-full h-auto rounded-lg shadow-lg max-w-md"
            />
          </div>

          {/* Right Section: Tool Details */}
          <div className="flex flex-col w-full md:w-1/2 space-y-9 md:pl-10 mt-9">
            <div>
              <h3 className="text-lg font-semibold">Specifications:</h3>
              <p className="text-gray-700">
                {selectedTool.specs ? selectedTool.specs.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                )) : "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Location:</h3>
              <p className="text-gray-700">{selectedTool.location || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Uses:</h3>
              <p className="text-gray-700">
                {selectedTool.uses ? selectedTool.uses.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                )) : "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Required PPE:</h3>
              <p className="text-gray-700">
                {selectedTool.required_ppe ? selectedTool.required_ppe.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                )) : "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Special Comments:</h3>
              <p className="text-gray-700">
                {selectedTool.special_comments ? selectedTool.special_comments.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                )) : "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Required Training:</h3>
              <p className="text-gray-700">
                {selectedTool.required_training ? selectedTool.required_training.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                )) : "N/A"}
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
