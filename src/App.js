import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes';



//<Navbar />
function App() {
  return (
    <html>
      <div className="App">
        <body>
          <div className='ini'> 
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </div>
        </body>
      </div>
    </html>
  );
}

export default App;
