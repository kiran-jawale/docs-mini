import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import { Document } from "../models/document.model.js";
import { Complaint } from "../models/complaint.model.js";
import { Notice } from "../models/notice.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";

// Helper to get MIME type based on extension
const getMimeType = (ext) => {
  const mimes = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };
  return mimes[ext] || 'application/octet-stream';
};

const shuffle = (array) => array.sort(() => 0.5 - Math.random());

// --- 1. CLEAN ALL SEED ---
export const cleanAllSeed = asyncHandler(async (req, res) => {
  const password = "12345678";
  const sourceDir = path.join(process.cwd(), "public", "seed");
  const destDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  let availableSeedFiles = [];
  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    availableSeedFiles = files.filter(f => 
      ['.pdf', '.docx', '.txt', '.json', '.pptx'].includes(path.extname(f).toLowerCase())
    );
  }

  if (availableSeedFiles.length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "No valid seed files found in public/seed/"));
  }

  // Wipe DB
  await Promise.all([
    User.deleteMany({}),
    Employee.deleteMany({}),
    Document.deleteMany({}),
    Complaint.deleteMany({}),
    Notice.deleteMany({})
  ]);

  // Create Employees (1 Admin, 5 Mods, 1 HR)
  const empData = [
    { empCode: "ADMIN", fullname: "Supreme Admin", email: "admin@user.com", role: "admin", dept: "Noticeboard" },
    { empCode: "HR001", fullname: "HR Manager", email: "hr@user.com", role: "hr", dept: "HR" }
  ];
  for (let i = 1; i <= 5; i++) {
    empData.push({ empCode: `MOD0${i}`, fullname: `Moderator ${i}`, email: `mod${i}@user.com`, role: "mod", dept: "Helpdesk" });
  }

  for (const emp of empData) {
    await Employee.create({ ...emp, password });
  }

  // Create 15 Users
  const createdUsers = [];
  for (let i = 1; i <= 15; i++) {
    let suffix = "0" + `${i}` ? i < 10 : i
    const user = await User.create({
      fullname: `User ${i}`,
      email: `user${i}@user.com`,
      password,
      status: i % 5 === 0 ? "restricted" : "active",
      contact: `99989796${i}`,
      address: "Pune, Maharashtra, India"
    });
    createdUsers.push(user);
  }

  // Create 20 Docs
  let docsCreated = 0;
  for (let i = 1; i <= 20; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomFile = availableSeedFiles[Math.floor(Math.random() * availableSeedFiles.length)];
    const ext = path.extname(randomFile).toLowerCase();
    
    const uniqueName = `clean-seed-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
    fs.copyFileSync(path.join(sourceDir, randomFile), path.join(destDir, uniqueName));

    await Document.create({
      title: `Clean Seed Doc ${i} - ${randomFile}`,
      description: "System generated document.",
      cloudUrl: `http://localhost:3000/uploads/${uniqueName}`, 
      cloudPublicId: `dummy_public_id_${Date.now()}`,
      fileType: getMimeType(ext),
      fileSize: 1024 * 50,
      isPublic: Math.random() > 0.5,
      owner: randomUser._id,
    });
    docsCreated++;
  }

  return res.status(200).json(new ApiResponse(200, {
    employees: 7, users: 15, docs: docsCreated
  }, "CLEAN MODE: DB wiped and populated successfully"));
});

// --- 2. SAFE SEED ---
export const safeSeed = asyncHandler(async (req, res) => {
  const sourceDir = path.join(process.cwd(), "public", "seed");
  const destDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  let availableSeedFiles = [];
  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    availableSeedFiles = files.filter(f => 
      ['.pdf', '.docx', '.txt', '.json', '.pptx'].includes(path.extname(f).toLowerCase())
    );
  }

  if (availableSeedFiles.length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "No valid seed files found in public/seed/"));
  }

  let users = await User.find({ status: 'active' });
  
  if (users.length < 5) {
    return res.status(400).json(new ApiResponse(400, null, "Not enough active users to perform safe seed. Need at least 5."));
  }

  const selectedUsers = shuffle(users).slice(0, 5);
  let docsCreated = 0;

  for (const user of selectedUsers) {
    for (let i = 1; i <= 2; i++) {
      const randomFile = availableSeedFiles[Math.floor(Math.random() * availableSeedFiles.length)];
      const ext = path.extname(randomFile).toLowerCase();
      
      const uniqueName = `safe-seed-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      fs.copyFileSync(path.join(sourceDir, randomFile), path.join(destDir, uniqueName));

      await Document.create({
        title: `Safe Seed Appended - ${randomFile}`,
        description: "Appended without deleting existing data.",
        cloudUrl: `http://localhost:3000/uploads/${uniqueName}`, 
        cloudPublicId: `dummy_public_id_${Date.now()}`,
        fileType: getMimeType(ext),
        fileSize: 1024 * 50,
        isPublic: Math.random() > 0.5,
        owner: user._id,
      });
      docsCreated++;
    }
  }

  return res.status(200).json(new ApiResponse(200, {
    usersTargeted: 5, docsAppended: docsCreated
  }, "SAFE MODE: 10 documents appended to 5 random users."));
});