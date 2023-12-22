import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TelaLogado from '../components/TelaLogado';
import './Home.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [estaLogado, setEstaLogado] = useState(false);
  const [loginSucesso, setLoginSucesso] = useState(false);


  useEffect(() => {
    const loggedIn = localStorage.getItem('estaLogado') === 'true';
    setEstaLogado(loggedIn);

    if (alert.show) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [alert.show]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5109/Usuario/authenticate', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setLoginSucesso(true); // Define que o login foi bem-sucedido
      setAlert({ show: true, message: 'Login bem-sucedido!', type: 'success' });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.setItem('estaLogado', 'false');
      setEstaLogado(false);
      setAlert({ show: true, message: 'Usuário ou senha inválidos.', type: 'danger' });
    }
  };

  const handleCloseAlert = () => {
    if (loginSucesso) {
      localStorage.setItem('estaLogado', 'true');
      setEstaLogado(true);
      window.location.reload();
    } else {
      setAlert({ ...alert, show: false });
    }
  };
  

  const logout = () => {
    setEstaLogado(false);
  };

  return estaLogado ? (
     <TelaLogado onLogout={logout} /> 
  ) : (
    <>
      <div className="main-content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="card my-5">
                <form className="card-body cardbody-color p-lg-5" onSubmit={handleLogin}>
                  <div className="text-center">
                    <img src="https://seeklogo.com/images/L/lar-logo-FDA7FE4AE4-seeklogo.com.png" className="img-fluid profile-image-pic my-3" width="200px" alt="profile" />
                  </div>
                  <h2 className="text-center mt-5">Login</h2>
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <br />
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <br />
                  <div className="text-center">
                    <button type="submit" className="btn btn-dark px-5 mb-5 w-50">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {alert.show && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="text-dark">Aviso</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseAlert}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p className="text-dark">{alert.message}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseAlert}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
