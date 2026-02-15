import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './global/AuthContex';
import {PrivateRoute ,Authorization, RoleBasedAccess} from './routes/PrivateRoute';
import UserTask from './pages/Usertask';
import UserDashboard from './pages/UserDashboard';
import Workspace from './pages/Workspace';
import Project from './pages/Project';
import ProjectDetail from './pages/ProjectDetail';
function App() {

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          
          {/* <Route path="/" element={<PrivateRoute><UserDashboard /></PrivateRoute>} /> */}
          
          <Route path="/" element={<PrivateRoute><RoleBasedAccess /></PrivateRoute>} />
          <Route path="/workspace/project" element={<Authorization><PrivateRoute><Project /></PrivateRoute></Authorization>} />
          <Route path="/workspace/project/:id" element={<Authorization><PrivateRoute><ProjectDetail /></PrivateRoute></Authorization>} />
          <Route path="/user" element={<PrivateRoute><UserTask /></PrivateRoute>} />
          {/* <Route path="/user" element={<PrivateRoute><UserTask /></PrivateRoute>} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>

    </div>
  );
}

export default App;
