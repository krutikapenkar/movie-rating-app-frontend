🎬 **Movie Rating Web App (React + Django)**
-----------------------------------

A full-stack **Movie Rating and Management Web Application** built using **React.js (frontend)** and **Django REST Framework (backend)**.
This project helped me learn how to integrate a modern React frontend with a powerful Django API backend — including authentication, CRUD operations, and dynamic UI rendering.


✨ **Frontend (React)**
- Interactive movie list with category sections  
- Add, edit, and delete movies  
- Display and add ratings with stars 
- Smooth UI with Tailwind CSS and Framer Motion  
- Token-based authentication for secure API access.

This repository contains only the **React frontend** part of the project.

🧠 **Backend (Django + DRF)**
- RESTful API endpoints for movies and ratings  
- Token Authentication using Django REST Framework  
- Custom endpoints for movie rating updates  
- MySQL database support  
- Serializer-based API structure

This repository link for **Django Backend ** : https://github.com/krutikapenkar/movie-rating-app.git


🛠️ **Tech Stack**
-----------------------------------
- **Frontend:** React.js, Tailwind CSS, Framer Motion
- **Backend:** Django, Django REST Framework
- **Database:** MySQL
- **Auth:** Token Authentication

⚙️ **Project Setup & Installation**
-----------------------------------

1️⃣ Clone the Repository

1) git clone https://github.com/krutikapenkar/movie-rating-app-frontend.git 
2) cd movie-rating-frontend

2️⃣ Install Dependencies

1) Make sure Node.js is installed, then run:
2) npm install

🔗 Backend API Integration

1) You’ll connect this frontend to your Django backend API.
2) In your project (for example, in src/services/api.js or wherever you’ve defined the Axios base URL), update the line:
const BASE_URL = "http://127.0.0.1:8000/api/";
3) Make sure your Django backend is running before testing.

3️⃣ Start Development Server

1) npm start






