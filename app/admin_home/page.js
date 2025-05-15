'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { HiMenuAlt3 } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
export default function AdminHome() {

  // Define all hooks at the top level first
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  // Then handle loading/error states
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // Then handle loading/error states
  if (status === "unauthenticated") {
    redirect('/');
  }

  if (session.user.title != "admin") {
    redirect('/unauthorized');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className="flex h-screen">
        <div className="hidden lg:block w-1/6 bg-gray-800 text-white p-4 space-y-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <ul className="space-y-4">
            <li>
              <Link href="/admin_items">
                <span className="block cursor-pointer hover:underline">View All Items</span>
              </Link>
            </li>
            <li>
              <Link href="/admin_users">
                <span className="block cursor-pointer hover:underline">View Users</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:hidden">
          <button
            onClick={toggleDrawer}
            className="p-2 text-white bg-gray-800 focus:outline-none fixed top-2 left-5 z-50 rounded-full"
          >
            <HiMenuAlt3 size={24} />
          </button>

          {drawerOpen && (
            <div
              className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50"
              onClick={toggleDrawer}
            ></div>
          )}

          <div
            className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 z-50`}
          >
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <ul className="space-y-4 mt-6">
              <li>
                <Link href="/admin_items">
                  <span
                    className="block cursor-pointer hover:underline"
                    onClick={toggleDrawer}
                  >
                    View All Items
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/admin_users">
                  <span
                    className="block cursor-pointer hover:underline"
                    onClick={toggleDrawer}
                  >
                    View Users
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 p-6">
          <h1 className="text-2xl font-bold">Welcome to the Admin Panel</h1>
          <p className="mt-4">Select an option from the sidebar to begin managing items or users.</p>
        </div>
      </div>
    </motion.div>
  );
}
