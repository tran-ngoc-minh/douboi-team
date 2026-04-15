// import React, { useState, useEffect, useRef } from 'react';
// import { localDb } from './localDb';
// import { GoogleGenAI } from "@google/genai";
// import { 
//   MessageSquare, 
//   BookOpen, 
//   Users, 
//   Plus, 
//   Search, 
//   Bell, 
//   Menu, 
//   X, 
//   Send, 
//   Sparkles, 
//   Clock, 
//   Eye, 
//   Trophy,
//   Star,
//   FileText,
//   Layout,
//   Globe,
//   Calendar,
//   ChevronDown,
//   ThumbsUp,
//   Heart,
//   Share2,
//   TrendingUp,
//   Award,
//   ChevronRight,
//   ArrowLeft,
//   Shield,
//   Zap,
//   LogOut,
//   User as UserIcon,
//   Hash,
//   ArrowRight
// } from 'lucide-react';
// import Markdown from 'react-markdown';
// import { formatDistanceToNow } from 'date-fns';
// import { ru } from 'date-fns/locale';
// import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';
// import { UserProfile, Category, Post, Comment } from './types';

// // Utility for tailwind classes
// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, errorInfo: string }> {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false, errorInfo: '' };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, errorInfo: error.message };
//   }

//   render() {
//     if (this.state.hasError) {
//       let displayMessage = "Что-то пошло не так.";
//       try {
//         const parsed = JSON.parse(this.state.errorInfo);
//         if (parsed.error && parsed.error.includes('insufficient permissions')) {
//           displayMessage = "У вас нет прав для этого действия. Проверьте, вошли ли вы в аккаунт.";
//         }
//       } catch (e) {
//         // Not a JSON error
//       }
//       return (
//         <div className="min-h-screen bg-white flex items-center justify-center p-6">
//           <div className="max-w-md w-full bg-zinc-50 border border-zinc-200 rounded-3xl p-8 text-center space-y-4">
//             <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
//               <Shield size={32} />
//             </div>
//             <h2 className="text-2xl font-black uppercase tracking-tighter">Ошибка системы</h2>
//             <p className="text-zinc-500 text-sm">{displayMessage}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
//             >
//               Попробовать снова
//             </button>
//           </div>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export default function App() {
//   return (
//     <ErrorBoundary>
//       <AppContent />
//     </ErrorBoundary>
//   );
// }

// function AppContent() {
//   const [user, setUser] = useState<any | null>(null);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [users, setUsers] = useState<UserProfile[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [view, setView] = useState<'landing' | 'forum' | 'post' | 'create' | 'documents' | 'community' | 'profile'>('landing');
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//   const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [isAuthReady, setIsAuthReady] = useState(false);
  
//   // Simple Auth States
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [displayName, setDisplayName] = useState('');
//   const [authError, setAuthError] = useState('');

//   useEffect(() => {
//     // Initialize data from localDb
//     const currentUser = localDb.getCurrentUser();
//     if (currentUser) {
//       setUser({ uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName });
//       setProfile(currentUser);
//     }
    
//     setCategories(localDb.getCategories());
//     setPosts(localDb.getPosts());
//     setUsers(localDb.getUsers());
//     setIsAuthReady(true);
//   }, []);

//   // Sync data when it changes (simulated)
//   useEffect(() => {
//     if (isAuthReady) {
//       const interval = setInterval(() => {
//         setPosts(localDb.getPosts());
//         setUsers(localDb.getUsers());
//       }, 2000);
//       return () => clearInterval(interval);
//     }
//   }, [isAuthReady]);

//   const handleLogin = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     setAuthError('');
    
//     const allUsers = localDb.getUsers();
//     const foundUser = allUsers.find(u => u.email === email);
    
//     if (foundUser) {
//       localDb.setCurrentUser(foundUser);
//       setUser({ uid: foundUser.uid, email: foundUser.email, displayName: foundUser.displayName });
//       setProfile(foundUser);
//       setShowAuthModal(false);
//       setEmail('');
//       setPassword('');
//     } else {
//       setAuthError('Email не найден или пароль неверный');
//     }
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setAuthError('');
//     if (!displayName.trim()) {
//       setAuthError('Пожалуйста, введите имя');
//       return;
//     }
    
//     const allUsers = localDb.getUsers();
//     if (allUsers.find(u => u.email === email)) {
//       setAuthError('Этот email уже используется');
//       return;
//     }

//     const newProfile: UserProfile = {
//       uid: Math.random().toString(36).substr(2, 9),
//       displayName: displayName,
//       email: email,
//       role: 'student',
//       points: 0,
//       dailyActivity: {},
//       createdAt: new Date().toISOString(),
//     };
    
//     localDb.setCurrentUser(newProfile);
//     setUser({ uid: newProfile.uid, email: newProfile.email, displayName: newProfile.displayName });
//     setProfile(newProfile);
//     setUsers(localDb.getUsers());
    
//     setShowAuthModal(false);
//     setEmail('');
//     setPassword('');
//     setDisplayName('');
//   };

//   const handleLogout = async () => {
//     localDb.setCurrentUser(null);
//     setUser(null);
//     setProfile(null);
//     setView('landing');
//   };

//   const createPost = async (title: string, content: string, categoryId: string, isAnonymous: boolean) => {
//     if (!profile || !user) return;
    
