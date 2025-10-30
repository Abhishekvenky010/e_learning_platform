import dotenv from "dotenv";
import mongoose from "mongoose";
import db from "./database/db.js";
import { Teacher } from "./models/teacher.model.js";
import { student } from "./models/student.model.js";
import { course } from "./models/course.model.js";
import { admin } from "./models/admin.model.js";

dotenv.config({ path: "./.env" });

const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await db();
  }
};

const upsertTeacher = async () => {
  const email = "teacher@example.com";
  const existing = await Teacher.findOne({ Email: email });
  if (existing) return existing;
  const created = await Teacher.create({
    Email: email,
    Firstname: "Alice",
    Lastname: "Teacher",
    Password: "password123",
    Isverified: true,
    Isapproved: "approved",
  });
  return created;
};

const upsertStudent = async () => {
  const email = "student@example.com";
  const existing = await student.findOne({ Email: email });
  if (existing) return existing;
  const created = await student.create({
    Email: email,
    Firstname: "Bob",
    Lastname: "Student",
    Password: "password123",
    Isverified: true,
    Isapproved: "approved",
  });
  return created;
};

const upsertCourse = async (teacherId) => {
  const name = "Mathematics";
  let existing = await course.findOne({ coursename: name });
  if (existing) return existing;
  existing = await course.create({
    coursename: name,
    description: "An introductory mathematics course.",
    isapproved: true,
    enrolledteacher: teacherId,
  });
  return existing;
};

const upsertAdmin = async () => {
  const username = "admin";
  const existing = await admin.findOne({ username });
  if (existing) return existing;
  const created = await admin.create({
    username: "admin",
    password: "admin123",
  });
  return created;
};

const main = async () => {
  try {
    await ensureConnection();
    const t = await upsertTeacher();
    const s = await upsertStudent();
    const a = await upsertAdmin();
    const c = await upsertCourse(t._id);
    console.log("Seed complete:", {
      teacherId: t._id.toString(),
      studentId: s._id.toString(),
      adminId: a._id.toString(),
      courseId: c._id.toString(),
    });
    console.log("\n📋 Default Credentials:");
    console.log("===================");
    console.log("Admin Username: admin");
    console.log("Admin Password: admin123");
    console.log("Teacher Email: teacher@example.com");
    console.log("Teacher Password: password123");
    console.log("Student Email: student@example.com");
    console.log("Student Password: password123");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close().catch(() => {});
  }
};

main();




