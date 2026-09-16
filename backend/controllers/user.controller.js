const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

// ============================================
// GET USER STATS
// ============================================
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.course', 'title instructor category level');

    const stats = {
      totalCourses: user.enrolledCourses?.length || 0,
      completedCourses: user.enrolledCourses?.filter(c => c.completed).length || 0,
      badges: user.badges || [],
      xp: user.xp || 0,
      level: user.level || 1,
      streak: user.streak || { current: 0, longest: 0 },
      courses: user.enrolledCourses?.map(ec => ({
        id: ec.course?._id,
        title: ec.course?.title || 'Unknown',
        instructor: ec.course?.instructor?.name || 'Unknown',
        category: ec.course?.category || 'other',
        level: ec.course?.level || 'beginner',
        progress: ec.progress || 0,
        completed: ec.completed || false,
        completedLessons: ec.completedLessons || []
      })) || [],
      nextLevelXp: (user.level || 1) * 1000
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ENROLL IN COURSE
// ============================================
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log('📝 Enrolling in user.controller:', courseId);

    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!user.enrolledCourses) user.enrolledCourses = [];
    const alreadyEnrolled = user.enrolledCourses.some(
      ec => ec.course && ec.course.toString() === courseId
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push({
        course: courseId,
        progress: 0,
        completed: false,
        completedLessons: [],
        startedAt: new Date()
      });
      await user.save();
    }

    // Ensure Enrollment document exists
    let enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId
    });
    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: userId,
        course: courseId,
        progress: 0,
        completed: false
      });
    }

    // Ensure student is in Course.students
    if (!course.students) course.students = [];
    if (!course.students.some(s => s && s.toString() === userId.toString())) {
      course.students.push(userId);
    }
    course.enrollments = (course.enrollments || 0) + 1;
    await course.save();

    res.json({
      success: true,
      message: 'Enrolled successfully!',
      data: { courseId, progress: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// GET COURSE CONTENT
// ============================================
exports.getCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate('instructor', 'name');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!user.enrolledCourses) user.enrolledCourses = [];
    let enrollment = user.enrolledCourses.find(
      ec => ec.course && ec.course.toString() === courseId
    );

    // Auto-enroll authenticated user if not already recorded
    if (!enrollment) {
      let dbEnrollment = await Enrollment.findOne({ student: userId, course: courseId });
      enrollment = {
        course: courseId,
        progress: dbEnrollment?.progress || 0,
        completed: dbEnrollment?.completed || false,
        completedLessons: [],
        startedAt: dbEnrollment?.createdAt || new Date()
      };
      user.enrolledCourses.push(enrollment);
      await user.save();

      if (!dbEnrollment) {
        try {
          await Enrollment.create({
            student: userId,
            course: courseId,
            progress: 0,
            completed: false
          });
        } catch (e) {}
      }

      if (!course.students) course.students = [];
      if (!course.students.some(s => s && s.toString() === userId.toString())) {
        course.students.push(userId);
        await course.save();
      }
    }

    // Fetch modules and lessons from DB
    const modules = await Module.find({ course: courseId }).sort({ order: 1 });
    let sections = [];

    if (modules && modules.length > 0) {
      const moduleIds = modules.map(m => m._id);
      const allLessons = await Lesson.find({ module: { $in: moduleIds } }).sort({ order: 1 });
      sections = modules.map(mod => {
        const modLessons = allLessons.filter(l => l.module.toString() === mod._id.toString());
        return {
          id: mod._id,
          title: mod.title,
          description: mod.description,
          order: mod.order,
          lessons: modLessons.length > 0 ? modLessons.map(l => ({
            id: l._id,
            title: l.title,
            description: l.description,
            videoUrl: l.videoUrl,
            duration: l.duration || '25 Min',
            content: l.description || `Hands-on guided walkthrough for ${l.title}. Practice the concepts in your local virtual laboratory environment.`
          })) : [
            {
              id: `${mod._id}-l1`,
              title: `${mod.title} - Foundation`,
              description: 'Fundamental principles and architecture exploration.',
              duration: '30 Min',
              content: `Detailed lecture and interactive walkthrough on ${mod.title}. Review system architectures, core concepts, and key operational security rules.`
            },
            {
              id: `${mod._id}-l2`,
              title: `${mod.title} - Hands-On Lab`,
              description: 'Practical defensive exercises and real-world scenarios.',
              duration: '45 Min',
              content: `Interactive laboratory exercises for ${mod.title}. Complete terminal execution tests and analyze payload signatures.`
            }
          ]
        };
      });
    }

    // If no modules exist in DB, provide comprehensive fallback curriculum
    if (sections.length === 0) {
      sections = [
        {
          id: 'sec-1',
          title: 'Module 1: Foundations & Architecture Setup',
          description: 'Core concepts, threat landscape overview, and sandbox environment configuration.',
          order: 1,
          lessons: [
            {
              id: 'l1',
              title: 'Introduction & Threat Landscape Overview',
              description: 'Comprehensive overview of attack surfaces and defensive methodology.',
              duration: '20 Min',
              videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
              content: 'In this opening lesson, we dissect modern threat topologies, attack vectors, and operational security guidelines. Understand the foundational kill chain and threat modeling taxonomy required for high-assurance cybersecurity defenses.'
            },
            {
              id: 'l2',
              title: 'Isolated Lab Architecture & Tooling Configuration',
              description: 'Configuring hardened virtual machines, network isolation, and telemetry.',
              duration: '35 Min',
              videoUrl: 'https://www.youtube.com/embed/inWWhr5tnEA',
              content: 'Set up your hypervisor sandboxes, configure air-gapped host-only host adapters, and initialize analysis toolchains including Ghidra, Wireshark, x64dbg, and Sysinternals suite.'
            },
            {
              id: 'l3',
              title: 'Static Triage & Cryptographic Hashing',
              description: 'Verifying file integrity, metadata extraction, and PE header analysis.',
              duration: '30 Min',
              videoUrl: 'https://www.youtube.com/embed/7_LCO3_B2L0',
              content: 'Inspect executable headers, entropy maps, imported DLL tables, and digital signatures. Calculate SHA-256 fingerprints and cross-reference indicators with threat intelligence databases.'
            }
          ]
        },
        {
          id: 'sec-2',
          title: 'Module 2: Deep-Dive Analysis & Disassembly',
          description: 'In-depth code decompilation, memory inspection, and behavioral tracking.',
          order: 2,
          lessons: [
            {
              id: 'l4',
              title: 'x86/x64 Disassembly & Control Flow Graphing',
              description: 'Tracing register allocations, call stacks, and branching logic.',
              duration: '45 Min',
              videoUrl: 'https://www.youtube.com/embed/b0Z1q2A3W-0',
              content: 'Analyze binary assembly routines, stack frames, calling conventions, and control flow graphs. Learn to quickly recognize anti-debugging traps and obfuscated loop structures.'
            },
            {
              id: 'l5',
              title: 'Dynamic Sandbox Execution & API Hooking',
              description: 'Real-time memory monitoring, registry telemetry, and network beaconing.',
              duration: '50 Min',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              content: 'Execute samples under active telemetry hooks. Track process creation, DLL injection techniques (Process Hollowing, APC Injection), and unearth hidden Command & Control IP addresses.'
            },
            {
              id: 'l6',
              title: 'Extracting Encrypted Configs & Payload Decryption',
              description: 'Locating AES/RC4 keys and reversing string obfuscation.',
              duration: '40 Min',
              videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
              content: 'Trace encryption routines to locate key material in memory dumps. Write automated Python scripts with CyberChef recipes to decrypt embedded configurations.'
            }
          ]
        },
        {
          id: 'sec-3',
          title: 'Module 3: Defense Engineering & Incident Response',
          description: 'Crafting detection signatures, remediation playbooks, and capstone assessment.',
          order: 3,
          lessons: [
            {
              id: 'l7',
              title: 'Authoring Production YARA Rules & Sigma Detections',
              description: 'Creating high-fidelity signatures for enterprise SIEM and EDR.',
              duration: '35 Min',
              videoUrl: 'https://www.youtube.com/embed/inWWhr5tnEA',
              content: 'Formulate production-grade YARA rules to detect mutant strings, opcode patterns, and malicious PE characteristics without false positives. Convert telemetry into actionable Sigma rules.'
            },
            {
              id: 'l8',
              title: 'Incident Containment & System Hardening Playbook',
              description: 'Mitigation strategies, forensic preservation, and enterprise remediation.',
              duration: '45 Min',
              videoUrl: 'https://www.youtube.com/embed/7_LCO3_B2L0',
              content: 'Execute forensic containment procedures. Isolate compromised assets, safely carve memory artifacts, patch vulnerable attack paths, and verify complete threat eradication.'
            },
            {
              id: 'l9',
              title: 'Capstone Challenge & Certification Assessment',
              description: 'Hands-on practical evaluation to earn your verified credential.',
              duration: '60 Min',
              videoUrl: 'https://www.youtube.com/embed/b0Z1q2A3W-0',
              content: 'Synthesize all acquired competencies in this culminating real-world scenario. Investigate an active breach scenario, document the adversary timeline, and submit your technical report to complete the course.'
            }
          ]
        }
      ];
    }

    res.json({
      success: true,
      data: {
        course: {
          id: course._id,
          _id: course._id,
          title: course.title,
          description: course.description,
          instructor: course.instructor?.name || 'Dr. Sarah Vance',
          thumbnail: course.thumbnail,
          category: course.category,
          level: course.level,
          sections
        },
        progress: enrollment.progress || 0,
        completed: enrollment.completed || false,
        completedLessons: enrollment.completedLessons || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// UPDATE COURSE PROGRESS
// ============================================
exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, progress, completedLesson } = req.body;
    const user = await User.findById(req.user.id);

    let enrollment = user.enrolledCourses.find(
      ec => ec.course && (ec.course._id || ec.course).toString() === courseId
    );

    if (!enrollment) {
      // Auto-create enrollment if missing
      enrollment = {
        course: courseId,
        progress: Math.min(progress, 100),
        completed: progress >= 100,
        completedLessons: completedLesson !== undefined ? [completedLesson] : [],
        startedAt: new Date()
      };
      user.enrolledCourses.push(enrollment);
    } else {
      enrollment.progress = Math.min(progress, 100);
      enrollment.lastAccessed = new Date();

      if (completedLesson !== undefined) {
        if (!enrollment.completedLessons) {
          enrollment.completedLessons = [];
        }
        if (!enrollment.completedLessons.includes(completedLesson)) {
          enrollment.completedLessons.push(completedLesson);
        }
      }
    }

    let newBadge = null;
    let xpEarned = 0;

    const course = await Course.findById(courseId);
    const totalLessons = course?.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 9;
    const completedCount = enrollment.completedLessons?.length || 0;
    
    const isComplete = enrollment.progress >= 100 || 
                      (totalLessons > 0 && completedCount >= totalLessons);

    if (isComplete && !enrollment.completed) {
      enrollment.completed = true;
      enrollment.progress = 100;
      
      xpEarned = 500;
      user.xp += xpEarned;
      
      while (user.xp >= user.level * 1000) {
        user.level += 1;
      }

      newBadge = {
        name: `${course?.title || 'Course'} Complete! 🎓`,
        icon: '🎓'
      };
      if (!user.badges) user.badges = [];
      user.badges.push(newBadge);

      if (!user.streak) user.streak = { current: 1, longest: 1, lastActivity: new Date() };
      const today = new Date().setHours(0, 0, 0, 0);
      const lastActivity = user.streak.lastActivity ? 
        new Date(user.streak.lastActivity).setHours(0, 0, 0, 0) : null;
      
      if (lastActivity !== today) {
        user.streak.current += 1;
        if (user.streak.current > user.streak.longest) {
          user.streak.longest = user.streak.current;
        }
        user.streak.lastActivity = new Date();
      }
    }

    await user.save();

    // Also sync progress into Enrollment collection
    try {
      await Enrollment.findOneAndUpdate(
        { student: user._id, course: courseId },
        { progress: enrollment.progress, completed: enrollment.completed },
        { upsert: true }
      );
    } catch (e) {}

    res.json({
      success: true,
      data: {
        progress: enrollment.progress,
        completed: enrollment.completed,
        completedLessons: enrollment.completedLessons || [],
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        streak: user.streak,
        newBadge,
        xpEarned
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// GET ANNOUNCEMENTS
// ============================================
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = [
      {
        id: 1,
        title: '🎉 Welcome to Cyberion!',
        content: 'Start your learning journey today. Enroll in your first course!',
        createdAt: new Date()
      }
    ];
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// GET PROFILE
// ============================================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// UPDATE PROFILE
// ============================================
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, image, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name !== undefined && name.trim()) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (image !== undefined) user.image = image;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        image: user.image,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// UPLOAD AVATAR
// ============================================
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const avatarUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    const user = await User.findById(req.user.id);
    if (user) {
      user.image = avatarUrl;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      url: avatarUrl,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};