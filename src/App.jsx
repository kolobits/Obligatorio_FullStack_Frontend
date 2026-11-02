import './bootstrap.min.css';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter, Routes, Route } from 'react-router';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Navbar from './componentes/Navbar';
import Dashboard from './componentes/Dashboard';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/registro' element={<Registro />} />
          <Route element={<Navbar />}>
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;