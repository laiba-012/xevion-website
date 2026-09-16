import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  MdMenuBook,
  MdCheckCircle,
  MdCancel,
  MdHourglassTop,
  MdSearch,
  MdEdit,
  MdDelete,
  MdThumbUp,
  MdThumbDown,
} from "react-icons/md";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/my-courses");
      setCourses(res.data.courses || []);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const approveCourse = async (id) => {
    try { await api.put(`/courses/approve/${id}`); fetchCourses(); }
    catch (err) { console.log(err); }
  };

  const rejectCourse = async (id) => {
    try { await api.put(`/courses/reject/${id}`); fetchCourses(); }
    catch (err) { console.log(err); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try { await api.delete(`/courses/${id}`); fetchCourses(); }
    catch (err) { console.log(err); }
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { icon: <MdMenuBook />,    count: courses.length,                                         label: "Total Courses",  grad: ["#1d4ed8","#2563eb"], glow: "37,99,235" },
    { icon: <MdCheckCircle />, count: courses.filter(c => c.status === "Published").length,   label: "Published",      grad: ["#15803d","#16a34a"], glow: "22,163,74"  },
    { icon: <MdHourglassTop />,count: courses.filter(c => c.status === "Pending").length,     label: "Pending",        grad: ["#c2410c","#ea580c"], glow: "234,88,12"  },
    { icon: <MdCancel />,      count: courses.filter(c => c.status === "Rejected").length,    label: "Rejected",       grad: ["#be123c","#e11d48"], glow: "225,29,72"  },
  ];

  return (
    <>
      <style>{`
        .xv-ac-page { padding: 0; }
        .xv-ac-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:14px; }
        .xv-ac-header h1 { font-size:24px; font-weight:700; color:#e8f0fe; margin:0; font-family:'Space Grotesk',sans-serif; }
        .xv-ac-header p  { font-size:13px; color:#4a6a8a; margin:4px 0 0; }
        .xv-ac-search {
          display:flex; align-items:center; gap:10px;
          background:rgba(0,212,255,0.04); border:1px solid rgba(0,212,255,0.12);
          border-radius:10px; padding:9px 14px; min-width:240px;
        }
        .xv-ac-search svg { color:#4a6a8a; font-size:16px; flex-shrink:0; }
        .xv-ac-search input {
          background:none; border:none; outline:none; color:#e8f0fe;
          font-size:14px; width:100%; font-family:'Inter',sans-serif;
        }
        .xv-ac-search input::placeholder { color:#4a6a8a; }

        .xv-ac-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
        .xv-ac-card {
          padding:20px; border-radius:14px; display:flex; align-items:center; gap:14px;
          border:1px solid rgba(255,255,255,0.06); position:relative; overflow:hidden;
          transition:all 0.3s ease;
        }
        .xv-ac-card:hover { transform:translateY(-4px); }
        .xv-ac-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.05),transparent); pointer-events:none; }
        .xv-ac-card-icon { font-size:28px; opacity:0.7; flex-shrink:0; color:#fff; }
        .xv-ac-card h2 { font-size:30px; font-weight:700; color:#fff; margin:0 0 2px; font-family:'Space Grotesk',sans-serif; }
        .xv-ac-card p  { font-size:12px; color:rgba(255,255,255,0.75); margin:0; }

        .xv-ac-table-wrap {
          background:rgba(13,23,38,0.9); border:1px solid rgba(0,212,255,0.08);
          border-radius:16px; overflow:hidden;
        }
        .xv-ac-table { width:100%; border-collapse:collapse; }
        .xv-ac-table thead tr { background:rgba(0,212,255,0.04); border-bottom:1px solid rgba(0,212,255,0.1); }
        .xv-ac-table th {
          padding:12px 16px; text-align:left; font-size:11px; font-weight:600;
          text-transform:uppercase; letter-spacing:0.08em; color:#4a6a8a;
          background:transparent;
        }
        .xv-ac-table td { padding:14px 16px; border-bottom:1px solid rgba(0,212,255,0.05); font-size:13px; color:#8baac8; vertical-align:middle; }
        .xv-ac-table tr:last-child td { border-bottom:none; }
        .xv-ac-table tr:hover td { background:rgba(0,212,255,0.03); color:#e8f0fe; }
        .xv-ac-table .loading { text-align:center; padding:40px; color:#4a6a8a; }
        .xv-ac-thumb { width:64px; height:48px; object-fit:cover; border-radius:8px; border:1px solid rgba(0,212,255,0.1); }
        .xv-ac-course-info strong { display:block; color:#e8f0fe; font-size:14px; font-weight:600; margin-bottom:2px; }
        .xv-ac-course-info small  { color:#4a6a8a; font-size:12px; }
        .xv-ac-level { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; background:rgba(124,58,237,0.12); color:#c4b5fd; border:1px solid rgba(124,58,237,0.2); font-family:'JetBrains Mono',monospace; }
        .xv-ac-status { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; font-family:'JetBrains Mono',monospace; text-transform:uppercase; }
        .xv-ac-status.published { background:rgba(0,255,157,0.1); color:#00ff9d; border:1px solid rgba(0,255,157,0.2); }
        .xv-ac-status.pending   { background:rgba(255,140,0,0.1);  color:#ff8c00; border:1px solid rgba(255,140,0,0.2); }
        .xv-ac-status.rejected  { background:rgba(255,68,68,0.1);  color:#ff4444; border:1px solid rgba(255,68,68,0.2); }
        .xv-ac-actions { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .xv-ac-btn {
          display:inline-flex; align-items:center; justify-content:center;
          width:32px; height:32px; border-radius:8px; border:none; cursor:pointer;
          font-size:16px; transition:all 0.2s;
        }
        .xv-ac-btn-approve { background:rgba(0,255,157,0.1); color:#00ff9d; border:1px solid rgba(0,255,157,0.15); }
        .xv-ac-btn-approve:hover { background:rgba(0,255,157,0.22); }
        .xv-ac-btn-reject  { background:rgba(255,140,0,0.1);  color:#ff8c00; border:1px solid rgba(255,140,0,0.15); }
        .xv-ac-btn-reject:hover  { background:rgba(255,140,0,0.22); }
        .xv-ac-btn-delete  { background:rgba(255,68,68,0.1);  color:#ff4444; border:1px solid rgba(255,68,68,0.15); }
        .xv-ac-btn-delete:hover  { background:rgba(255,68,68,0.22); }
        .xv-ac-btn-edit    { background:rgba(79,70,229,0.12); color:#818cf8; border:1px solid rgba(79,70,229,0.2); }
        .xv-ac-btn-edit:hover    { background:rgba(79,70,229,0.26); }
        @media (max-width:1100px) { .xv-ac-cards { grid-template-columns:repeat(2,1fr); } }
      `}</style>

      <div className="xv-ac-page">
        {/* Header */}
        <div className="xv-ac-header">
          <div>
            <h1>Course Management</h1>
            <p>Review, approve, and manage all platform courses</p>
          </div>
          <div className="xv-ac-search">
            <MdSearch />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="xv-ac-cards">
          {statCards.map((s, i) => (
            <div key={i} className="xv-ac-card" style={{
              background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})`,
              boxShadow: `0 6px 20px rgba(${s.glow},0.3)`,
            }}>
              <div className="xv-ac-card-icon">{s.icon}</div>
              <div>
                <h2>{s.count}</h2>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="xv-ac-table-wrap">
          <table className="xv-ac-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Level</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="loading">Loading courses…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="loading">No courses found</td></tr>
              ) : filtered.map(course => (
                <tr key={course._id}>
                  <td>
                    <img
                      src={course.thumbnail || "https://placehold.co/80x60/050b14/00d4ff?text=XV"}
                      alt="course"
                      className="xv-ac-thumb"
                    />
                  </td>
                  <td>
                    <div className="xv-ac-course-info">
                      <strong>{course.title}</strong>
                      <small>{course.duration}</small>
                    </div>
                  </td>
                  <td>{course.instructor?.name || "N/A"}</td>
                  <td>{course.category}</td>
                  <td><span className="xv-ac-level">{course.level}</span></td>
                  <td>Rs {course.price}</td>
                  <td>
                    <span className={`xv-ac-status ${course.status.toLowerCase()}`}>
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <div className="xv-ac-actions">
                      <button className="xv-ac-btn xv-ac-btn-edit" title="Edit"><MdEdit /></button>
                      {course.status === "Pending" && (
                        <button className="xv-ac-btn xv-ac-btn-approve" title="Approve" onClick={() => approveCourse(course._id)}>
                          <MdThumbUp />
                        </button>
                      )}
                      {course.status !== "Rejected" && (
                        <button className="xv-ac-btn xv-ac-btn-reject" title="Reject" onClick={() => rejectCourse(course._id)}>
                          <MdThumbDown />
                        </button>
                      )}
                      <button className="xv-ac-btn xv-ac-btn-delete" title="Delete" onClick={() => deleteCourse(course._id)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminCourses;
