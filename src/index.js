import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import store, { persistor } from './store/store';

ReactDOM.render(
    <Provider store={store}>
            <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
reportWebVitals();
