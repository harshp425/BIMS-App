'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminItemCard from "@/components/adminItemCard";
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { Alert } from "@mui/material";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function ItemsPage() {

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [newTool, setNewTool] = useState({
    name: "",
    image_path: null,
    uses: "",
    location: "",
    specs: "",
    special_comments: "",
    required_ppe: "",
    required_training: ""
  });

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


  if (status === "loading") {
    return <LoadingSpinner />;
  }


  if (status === "unauthenticated") {
    redirect('/');
  }

  if (session.user.title != "admin") {
    redirect('/unauthorized');
  }

  const handleSearch = () => {
    const filteredItems = allItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setItems(filteredItems);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  const handleImageUpload = async () => {

    let uploadedImagePath = '';

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedImagePath = data.fileUrl;
        } else {
          console.error("Image upload failed.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    return uploadedImagePath;
  }
  const addNewTool = async () => {
    try {
      // Wait for the image upload to complete and get the file path
      const uploadedImagePath = await handleImageUpload();

      // Update the newTool object with the image path
      const updatedTool = {
        ...newTool,
        image_path: uploadedImagePath,
      };

      const res = await fetch(`/api/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTool),
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems(prevItems => [...prevItems, newItem]);
        setShowDrawer(false);

        // Reset the form
        setNewTool({
          name: "",
          uses: "",
          image_path: null,
          location: "",
          specs: "",
          special_comments: "",
          required_ppe: "",
          required_training: ""
        });
        setErrorMessage("");
      } else {
        setErrorMessage('Failed to add new tool. Please fill out all fields.');
      }
    } catch (err) {
      console.error("Error adding new tool:", err);
    }
  };
  const handleSave = async () => {
    try {

      const uploadedImagePath = await handleImageUpload();
      if (uploadedImagePath !== '') {
        selectedItem.image_path = uploadedImagePath
      }

      if (selectedItem) {
        try {
          const res = await fetch(`/api/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: selectedItem.name,
              updates: {
                uses: selectedItem.uses,
                image_path: selectedItem.image_path,
                location: selectedItem.location,
                specs: selectedItem.specs,
                special_comments: selectedItem.special_comments,
                required_ppe: selectedItem.required_ppe,
                required_training: selectedItem.required_training

              },
            }),
          });

          if (res.ok) {

            setItems(prevItems =>
              prevItems.map(item =>
                item.name === selectedItem.name ? selectedItem : item
              )
            );
            setShowModal(false);
          } else {
            console.error('Failed to update item');
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    catch (err) {
      console.log("Error Updating Tool")
    }
  };

  const deleteItem = async (item) => {
    try {
      const res = await fetch(`/api/delete?toolName=${item.name}`,
        { method: 'DELETE' }
      )
      if (res.ok) {
        setItems(prevItems => prevItems.filter(i => i.name !== item.name));
      } else {
        console.error("Failed to delete the item:", await res.json());
      }
    }
    catch (err) {
      console.log(err)
    }

  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Items</h1>


        <div className="flex justify-between mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="w-full"
          >
            <Input
              className="w-full"
              placeholder="Search for anything in Bovay"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </form>
          <Button onClick={() => setShowDrawer(true)} className="ml-4" variant="primary">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 w-full">

          <ul className="flex flex-wrap justify-center sm:justify-start items-center sm:items-start gap-4">
            {items.map((result, index) => (
              <li key={index}>
                <AdminItemCard
                  name={result.name}
                  image={result.image_path}
                  object={result}
                  onEdit={() => openModal(result)}
                  onDelete={() => deleteItem(result)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">{selectedItem.name}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Image</label>
              <Input
                type="file"
                accept="image/*"
                //value={newTool.name}
                onChange={(e) =>
                  setImageFile(e.target.files[0])
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Uses</label>
              <textarea
                value={selectedItem.uses}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, uses: e.target.value })
                }
                rows={3}
                className="w-full p-2 border rounded"
                placeholder="Enter specifications here..."
              ></textarea>

            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                type="text"
                value={selectedItem.location}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, location: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Specifications</label>
              <textarea
                value={selectedItem.specs}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, specs: e.target.value })
                }
                rows={5}
                className="w-full p-2 border rounded"
                placeholder="Enter specifications here..."
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Required PPE</label>
              <textarea
                value={selectedItem.required_ppe}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, required_ppe: e.target.value })
                }
                rows={5}
                className="w-full p-2 border rounded"
                placeholder="Enter required ppe equipment here..."
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Special Comments</label>
              <textarea
                value={selectedItem.special_comments}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, special_comments: e.target.value })
                }
                rows={3}
                className="w-full p-2 border rounded"
                placeholder="Enter special comments here..."
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Required Training</label>
              <textarea
                value={selectedItem.required_training}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, required_training: e.target.value })
                }
                rows={5}
                className="w-full p-2 border rounded"
                placeholder="Enter any required training here..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-4">
              <Button onClick={closeModal} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="primary">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}


      {showDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
          <div className="bg-white p-6 w-1/3 h-full shadow-lg relative">
            <button onClick={() => setShowDrawer(false)} className="absolute top-4 right-4">
              <X className="w-6 h-6" />
            </button>
            {errorMessage && (
              <Alert
                variant="filled"
                severity="error"
                onClose={() => setErrorMessage(null)}
              >
                {errorMessage}
              </Alert>
            )}
            <h2 className="text-xl font-bold mb-4">Add New Tool</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                value={newTool.name}
                onChange={(e) =>
                  setNewTool({ ...newTool, name: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Image</label>
              <Input
                type="file"
                accept="image/*"
                //value={newTool.name}
                onChange={(e) =>
                  setImageFile(e.target.files[0])
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Uses</label>
              <textarea
                value={newTool.uses}
                onChange={(e) =>
                  setNewTool({ ...newTool, uses: e.target.value })
                }
                rows={3}
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                type="text"
                value={newTool.location}
                onChange={(e) =>
                  setNewTool({ ...newTool, location: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Specifications</label>
              <textarea
                value={newTool.specs}
                onChange={(e) =>
                  setNewTool({ ...newTool, specs: e.target.value })
                }
                rows={5}
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Required PPE</label>
              <textarea
                value={newTool.required_ppe}
                onChange={(e) =>
                  setNewTool({ ...newTool, required_ppe: e.target.value })
                }
                rows={5}
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Special Comments</label>
              <textarea
                value={newTool.special_comments}
                onChange={(e) =>
                  setNewTool({ ...newTool, special_comments: e.target.value })
                }
                rows={3}
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Required Training</label>
              <textarea
                value={newTool.required_training}
                onChange={(e) =>
                  setNewTool({ ...newTool, required_training: e.target.value })
                }
                rows={5}
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>
            <Button onClick={addNewTool} className="w-full bg-black text-white" variant="primary">
              Add Tool
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}