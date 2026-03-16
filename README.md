# HostelPlusPlus
## Backend Server Setup and Run Instructions

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | v18.x or higher | JavaScript runtime |
| **npm** | v9.x or higher | Package manager (comes with Node.js) |
| **MySQL** | v8.0 or higher | Database server |
| **Git** | Latest | Version control (optional) |

---

## Step 1: Clone or Download the Project

### Clone with Git
```bash
git clone https://github.com/Ali-Noman-17/HostelPlusPlus.git
cd HostelPlusPlus

```


## Step 2: Install Node.js Dependencies

### Run the following command in the project root directory:

```bash
npm install
```
This will install all required packages including:  

+ express - Web framework  
+ mysql2 - MySQL database driver  
+ jsonwebtoken - JWT authentication 
+ bcrypt - Password hashing  
+ dotenv - Environment variables  
+ cors - Cross-origin resource sharing  
+ helmet - Security headers
+ morgan - HTTP request logging
+ joi - Request validation
+ express-validator - Additional validation
  
    
## Step 3: Set Up MySQL Database
 Start MySQL Server. 
 Create Database  
 
```sql
CREATE DATABASE hostel_databasw;
```
Import Database Schema File: schema.sql  
Import Sample Data File: seed.sql (optional)  
Run Files to start.

## Step 4: Configure Environment Variables
### Open the .env file:
Replace the following values:  

+ DB_PASSWORD: Your actual MySQL password
+ JWT_SECRET: A strong random string (at least 32 characters)  

 ### Generate a Strong JWT Secret (Optional)
Run this command to generate a random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as your JWT_SECRET value.

## Step 5: Verify Database Connection
Before starting the server, ensure the database connection works:

```bash
# Test the connection by running a simple query
mysql -u root -p -e "USE hostel_services; SHOW TABLES;"
```

You should see a list of tables including: cities, areas, hostels, users, bookings, etc.

## Step 6: Start the Server
### Simple run
```bash
node src\server.js
```

### Development Mode (with auto-restart)
```bash
npm run dev
```
### You should see output similar to:

```text
✅ Database connected successfully
   Connected as: root@localhost
   Database: hostel_services

==================================================
🚀 Server started successfully!
==================================================
📍 Environment: development
📍 Port: 3000
📍 API Base: http://localhost:3000/api/v1
📍 Health Check: http://localhost:3000/health
==================================================
```

## Step 7: Verify Server is Running
Open a new terminal and test the health endpoint:

```bash
curl http://localhost:3000/health
```


