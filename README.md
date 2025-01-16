# Bovay Inventory Management System (BIMS)
BIMS is an interactive web application developed as the primary inventory management system for Bovay Labs. The system allows users to log in and search for lab tools, machines, and equipment, providing vital information about each item. Admins have access to advanced features to manage the inventory and monitor user activity for enhanced decision-making and security.

## Technologies Used
- Frontend: Next.js + Tailwind CSS
- Backend: Next.js
- Database: JSON Database
- Authentication: NextAuth

## Key Features

### User Features
- Tool Search: Query for any tool, machine, or equipment available in the lab.
- Detailed View: Access specific information for each tool such as:
    - Uses
    - Specifications
    - Location (within lab)
    - Special Training Requirements
    - Images
    - Special Comments
### Admin Features
- Admin Portal:
    - View all registered users and their latest searches to aid in:
        - Loss prevention
        - Insight into popular tools for better budget planning and equipment ordering.
    - Add, delete, and edit tool information through an admin console.
### In Progress
- User Query Tracking: Feature to track and display user queries for admins is currently under development.

## Workflow
### Step 1: User Login
Users and admins log in with their credentials to access respective dashboards.

### Step 2: Tool Search (Users)
- Search bar: Users enter keywords to query the inventory.
- Search results: Display relevant tools, machines, or equipment.
- Tool details: Upon selecting a tool, users can view:
    - Specifications and uses
    - Images
    - Location and training requirements
    - Special comments
### Step 3: Admin Dashboard
- User Insights:
    - View user logs and latest searches.
    - Gain actionable insights for budgeting and equipment planning.
- Inventory Management:
    - Add, delete, or edit tool information through a user-friendly interface.
### Step 4: Query Tracking (Coming Soon)
Admins will be able to track user queries in real time to:
  - Identify the most frequently searched tools.
  - Spot patterns in user activity to enhance loss prevention strategies.
