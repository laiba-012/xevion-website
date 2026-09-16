// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Layout from "./components/layout/Layout";

// // ============================================
// // PUBLIC PAGES - LAYOUT KE ANDAR PAGES FOLDER
// // ============================================
// import Home from "./components/layout/pages/Home";
// import About from "./components/layout/pages/About";
// import Team from "./components/layout/pages/Team";
// import Sponsors from "./components/layout/pages/Sponsors";
// import Blog from "./components/layout/pages/Blog";
// import BlogPost from "./components/layout/pages/BlogPost";
// import Contact from "./components/layout/pages/Contact";
// import Events from "./components/layout/pages/Events";
// import Courses from "./components/layout/pages/Courses";
// import CourseDetail from "./components/layout/pages/CourseDetail";
// import Login from "./components/layout/pages/Login";
// import Signup from "./components/layout/pages/Signup";
// import UserProfile from "./components/layout/pages/UserProfile";
// import CoursePlayer from "./components/layout/pages/CoursePlayer";

// // ============================================
// // DASHBOARD PAGES
// // ============================================
// import UserDashboard from "./components/dashboard/UserDashboard";
// import AdminDashboard from "./components/dashboard/AdminDashboard";
// import InstructorDashboard from "./components/dashboard/InstructorDashboard";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
          
//           {/* ============================================
//               PUBLIC ROUTES - WITH LAYOUT
//               ============================================ */}
          
//           <Route path="/" element={<Layout><Home /></Layout>} />
//           <Route path="/about" element={<Layout><About /></Layout>} />
//           <Route path="/team" element={<Layout><Team /></Layout>} />
//           <Route path="/sponsors" element={<Layout><Sponsors /></Layout>} />
//           <Route path="/contact" element={<Layout><Contact /></Layout>} />
          
//           <Route path="/courses" element={<Layout><Courses /></Layout>} />
//           <Route path="/courses/:id" element={<Layout><CourseDetail /></Layout>} />
//           <Route path="/courses/:courseId/learn" element={
//             <ProtectedRoute>
//               <Layout><CoursePlayer /></Layout>
//             </ProtectedRoute>
//           } />
          
//           <Route path="/blog" element={<Layout><Blog /></Layout>} />
//           <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          
//           <Route path="/events" element={<Layout><Events /></Layout>} />
          
//           <Route path="/login" element={<Layout><Login /></Layout>} />
//           <Route path="/signup" element={<Layout><Signup /></Layout>} />
          
//           <Route path="/profile" element={
//             <ProtectedRoute>
//               <Layout><UserProfile /></Layout>
//             </ProtectedRoute>
//           } />

//           {/* ============================================
//               DASHBOARD ROUTES - WITHOUT LAYOUT
//               ============================================ */}
          
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <UserDashboard />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/dashboard/admin" element={
//             <ProtectedRoute roles={['admin']}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />
          
//           <Route path="/dashboard/instructor" element={
//             <ProtectedRoute roles={['admin', 'instructor']}>
//               <InstructorDashboard />
//             </ProtectedRoute>
//           } />
          
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";

// PUBLIC PAGES
import Home from "./components/layout/pages/Home";
import About from "./components/layout/pages/About";
import Team from "./components/layout/pages/Team";
import Sponsors from "./components/layout/pages/Sponsors";
import Blog from "./components/layout/pages/Blog";
import BlogPost from "./components/layout/pages/BlogPost";
import Contact from "./components/layout/pages/Contact";
import Events from "./components/layout/pages/Events";
import Courses from "./components/layout/pages/Courses";
import CourseDetail from "./components/layout/pages/CourseDetail";
import Login from "./components/layout/pages/Login";
import Signup from "./components/layout/pages/Signup";
import UserProfile from "./components/layout/pages/UserProfile";
import CoursePlayer from "./components/layout/pages/CoursePlayer";

// DASHBOARD PAGES
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import InstructorDashboard from "./components/dashboard/InstructorDashboard";

// ADMIN MANAGEMENT PAGES - ✅ Admin Only
import AdminUsers from "./components/dashboard/AdminUsers";
import AdminCourses from "./components/dashboard/AdminCourses";
import AdminBlogs from "./components/dashboard/AdminBlogs";
import AdminEvents from "./components/dashboard/AdminEvents";
import AdminSponsors from "./components/dashboard/AdminSponsors";
import AdminSettings from "./components/dashboard/AdminSettings";
import CreateInstructor from "./components/dashboard/CreateInstructor";
import CreateCourse from "./components/dashboard/CreateCourse";
import EditCourse from "./components/dashboard/EditCourse";

