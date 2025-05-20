import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import store from './store/store';
import './index.scss';
import App from './components/App/App';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode >
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  </BrowserRouter>
)
