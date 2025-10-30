import dotenv from "dotenv";
import mongoose from "mongoose";
import db from "./database/db.js";
import { course } from "./models/course.model.js";
import { student } from "./models/student.model.js";
import { Teacher } from "./models/teacher.model.js";

dotenv.config({ path: "./.env" });

const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await db();
  }
};

const main = async () => {
  try {
    await ensureConnection();

    const s = await student.findOne({ Email: "student@example.com" });
    const t = await Teacher.findOne({ Email: "teacher@example.com" });
    const c = await course.findOne({ coursename: "Mathematics" });

    if (!s || !t || !c) {
      console.log("Required seed documents not found", { s: !!s, t: !!t, c: !!c });
      return;
    }

    // Enroll student if not already
    const already = c.enrolledStudent?.some((id) => id.toString() === s._id.toString());
    if (!already) {
      c.enrolledStudent = [...(c.enrolledStudent || []), s._id];
      await c.save();
      console.log("Student enrolled in course");
    } else {
      console.log("Student already enrolled");
    }

    // Add a sample upcoming class if none exists
    if (!c.liveClasses || c.liveClasses.length === 0) {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      today.setHours(0, 0, 0, 0);
      c.liveClasses = [
        {
          title: "Intro Session",
          timing: 10 * 60, // 10:00
          date: today,
          link: "https://example.com/class",
          status: "upcoming",
        },
      ];
      await c.save();
      console.log("Sample class added");
    } else {
      console.log("Course already has classes");
    }
  } catch (err) {
    console.error("Seed enroll failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close().catch(() => {});
  }
};

main();








