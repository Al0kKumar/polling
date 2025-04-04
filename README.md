# 🗳️ Real-Time Polling App

## 🚀 Project Overview
This project is a **real-time polling application** that allows users to vote on different options. It uses **Kafka** for message queuing, **Prisma** for database management, and **WebSockets** for real-time updates. The application ensures scalability and efficiency by leveraging Kafka for handling high traffic during voting sessions.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Message Broker:** Apache Kafka
- **Real-Time Communication:** WebSockets

---

## 🏗️ Setup & Installation

### **1️⃣ Prerequisites**
- Install **Node.js** 
- Install **Docker & Docker Compose**
- Install **Kafka & Zookeeper** (or use Docker for Kafka)

### **2️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/polling-app.git
cd polling-app
```

### **3️⃣ Install Dependencies**
```bash
npm install
```

### **4️⃣ Set Up Environment Variables**
Create a `.env` file in the root folder and add:
```
DATABASE_URL=postgresql://user:password@localhost:5432/polling_db
KAFKA_BROKER=localhost:9092
PORT=5000
```

### **5️⃣ Start Services**
Run Kafka , Zookeeper & Postgres using Docker:
```bash
docker-compose up -d
```

### **6️⃣ Run Database Migrations**
```bash
npx prisma migrate dev --name init
```

### **7️⃣ Start the Server**
```bash
npm run dev
```

---

## 📡 API Endpoints

### **1️⃣ Polls**
- **Create Poll** → `POST /polls`
- **Get All Polls** → `GET /polls`
- **Get Poll By ID** → `GET /polls/:id`

### **2️⃣ Voting**
- **Cast Vote** → `POST /votes/:id`
- **Get Leaderboard** → `GET /leaderboard`

---

## 🔄 Kafka Flow Explanation
1. **Producer** (`votes` topic):
   - The frontend sends a vote request.
   - The producer publishes the vote message to Kafka.
2. **Consumer** (`vote-group` consumer):
   - Listens for new votes from Kafka.
   - Updates the database vote count.
   - Broadcasts the update via WebSockets.

---

## 📩 Contact
For any queries, reach out via [Mail]( mishraalok189381@gmail.com) , [LinkedIn](https://www.linkedin.com/in/alok-kumar09/)
