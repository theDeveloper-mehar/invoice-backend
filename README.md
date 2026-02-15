# Invoice Management System - Frontend

Tech Stack for frontend :
- React (Vite)
- Axios
- React Router
- CSS

- Tech Stack backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt

Live Demo
Frontend: https://invoice-frontend-v14l.onrender.com

Backend:  https://invoice-backend-ao12.onrender.com

---
 Run Locally :

1. Create Folder

2. Clone repository:
git clone for backend : https://github.com/theDeveloper-mehar/invoice-backend.git
git clone for frontend : https://github.com/theDeveloper-mehar/invoice-frontend.git

3. Go inside folder:
cd invoice-frontend

4. Install dependencies:
npm install

5. In api.js file 
replace baseURL: "http://localhost:5000/api with this

6. Go back to folder
 cd invoice-backend
   
7. Install dependencies:
npm install

8. Create .env file in backend folder
paste this code
PORT=5000
MONGO_URL = mongodb://localhost:27017/invoice_app
JWT_SECRET = km@2708

9. Start development server frontend:
npm run dev

10. Start development server backend in new terminal:
npm start

App runs at:
http://localhost:5173

---

## 🔗 API Configuration

Backend URL is configured in:

src/services/api.js
