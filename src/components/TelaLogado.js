import axios from 'axios';
import React, { useState } from 'react';
import TelaPessoas from '../components/TelaPessoas'; // Substitua com o caminho correto do seu componente

function TelaLogado({ onLogout }) {
  const [telaAtual, setTelaAtual] = useState('inicio'); // 'inicio', 'formulario', 'listaPessoas'
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    estaAtivo: true,
    telefones: [{ numero: '', tipo: 'Celular', isWhatsApp: false }]
  });

  const [formDataUsuario, setFormDataUsuario] = useState({
    username: '',
    password: ''
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  const handleInputChangeUsuario = (e) => {
    const { name, value } = e.target;
    setFormDataUsuario({ ...formDataUsuario, [name]: value });
  };
  
  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/Usuario', formDataUsuario, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShowSuccessModal(true); // Mostra o modal de sucesso
      setFormDataUsuario({ username: '', password: '' }); // Limpa o formulário
    } catch (error) {
      setShowFailureModal(true); // Mostra o modal de falha
    }
  };
  

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('estaLogado', 'false');
    onLogout();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTelefoneChange = (e, index) => {
    const newTelefones = formData.telefones.map((telefone, i) => {
      if (i === index) {
        return { ...telefone, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
      }
      return telefone;
    });
    setFormData({ ...formData, telefones: newTelefones });
  };

  const handleAddTelefone = () => {
    setFormData({
      ...formData,
      telefones: [...formData.telefones, { numero: '', tipo: 'Celular', isWhatsApp: false }]
    });
  };

  const handleRemoveTelefone = (index) => {
    const newTelefones = formData.telefones.filter((_, i) => i !== index);
    setFormData({ ...formData, telefones: newTelefones });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/Pessoa', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShowSuccessModal(true);
      setFormData({
        nome: '',
        cpf: '',
        dataNascimento: '',
        estaAtivo: true,
        telefones: [{ numero: '', tipo: 'Celular', isWhatsApp: false }]
      });
    } catch (error) {
      setShowFailureModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setTelaAtual('inicio');
  };

  const handleCloseFailureModal = () => {
    setShowFailureModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" href="#" onClick={() => setTelaAtual('listaPessoas')}>Lista Pessoas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => setTelaAtual('formulario')}>Criar Pessoa</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => setTelaAtual('cadastroUsuario')}>Criar Usuário</a>
            </li>
          </ul>
          <form className="d-flex">
            <button className="btn btn-outline-danger" type="button" onClick={handleLogout}>Sair</button>
          </form>
        </div>
      </nav>

      {telaAtual === 'inicio' && (
        <div className="tela-logado">
          <h1>Bem-vindo ao Sistema!</h1>
          <p>Você está logado.</p>
        </div>
      )}

      {telaAtual === 'formulario' && (
        <div className="container mt-4">
          <h2>Cadastro de Pessoa</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome</label>
              <input type="text" className="form-control" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input type="text" className="form-control" id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
              <input type="date" className="form-control" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} />
            </div>
            {formData.telefones.map((telefone, index) => (
              <div key={index} className="mb-3">
                <label htmlFor={`numero-${index}`} className="form-label">Número do Telefone</label>
                <input type="text" className="form-control" id={`numero-${index}`} name="numero" value={telefone.numero} onChange={(e) => handleTelefoneChange(e, index)} />
                <label htmlFor={`tipo-${index}`} className="form-label">Tipo</label>
                <select className="form-select" id={`tipo-${index}`} name="tipo" value={telefone.tipo} onChange={(e) => handleTelefoneChange(e, index)}>
                  <option value="Celular">Celular</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                </select>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id={`isWhatsApp-${index}`} name="isWhatsApp" checked={telefone.isWhatsApp} onChange={(e) => handleTelefoneChange(e, index)} />
                  <label className="form-check-label" htmlFor={`isWhatsApp-${index}`}>É WhatsApp?</label>
                </div>
                {index > 0 && (
                  <button type="button" className="btn btn-danger" onClick={() => handleRemoveTelefone(index)}>Remover</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={handleAddTelefone}>Adicionar Telefone</button><br/><br/><br/>
            <button type="submit" className="btn btn-primary">Cadastrar</button>
          </form>
        </div>
      )}

      {telaAtual === 'listaPessoas' && (
        <TelaPessoas voltarParaInicio={() => setTelaAtual('inicio')} />
      )}

      {telaAtual === 'cadastroUsuario' && (
        <div className="container mt-4">
          <h2>Cadastro de Usuário</h2>
          <form onSubmit={handleSubmitUsuario}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuário</label>
              <input type="text" className="form-control" id="username" name="username" value={formDataUsuario.username} onChange={handleInputChangeUsuario} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Senha</label>
              <input type="password" className="form-control" id="password" name="password" value={formDataUsuario.password} onChange={handleInputChangeUsuario} />
            </div>
            <button type="submit" className="btn btn-primary">Cadastrar</button>
          </form>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">Sucesso</h5>
                <button type="button" className="btn-close" onClick={handleCloseSuccessModal}></button>
              </div>
              <div className="modal-body text-dark">
                <p>Cadastro realizado com sucesso!</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseSuccessModal}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFailureModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">Erro</h5>
                <button type="button" className="btn-close" onClick={handleCloseFailureModal}></button>
              </div>
              <div className="modal-body text-dark">
                <p>Houve um erro ao realizar o cadastro.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseFailureModal}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TelaLogado;