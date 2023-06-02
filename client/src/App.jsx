import { Route, Routes } from 'react-router-dom';

import { Login } from './pages/Loginpage';
import { File } from './pages/Filepage';
import { Profile } from './pages/Profilepage';
import { Home } from './pages/Homepage';
import { Access } from './pages/Accesspage';

import { Layout } from './components/Layout';

import { RequireAuth } from './hoc/RequireAuth';
import { AuthProvider } from './hoc/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={
          <RequireAuth>
            <Layout/>
          </RequireAuth>
        }>
          <Route path='/file' element={<File/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/access/:id' element={<Access/>}/>
          <Route path='/home' element={<Home/>}/>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
