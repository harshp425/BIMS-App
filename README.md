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
Users and admins log in with their credentials to access thier respective dashboards. If a user had not logged in before, they must first sign up and provide the necessary information for registration. Admins don't require registration as admins will be provided thier credentials.

***Note: All regular users will have a shared password which will be provided within the lab. This is a purposeful design decision as per user requirements.***

https://github.com/user-attachments/assets/e0b4d340-aeb1-4712-94fe-5e4e98532074

### Step 2: Tool Search (Users)
- Search bar: Users enter keywords to query the inventory.
      - Users can query tools by name, location, uses, and specifications
- Search results: Display relevant tools, machines, or equipment to the user as matched by the query provided.
- Tool details: Upon selecting a tool, users can view more detailed information such as:
    - Specifications
    - Uses
    - Images
    - Location
    - Training Requirements
    - Required PPE
    - Special comments

<img width="1470" alt="Screenshot 2025-01-20 at 8 51 13 PM" src="https://github.com/user-attachments/assets/7bff2973-bfef-46f5-8f9e-6254793de68c" />

https://github.com/user-attachments/assets/d489170d-0eee-4f9b-bbd1-d308f9baef48

https://github.com/user-attachments/assets/46da62e4-c8f2-4ae3-90b1-9498d91b2c56


### Step 3: Admin Dashboard
- User Insights:
    - View user logs and latest searches.
    - Gain actionable insights for budgeting and equipment planning.
- Inventory Management:
    - Add, delete, or edit tool information through a user-friendly interface.

<img width="1470" alt="Screenshot 2025-01-20 at 8 54 56 PM" src="https://github.com/user-attachments/assets/656aa65c-56b9-47f1-8345-f4078a219b72" />

https://github.com/user-attachments/assets/3931e94f-8529-4080-9703-65cd31559392

https://github.com/user-attachments/assets/9695970a-fefe-42aa-a7dc-61bfac7e7eed

https://github.com/user-attachments/assets/ee333db9-10fc-49da-8050-66f47f069b90

      
### Step 4: Query Tracking (Coming Soon)
Admins will be able to track user queries in real time to:
  - Identify the most frequently searched tools.
  - Spot patterns in user activity to enhance loss prevention strategies.
