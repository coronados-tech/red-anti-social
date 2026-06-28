import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import PublicProfile from './pages/PublicProfile';
import UserFollowPage from './pages/UserFollowPage';
import Profile from './pages/Profile';
import NewPost from './pages/NewPost';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="app-layout d-flex flex-column">
      <ScrollToTop />
      <AppNavbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/usuario/:nickname/seguidores" element={<UserFollowPage />} />
          <Route path="/usuario/:nickname/siguiendo" element={<UserFollowPage />} />
          <Route path="/usuario/:nickname" element={<PublicProfile />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/nosotros" element={<About />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nuevo-post"
            element={
              <ProtectedRoute>
                <NewPost />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
