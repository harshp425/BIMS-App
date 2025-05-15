'use client'

import React from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function usersGuide() {
  // Define all hooks at the top level first
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

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
      <Navbar
        home_redirect='/admin_home'
      />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Guide</h1>
        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography style={{ fontWeight: 'bold', fontSize: "20px" }} component="span">How to Navigate the Admin Panel</Typography>
          </AccordionSummary>
          <AccordionDetails>
            After logging into the system with admin credentials, you will automatically be presented with the admin panel
            which has the following three options...
            <p className='font-bold mt-4'>
              View All Items
            </p>
            <p className='mt-1'>
              Selecting this option will redirect you to the admin item management dashboard. From this dashboard, you will be able
              to add new tools by clicking on the + button on the top right corner, besides the search bar. Clicking the + will open a
              drawer on the side of the screen where you can input information about the new equipment. The dashboard will have all of the
              items presented to you with the option of edit or delete. If you are looking for a specific tool, you can also use the search bar
              with the tool's name, location, uses, or specs to find the specific equipment.
            </p>
            <p className='font-bold mt-4'>
              View Users
            </p>
            <p className='mt-1'>
              Selecting this option will redirect you to the user management dashboard. From this dashboard, you will be able
              to view all the unique users that have signed up and are using the system.
            </p>
            <p className='italic mt-0.5'>
              *** Coming Soon ***
            </p>
            <p>
              You will also be able to see all of the queries that have been made on the BIMS system with information about the time
              of the query, the user who made it, and the equipment for which it was directed.
            </p>
            <p className='font-bold mt-4'>
              User Guide
            </p>
            <p className='mt-1'>
              Selecting this option will redirect you to the user guide (this page). Here, you will able to learn about how to operate the
              BIMS system as well as some of its quirks :).
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography style={{ fontWeight: 'bold', fontSize: "20px" }} component="span">Adding A Tool</Typography>
          </AccordionSummary>
          <AccordionDetails>
            In order to add a tool the BIMS system, you must first navigate to the admin item management dashboard. You will then see a + button
            on the top righthand corner of the screen besides the search bar. Upon clicking the button, a drawer will open on the side of the screen
            which will ask for some information for the tool. Once you have inputted all the information, scroll down and press the 'Add Tool'
            button. ALL INPUT FIELDS ARE REQUIRED.
            <p className='mt-1'>
              Things to keep in mind...
            </p>
            <ul className='ml-1'>
              <p>
                - When you are uploading the image of the tool, please ensure that it is a 'jpeg' or 'jpg' and provide the image with
                a descriptive name.
              </p>
              <p>
                - As all fields are required, if you do not have any information/comments to input for a particular section,
                please write 'N/A' instead of leaving it blank.
              </p>
              <p>
                - Please input information in the form of BULLETS and not just one large paragraph. When inputting multiple bullets of
                information, in order to start a new bullet line, press 'enter' on your keyboard to start a newline on your text box and then
                start the bullet with a '-' followed by text.
              </p>

            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography style={{ fontWeight: 'bold', fontSize: "20px" }} component="span">Editing Tool Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            In order to edit a tool's information the BIMS system, you must first navigate to the admin item management dashboard. In the
            dashboard, you will see cards for all of the tools in the system. You may scroll through to find the tool you want to edit or
            you can utilize the search bar and search for the tool. Once you find the tool card you want to edit, press the 'Edit' button on the
            bottom left of the respective card.
            <p className='mt-1'>
              Clicking the edit button will open up a modal with all the current information about the tool currently in the system. You can then
              make the necesary changes to any particular section. Once you are done, scroll down and click the 'Save' button to save your changes.
              In order to see the changes, you can simply click on the tool card and you will be redirected to that tool's about page which will
              reflect your changes.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography style={{ fontWeight: 'bold', fontSize: "20px" }} component="span">Deleting a Tool</Typography>
          </AccordionSummary>
          <AccordionDetails>
            In order to delete a tool in the BIMS system, you must first navigate to the admin item management dashboard. In the
            dashboard, you will see cards for all of the tools in the system. You may scroll through to find the tool you want to delete or
            you can utilize the search bar and search for the tool. Once you find the tool card you want to delete, press the 'Delete' button on the
            bottom right of the respective card.
            <p className='mt-2 font-bold'>
              ONCE YOU DELETE A TOOL, ALL OF ITS INFORMATION WILL BE REMOVED FROM THE SYSTEM
            </p>
          </AccordionDetails>
        </Accordion>
      </div>
    </motion.div>
  );
}