//     setIsPublishing(true);
//     try {
//       localDb.addPost({
//         title: title.trim(),
//         content: content.trim(),
//         authorId: user.uid,
//         authorName: isAnonymous ? 'Аноним' : profile.displayName,
//         categoryId,
//         isAnonymous
//       });
//       setPosts(localDb.getPosts());
//       setView('forum');
//     } catch (error) {
//       console.error("Error creating post:", error);
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   const handleLike = (postId: string) => {
//     if (!profile) {
//       setShowAuthModal(true);
//       return;
//     }
//     localDb.likePost(postId, profile.uid);
//     setPosts(localDb.getPosts());
    
//     // Update profile state to reflect likedPosts change
//     const updatedProfile = localDb.getCurrentUser();
//     if (updatedProfile) {
//       setProfile(updatedProfile);
//     }

//     if (selectedPost && selectedPost.id === postId) {
//       const updatedPosts = localDb.getPosts();
//       const updatedPost = updatedPosts.find(p => p.id === postId);
//       if (updatedPost) {
//         setSelectedPost(updatedPost);
//       }
//     }
//   };

//   const handleCommentAdded = (postId: string) => {
//     setPosts(localDb.getPosts());
//     if (selectedPost && selectedPost.id === postId) {
//       setSelectedPost({ ...selectedPost, commentCount: selectedPost.commentCount + 1 });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
//       {/* Navbar */}
//       <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-8">
//             <div 
//               className="flex items-center gap-2 cursor-pointer" 
//               onClick={() => setView('landing')}
//             >
//               <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white">
//                 <BookOpen size={20} />
//               </div>
//               <span className="text-xl font-bold tracking-tighter">Douboi</span>
//             </div>
            
//             <div className="hidden md:flex items-center gap-6">
//               <button onClick={() => setView('landing')} className={cn("text-sm font-medium transition-colors", view === 'landing' ? "text-black" : "text-zinc-500 hover:text-black")}>Главная</button>
//               <button onClick={() => setView('forum')} className={cn("text-sm font-medium transition-colors", view === 'forum' ? "text-black" : "text-zinc-500 hover:text-black")}>Форум</button>
//               <button onClick={() => setView('documents')} className={cn("text-sm font-medium transition-colors", view === 'documents' ? "text-black" : "text-zinc-500 hover:text-black")}>Материалы</button>
//               <button onClick={() => setView('community')} className={cn("text-sm font-medium transition-colors", view === 'community' ? "text-black" : "text-zinc-500 hover:text-black")}>Люди</button>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative hidden sm:block">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
//               <input 
//                 type="text" 
//                 placeholder="Поиск..."
//                 className="bg-zinc-100 border-none rounded-full py-2 pl-10 pr-4 text-sm w-48 focus:w-64 transition-all outline-none focus:ring-1 focus:ring-black"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             {profile ? (
//               <div className="flex items-center gap-4">
//                 <div className="text-right hidden sm:block">
//                   <p className="text-xs font-bold">{profile.displayName}</p>
//                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{profile.role === 'admin' ? 'Админ' : 'Студент'}</p>
//                 </div>
//                 <div className="relative">
//                   <button 
//                     onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                     className="w-8 h-8 rounded bg-black text-white flex items-center justify-center text-xs font-bold hover:bg-zinc-800 transition-all"
//                   >
//                     {profile.displayName[0].toUpperCase()}
//                   </button>
//                   {isProfileMenuOpen && (
//                     <>
//                       <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
//                       <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//                         <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
//                           <p className="text-xs font-bold truncate">{profile.displayName}</p>
//                           <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{profile.role === 'admin' ? 'Админ' : 'Студент'}</p>
//                         </div>
//                         <button 
//                           onClick={() => {
//                             setSelectedUser(profile);
//                             setView('profile');
//                             setIsProfileMenuOpen(false);
//                           }}
//                           className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-zinc-50 transition-colors flex items-center gap-3"
//                         >
//                           <Layout size={18} /> Мой профиль
//                         </button>
//                         <button 
//                           onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
//                           className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-zinc-50 flex items-center gap-2"
//                         >
//                           <LogOut size={16} /> Выйти
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <button 
//                 onClick={() => setShowAuthModal(true)}
//                 className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"
//               >
//                 <Globe size={16} /> Войти
//               </button>
//             )}
//             <button className="md:hidden p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//               <Menu size={20} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       <main>
//         {/* Mobile Sidebar */}
//         {isSidebarOpen && (
//           <div className="fixed inset-0 z-[60] md:hidden">
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
//             <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-2xl p-6 flex flex-col gap-8 animate-in slide-in-from-right duration-300">
//               <div className="flex items-center justify-between">
//                 <span className="text-xl font-black tracking-tighter uppercase">Меню</span>
//                 <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full">
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="flex flex-col gap-4">
//                 <button onClick={() => { setView('landing'); setIsSidebarOpen(false); }} className={cn("text-left py-3 px-4 rounded-xl font-bold transition-all", view === 'landing' ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100")}>Главная</button>
//                 <button onClick={() => { setView('forum'); setIsSidebarOpen(false); }} className={cn("text-left py-3 px-4 rounded-xl font-bold transition-all", view === 'forum' ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100")}>Форум</button>
//                 <button onClick={() => { setView('documents'); setIsSidebarOpen(false); }} className={cn("text-left py-3 px-4 rounded-xl font-bold transition-all", view === 'documents' ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100")}>Материалы</button>
//                 <button onClick={() => { setView('community'); setIsSidebarOpen(false); }} className={cn("text-left py-3 px-4 rounded-xl font-bold transition-all", view === 'community' ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100")}>Люди</button>
//               </div>
//               {!profile && (
//                 <button 
//                   onClick={() => { setShowAuthModal(true); setIsSidebarOpen(false); }}
//                   className="mt-auto bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
//                 >
//                   <Globe size={16} /> Войти
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {showAuthModal && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
//               <button 
//                 onClick={() => setShowAuthModal(false)}
//                 className="absolute right-6 top-6 text-zinc-400 hover:text-black"
//               >
//                 <X size={24} />
//               </button>
              
//               <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">
//                 {authMode === 'login' ? 'Вход' : 'Регистрация'}
//               </h2>
//               <p className="text-zinc-500 text-sm mb-8">
//                 {authMode === 'login' ? 'Рады видеть вас снова!' : 'Присоединяйтесь к нашему сообществу.'}
//               </p>

//               <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
//                 {authMode === 'register' && (
//                   <div className="space-y-1">
//                     <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Имя</label>
//                     <input 
//                       type="text" 
//                       required
//                       className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black transition-all"
//                       value={displayName}
//                       onChange={(e) => setDisplayName(e.target.value)}
//                     />
//                   </div>
//                 )}
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
//                   <input 
//                     type="email" 
//                     required
//                     className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black transition-all"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Пароль</label>
//                   <input 
//                     type="password" 
//                     required
//                     className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black transition-all"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>

//                 {authError && <p className="text-red-500 text-xs font-bold ml-1">{authError}</p>}

//                 <button 
//                   type="submit"
//                   className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
//                 >
//                   {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
//                 </button>
//               </form>

//               <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
//                 <button 
//                   onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
//                   className="text-sm font-bold text-zinc-400 hover:text-black transition-colors"
//                 >
//                   {authMode === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {view === 'landing' && (
//           <LandingView onStart={() => setView('forum')} />
//         )}

//         {view === 'forum' && (
//           <div className="max-w-7xl mx-auto px-4 py-8">
//             <ForumView 
//               posts={posts} 
//               categories={categories}
//               users={users}
//               selectedCategory={selectedCategory}
//               setSelectedCategory={setSelectedCategory}
//               searchQuery={searchQuery}
//               onPostClick={(post) => { setSelectedPost(post); setView('post'); }}
//               onCreatePost={() => setView('create')}
//               profile={profile}
//               onLike={handleLike}
//               onUserClick={(user) => {
//                 setSelectedUser(user);
//                 setView('profile');
//               }}
//             />
//           </div>
//         )}

//         {view === 'create' && (
//           <div className="max-w-7xl mx-auto px-4 py-8">
//             <CreatePostView 
//               categories={categories} 
//               onCancel={() => setView('forum')}
//               onSubmit={createPost}
//               isPublishing={isPublishing}
//             />
//           </div>
//         )}

//         {view === 'post' && selectedPost && (
//           <div className="max-w-7xl mx-auto px-4 py-8">
//             <PostDetailView 
//               post={selectedPost} 
//               onBack={() => setView('forum')} 
//               profile={profile}
//               onLike={handleLike}
//               onCommentAdded={handleCommentAdded}
//               onUserClick={(userId) => {
//                 const user = users.find(u => u.uid === userId);
//                 if (user) {
//                   setSelectedUser(user);
//                   setView('profile');
//                 }
//               }}
//             />
//           </div>
//         )}

//         {view === 'profile' && selectedUser && (
//           <div className="max-w-7xl mx-auto px-4 py-8">
//             <ProfileView 
//               user={selectedUser} 
//               onBack={() => setView('forum')}
//               isOwnProfile={profile?.uid === selectedUser.uid}
//               onPostClick={(post) => {
//                 setSelectedPost(post);
//                 setView('post');
//               }}
//             />
//           </div>
//         )}

//         {view === 'documents' && (
//           <div className="max-w-7xl mx-auto px-4 py-8">
//             <DocumentsView />
//           </div>
//         )}

//         {view === 'community' && (
//           <div className="max-w-7xl mx-auto px-4 py-8">
//             <CommunityView profile={profile} users={users} />
//           </div>
//         )}
//       </main>

//       <AIAssistant />
//     </div>
//   );
// }

// function LandingView({ onStart }: { onStart: () => void }) {
//   return (
//     <div className="space-y-0">
//       {/* Hero Section */}
//       <section className="hero-gradient text-white py-24 px-4 overflow-hidden relative">
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
//           <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
//             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
//               <Sparkles size={14} className="text-zinc-300" /> Платформа Douboi 2.0
//             </div>
//             <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
//               УЧИСЬ <br /> вместе, <br /> ДОСТИГАЙ <br /> большего.
//             </h1>
//             <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
//               Сообщество студентов, где помогают делом. Делись конспектами, задавай вопросы и готовься к экзаменам без лишнего стресса.
//             </p>
//             <div className="flex flex-wrap gap-4 pt-4">
//               <button 
//                 onClick={onStart}
//                 className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 text-lg"
//               >
//                 Начать учиться <ChevronRight size={20} />
//               </button>
//               <button className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/10 transition-all text-lg">
//                 Как это работает?
//               </button>
//             </div>
//           </div>
//           <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000">
//             <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-full"></div>
//             <div className="relative bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-6">
//                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
//                     <Users className="text-zinc-400 mb-4" size={32} />
//                     <h3 className="text-2xl font-bold">10к+</h3>
//                     <p className="text-zinc-500 text-sm">Студентов</p>
//                   </div>
//                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
//                     <MessageSquare className="text-zinc-400 mb-4" size={32} />
//                     <h3 className="text-2xl font-bold">50к+</h3>
//                     <p className="text-zinc-500 text-sm">Обсуждений</p>
//                   </div>
//                 </div>
//                 <div className="space-y-6 pt-12">
//                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
//                     <FileText className="text-zinc-400 mb-4" size={32} />
//                     <h3 className="text-2xl font-bold">5к+</h3>
//                     <p className="text-zinc-500 text-sm">Материалов</p>
//                   </div>
//                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
//                     <Trophy className="text-zinc-400 mb-4" size={32} />
//                     <h3 className="text-2xl font-bold">200+</h3>
//                     <p className="text-zinc-500 text-sm">Событий</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="py-24 px-4 team-section-bg">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center space-y-4 mb-16">
//             <h2 className="text-4xl font-black tracking-tighter uppercase">Кто мы такие</h2>
//             <p className="text-zinc-500 max-w-2xl mx-auto">Команда единомышленников, которые хотят сделать образование доступным и понятным для каждого.</p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { name: "Александр Волков", role: "Основатель", img: "https://picsum.photos/seed/a/400/400" },
//               { name: "Елена Соколова", role: "Технический директор", img: "https://picsum.photos/seed/b/400/400" },
//               { name: "Дмитрий Морозов", role: "Продукт-менеджер", img: "https://picsum.photos/seed/c/400/400" }
//             ].map((member, i) => (
//               <div key={i} className="group relative bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-black transition-all">
//                 <img src={member.img} alt={member.name} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
//                 <div className="p-6 text-center">
//                   <h4 className="text-xl font-bold">{member.name}</h4>
//                   <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">{member.role}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-24 px-4 bg-black text-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
//             {[
//               { icon: <Globe size={32} />, title: "Везде свои", desc: "Общайся со студентами со всей страны, от Калининграда до Владивостока." },
//               { icon: <Shield size={32} />, title: "Всё честно", desc: "Твои данные под защитой. Мы ценим приватность и безопасность." },
//               { icon: <Zap size={32} />, title: "Быстро и просто", desc: "Сайт летает на любом устройстве. Никаких тормозов, только учёба." },
//               { icon: <Star size={32} />, title: "Только польза", desc: "Наши модераторы следят за качеством контента. Никакого спама." }
//             ].map((feature, i) => (
//               <div key={i} className="space-y-4">
//                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold">{feature.title}</h3>
//                 <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// function ForumView({ 
//   posts, 
//   categories, 
//   users,
//   selectedCategory, 
//   setSelectedCategory, 
//   searchQuery, 
//   onPostClick, 
//   onCreatePost,
//   profile,
//   onLike,
//   onUserClick
// }: { 
//   posts: Post[], 
//   categories: Category[], 
//   users: UserProfile[],
//   selectedCategory: string | null, 
//   setSelectedCategory: (id: string | null) => void, 
//   searchQuery: string, 
//   onPostClick: (post: Post) => void,
//   onCreatePost: () => void,
//   profile: UserProfile | null,
//   onLike: (id: string) => void,
//   onUserClick: (user: UserProfile) => void
// }) {
//   const filteredPosts = posts.filter(p => {
//     const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });
//   const hotThreads = posts.slice(0, 3);

//   const handleUserClick = (e: React.MouseEvent, userId: string) => {
//     e.stopPropagation();
//     const user = users.find(u => u.uid === userId);
//     if (user) onUserClick(user);
//   };

//   return (
//     <div className="grid lg:grid-cols-12 gap-8">
//       {/* Sidebar */}
//       <div className="lg:col-span-3 space-y-8">
//         <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
//           <div>
//             <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Разделы</h3>
//             <div className="space-y-1">
//               <button 
//                 onClick={() => setSelectedCategory(null)}
//                 className={cn(
//                   "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
//                   !selectedCategory ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
//                 )}
//               >
//                 Все темы
//               </button>
//               {categories.map(cat => (
//                 <button 
//                   key={cat.id}
//                   onClick={() => setSelectedCategory(cat.id)}
//                   className={cn(
//                     "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
//                     selectedCategory === cat.id ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
//                   )}
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           {profile && (
//             <button 
//               onClick={onCreatePost}
//               className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
//             >
//               <Plus size={18} /> Создать тему
//             </button>
//           )}
//         </div>

//         <div className="bg-zinc-900 text-white rounded-2xl p-6 space-y-4">
//           <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} /> Статистика</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="text-zinc-500">Участников:</span>
//               <span className="font-bold">{users.length.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-zinc-500">Сообщений:</span>
//               <span className="font-bold">{posts.length.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-zinc-500">В сети:</span>
//               <span className="font-bold">1</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="lg:col-span-9 space-y-8">
//         {/* Hot Threads */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
//             <Award size={20} className="text-black" /> Популярное сейчас
//           </h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             {hotThreads.map(post => (
//               <div 
//                 key={post.id} 
//                 onClick={() => onPostClick(post)}
//                 className="hot-thread-card group cursor-pointer"
//               >
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center text-[10px] font-bold">
//                     {post.authorName[0]}
//                   </div>
//                   <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{post.authorName}</span>
//                 </div>
//                 <h4 className="font-bold text-sm line-clamp-2 group-hover:text-black transition-colors mb-4">{post.title}</h4>
//                 <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
//                   <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.commentCount}</span>
//                   <span className="flex items-center gap-1"><Eye size={12} /> {post.viewCount}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Thread List */}
//         <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
//           <div className="thread-list-header grid grid-cols-12 px-6 py-4">
//             <div className="col-span-7">Название темы</div>
//             <div className="col-span-2 text-center">Реакции</div>
//             <div className="col-span-3 text-right">Активность</div>
//           </div>
//           <div className="divide-y divide-zinc-100">
//             {filteredPosts.map(post => (
//               <div 
//                 key={post.id} 
//                 onClick={() => onPostClick(post)}
//                 className="thread-item-hover grid grid-cols-12 px-6 py-5 items-center"
//               >
//                 <div className="col-span-7 flex items-center gap-4">
//                   <div 
//                     onClick={(e) => handleUserClick(e, post.authorId)}
//                     className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-black font-bold shrink-0 hover:bg-black hover:text-white transition-all cursor-pointer"
//                   >
//                     {post.authorName[0].toUpperCase()}
//                   </div>
//                   <div className="min-w-0">
//                     <h4 className="font-bold text-zinc-900 truncate mb-1">{post.title}</h4>
//                     <p className="text-xs text-zinc-500">От <span onClick={(e) => handleUserClick(e, post.authorId)} className="font-bold text-zinc-700 hover:underline cursor-pointer">{post.authorName}</span> • {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru }) : 'Только что'}</p>
//                   </div>
//                 </div>
//                 <div className="col-span-2 flex flex-col items-center gap-1">
//                   <span className="text-xs font-bold text-zinc-900">{post.likeCount || 0}</span>
//                   <button 
//                     onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
//                     className={cn(
//                       "flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold transition-colors",
//                       profile?.likedPosts?.includes(post.id) ? "text-red-500" : "text-zinc-400 hover:text-black"
//                     )}
//                   >
//                     <Heart size={14} fill={profile?.likedPosts?.includes(post.id) ? "currentColor" : "none"} />
//                     Лайк
//                   </button>
//                 </div>
//                 <div className="col-span-2 flex flex-col items-center gap-1">
//                   <span className="text-xs font-bold text-zinc-900">{post.commentCount}</span>
//                   <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Ответов</span>
//                 </div>
//                 <div className="col-span-3 text-right">
//                   <div className="flex items-center justify-end gap-2 text-zinc-400">
//                     <Eye size={14} />
//                     <span className="text-xs font-bold">{post.viewCount}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {filteredPosts.length === 0 && (
//               <div className="py-20 text-center text-zinc-500">
//                 Ничего не найдено.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function DocumentsView() {
//   const docs = [
//     { title: "Матанализ 1 — Экзамен 2023", type: "PDF", size: "2.4 MB", downloads: 1250 },
//     { title: "Структуры данных и алгоритмы", type: "DOCX", size: "1.8 MB", downloads: 850 },
//     { title: "Общая физика 2", type: "PDF", size: "5.2 MB", downloads: 2100 },
//     { title: "Объектно-ориентированное программирование", type: "PDF", size: "3.1 MB", downloads: 1540 },
//     { title: "Политэкономия", type: "PDF", size: "1.2 MB", downloads: 420 },
//     { title: "Теория вероятностей и статистика", type: "PDF", size: "2.9 MB", downloads: 1100 }
//   ];

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-black tracking-tighter uppercase">База знаний</h2>
//           <p className="text-zinc-500">Собрание учебников, экзаменационных работ и полезных материалов.</p>
//         </div>
//         <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
//           <Plus size={18} /> Поделиться файлом
//         </button>
//       </div>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {docs.map((doc, i) => (
//           <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-black transition-all group cursor-pointer">
//             <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-black mb-4 group-hover:bg-black group-hover:text-white transition-all">
//               <FileText size={24} />
//             </div>
//             <h3 className="font-bold text-lg mb-2">{doc.title}</h3>
//             <div className="flex items-center gap-4 text-xs text-zinc-400 font-bold uppercase tracking-widest">
//               <span>{doc.type}</span>
//               <span>{doc.size}</span>
//               <span className="flex items-center gap-1"><Eye size={12} /> {doc.downloads}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function CommunityView({ profile, users }: { profile: UserProfile | null, users: UserProfile[] }) {
//   return (
//     <div className="grid lg:grid-cols-12 gap-8">
//       <div className="lg:col-span-8 space-y-8">
//         <div className="bg-white border border-zinc-200 rounded-2xl p-8 space-y-6">
//           <h2 className="text-2xl font-black tracking-tighter uppercase">Наши люди</h2>
//           <div className="grid md:grid-cols-2 gap-4">
//             {users.map((user) => (
//               <div key={user.uid} className="p-6 border border-zinc-100 rounded-xl hover:bg-zinc-50 transition-all flex items-center gap-4">
//                 <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
//                   {user.displayName[0].toUpperCase()}
//                 </div>
//                 <div>
//                   <h4 className="font-bold">{user.displayName}</h4>
//                   <p className="text-xs text-zinc-500 uppercase tracking-widest">{user.role === 'admin' ? 'Админ' : 'Студент'}</p>
//                   <p className="text-[10px] text-zinc-400 mt-1">В команде с: {new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
//                 </div>
//               </div>
//             ))}
//             {users.length === 0 && (
//               <p className="text-zinc-500 col-span-2 text-center py-8">Пока здесь никого нет.</p>
//             )}
//           </div>
//         </div>

//         <div className="bg-white border border-zinc-200 rounded-2xl p-8 space-y-6">
//           <h2 className="text-2xl font-black tracking-tighter uppercase">Что намечается</h2>
//           <div className="space-y-4">
//             {[
//               { title: "Воркшоп: Как стать веб-разработчиком", date: "20/03/2024", location: "Актовый зал" },
//               { title: "Конкурс: Code Challenge 2024", date: "25/03/2024", location: "Онлайн" },
//               { title: "Семинар: ИИ в учебе", date: "02/04/2024", location: "Аудитория 201" }
//             ].map((event, i) => (
//               <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-zinc-200">
//                     <span className="text-[10px] font-bold text-zinc-400 uppercase">{event.date.split('/')[1]}</span>
//                     <span className="text-lg font-black leading-none">{event.date.split('/')[0]}</span>
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-sm">{event.title}</h4>
//                     <p className="text-xs text-zinc-500">{event.location}</p>
//                   </div>
//                 </div>
//                 <button className="text-xs font-bold uppercase tracking-widest hover:underline">Участвовать</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="lg:col-span-4 space-y-8">
//         <div className="bg-black text-white rounded-2xl p-8 space-y-6">
//           <h3 className="text-xl font-bold flex items-center gap-2"><Star size={20} /> Лидеры</h3>
//           <div className="space-y-4">
//             {[
//               { name: "Александр", points: 2450, rank: 1 },
//               { name: "Елена", points: 2100, rank: 2 },
//               { name: "Дмитрий", points: 1950, rank: 3 },
//               { name: "Анна", points: 1800, rank: 4 },
//               { name: "Иван", points: 1650, rank: 5 }
//             ].map((user, i) => (
//               <div key={i} className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <span className={cn(
//                     "w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
//                     user.rank === 1 ? "bg-white text-black" : "bg-white/10 text-white"
//                   )}>{user.rank}</span>
//                   <span className="text-sm font-medium">{user.name}</span>
//                 </div>
//                 <span className="text-xs font-bold text-zinc-500">{user.points} pts</span>
//               </div>
//             ))}
//           </div>
//           <button className="w-full py-3 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
//             Посмотреть всех
//           </button>
//         </div>

//         <div className="bg-white border border-zinc-200 rounded-2xl p-8 space-y-6">
//           <h3 className="text-xl font-bold">Новички</h3>
//           <div className="flex flex-wrap gap-3">
//             {[1,2,3,4,5,6,7,8].map(i => (
//               <div key={i} className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-black font-bold text-xs border border-zinc-200">
//                 U{i}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CreatePostView({ categories, onCancel, onSubmit, isPublishing }: { categories: Category[], onCancel: () => void, onSubmit: (t: string, c: string, cat: string, a: boolean) => void, isPublishing: boolean }) {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [categoryId, setCategoryId] = useState('');
//   const [isAnonymous, setIsAnonymous] = useState(false);

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
//       <div className="flex items-center gap-4">
//         <button onClick={onCancel} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
//           <ArrowLeft size={24} />
//         </button>
//         <h2 className="text-3xl font-black tracking-tighter uppercase">Начать обсуждение</h2>
//       </div>

//       <div className="space-y-8">
//         <div className="space-y-2">
//           <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Заголовок</label>
//           <input 
//             type="text" 
//             placeholder="О чем хочешь спросить?"
//             className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-2xl py-4 px-6 outline-none transition-all font-bold text-lg"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             disabled={isPublishing}
//           />
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Раздел</label>
//             <select 
//               className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-2xl py-4 px-6 outline-none transition-all font-bold appearance-none"
//               value={categoryId}
//               onChange={(e) => setCategoryId(e.target.value)}
//               disabled={isPublishing}
//             >
//               <option value="">Выбери раздел</option>
//               {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//             </select>
//           </div>
//           <div className="flex items-end pb-4">
//             <label className="flex items-center gap-3 cursor-pointer select-none group">
//               <div className={cn(
//                 "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
//                 isAnonymous ? "bg-black border-black" : "bg-white border-zinc-200 group-hover:border-black"
//               )}>
//                 {isAnonymous && <Sparkles size={12} className="text-white" />}
//                 <input 
//                   type="checkbox" 
//                   className="hidden"
//                   checked={isAnonymous}
//                   onChange={(e) => setIsAnonymous(e.target.checked)}
//                   disabled={isPublishing}
//                 />
//               </div>
//               <span className="text-sm font-bold text-zinc-500 group-hover:text-black transition-colors">Опубликовать анонимно</span>
//             </label>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Суть вопроса</label>
//           <textarea 
//             rows={12}
//             placeholder="Опиши свою проблему подробнее..."
//             className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-2xl py-6 px-6 outline-none transition-all font-medium resize-none leading-relaxed"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             disabled={isPublishing}
//           />
//         </div>

//         <div className="flex items-center justify-end gap-6 pt-4">
//           <button 
//             onClick={onCancel} 
//             disabled={isPublishing}
//             className="text-sm font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
//           >
//             Отмена
//           </button>
//           <button 
//             disabled={!title || !content || !categoryId || isPublishing}
//             onClick={() => onSubmit(title, content, categoryId, isAnonymous)}
//             className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10 flex items-center gap-2"
//           >
//             {isPublishing ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 Публикуем...
//               </>
//             ) : (
//               'Опубликовать'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function PostDetailView({ post, onBack, profile, onLike, onCommentAdded, onUserClick }: { post: Post, onBack: () => void, profile: UserProfile | null, onLike: (id: string) => void, onCommentAdded: (id: string) => void, onUserClick: (userId: string) => void }) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const commentSectionRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setComments(localDb.getComments(post.id));
//   }, [post.id]);

//   const handleAddComment = async () => {
//     if (!profile || !newComment.trim()) return;
//     setIsSubmitting(true);
//     try {
//       localDb.addComment({
//         postId: post.id,
//         content: newComment,
//         authorId: profile.uid,
//         authorName: profile.displayName
//       });
//       setComments(localDb.getComments(post.id));
//       setNewComment('');
//       onCommentAdded(post.id);
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const scrollToComments = () => {
//     commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">
//       <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-black font-bold text-xs uppercase tracking-widest transition-colors">
//         <ArrowLeft size={16} /> Назад к темам
//       </button>

//       <article className="bg-white p-8 md:p-16 rounded-3xl border border-zinc-200 shadow-sm">
//         <div className="flex items-center gap-4 mb-10">
//           <div 
//             onClick={() => onUserClick(post.authorId)}
//             className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-zinc-800 transition-all"
//           >
//             {post.authorName[0].toUpperCase()}
//           </div>
//           <div>
//             <h3 onClick={() => onUserClick(post.authorId)} className="font-bold text-lg hover:underline cursor-pointer">{post.authorName}</h3>
//             <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
//               {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}
//             </p>
//           </div>
//         </div>

//         <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-[1.1]">{post.title}</h1>
        
//         <div className="prose prose-zinc max-w-none mb-16 text-lg leading-relaxed">
//           <Markdown>{post.content}</Markdown>
//         </div>

//         <div className="flex items-center gap-8 pt-10 border-t border-zinc-100">
//           <button 
//             onClick={() => onLike(post.id)}
//             className={cn(
//               "flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-widest",
//               profile?.likedPosts?.includes(post.id) ? "text-red-500" : "text-zinc-400 hover:text-black"
//             )}
//           >
//             <Heart size={20} fill={profile?.likedPosts?.includes(post.id) ? "currentColor" : "none"} /> {post.likeCount || 0} Нравится
//           </button>
//           <button 
//             onClick={scrollToComments}
//             className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors font-bold text-xs uppercase tracking-widest"
//           >
//             <MessageSquare size={20} /> {post.commentCount || 0} Комментарии
//           </button>
//           <button className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors font-bold text-xs uppercase tracking-widest">
//             <Share2 size={20} /> Поделиться
//           </button>
//         </div>
//       </article>

//       <div className="space-y-8" ref={commentSectionRef}>
//         <h3 className="text-2xl font-black tracking-tighter uppercase">
//           Обсуждение <span className="text-zinc-300">({comments.length})</span>
//         </h3>

//         {profile ? (
//           <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 flex gap-6">
//             <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white font-bold shrink-0">
//               {profile.displayName[0].toUpperCase()}
//             </div>
//             <div className="flex-1 space-y-4">
//               <textarea 
//                 placeholder="Что думаешь об этом?"
//                 className="w-full bg-white border border-zinc-200 rounded-2xl py-4 px-6 outline-none focus:border-black transition-all resize-none min-h-[150px] leading-relaxed"
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//               />
//               <div className="flex justify-end">
//                 <button 
//                   disabled={!newComment.trim() || isSubmitting}
//                   onClick={handleAddComment}
//                   className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
//                 >
//                   Отправить
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-zinc-100 p-12 rounded-3xl border border-dashed border-zinc-300 text-center">
//             <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Войди в аккаунт, чтобы участвовать в беседе.</p>
//           </div>
//         )}

//         <div className="space-y-6">
//           {[...comments].reverse().map(comment => (
//             <div key={comment.id} className="bg-white p-8 rounded-3xl border border-zinc-100 flex gap-6 hover:border-zinc-200 transition-all">
//               <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-black font-bold shrink-0">
//                 {comment.authorName[0].toUpperCase()}
//               </div>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <span className="font-bold">{comment.authorName}</span>
//                   <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">• {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ru })}</span>
//                 </div>
//                 <p className="text-zinc-600 leading-relaxed text-lg">{comment.content}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ProfileView({ user, isOwnProfile, onBack, onPostClick }: { user: UserProfile, isOwnProfile: boolean, onBack: () => void, onPostClick: (post: Post) => void }) {
//   const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
//   const [userPosts, setUserPosts] = useState<Post[]>([]);
//   const [userComments, setUserComments] = useState<Comment[]>([]);

//   useEffect(() => {
//     setUserPosts(localDb.getUserPosts(user.uid));
//     setUserComments(localDb.getUserComments(user.uid));
//   }, [user.uid]);

//   // Activity Graph Logic
//   const last90Days = Array.from({ length: 90 }, (_, i) => {
//     const d = new Date();
//     d.setDate(d.getDate() - (89 - i));
//     return d.toISOString().split('T')[0];
//   });

//   const getActivityColor = (count: number) => {
//     if (count === 0) return 'bg-zinc-100';
//     if (count < 3) return 'bg-emerald-200';
//     if (count < 6) return 'bg-emerald-400';
//     return 'bg-emerald-600';
//   };

//   return (
//     <div className="max-w-5xl mx-auto space-y-8">
//       <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-black font-bold text-xs uppercase tracking-widest transition-colors">
//         <ArrowLeft size={16} /> Назад
//       </button>

//       <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
//         <div className="h-32 bg-zinc-900 relative">
//           <div className="absolute -bottom-12 left-8">
//             <div className="w-24 h-24 rounded-3xl bg-black border-4 border-white flex items-center justify-center text-white font-black text-4xl shadow-xl">
//               {user.displayName[0].toUpperCase()}
//             </div>
//           </div>
//         </div>
        
//         <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div className="space-y-2">
//             <h2 className="text-3xl font-black tracking-tighter uppercase">{user.displayName}</h2>
//             <p className="text-zinc-500 font-medium">{user.bio || "О себе пока ничего не рассказал."}</p>
//             <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
//               <span className="flex items-center gap-1"><Calendar size={14} /> В команде с {new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
//               <span className="flex items-center gap-1"><Star size={14} /> {user.role === 'admin' ? 'Админ' : 'Студент'}</span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100 text-center">
//               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Репутация</p>
//               <p className="text-2xl font-black flex items-center justify-center gap-2">
//                 <Trophy size={20} className="text-yellow-500" /> {user.points || 0}
//               </p>
//             </div>
//             {isOwnProfile && (
//               <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all">
//                 Редактировать
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
//         <h3 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
//           <TrendingUp size={20} /> Активность
//         </h3>
        
//         <div className="overflow-x-auto pb-4">
//           <div className="flex gap-1 min-w-max">
//             {last90Days.map(date => {
//               const count = user.dailyActivity?.[date] || 0;
//               return (
//                 <div 
//                   key={date}
//                   title={`${date}: ${count} действий`}
//                   className={cn("w-3 h-3 rounded-sm transition-all hover:scale-150 cursor-pointer", getActivityColor(count))}
//                 />
//               );
//             })}
//           </div>
//           <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
//             <span>90 дней назад</span>
//             <span>Сегодня</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-12 gap-8">
//         <div className="lg:col-span-8 space-y-6">
//           <div className="flex gap-8 border-b border-zinc-100">
//             <button 
//               onClick={() => setActiveTab('posts')}
//               className={cn(
//                 "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative",
//                 activeTab === 'posts' ? "text-black" : "text-zinc-400 hover:text-black"
//               )}
//             >
//               Посты ({userPosts.length})
//               {activeTab === 'posts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
//             </button>
//             <button 
//               onClick={() => setActiveTab('comments')}
//               className={cn(
//                 "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative",
//                 activeTab === 'comments' ? "text-black" : "text-zinc-400 hover:text-black"
//               )}
//             >
//               Комментарии ({userComments.length})
//               {activeTab === 'comments' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
//             </button>
//           </div>

//           <div className="space-y-4">
//             {activeTab === 'posts' ? (
//               userPosts.length > 0 ? (
//                 userPosts.map(post => (
//                   <div 
//                     key={post.id} 
//                     onClick={() => onPostClick(post)}
//                     className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-zinc-300 transition-all cursor-pointer group"
//                   >
//                     <h4 className="font-bold text-lg group-hover:underline mb-2">{post.title}</h4>
//                     <div className="flex items-center gap-4 text-xs text-zinc-400 font-bold uppercase tracking-widest">
//                       <span className="flex items-center gap-1"><Heart size={12} /> {post.likeCount}</span>
//                       <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.commentCount}</span>
//                       <span>{new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="py-12 text-center text-zinc-400 font-medium">Пока нет ни одного поста.</div>
//               )
//             ) : (
//               userComments.length > 0 ? (
//                 userComments.map(comment => (
//                   <div key={comment.id} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-2">
//                     <p className="text-zinc-600 leading-relaxed">{comment.content}</p>
//                     <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
//                       В теме: {comment.postId} • {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="py-12 text-center text-zinc-400 font-medium">Комментариев пока нет.</div>
//               )
//             )}
//           </div>
//         </div>

//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 space-y-4">
//             <h4 className="font-bold uppercase tracking-widest text-xs text-zinc-400">Достижения</h4>
//             <div className="space-y-3">
//               {user.points >= 100 && (
//                 <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-zinc-100">
//                   <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
//                     <Award size={18} />
//                   </div>
//                   <span className="text-xs font-bold">Активный участник</span>
//                 </div>
//               )}
//               {userPosts.length >= 5 && (
//                 <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-zinc-100">
//                   <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
//                     <FileText size={18} />
//                   </div>
//                   <span className="text-xs font-bold">Автор контента</span>
//                 </div>
//               )}
//               <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-zinc-100">
//                 <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
//                   <Clock size={18} />
//                 </div>
//                 <span className="text-xs font-bold">Новичок</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AIAssistant() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;
//     const userMsg = input;
//     setInput('');
//     setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
//     setIsLoading(true);

//     try {
//       const result = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: userMsg,
//         config: {
//           systemInstruction: "Вы — Douboi AI, полезный ИИ-помощник для студенческого форума. Дайте краткую, точную и ободряющую академическую помощь. Используйте Markdown для форматирования. Отвечайте на русском языке.",
//         }
//       });
//       setMessages(prev => [...prev, { role: 'ai', text: result.text || "Извините, я не смог это обработать." }]);
//     } catch (error) {
//       setMessages(prev => [...prev, { role: 'ai', text: "Ошибка подключения к ИИ-сервису." }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-8 right-8 z-[100]">
//       {isOpen ? (
//         <div className="w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
//           <div className="bg-black p-4 text-white flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
//                 <Sparkles size={18} className="text-white" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-sm">Douboi AI</h3>
//                 <p className="text-[10px] text-white/60 uppercase tracking-widest">Ассистент</p>
//               </div>
//             </div>
//             <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
//               <X size={20} />
//             </button>
//           </div>

//           <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
//             {messages.length === 0 && (
//               <div className="text-center py-12 px-6">
//                 <div className="w-16 h-16 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
//                   <Sparkles size={32} className="text-black" />
//                 </div>
//                 <h4 className="font-bold mb-2">Чем могу помочь?</h4>
//                 <p className="text-sm text-zinc-500">Я могу объяснить сложные темы, пересказать посты или помочь с домашкой.</p>
//               </div>
//             )}
//             {messages.map((msg, i) => (
//               <div key={i} className={cn(
//                 "max-w-[85%] p-3 rounded-xl text-sm leading-relaxed",
//                 msg.role === 'user' 
//                   ? "bg-black text-white ml-auto rounded-tr-none" 
//                   : "bg-white text-black mr-auto rounded-tl-none shadow-sm border border-zinc-200"
//               )}>
//                 <Markdown>{msg.text}</Markdown>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="bg-white text-black mr-auto rounded-xl rounded-tl-none shadow-sm border border-zinc-200 p-3 max-w-[85%]">
//                 <div className="flex gap-1">
//                   <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
//                   <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
//                   <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="p-4 bg-white border-t border-zinc-200">
//             <div className="relative">
//               <input 
//                 type="text" 
//                 placeholder="Спроси о чем угодно..."
//                 className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-3 pl-4 pr-12 outline-none focus:border-black transition-all"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//               />
//               <button 
//                 onClick={handleSend}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-black hover:bg-zinc-100 rounded-lg transition-colors"
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <button 
//           onClick={() => setIsOpen(true)}
//           className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
//         >
//           <Sparkles size={28} />
//         </button>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { localDb } from './localDb';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserProfile, Category, Post, Comment, Document as DocType, Notification, LeaderboardEntry } from './types';
import {
  MessageSquare, BookOpen, Users, Plus, Search, Menu, X, Sparkles, Clock, Eye, Trophy,
  Star, FileText, Layout, Globe, Calendar, Heart, Share2, TrendingUp, Award, ChevronRight,
  ArrowLeft, Shield, Zap, LogOut, Crown, Medal, Bell, Download, Upload, File, Check,
  AlertCircle, CreditCard
} from 'lucide-react';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState({ usersCount: 0, postsCount: 0, commentsCount: 0, documentsCount: 0 });
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<string>('landing');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => { refreshAll(); }, []);
  useEffect(() => {
    if (profile) {
      const iv = setInterval(refreshAll, 3000);
      return () => clearInterval(iv);
    }
  }, [profile?.uid]);

  const refreshAll = () => {
    const cu = localDb.getCurrentUser();
    if (cu) { setProfile(cu); }
    setCategories(localDb.getCategories());
    setPosts(localDb.getPosts());
    setUsers(localDb.getUsers());
    setLeaderboard(localDb.getLeaderboard());
    setStats(localDb.getStats());
    setDocuments(localDb.getDocuments());
    if (cu) {
      setNotifications(localDb.getNotifications(cu.uid));
      setUnreadCount(localDb.getUnreadCount(cu.uid));
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    const found = localDb.getUsers().find(u => u.email === email);
    if (found) {
      localDb.setCurrentUser(found);
      setProfile(found);
      setShowAuthModal(false);
      setEmail(''); setPassword('');
      refreshAll();
    } else {
      setAuthError('Email не найден');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!displayName.trim()) { setAuthError('Введите имя'); return; }
    if (localDb.getUsers().find(u => u.email === email)) { setAuthError('Email занят'); return; }
    const newUser: UserProfile = {
      uid: Math.random().toString(36).substr(2, 9), displayName, email, role: 'student',
      points: 0, dailyActivity: {}, createdAt: new Date().toISOString(),
      isPremium: false, dailyDownloads: 0
    };
    localDb.setCurrentUser(newUser);
    localDb.addNotification(newUser.uid, 'system', 'Добро пожаловать!', `Привет, ${displayName}! Начни зарабатывать очки!`);
    setProfile(newUser);
    setShowAuthModal(false);
    setEmail(''); setPassword(''); setDisplayName('');
    refreshAll();
  };

  const handleLogout = () => { localDb.setCurrentUser(null); setProfile(null); setView('landing'); refreshAll(); };

  const createPost = (title: string, content: string, categoryId: string, isAnonymous: boolean) => {
    if (!profile) return;
    setIsPublishing(true);
    localDb.addPost({ title: title.trim(), content: content.trim(), authorId: profile.uid, authorName: isAnonymous ? 'Аноним' : profile.displayName, categoryId, isAnonymous });
    refreshAll();
    setView('forum');
    setIsPublishing(false);
  };

  const handleLike = (postId: string) => {
    if (!profile) { setShowAuthModal(true); return; }
    localDb.likePost(postId, profile.uid);
    refreshAll();
    if (selectedPost?.id === postId) {
      const up = localDb.getPosts().find(p => p.id === postId);
      if (up) setSelectedPost(up);
    }
  };

  const handleCommentAdded = () => { refreshAll(); };
  const handleMarkAllRead = () => { if (profile) { localDb.markAllRead(profile.uid); refreshAll(); } };
  const handleActivatePremium = (plan: 'monthly' | 'yearly') => {
    if (!profile) return;
    localDb.activatePremium(profile.uid, plan);
    refreshAll();
    setShowPremiumModal(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white"><BookOpen size={20} /></div>
              <span className="text-xl font-bold tracking-tighter">Douboi</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {[['landing', 'Главная'], ['forum', 'Форум'], ['documents', 'Материалы'], ['community', 'Люди и рейтинг']].map(([v, l]) => (
                <button key={v} onClick={() => setView(v)} className={cn("text-sm font-medium transition-colors", view === v ? "text-black" : "text-zinc-500 hover:text-black")}>{l}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input type="text" placeholder="Поиск..." className="bg-zinc-100 border-none rounded-full py-2 pl-10 pr-4 text-sm w-48 focus:w-64 transition-all outline-none focus:ring-1 focus:ring-black" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {profile ? (
              <div className="flex items-center gap-3">
                {/* Bell */}
                <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-zinc-100 rounded-full">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50 max-h-[400px] flex flex-col overflow-hidden">
                        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                          <span className="font-bold text-sm">Уведомления</span>
                          {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-xs text-blue-500 hover:underline">Прочитать все</button>}
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {notifications.length > 0 ? notifications.slice(0, 20).map(n => (
                            <div key={n.id} className={cn("px-4 py-3 border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer", !n.isRead && "bg-blue-50")} onClick={() => { if (!n.isRead) { localDb.markRead(n.id); refreshAll(); } }}>
                              <div className="flex items-start gap-3">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", n.type === 'like' ? "bg-red-100 text-red-500" : n.type === 'comment' ? "bg-blue-100 text-blue-500" : n.type === 'download' ? "bg-green-100 text-green-500" : n.type === 'premium' ? "bg-yellow-100 text-yellow-600" : "bg-zinc-100 text-zinc-500")}>
                                  {n.type === 'like' && <Heart size={14} />}{n.type === 'comment' && <MessageSquare size={14} />}{n.type === 'download' && <Download size={14} />}{n.type === 'premium' && <Crown size={14} />}{n.type === 'system' && <Bell size={14} />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate">{n.title}</p>
                                  <p className="text-xs text-zinc-500 line-clamp-2">{n.message}</p>
                                  <p className="text-[10px] text-zinc-400 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ru })}</p>
                                </div>
                              </div>
                            </div>
                          )) : <div className="py-8 text-center text-zinc-400 text-sm">Нет уведомлений</div>}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1"><p className="text-xs font-bold">{profile.displayName}</p>{profile.isPremium && <Crown size={12} className="text-yellow-500" />}</div>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1 justify-end"><Trophy size={10} className="text-yellow-500" /> {profile.points} pts</p>
                </div>
                <div className="relative">
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className={cn("w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all", profile.isPremium ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : "bg-black text-white hover:bg-zinc-800")}>{profile.displayName[0].toUpperCase()}</button>
                  {isProfileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
                          <p className="text-xs font-bold truncate flex items-center gap-1">{profile.displayName}{profile.isPremium && <Crown size={12} className="text-yellow-500" />}</p>
                          <p className="text-[10px] text-zinc-500 flex items-center gap-1"><Trophy size={10} className="text-yellow-500" /> {profile.points} очков</p>
                        </div>
                        <button onClick={() => { setSelectedUser(profile); setView('profile'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-zinc-50 flex items-center gap-3"><Layout size={18} /> Мой профиль</button>
                        {!profile.isPremium && <button onClick={() => { setShowPremiumModal(true); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-zinc-50 flex items-center gap-3 text-yellow-600"><Crown size={18} /> Premium</button>}
                        <button onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-zinc-50 flex items-center gap-2"><LogOut size={16} /> Выйти</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"><Globe size={16} /> Войти</button>
            )}
            <button className="md:hidden p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={20} /></button>
          </div>
        </div>
      </nav>

      <main>
        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-2xl p-6 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black tracking-tighter uppercase">Меню</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex flex-col gap-4">
                {[['landing', 'Главная'], ['forum', 'Форум'], ['documents', 'Материалы'], ['community', 'Люди и рейтинг']].map(([v, l]) => (
                  <button key={v} onClick={() => { setView(v); setIsSidebarOpen(false); }} className={cn("text-left py-3 px-4 rounded-xl font-bold transition-all", view === v ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100")}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
              <button onClick={() => setShowAuthModal(false)} className="absolute right-6 top-6 text-zinc-400 hover:text-black"><X size={24} /></button>
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">{authMode === 'login' ? 'Вход' : 'Регистрация'}</h2>
              <p className="text-zinc-500 text-sm mb-8">{authMode === 'login' ? 'Рады видеть!' : 'Присоединяйся.'}</p>
              <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                {authMode === 'register' && <div className="space-y-1"><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Имя</label><input type="text" required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black" value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>}
                <div className="space-y-1"><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label><input type="email" required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Пароль</label><input type="password" required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black" value={password} onChange={e => setPassword(e.target.value)} /></div>
                {authError && <p className="text-red-500 text-xs font-bold ml-1">{authError}</p>}
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-zinc-800">{authMode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
              </form>
              <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-zinc-400 hover:text-black">{authMode === 'login' ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Premium Modal */}
        {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onActivate={handleActivatePremium} />}

        {view === 'landing' && <LandingView onStart={() => setView('forum')} stats={stats} leaderboard={leaderboard} onPremiumClick={() => profile ? setShowPremiumModal(true) : setShowAuthModal(true)} />}
        {view === 'forum' && <div className="max-w-7xl mx-auto px-4 py-8"><ForumView posts={posts} categories={categories} users={users} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} searchQuery={searchQuery} onPostClick={p => { setSelectedPost(p); setView('post'); }} onCreatePost={() => setView('create')} profile={profile} onLike={handleLike} stats={stats} leaderboard={leaderboard} onUserClick={u => { setSelectedUser(u); setView('profile'); }} /></div>}
        {view === 'create' && <div className="max-w-7xl mx-auto px-4 py-8"><CreatePostView categories={categories} onCancel={() => setView('forum')} onSubmit={createPost} isPublishing={isPublishing} /></div>}
        {view === 'post' && selectedPost && <div className="max-w-7xl mx-auto px-4 py-8"><PostDetailView post={selectedPost} onBack={() => setView('forum')} profile={profile} onLike={handleLike} onCommentAdded={handleCommentAdded} onUserClick={uid => { const u = users.find(x => x.uid === uid); if (u) { setSelectedUser(u); setView('profile'); } }} /></div>}
        {view === 'profile' && selectedUser && <div className="max-w-7xl mx-auto px-4 py-8"><ProfileView user={selectedUser} onBack={() => setView('forum')} isOwnProfile={profile?.uid === selectedUser.uid} onPostClick={p => { setSelectedPost(p); setView('post'); }} leaderboard={leaderboard} onPremiumClick={() => setShowPremiumModal(true)} /></div>}
        {view === 'documents' && <div className="max-w-7xl mx-auto px-4 py-8"><DocumentsView documents={documents} categories={categories} profile={profile} onRefresh={refreshAll} onLoginRequired={() => setShowAuthModal(true)} onPremiumRequired={() => setShowPremiumModal(true)} /></div>}
        {view === 'community' && <div className="max-w-7xl mx-auto px-4 py-8"><CommunityView users={users} leaderboard={leaderboard} onUserClick={u => { setSelectedUser(u); setView('profile'); }} /></div>}
      </main>
    </div>
  );
}

// ========== COMPONENTS ==========

function PremiumModal({ onClose, onActivate }: { onClose: () => void; onActivate: (plan: 'monthly' | 'yearly') => void }) {
  const [sel, setSel] = useState<'monthly' | 'yearly'>('monthly');
  const plans = [
    { id: 'monthly' as const, name: 'Месячный', price: 99, period: 'мес', features: ['Без лимита скачиваний', 'Premium материалы', 'Значок в профиле'] },
    { id: 'yearly' as const, name: 'Годовой', price: 999, period: 'год', discount: '2 мес бесплатно!', features: ['Всё из месячного', 'Скидка 17%', 'Эксклюзивные материалы'] }
  ];
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-6 top-6 text-zinc-400 hover:text-black"><X size={24} /></button>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Crown size={32} className="text-white" /></div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Douboi Premium</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {plans.map(p => (
            <div key={p.id} onClick={() => setSel(p.id)} className={cn("rounded-2xl p-6 cursor-pointer transition-all border-2", sel === p.id ? "border-yellow-400 bg-yellow-50" : "border-zinc-200")}>
              <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg">{p.name}</h3>{p.discount && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{p.discount}</span>}</div>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-black">{p.price}</span><span className="text-zinc-500">₽/{p.period}</span></div>
              <ul className="space-y-2">{p.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-zinc-600"><Check size={16} className="text-green-500" />{f}</li>)}</ul>
            </div>
          ))}
        </div>
        <button onClick={() => onActivate(sel)} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2"><CreditCard size={20} />Активировать (демо)</button>
        <p className="text-center text-xs text-zinc-400 mt-3">Демо-версия. Оплата не взимается.</p>
      </div>
    </div>
  );
}

function LandingView({ onStart, stats, leaderboard, onPremiumClick }: { onStart: () => void; stats: any; leaderboard: LeaderboardEntry[]; onPremiumClick: () => void }) {
  return (
    <div className="space-y-0">
      <section className="hero-gradient text-white py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20"><Sparkles size={14} /> Платформа Douboi 2.0</div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">УЧИСЬ <br /> вместе, <br /> ДОСТИГАЙ <br /> большего.</h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">Место, где студенты реально помогают друг другу. Конспекты, ответы на вопросы, подготовка к экзаменам — всё тут.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={onStart} className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 flex items-center gap-2 text-lg">Начать учиться <ChevronRight size={20} /></button>
              <button onClick={onPremiumClick} className="px-8 py-4 rounded-full font-bold border border-yellow-400/50 hover:bg-yellow-400/10 text-lg text-yellow-400 flex items-center gap-2"><Crown size={20} /> Premium</button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                {[{ icon: <Users size={32} />, val: stats.usersCount, label: 'Студентов' }, { icon: <MessageSquare size={32} />, val: stats.commentsCount, label: 'Обсуждений' }, { icon: <FileText size={32} />, val: stats.documentsCount, label: 'Материалов' }, { icon: <Trophy size={32} />, val: stats.postsCount, label: 'Тем на форуме' }].map((s, i) => (
                  <div key={i} className={cn("bg-white/5 p-6 rounded-2xl border border-white/10", i >= 2 && "mt-6")}><div className="text-zinc-400 mb-4">{s.icon}</div><h3 className="text-2xl font-bold">{s.val}+</h3><p className="text-zinc-500 text-sm">{s.label}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 team-section-bg">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl font-black tracking-tighter uppercase">Наша команда</h2>
          <p className="text-zinc-500">Мы просто хотим, чтобы учиться было проще.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[{ name: "Чан Нгок Минь", img: "https://picsum.photos/seed/minh/400/400" }, { name: "До Хю Хоанг", img: "https://picsum.photos/seed/hoang/400/400" }, { name: "Егор", img: "https://picsum.photos/seed/egor/400/400" }].map((m, i) => (
            <div key={i} className="group bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-black transition-all">
              <img src={m.img} alt={m.name} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="p-6 text-center"><h4 className="text-xl font-bold">{m.name}</h4></div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 bg-black text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[{ icon: <Globe size={32} />, title: "Везде свои", desc: "Студенты со всей страны." }, { icon: <Shield size={32} />, title: "Всё честно", desc: "Данные под защитой. Без рекламы." }, { icon: <Zap size={32} />, title: "Быстро", desc: "Работает шустро." }, { icon: <Star size={32} />, title: "Без мусора", desc: "Модераторы следят. Спам удаляется." }].map((f, i) => (
            <div key={i} className="space-y-4"><div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">{f.icon}</div><h3 className="text-xl font-bold">{f.title}</h3><p className="text-zinc-500 text-sm">{f.desc}</p></div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-yellow-50 to-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm font-bold mb-6"><Crown size={16} /> Premium</div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Качай без лимитов</h2>
          <p className="text-zinc-500 max-w-xl mx-auto mb-8">С Premium качаешь сколько хочешь и открываешь закрытые материалы.</p>
          <button onClick={onPremiumClick} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 shadow-lg">Попробовать — от 99₽/мес</button>
        </div>
      </section>
    </div>
  );
}

function ForumView({ posts, categories, users, selectedCategory, setSelectedCategory, searchQuery, onPostClick, onCreatePost, profile, onLike, stats, leaderboard, onUserClick }: any) {
  const filtered = posts.filter((p: Post) => {
    const s = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const c = !selectedCategory || p.categoryId === selectedCategory;
    return s && c;
  });
  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Разделы</h3>
          <div className="space-y-1">
            <button onClick={() => setSelectedCategory(null)} className={cn("w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left", !selectedCategory ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100")}>Все темы</button>
            {categories.map((cat: Category) => <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={cn("w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left", selectedCategory === cat.id ? "bg-black text-white" : "text-zinc-500 hover:bg-zinc-100")}>{cat.name}</button>)}
          </div>
          {profile && <button onClick={onCreatePost} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-zinc-800 flex items-center justify-center gap-2"><Plus size={18} /> Создать тему</button>}
        </div>
        <div className="bg-zinc-900 text-white rounded-2xl p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} /> Статистика</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Участников:</span><span className="font-bold">{stats.usersCount}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Тем:</span><span className="font-bold">{stats.postsCount}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Материалов:</span><span className="font-bold">{stats.documentsCount}</span></div>
          </div>
        </div>
        {leaderboard.length > 0 && (
          <div className="bg-gradient-to-b from-yellow-50 to-white border border-yellow-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm"><Crown size={16} className="text-yellow-500" /> Топ-5</h3>
            {leaderboard.slice(0, 5).map((u: LeaderboardEntry, i: number) => (
              <div key={u.uid} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><span className={cn("w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center", i === 0 ? "bg-yellow-400 text-black" : i === 1 ? "bg-zinc-300 text-black" : i === 2 ? "bg-orange-400 text-white" : "bg-zinc-100 text-zinc-500")}>{i + 1}</span><span className="font-medium truncate max-w-[100px]">{u.displayName}</span></div>
                <span className="text-zinc-500 text-xs">{u.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lg:col-span-9 space-y-8">
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="thread-list-header grid grid-cols-12 px-6 py-4"><div className="col-span-8">Тема</div><div className="col-span-2 text-center">Реакции</div><div className="col-span-2 text-right">Просмотры</div></div>
          <div className="divide-y divide-zinc-100">
            {filtered.map((post: Post) => (
              <div key={post.id} onClick={() => onPostClick(post)} className="thread-item-hover grid grid-cols-12 px-6 py-5 items-center">
                <div className="col-span-8 flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-black font-bold shrink-0">{post.authorName[0].toUpperCase()}</div>
                  <div className="min-w-0"><h4 className="font-bold text-zinc-900 truncate mb-1">{post.title}</h4><p className="text-xs text-zinc-500">От {post.authorName} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}</p></div>
                </div>
                <div className="col-span-2 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold">{post.likeCount}</span>
                  <button onClick={e => { e.stopPropagation(); onLike(post.id); }} className={cn("flex items-center gap-1 text-[10px] uppercase font-bold", profile?.likedPosts?.includes(post.id) ? "text-red-500" : "text-zinc-400 hover:text-black")}><Heart size={14} fill={profile?.likedPosts?.includes(post.id) ? "currentColor" : "none"} /> Лайк</button>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2 text-zinc-400"><Eye size={14} /><span className="text-xs font-bold">{post.viewCount}</span></div>
              </div>
            ))}
            {filtered.length === 0 && <div className="py-20 text-center text-zinc-500">Ничего не найдено.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatePostView({ categories, onCancel, onSubmit, isPublishing }: { categories: Category[]; onCancel: () => void; onSubmit: (t: string, c: string, cat: string, a: boolean) => void; isPublishing: boolean }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [catId, setCatId] = useState('');
  const [anon, setAnon] = useState(false);
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-zinc-200 space-y-8">
      <div className="flex items-center gap-4"><button onClick={onCancel} className="p-2 hover:bg-zinc-100 rounded-full"><ArrowLeft size={24} /></button><h2 className="text-3xl font-black tracking-tighter uppercase">Новая тема</h2></div>
      <div className="space-y-2"><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Заголовок</label><input type="text" placeholder="О чём?" className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-2xl py-4 px-6 outline-none font-bold text-lg" value={title} onChange={e => setTitle(e.target.value)} /></div>
      <div className="space-y-2"><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Раздел</label><select className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-2xl py-4 px-6 outline-none font-bold" value={catId} onChange={e => setCatId(e.target.value)}><option value="">Выбери</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className="space-y-2"><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Текст</label><textarea rows={10} placeholder="Подробнее..." className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-2xl py-6 px-6 outline-none resize-none" value={content} onChange={e => setContent(e.target.value)} /></div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-zinc-500"><input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} /> Анонимно</label>
        <button disabled={!title || !content || !catId || isPublishing} onClick={() => onSubmit(title, content, catId, anon)} className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-zinc-800 disabled:opacity-50">{isPublishing ? 'Публикуем...' : 'Опубликовать'}</button>
      </div>
    </div>
  );
}

function PostDetailView({ post, onBack, profile, onLike, onCommentAdded, onUserClick }: { post: Post; onBack: () => void; profile: UserProfile | null; onLike: (id: string) => void; onCommentAdded: () => void; onUserClick: (uid: string) => void }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  useEffect(() => { setComments(localDb.getComments(post.id)); }, [post.id]);

  const handleAdd = () => {
    if (!profile || !newComment.trim()) return;
    localDb.addComment({ postId: post.id, content: newComment, authorId: profile.uid, authorName: profile.displayName });
    setComments(localDb.getComments(post.id));
    setNewComment('');
    onCommentAdded();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-black font-bold text-xs uppercase tracking-widest"><ArrowLeft size={16} /> Назад</button>
      <article className="bg-white p-8 md:p-16 rounded-3xl border border-zinc-200">
        <div className="flex items-center gap-4 mb-10">
          <div onClick={() => onUserClick(post.authorId)} className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-xl cursor-pointer">{post.authorName[0].toUpperCase()}</div>
          <div><h3 onClick={() => onUserClick(post.authorId)} className="font-bold text-lg hover:underline cursor-pointer">{post.authorName}</h3><p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}</p></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-10 leading-[1.1]">{post.title}</h1>
        <div className="text-lg leading-relaxed whitespace-pre-wrap mb-16 text-zinc-600">{post.content}</div>
        <div className="flex items-center gap-8 pt-10 border-t border-zinc-100">
          <button onClick={() => onLike(post.id)} className={cn("flex items-center gap-2 font-bold text-xs uppercase tracking-widest", profile?.likedPosts?.includes(post.id) ? "text-red-500" : "text-zinc-400 hover:text-black")}><Heart size={20} fill={profile?.likedPosts?.includes(post.id) ? "currentColor" : "none"} /> {post.likeCount} Нравится</button>
          <span className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest"><MessageSquare size={20} /> {post.commentCount} Комментарии</span>
        </div>
      </article>
      <h3 className="text-2xl font-black tracking-tighter uppercase">Обсуждение <span className="text-zinc-300">({comments.length})</span></h3>
      {profile ? (
        <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 flex gap-6">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white font-bold shrink-0">{profile.displayName[0].toUpperCase()}</div>
          <div className="flex-1 space-y-4">
            <textarea placeholder="Что думаешь?" className="w-full bg-white border border-zinc-200 rounded-2xl py-4 px-6 outline-none focus:border-black resize-none min-h-[120px]" value={newComment} onChange={e => setNewComment(e.target.value)} />
            <div className="flex justify-end"><button disabled={!newComment.trim()} onClick={handleAdd} className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-zinc-800 disabled:opacity-50">Отправить</button></div>
          </div>
        </div>
      ) : <div className="bg-zinc-100 p-12 rounded-3xl border-dashed border border-zinc-300 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm">Войди, чтобы комментировать.</div>}
      <div className="space-y-6">
        {[...comments].reverse().map(c => (
          <div key={c.id} className="bg-white p-8 rounded-3xl border border-zinc-100 flex gap-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center font-bold shrink-0">{c.authorName[0].toUpperCase()}</div>
            <div className="space-y-2"><div className="flex items-center gap-3"><span className="font-bold">{c.authorName}</span><span className="text-[10px] text-zinc-400">• {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: ru })}</span></div><p className="text-zinc-600 text-lg">{c.content}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsView({ documents, categories, profile, onRefresh, onLoginRequired, onPremiumRequired }: { documents: DocType[]; categories: Category[]; profile: UserProfile | null; onRefresh: () => void; onLoginRequired: () => void; onPremiumRequired: () => void }) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCatId, setUploadCatId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPrice, setUploadPrice] = useState(0);
  const [uploadPremium, setUploadPremium] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [error, setError] = useState('');

  const filtered = documents.filter(d => {
    const s = d.title.toLowerCase().includes(searchQ.toLowerCase());
    const c = !filterCat || d.categoryId === filterCat;
    return s && c;
  });

  const handleUpload = async () => {
    if (!profile || !uploadFile) return;
    let dataUrl: string | undefined;
    if (uploadFile.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      dataUrl = await new Promise<string>(r => { reader.onload = () => r(reader.result as string); reader.readAsDataURL(uploadFile); });
    }
    localDb.addDocument({ title: uploadTitle || uploadFile.name, description: uploadDesc, filename: uploadFile.name, fileSize: uploadFile.size, authorId: profile.uid, authorName: profile.displayName, categoryId: uploadCatId, price: uploadPrice, isPremiumOnly: uploadPremium, dataUrl });
    setShowUpload(false); setUploadTitle(''); setUploadDesc(''); setUploadCatId(''); setUploadFile(null); setUploadPrice(0); setUploadPremium(false);
    onRefresh();
  };

  const handleDownload = (doc: DocType) => {
    if (!profile) { onLoginRequired(); return; }
    const res = localDb.downloadDocument(doc.id, profile.uid);
    if (!res.success) { if (res.error?.includes('Premium')) onPremiumRequired(); else { setError(res.error || ''); setTimeout(() => setError(''), 5000); } return; }
    if (res.dataUrl) { const a = document.createElement('a'); a.href = res.dataUrl; a.download = doc.filename; a.click(); }
    onRefresh();
  };

  const fmtSize = (b: number) => b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / 1024 / 1024).toFixed(1) + ' MB';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-3xl font-black tracking-tighter uppercase">Материалы</h2><p className="text-zinc-500">Конспекты, экзамены, шпаргалки — всё в одном месте.</p></div>
        {profile && <button onClick={() => setShowUpload(true)} className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Upload size={18} /> Загрузить PDF</button>}
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"><AlertCircle size={18} />{error}</div>}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowUpload(false)} className="absolute right-6 top-6 text-zinc-400 hover:text-black"><X size={24} /></button>
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-6">Загрузить материал</h3>
            <div className="space-y-4">
              <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">PDF файл</label><input type="file" accept=".pdf" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4" /></div>
              <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Название</label><input type="text" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black" /></div>
              <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Описание</label><textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black resize-none" rows={3} /></div>
              <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Раздел</label><select value={uploadCatId} onChange={e => setUploadCatId(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black"><option value="">Выбери</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Цена (₽)</label><input type="number" min="0" value={uploadPrice} onChange={e => setUploadPrice(parseInt(e.target.value) || 0)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black" /></div>
                <div className="flex items-end pb-3"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={uploadPremium} onChange={e => setUploadPremium(e.target.checked)} className="w-4 h-4" /><span className="text-sm font-medium">Только Premium</span></label></div>
              </div>
              <button onClick={handleUpload} disabled={!uploadFile} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-2"><Upload size={18} /> Загрузить (+10 очков)</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} /><input type="text" placeholder="Поиск..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="w-full bg-zinc-100 border-none rounded-full py-2 pl-10 pr-4 text-sm outline-none" /></div>
        <select value={filterCat || ''} onChange={e => setFilterCat(e.target.value || null)} className="bg-zinc-100 border-none rounded-full py-2 px-4 text-sm outline-none"><option value="">Все разделы</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-black transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all"><File size={24} /></div>
              <div className="flex items-center gap-2">{doc.isPremiumOnly && <Crown size={16} className="text-yellow-500" />}{doc.price > 0 && <span className="text-xs font-bold text-green-600">{doc.price}₽</span>}</div>
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{doc.title}</h3>
            {doc.description && <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{doc.description}</p>}
            <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-widest mb-4"><span>PDF • {fmtSize(doc.fileSize)}</span><span className="flex items-center gap-1"><Download size={12} /> {doc.downloadCount}</span></div>
            <button onClick={() => handleDownload(doc)} className="w-full bg-zinc-100 hover:bg-black hover:text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"><Download size={16} /> Скачать</button>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full py-20 text-center text-zinc-500"><FileText className="w-16 h-16 mx-auto mb-4 text-zinc-300" /><p className="font-bold">Пусто</p></div>}
      </div>
    </div>
  );
}

function CommunityView({ users, leaderboard, onUserClick }: { users: UserProfile[]; leaderboard: LeaderboardEntry[]; onUserClick: (u: UserProfile) => void }) {
  const [tab, setTab] = useState<'ranking' | 'people' | 'events'>('ranking');
  const getRankBg = (r: number) => r === 1 ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300" : r === 2 ? "bg-gradient-to-r from-zinc-50 to-zinc-100 border-zinc-300" : r === 3 ? "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300" : "bg-white border-zinc-200";
  return (
    <div className="space-y-8">
      <div className="bg-zinc-900 text-white rounded-3xl p-8">
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2"><Sparkles size={18} /> За что дают очки</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ icon: <FileText className="text-yellow-400" size={18} />, bg: "bg-yellow-500/20", pts: "+5", lbl: "Новая тема" }, { icon: <MessageSquare className="text-blue-400" size={18} />, bg: "bg-blue-500/20", pts: "+2", lbl: "Комментарий" }, { icon: <Heart className="text-red-400" size={18} />, bg: "bg-red-500/20", pts: "+10", lbl: "Лайк на пост" }, { icon: <Upload className="text-green-400" size={18} />, bg: "bg-green-500/20", pts: "+10", lbl: "Загрузка PDF" }].map((x, i) => (
            <div key={i} className="flex items-center gap-3"><div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", x.bg)}>{x.icon}</div><div><p className="font-bold text-sm">{x.pts}</p><p className="text-zinc-400 text-xs">{x.lbl}</p></div></div>
          ))}
        </div>
      </div>
      <div className="flex gap-6 border-b border-zinc-200">
        {[['ranking', 'Рейтинг', <Trophy size={16} key="t" />], ['people', `Участники (${users.length})`, <Users size={16} key="u" />], ['events', 'События', <Calendar size={16} key="c" />]].map(([v, l, icon]) => (
          <button key={v as string} onClick={() => setTab(v as any)} className={cn("pb-3 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-1", tab === v ? "text-black" : "text-zinc-400 hover:text-black")}>{icon}{l as string}{tab === v && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}</button>
        ))}
      </div>
      {tab === 'ranking' && (
        <div className="space-y-3">
          {leaderboard.map(u => {
            const full = users.find(x => x.uid === u.uid);
            return (
              <div key={u.uid} onClick={() => full && onUserClick(full)} className={cn("rounded-2xl border p-5 flex items-center gap-5 cursor-pointer hover:shadow-md transition-all", getRankBg(u.rank))}>
                <div className="w-10 flex items-center justify-center">{u.rank <= 3 ? (u.rank === 1 ? <Crown className="text-yellow-500" size={20} /> : <Medal className={u.rank === 2 ? "text-zinc-400" : "text-orange-500"} size={20} />) : <span className="text-sm font-bold text-zinc-400">#{u.rank}</span>}</div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold", u.rank === 1 ? "bg-yellow-400 text-black" : u.rank === 2 ? "bg-zinc-400 text-black" : u.rank === 3 ? "bg-orange-400 text-white" : "bg-black text-white")}>{u.displayName[0].toUpperCase()}</div>
                <div className="flex-1"><h3 className="font-bold flex items-center gap-2">{u.displayName}{u.isPremium && <Crown size={14} className="text-yellow-500" />}</h3><p className="text-zinc-500 text-sm">{u.postsCount} тем, {u.commentsCount} комментариев</p></div>
                <div className="text-right"><p className="text-xl font-black">{u.points}</p><p className="text-zinc-400 text-[10px] uppercase tracking-widest">очков</p></div>
              </div>
            );
          })}
          {leaderboard.length === 0 && <div className="text-center py-16 text-zinc-500"><Trophy className="w-12 h-12 mx-auto mb-3 text-zinc-300" /><p className="font-bold">Пока пусто</p></div>}
        </div>
      )}
      {tab === 'people' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u.uid} onClick={() => onUserClick(u)} className="p-5 border border-zinc-100 rounded-xl hover:bg-zinc-50 flex items-center gap-4 cursor-pointer">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg", u.isPremium ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : "bg-black text-white")}>{u.displayName[0].toUpperCase()}</div>
              <div className="flex-1"><h4 className="font-bold flex items-center gap-1 truncate">{u.displayName}{u.isPremium && <Crown size={14} className="text-yellow-500" />}</h4><p className="text-xs text-zinc-500">{u.role === 'admin' ? 'Админ' : 'Студент'}</p></div>
              <div className="text-right"><p className="font-bold text-yellow-600">{u.points}</p><p className="text-[10px] text-zinc-400">очков</p></div>
            </div>
          ))}
        </div>
      )}
      {tab === 'events' && (
        <div className="space-y-4">
          {[{ title: "Воркшоп: Как стать веб-разработчиком", date: "20/03", loc: "Актовый зал" }, { title: "Конкурс: Code Challenge 2024", date: "25/03", loc: "Онлайн" }, { title: "Семинар: ИИ в учебе", date: "02/04", loc: "Аудитория 201" }].map((ev, i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl">
              <div className="flex items-center gap-4"><div className="w-14 h-14 bg-white rounded-lg flex flex-col items-center justify-center border border-zinc-200"><span className="text-xl font-black leading-none">{ev.date.split('/')[0]}</span><span className="text-[10px] font-bold text-zinc-400">{ev.date.split('/')[1]}</span></div><div><h4 className="font-bold">{ev.title}</h4><p className="text-xs text-zinc-500">{ev.loc}</p></div></div>
              <button className="text-xs font-bold uppercase tracking-widest hover:underline">Участвовать</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileView({ user, isOwnProfile, onBack, onPostClick, leaderboard, onPremiumClick }: { user: UserProfile; isOwnProfile: boolean; onBack: () => void; onPostClick: (p: Post) => void; leaderboard: LeaderboardEntry[]; onPremiumClick: () => void }) {
  const [tab, setTab] = useState<'posts' | 'comments'>('posts');
  const userPosts = localDb.getUserPosts(user.uid);
  const userComments = localDb.getUserComments(user.uid);
  const userRank = leaderboard.find(l => l.uid === user.uid)?.rank || '-';
  const last90 = Array.from({ length: 90 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (89 - i)); return d.toISOString().split('T')[0]; });
  const actColor = (c: number) => c === 0 ? 'bg-zinc-100' : c < 3 ? 'bg-emerald-200' : c < 6 ? 'bg-emerald-400' : 'bg-emerald-600';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-black font-bold text-xs uppercase tracking-widest"><ArrowLeft size={16} /> Назад</button>
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
        <div className={cn("h-32 relative", user.isPremium ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-zinc-900")}>
          <div className="absolute -bottom-12 left-8"><div className={cn("w-24 h-24 rounded-3xl border-4 border-white flex items-center justify-center text-white font-black text-4xl shadow-xl", user.isPremium ? "bg-gradient-to-br from-yellow-400 to-orange-500" : "bg-black")}>{user.displayName[0].toUpperCase()}</div></div>
        </div>
        <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-2">{user.displayName}{user.isPremium && <Crown size={24} className="text-yellow-500" />}</h2>
            <p className="text-zinc-500">{user.bio || "О себе пока ничего."}</p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400"><span className="flex items-center gap-1"><Calendar size={14} /> С {new Date(user.createdAt).toLocaleDateString('ru-RU')}</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-b from-yellow-50 to-white px-6 py-3 rounded-2xl border border-yellow-200 text-center"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Место</p><p className="text-2xl font-black flex items-center justify-center gap-2"><Crown size={20} className="text-yellow-500" /> #{userRank}</p></div>
            <div className="bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100 text-center"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Очков</p><p className="text-2xl font-black flex items-center justify-center gap-2"><Trophy size={20} className="text-yellow-500" /> {user.points}</p></div>
            {isOwnProfile && !user.isPremium && <button onClick={onPremiumClick} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Crown size={18} /> Premium</button>}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-zinc-200 space-y-6">
        <h3 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2"><TrendingUp size={20} /> Активность</h3>
        <div className="overflow-x-auto pb-4"><div className="flex gap-1 min-w-max">{last90.map(d => <div key={d} title={`${d}: ${user.dailyActivity?.[d] || 0}`} className={cn("w-3 h-3 rounded-sm transition-all hover:scale-150 cursor-pointer", actColor(user.dailyActivity?.[d] || 0))} />)}</div></div>
      </div>

      <div className="flex gap-8 border-b border-zinc-100">
        {[['posts', `Посты (${userPosts.length})`], ['comments', `Комментарии (${userComments.length})`]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v as any)} className={cn("pb-4 text-sm font-bold uppercase tracking-widest relative", tab === v ? "text-black" : "text-zinc-400 hover:text-black")}>{l}{tab === v && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}</button>
        ))}
      </div>
      <div className="space-y-4">
        {tab === 'posts' ? (userPosts.length > 0 ? userPosts.map(p => (
          <div key={p.id} onClick={() => onPostClick(p)} className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-zinc-300 cursor-pointer group">
            <h4 className="font-bold text-lg group-hover:underline mb-2">{p.title}</h4>
            <div className="flex items-center gap-4 text-xs text-zinc-400 font-bold uppercase tracking-widest"><span className="flex items-center gap-1"><Heart size={12} /> {p.likeCount}</span><span className="flex items-center gap-1"><MessageSquare size={12} /> {p.commentCount}</span></div>
          </div>
        )) : <div className="py-12 text-center text-zinc-400">Пока нет постов.</div>) : (userComments.length > 0 ? userComments.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-zinc-100"><p className="text-zinc-600">{c.content}</p><p className="text-[10px] text-zinc-400 mt-2">{new Date(c.createdAt).toLocaleDateString('ru-RU')}</p></div>
        )) : <div className="py-12 text-center text-zinc-400">Комментариев нет.</div>)}
      </div>
    </div>
  );
}

