require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Course = require("./models/Course");
const Module = require("./models/Module");
const Lesson = require("./models/Lesson");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // 1. Create or Find Instructor
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("instructor123", salt);
    const adminHashed = await bcrypt.hash("admin123", salt);
    const studentHashed = await bcrypt.hash("student123", salt);

    let instructor = await User.findOne({ email: "instructor@xevion.com" });
    if (!instructor) {
      instructor = await User.create({
        name: "Dr. Sarah Vance",
        email: "instructor@xevion.com",
        password: hashedPassword,
        role: "instructor",
        phone: "+1-555-0192",
        designation: "Lead Cybersecurity Architect",
        qualification: "Ph.D. in Computer Security",
        specialization: "Offensive Security & Cryptography",
        experience: "12 Years",
        gender: "Female",
        xp: 5000,
        level: 5,
        badges: [
          { name: "Master Instructor", icon: "🎓" },
          { name: "Top Contributor", icon: "⭐" }
        ],
        isPremium: true
      });
      console.log("✅ Created Instructor:", instructor.email);
    }

    let admin = await User.findOne({ email: "admin@xevion.com" });
    if (!admin) {
      admin = await User.create({
        name: "Xevion Admin",
        email: "admin@xevion.com",
        password: adminHashed,
        role: "admin",
        xp: 10000,
        level: 10,
      });
      console.log("✅ Created Admin:", admin.email);
    }

    let student = await User.findOne({ email: "student@xevion.com" });
    if (!student) {
      student = await User.create({
        name: "Alex Hunter",
        email: "student@xevion.com",
        password: studentHashed,
        role: "user",
        xp: 500,
        level: 1,
      });
      console.log("✅ Created Student:", student.email);
    }

    // 2. Define standard courses
    const coursesData = [
      {
        title: "Cybersecurity Fundamentals & Threat Defense",
        category: "Cyber Security",
        level: "Beginner",
        price: 0,
        duration: "8 Weeks",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
        description: "Master the core concepts of cybersecurity, threat modeling, network defense perimeter design, and cryptographic protocols for modern enterprise systems.",
        instructor: instructor._id,
        status: "Published",
        publishedAt: new Date(),
        modules: [
          {
            title: "Module 1: Introduction to Threat Modeling",
            order: 1,
            lessons: [
              { title: "Understanding the Threat Landscape", duration: "25 Min", order: 1, isPublished: true },
              { title: "OSINT and Reconnaissance Basics", duration: "35 Min", order: 2, isPublished: true }
            ]
          },
          {
            title: "Module 2: Perimeter Security Architecture",
            order: 2,
            lessons: [
              { title: "Firewalls and DMZ Topology", duration: "40 Min", order: 1, isPublished: true },
              { title: "Intrusion Detection & Prevention (IDS/IPS)", duration: "45 Min", order: 2, isPublished: true }
            ]
          }
        ]
      },
      {
        title: "Ethical Hacking & Network Penetration Testing",
        category: "Cyber Security",
        level: "Intermediate",
        price: 49,
        duration: "10 Weeks",
        thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
        description: "Hands-on real-world exploitation, vulnerability scanning, bug bounty methodology, privilege escalation, and active directory penetration testing.",
        instructor: instructor._id,
        status: "Published",
        publishedAt: new Date(),
        modules: [
          {
            title: "Module 1: Network Scanning & Enumeration",
            order: 1,
            lessons: [
              { title: "Nmap Deep Dive & NSE Scripts", duration: "30 Min", order: 1, isPublished: true },
              { title: "Enumerating SMB, SNMP, and RPC", duration: "45 Min", order: 2, isPublished: true }
            ]
          },
          {
            title: "Module 2: Exploitation Frameworks",
            order: 2,
            lessons: [
              { title: "Metasploit Pro Tactics", duration: "50 Min", order: 1, isPublished: true },
              { title: "Privilege Escalation on Linux & Windows", duration: "60 Min", order: 2, isPublished: true }
            ]
          }
        ]
      },
      {
        title: "Modern Full-Stack Engineering with React & Node",
        category: "Web Development",
        level: "Beginner",
        price: 39,
        duration: "12 Weeks",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
        description: "Build reactive full-stack web applications with Vite, React 19, Express microservices, MongoDB Atlas, and JWT-authenticated zero-trust security.",
        instructor: instructor._id,
        status: "Published",
        publishedAt: new Date(),
        modules: [
          {
            title: "Module 1: Modern React 19 Architecture",
            order: 1,
            lessons: [
              { title: "Component Composition & Hooks", duration: "35 Min", order: 1, isPublished: true },
              { title: "State Management & Context API", duration: "40 Min", order: 2, isPublished: true }
            ]
          }
        ]
      },
      {
        title: "Artificial Intelligence & Neural Networks",
        category: "AI & Data Science",
        level: "Advanced",
        price: 89,
        duration: "14 Weeks",
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
        description: "Deep dive into artificial neural networks, transformers, reinforcement learning, and deploying secure AI models in enterprise environments.",
        instructor: instructor._id,
        status: "Published",
        publishedAt: new Date(),
        modules: [
          {
            title: "Module 1: Foundations of Deep Learning",
            order: 1,
            lessons: [
              { title: "Gradient Descent & Backpropagation", duration: "45 Min", order: 1, isPublished: true }
            ]
          }
        ]
      },
      {
        title: "Cloud Infrastructure & Kubernetes Security",
        category: "Cloud Computing",
        level: "Intermediate",
        price: 59,
        duration: "6 Weeks",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
        description: "Deploy, monitor, and harden containerized microservices across AWS, GCP, and Kubernetes clusters with automated zero-trust compliance.",
        instructor: instructor._id,
        status: "Published",
        publishedAt: new Date(),
        modules: [
          {
            title: "Module 1: Container Security",
            order: 1,
            lessons: [
              { title: "Hardening Docker Containers", duration: "30 Min", order: 1, isPublished: true }
            ]
          }
        ]
      },
      {
        title: "Reverse Engineering & Malware Analysis",
        category: "Cyber Security",
        level: "Advanced",
        price: 79,
        duration: "10 Weeks",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
        description: "Dissect real malware samples in secure sandboxes, perform x86/x64 assembly disassembly, Ghidra decompilation, and dynamic memory analysis.",
        instructor: instructor._id,
        status: "Published",
        publishedAt: new Date(),
        modules: [
          {
            title: "Module 1: Static Analysis",
            order: 1,
            lessons: [
              { title: "PE Header Inspection & Hashing", duration: "35 Min", order: 1, isPublished: true }
            ]
          }
        ]
      }
    ];

    // Check existing courses count
    const existingCount = await Course.countDocuments();
    console.log(`Current courses in DB: ${existingCount}`);

    if (existingCount === 0) {
      console.log("Seeding courses into MongoDB...");
      for (const cData of coursesData) {
        const { modules, ...courseFields } = cData;
        const course = await Course.create(courseFields);
        console.log(`Created course: ${course.title} (ID: ${course._id})`);

        if (modules && modules.length > 0) {
          for (const mData of modules) {
            const { lessons, ...moduleFields } = mData;
            const moduleDoc = await Module.create({
              ...moduleFields,
              course: course._id
            });

            if (lessons && lessons.length > 0) {
              for (const lData of lessons) {
                await Lesson.create({
                  ...lData,
                  module: moduleDoc._id,
                  createdBy: instructor._id
                });
              }
            }
          }
        }
      }
      console.log("✅ All courses, modules, and lessons seeded successfully!");
    } else {
      console.log("Courses already exist. Ensuring all are Published...");
      await Course.updateMany({}, { status: "Published" });
      console.log("✅ Updated all existing courses to Published status.");
    }

    const totalInDb = await Course.countDocuments({ status: "Published" });
    console.log(`🎉 Total Published Courses in MongoDB: ${totalInDb}`);

  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

seedDatabase();
