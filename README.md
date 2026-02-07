# 🐾 PetMatch Backend  
Express + TypeScript + Supabase backend powering the PetMatch adoption platform.

This backend provides a clean, modular API for managing pets, favorites, tags, adoption requests, and image galleries.  
Built with **Express**, **TypeScript**, and **Supabase** for a modern, scalable architecture.

---

## 🚀 Features

### 🐶 Pets
- Create, update, delete pets  
- List pets with filters, search, sorting, and pagination  
- Fetch single pet  
- Recently added pets  
- Featured “Pet of the Day”  
- Pet image gallery (add + list images)

### ❤️ Favorites
- Add pet to favorites  
- Remove favorite  
- Add/update notes  
- Joined pet data for easy frontend display  

### 🏷️ Tags
- Create tags  
- Assign tags to pets  
- Fetch tags for a pet  

### 📩 Adoption Requests
- Submit adoption request  
- Fetch all requests for a user  
- Joined pet data  

---

## 📦 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **Supabase (PostgreSQL)**
- **CORS**
- **dotenv**
- **Nodemon** (dev)

---

## 📁 Project Structure


---

## 🔧 Environment Variables

Create a `.env` file in the project root:


> ⚠️ **Never expose the service role key to the frontend.**  
This backend runs in a trusted environment, so it is safe here.

---

## 🛠️ Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |

---

## 📚 API Routes

### 🐶 Pets

#### **POST /pets**
Create a new pet.

#### **GET /pets**
List pets with filters, search, sorting, pagination.

#### **GET /pets/:id**
Fetch single pet.

#### **PATCH /pets/:id**
Update pet.

#### **DELETE /pets/:id**
Delete pet.

#### **GET /pets/recent**
10 most recently added pets.

#### **GET /pets/featured**
Daily featured pet.

#### **GET /pets/:id/images**
List images for a pet.

#### **POST /pets/:id/images**
Add image to a pet.

---

### ❤️ Favorites

#### **POST /favorites**
Add favorite.

#### **GET /favorites/:userId**
List favorites for a user.

#### **PATCH /favorites/:id**
Update note.

#### **DELETE /favorites/:id**
Remove favorite.

---

### 🏷️ Tags

#### **GET /tags**
List all tags.

#### **POST /tags**
Create tag.

#### **POST /tags/assign**
Assign tag to pet.

#### **GET /tags/pet/:petId**
List tags for a pet.

---

### 📩 Adoption Requests

#### **POST /adoption**
Submit adoption request.

#### **GET /adoption/:userId**
List adoption requests for a user.

---

## ▶️ Running the Project

### **Development**

---

## 🐾 Status

PetMatch Backend is fully functional and ready for integration with the frontend.

---

## 📄 License
MIT © VGoku