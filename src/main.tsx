import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'flatpickr/dist/flatpickr.min.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import RealUserContext from './Context/realUser';
import EnabledControlled from './Context/enabledControlled';
import TableCardViewContext from './Context/tableView';
import UserProvider from './Context/loggedInUser';
import 'yet-another-react-lightbox/styles.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RealUserContext>
          <EnabledControlled>
            <TableCardViewContext>
              <Router>
                <App />
              </Router>
            </TableCardViewContext>
          </EnabledControlled>
        </RealUserContext>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
