import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import { Document } from "../models/document.model.js";
import { Complaint } from "../models/complaint.model.js";
import { Notice } from "../models/notice.model.js";
import { Transaction } from "../models/transaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";

const getMimeType = (ext) => {
  const mimes = {
    '.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain', '.json': 'application/json', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.jpg': 'image/jpeg', '.png': 'image/png'
  };
  return mimes[ext] || 'application/octet-stream';
};

const password = "pass1234"; // Fixed as requested
const sourceDir = path.join(process.cwd(), "public", "seed");
const destDir = path.join(process.cwd(), "public", "uploads");

// --- CLEAN ALL SEED ---
export const cleanAllSeed = asyncHandler(async (req, res) => {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  // 1. Wipe Everything
  await Promise.all([
    User.deleteMany({}), Employee.deleteMany({}), Document.deleteMany({}),
    Complaint.deleteMany({}), Notice.deleteMany({}), Transaction.deleteMany({})
  ]);

  // 2. Seed Only 5 Specific Users
  const createdUsers = [];
  for (let i = 1; i <= 5; i++) {
    const u = await User.create({
      fullname: `Standard User ${i}`,
      email: `user${i}@docs.com`,
      password, // Mongoose hook will hash this
      status: "active",
      contact: `+91 90000 0000${i}`,
      address: "Pune, Maharashtra"
    });
    createdUsers.push(u);
  }

  // 3. Create Admin Employee (For Noticeboard/Finance testing)
  const admin = await Employee.create({
    empCode: "ADMIN", fullname: "Supreme Admin", email: "admin@docs.com", 
    password, role: "admin", dept: "General"
  });

  // 4. Seed Single Notice
  await Notice.create({
    title: "Welcome to DOCS MINI",
    message: "Your enterprise-grade document and operational management system is now live. Explore your dashboard!",
    type: "success",
    createdBy: admin._id
  });

  // 5. Seed 20 Docs (Randomly assigned to the 5 users)
  let seedFiles = fs.existsSync(sourceDir) ? fs.readdirSync(sourceDir) : [];
  let docsCreated = 0;
  
  if (seedFiles.length > 0) {
    for (let i = 0; i < 20; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const fileName = seedFiles[Math.floor(Math.random() * seedFiles.length)];
      const ext = path.extname(fileName).toLowerCase();
      const uniqueName = `seed-${Date.now()}-${i}${ext}`;
      
      fs.copyFileSync(path.join(sourceDir, fileName), path.join(destDir, uniqueName));

      await Document.create({
        title: `Seeded Doc #${i + 1}`,
        description: `Statically retrieved from ${fileName}`,
        cloudUrl: `http://localhost:3500/uploads/${uniqueName}`, 
        cloudPublicId: `seed_file_${i}`,
        fileType: getMimeType(ext),
        fileSize: 1024 * 100,
        isPublic: i % 4 === 0,
        owner: randomUser._id
      });
      docsCreated++;
    }
  }

  return res.status(200).json(new ApiResponse(200, {
    users: 5, docs: docsCreated, admin: "admin@docs.com", password: "pass1234"
  }, "System Cleaned & Seeded with Default Users"));
});

// --- SAFE SEED (APPEND ONLY) ---
export const safeSeed = asyncHandler(async (req, res) => {
  const users = await User.find({ status: 'active' });
  if (users.length === 0) return res.status(400).json(new ApiResponse(400, null, "No users to attach docs to."));

  let seedFiles = fs.existsSync(sourceDir) ? fs.readdirSync(sourceDir) : [];
  let docsAppended = 0;

  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const fileName = seedFiles[Math.floor(Math.random() * seedFiles.length)];
    const ext = path.extname(fileName).toLowerCase();
    const uniqueName = `safe-append-${Date.now()}-${i}${ext}`;
    
    fs.copyFileSync(path.join(sourceDir, fileName), path.join(destDir, uniqueName));

    await Document.create({
      title: `Appended Doc ${i + 1}`,
      description: "Safe seed attachment",
      cloudUrl: `http://localhost:3500/uploads/${uniqueName}`,
      cloudPublicId: `safe_${Date.now()}`,
      fileType: getMimeType(ext),
      fileSize: 1024 * 100,
      isPublic: true,
      owner: randomUser._id
    });
    docsAppended++;
  }

  return res.status(200).json(new ApiResponse(200, { docsAppended }, "Safe seed completed successfully"));
});