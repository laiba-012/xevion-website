import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get(`/users/courses/${courseId}/content`);
      const d = res.data.data;
      setCourse(d.course);
      setProgress(d.progress || 0);
      setCompletedLessons(d.completedLessons || []);
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login'); }
      else setError(err.response?.data?.message || 'Failed to load course.');
    } finally { setLoading(false); }
  };

  const updateProgress = async (newProg, lessonIdx) => {
    try {
      const res = await api.put('/users/courses/progress', { courseId, progress: newProg, completedLesson: lessonIdx });
      setProgress(newProg);
      if (res.data.data?.completed) {
        setCompletionData({ badge: res.data.data.newBadge, xp: res.data.data.xpEarned, level: res.data.data.level });
        setShowCompletion(true);
      }
    } catch (err) { console.error(err); }
  };

  const getTotalLessons = () => (course?.sections || []).reduce((a, s) => a + (s.lessons?.length || 0), 0);

  const getGlobalIdx = (si, li) => {
    const secs = course?.sections || [];
    let idx = 0;
    for (let i = 0; i < secs.length; i++) {
      for (let j = 0; j < (secs[i].lessons?.length || 0); j++) {
        if (i === si && j === li) return idx;
        idx++;
      }
    }
    return 0;
  };

  const getCurrentGlobal = () => getGlobalIdx(currentSection, currentLesson);
  const isLessonDone = (si, li) => completedLessons.includes(getGlobalIdx(si, li));

  const jumpTo = (globalIdx) => {
    const secs = course?.sections || [];
    let idx = 0;
    for (let i = 0; i < secs.length; i++) {
      for (let j = 0; j < (secs[i].lessons?.length || 0); j++) {
        if (idx === globalIdx) { setCurrentSection(i); setCurrentLesson(j); return; }
        idx++;
      }
    }
  };

  const handleNext = () => {
    const total = getTotalLessons();
    const g = getCurrentGlobal();
    if (!completedLessons.includes(g)) setCompletedLessons(p => [...p, g]);
    const nextG = g + 1;
    if (nextG < total) { jumpTo(nextG); updateProgress(Math.round((nextG / total) * 100), g); }
    else updateProgress(100, g);
  };

  const handlePrev = () => {
    const g = getCurrentGlobal();
    if (g > 0) jumpTo(g - 1);
  };

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#050b14',flexDirection:'column'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:44,height:44,border:'3px solid rgba(0,132,255,0.15)',borderTop:'3px solid #0084ff',borderRadius:'50%',animation:'spin 0.8s linear infinite',marginBottom:16}}/>
      <p style={{color:'#4a6a8a',fontSize:15}}>Loading course...</p>
    </div>
  );

  if (error || !course) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#050b14',flexDirection:'column',textAlign:'center',padding:32}}>
      <h2 style={{color:'#ef4444',marginBottom:8}}>{error || 'Course not found'}</h2>
      <p style={{color:'#64748b',marginBottom:24,fontSize:14}}>You may not be enrolled or the course does not exist.</p>
      <div style={{display:'flex',gap:12}}>
        <button onClick={() => navigate('/courses')} style={S.outBtn}>Browse Courses</button>
        <button onClick={fetchCourseContent} style={S.priBtn}>Try Again</button>
      </div>
    </div>
  );

  const secs = course.sections || [];
  const lesson = secs[currentSection]?.lessons?.[currentLesson];
  const total = getTotalLessons();
  const g = getCurrentGlobal();

  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh',background:'#050b14',color:'#e8f0fe',fontFamily:'Inter,sans-serif'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {showCompletion && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={{fontSize:56,marginBottom:8}}>&#127881;</div>
            <h2 style={{fontSize:26,fontWeight:800,color:'#f8fafc',marginBottom:12}}>Course Complete!</h2>
            <div style={{padding:'10px 18px',background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:12,color:'#f59e0b',fontSize:14,fontWeight:700,marginBottom:16,display:'inline-block'}}>
              {completionData?.badge?.name || (course.title + ' - Certified!')}
            </div>
            <div style={{display:'flex',justifyContent:'center',gap:20,marginBottom:20,color:'#8baac8',fontSize:14}}>
              <span>+{completionData?.xp || 500} XP</span>
              <span>Level {completionData?.level || 2}</span>
            </div>
            <button onClick={() => { setShowCompletion(false); navigate('/dashboard'); }} style={{...S.priBtn,width:'100%'}}>Go to Dashboard</button>
          </div>
        </div>
      )}

      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',height:56,background:'rgba(8,14,28,0.97)',borderBottom:'1px solid rgba(0,132,255,0.12)',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:12,flex:1,minWidth:0}}>
          <button onClick={() => setSidebarOpen(p => !p)} style={{background:'transparent',border:'none',color:'#6b8cb0',fontSize:20,cursor:'pointer',padding:'4px 8px'}}>&#9776;</button>
          <Link to="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
            <img src="/xevion-logo-cropped.png" alt="Xevion" style={{height:30}} />
          </Link>
          <div style={{width:1,height:20,background:'rgba(255,255,255,0.07)'}}/>
          <span style={{fontSize:14,fontWeight:600,color:'#94a3b8',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:350}}>{course.title}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14,flexShrink:0}}>
          <span style={{fontSize:12,fontWeight:700,color:'#0084ff',fontFamily:'monospace'}}>{progress}%</span>
          <div style={{width:100,height:5,background:'rgba(0,132,255,0.12)',borderRadius:10,overflow:'hidden'}}>
            <div style={{width:progress+'%',height:'100%',background:'linear-gradient(90deg,#0052cc,#0084ff)',borderRadius:10,transition:'width 0.5s'}}/>
          </div>
          <button onClick={() => navigate('/dashboard')} style={S.outBtn}>Dashboard</button>
        </div>
      </header>

      <div style={{display:'flex',flex:1}}>
        {sidebarOpen && (
          <aside style={{width:290,background:'rgba(6,10,20,0.98)',borderRight:'1px solid rgba(0,132,255,0.1)',overflowY:'auto',flexShrink:0}}>
            <div style={{padding:'18px 12px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:700,color:'#38bdf8',textTransform:'uppercase',letterSpacing:'0.06em'}}>Course Content</span>
                <span style={{fontSize:11,color:'#0084ff',fontFamily:'monospace',fontWeight:700}}>{g+1}/{total}</span>
              </div>
              <div style={{height:4,background:'rgba(0,132,255,0.1)',borderRadius:10,overflow:'hidden',marginBottom:4}}>
                <div style={{width:progress+'%',height:'100%',background:'linear-gradient(90deg,#0052cc,#0084ff)',transition:'width 0.5s'}}/>
              </div>
              <span style={{fontSize:11,color:'#4a6a8a',fontFamily:'monospace'}}>{progress}% Complete</span>
              <div style={{marginTop:14}}>
                {secs.map((sec, si) => (
                  <div key={si} style={{marginBottom:14}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,padding:'5px 8px',background:'rgba(0,132,255,0.05)',borderRadius:7,marginBottom:4}}>
                      <span style={{width:18,height:18,background:'rgba(0,132,255,0.2)',border:'1px solid rgba(0,132,255,0.35)',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#38bdf8',flexShrink:0}}>{si+1}</span>
                      <span style={{fontSize:11,fontWeight:700,color:'#8baac8',lineHeight:1.3}}>{sec.title}</span>
                    </div>
                    {(sec.lessons || []).map((les, li) => {
                      const active = si === currentSection && li === currentLesson;
                      const done = isLessonDone(si, li);
                      return (
                        <button key={li} onClick={() => { setCurrentSection(si); setCurrentLesson(li); }}
                          style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'7px 9px',marginBottom:1,borderRadius:6,border:'none',cursor:'pointer',textAlign:'left',fontFamily:'Inter,sans-serif',transition:'all 0.15s',
                            background: active ? 'rgba(0,132,255,0.12)' : 'transparent',
                            borderLeft: active ? '2px solid #0084ff' : '2px solid transparent',
                            color: done ? '#10b981' : active ? '#38bdf8' : '#6b8cb0'}}>
                          <span style={{fontSize:11,flexShrink:0,width:14,textAlign:'center'}}>{done ? '\u2713' : active ? '\u25B6' : '\u25CB'}</span>
                          <span style={{flex:1,fontSize:11,fontWeight:500,lineHeight:1.3}}>{les.title}</span>
                          <span style={{fontSize:9,color:'#2d4a6a',fontFamily:'monospace',flexShrink:0}}>{les.duration || '25m'}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        <main style={{flex:1,padding:'28px 40px 48px',overflowY:'auto'}}>
          <div style={{fontSize:12,color:'#4a6a8a',marginBottom:10,fontFamily:'monospace'}}>
            <span style={{color:'#38bdf8'}}>Module {currentSection+1}</span>
            <span style={{color:'#2d4a6a',margin:'0 8px'}}>{'>'}</span>
            <span style={{color:'#8baac8'}}>Lesson {currentLesson+1}</span>
          </div>

          <h1 style={{fontSize:26,fontWeight:800,color:'#f8fafc',marginBottom:10,lineHeight:1.25}}>{lesson?.title || 'Lesson'}</h1>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:22,flexWrap:'wrap'}}>
            {course.category && <span style={S.tag}>{course.category}</span>}
            {course.level && <span style={S.tag}>{course.level}</span>}
            <span style={{color:'#4a6a8a',fontSize:13}}>{lesson?.duration || '25 Min'}</span>
          </div>

          {lesson?.videoUrl ? (
            <div style={{position:'relative',borderRadius:14,overflow:'hidden',border:'1px solid rgba(0,132,255,0.15)',marginBottom:28,aspectRatio:'16/9',background:'#000'}}>
              <iframe src={lesson.videoUrl} title={lesson.title} frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen style={{width:'100%',height:'100%',border:'none',position:'absolute',top:0,left:0}}/>
            </div>
          ) : (
            <div style={{background:'rgba(10,16,32,0.8)',border:'1px solid rgba(0,132,255,0.1)',borderRadius:14,padding:'48px 24px',textAlign:'center',marginBottom:28,minHeight:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <p style={{color:'#4a6a8a',fontSize:14}}>Video will appear here once uploaded by the instructor.</p>
            </div>
          )}

          <div style={{background:'rgba(10,16,32,0.85)',border:'1px solid rgba(0,132,255,0.1)',borderRadius:14,padding:'22px 26px',marginBottom:32}}>
            <h3 style={{fontSize:14,fontWeight:700,color:'#38bdf8',marginBottom:12}}>Lesson Notes</h3>
            <div style={{color:'#8baac8',fontSize:14,lineHeight:1.85}}>
              {lesson?.content || lesson?.description || 'Detailed notes and exercises will appear here. Follow along with the video and complete the labs.'}
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:20,borderTop:'1px solid rgba(0,132,255,0.08)',flexWrap:'wrap',gap:12}}>
            <button onClick={handlePrev} disabled={g===0} style={{...S.navBtn,opacity:g===0?0.4:1,cursor:g===0?'not-allowed':'pointer'}}>Previous</button>
            <span style={{fontSize:13,color:'#4a6a8a',fontFamily:'monospace'}}>{g+1} / {total}</span>
            {g === total - 1 ? (
              <button onClick={() => updateProgress(100, g)} style={{...S.navBtn,...S.navBtnGreen}}>Complete Course</button>
            ) : (
              <button onClick={handleNext} style={{...S.navBtn,...S.navBtnBlue}}>Next Lesson</button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const S = {
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000},
  modal:{background:'rgba(8,14,28,0.97)',border:'1px solid rgba(0,132,255,0.25)',borderRadius:24,padding:'40px 36px',maxWidth:440,width:'90%',textAlign:'center',boxShadow:'0 30px 80px rgba(0,0,0,0.6)'},
  tag:{padding:'3px 10px',background:'rgba(0,132,255,0.1)',border:'1px solid rgba(0,132,255,0.2)',borderRadius:20,fontSize:11,fontWeight:700,color:'#38bdf8',textTransform:'uppercase',letterSpacing:'0.06em'},
  navBtn:{padding:'10px 22px',borderRadius:10,border:'1px solid rgba(0,132,255,0.2)',background:'rgba(0,132,255,0.05)',color:'#38bdf8',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif'},
  navBtnBlue:{background:'linear-gradient(135deg,#0084ff,#0052cc)',border:'none',color:'#fff',boxShadow:'0 4px 18px rgba(0,132,255,0.35)'},
  navBtnGreen:{background:'linear-gradient(135deg,#10b981,#059669)',border:'none',color:'#fff',boxShadow:'0 4px 18px rgba(16,185,129,0.35)'},
  priBtn:{padding:'11px 24px',background:'linear-gradient(135deg,#0084ff,#0052cc)',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'},
  outBtn:{padding:'10px 18px',background:'transparent',border:'1px solid rgba(0,132,255,0.25)',borderRadius:10,color:'#38bdf8',fontSize:13,fontWeight:600,cursor:'pointer',textDecoration:'none'},
};

export default CoursePlayer;
