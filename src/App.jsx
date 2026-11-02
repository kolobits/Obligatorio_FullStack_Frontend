import './bootstrap.min.css';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Dashboard from './componentes/Dashboard';

const App = () => {
  return (
    <Provider store={store}>
      <Login />
      {/*<Registro />*/}
      {/* <Dashboard /> */}
    </Provider>
  );
};

export default App;