import InstructorCourses from "./components/dashboard/InstructorCourses";

import CourseModules from "./components/dashboard/CourseModules";

import LessonManager from "./components/dashboard/LessonManager";

import MyCourses from "./components/layout/pages/student/dashboard/MyCourses";


import CourseLearning from "./components/layout/pages/student/dashboard/CourseLearning";

import DashboardHome from "./components/dashboard/pages/DashboardHome";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/team" element={<Layout><Team /></Layout>} />
          <Route path="/sponsors" element={<Layout><Sponsors /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/courses" element={<Layout><Courses /></Layout>} />
          <Route path="/courses/:id" element={<Layout><CourseDetail /></Layout>} />
          <Route path="/courses/:courseId/learn" element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          {/* ✅ My Profile opens directly inside Student Dashboard */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserDashboard initialTab="profile" />
            </ProtectedRoute>
          } />

          {/* ===== DASHBOARD ROUTES - ROLE BASED ===== */}
          
          {/* ✅ ALL USERS - Basic Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* ✅ ADMIN ONLY - Sirf Admin Access */}
         <Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute roles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
>
  <Route index element={<DashboardHome />} />

  <Route path="users" element={<AdminUsers />} />

  <Route path="courses" element={<AdminCourses />} />

  <Route path="blogs" element={<AdminBlogs />} />

  <Route path="events" element={<AdminEvents />} />

  <Route path="sponsors" element={<AdminSponsors />} />

  <Route path="settings" element={<AdminSettings />} />

  <Route
    path="create-instructor"
    element={<CreateInstructor />}
  />

  <Route
    path="create-course"
    element={<CreateCourse />}
  />
</Route>
          
          {/* ✅ INSTRUCTOR + ADMIN */}
         <Route
  path="/dashboard/instructor"
  element={
    <ProtectedRoute roles={["admin", "instructor"]}>
      <InstructorDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/instructor/create-course"
  element={
    <ProtectedRoute roles={["instructor", "admin"]}>
      <CreateCourse />
    </ProtectedRoute>
  }
/>

<Route
  path="/instructor/course/:courseId/modules"
  element={
    <ProtectedRoute roles={["admin", "instructor"]}>
      <CourseModules />
    </ProtectedRoute>
  }
/>




          {/* ===== ADMIN MANAGEMENT ROUTES - ✅ ADMIN ONLY ===== */}
          {/* <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute roles={['admin']}>
              <AdminCourses />
            </ProtectedRoute>
          } />
          <Route path="/admin/blogs" element={
            <ProtectedRoute roles={['admin']}>
              <AdminBlogs />
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute roles={['admin']}>
              <AdminEvents />
            </ProtectedRoute>
          } />
          <Route path="/admin/sponsors" element={
            <ProtectedRoute roles={['admin']}>
              <AdminSponsors />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute roles={['admin']}>
              <AdminSettings />
            </ProtectedRoute>
          } />


          <Route
  path="/admin/create-instructor"
  element={
    <ProtectedRoute roles={["admin"]}>
      <CreateInstructor />
    </ProtectedRoute>
  }
/>

<Route
    path="/admin/create-course"
    element={
        <ProtectedRoute roles={["admin"]}>
            <CreateCourse />
        </ProtectedRoute>
    }
/> */}


<Route
  path="/instructor/edit-course/:id"
  element={
    <ProtectedRoute roles={["admin", "instructor"]}>
      <EditCourse />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/edit-course/:id"
  element={
    <ProtectedRoute roles={["admin", "instructor"]}>
      <EditCourse />
    </ProtectedRoute>
  }
/>

<Route
  path="/instructor/courses"
  element={
    <ProtectedRoute roles={["instructor", "admin"]}>
      <InstructorCourses />
    </ProtectedRoute>
  }
/>
          

          <Route
  path="/instructor/modules/:courseId"
  element={
    <ProtectedRoute roles={["admin", "instructor"]}>
      <CourseModules />
    </ProtectedRoute>
  }
/>

<Route
  path="/instructor/lessons/:moduleId"
  element={
    <ProtectedRoute roles={["admin","instructor"]}>
      <LessonManager />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-courses"
  element={
    <ProtectedRoute>
      <MyCourses />
    </ProtectedRoute>
  }
/>

<Route
  path="/learn/:courseId"
  element={
    <ProtectedRoute>
      <CourseLearning />
    </ProtectedRoute>
  }
/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;