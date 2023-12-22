import axios from 'axios';
import React, { useEffect, useState } from 'react';

function TelaPessoas({ voltarParaInicio }) {
  const [pessoas, setPessoas] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [pessoaEditando, setPessoaEditando] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showConfirmSalvarModal, setShowConfirmSalvarModal] = useState(false);
  const [showConfirmDeletarModal, setShowConfirmDeletarModal] = useState(false);
  const [idDeletando, setIdDeletando] = useState(null); // Para armazenar o ID ao deletar
  
  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5109/Pessoa', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPessoas(response.data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    }
  };

  const handleEditar = (pessoa) => {
    pessoa.dataNascimento = formatarData(pessoa.dataNascimento);
    setPessoaEditando({...pessoa});
  };

  const handleCancelarEdicao = () => {
    setPessoaEditando(null);
  };

  const handleSalvarEdicao = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5109/Pessoa/${pessoaEditando.id}`, pessoaEditando, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setShowSuccessModal(true); // Exibe o modal de sucesso
    } catch (error) {
      console.error('Erro ao salvar a edição:', error);
      setShowFailureModal(true); // Exibe o modal de falha
    } finally {
      fecharModalSalvar(); // Fecha o modal de confirmação
      setPessoaEditando(null); // Limpa a pessoa editando
      carregarPessoas(); // Recarrega a lista de pessoas
    }
  };
  

  const handleDeletar = async (pessoaId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5109/Pessoa/${pessoaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setShowSuccessModal(true); // Exibe o modal de sucesso
    } catch (error) {
      console.error('Erro ao deletar pessoa:', error);
      setShowFailureModal(true); // Exibe o modal de falha
    } finally {
      fecharModalDeletar(); // Fecha o modal de confirmação
      carregarPessoas(); // Recarrega a lista de pessoas
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPessoaEditando({
      ...pessoaEditando,
      [name]: value
    });
  };

  const handleTelefoneChange = (e, index) => {
    const telefonesAtualizados = pessoaEditando.telefones.map((telefone, i) => {
      if (i === index) {
        return { ...telefone, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
      }
      return telefone;
    });
    setPessoaEditando({ ...pessoaEditando, telefones: telefonesAtualizados });
  };

  const handleAddTelefone = () => {
    setPessoaEditando({
      ...pessoaEditando,
      telefones: [...pessoaEditando.telefones, { numero: '', tipo: 'Celular', isWhatsApp: false }]
    });
  };

  const handleRemoveTelefone = (index) => {
    const telefonesAtualizados = pessoaEditando.telefones.filter((_, i) => i !== index);
    setPessoaEditando({ ...pessoaEditando, telefones: telefonesAtualizados });
  };

  const pessoasFiltradas = pessoas.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    pessoa.cpf.includes(termoPesquisa)
  );

  const formatarData = (dataString) => {
    return dataString.split('T')[0];
  };

  const abrirModalSalvar = () => {
    setShowConfirmSalvarModal(true);
  };
  
  const fecharModalSalvar = () => {
    setShowConfirmSalvarModal(false);
  };
  
  const abrirModalDeletar = (id) => {
    setIdDeletando(id);
    setShowConfirmDeletarModal(true);
  };
  
  const fecharModalDeletar = () => {
    setShowConfirmDeletarModal(false);
    setIdDeletando(null);
  };
  
  const ModalConfirmacao = ({ show, handleClose, handleConfirm, titulo, mensagem }) => {
    return (
      <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
        <div className="modal-dialog text-dark">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{titulo}</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body text-dark">
              <p>{mensagem}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Não</button>
              <button type="button" className="btn btn-primary" onClick={handleConfirm}>Sim</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div className="tela-pessoas-container">
      {pessoaEditando ? (
        <div className="container">
          <h2>Editar Pessoa</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                name="nome"
                value={pessoaEditando.nome}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                className="form-control"
                id="cpf"
                name="cpf"
                value={pessoaEditando.cpf}
                onChange={handleInputChange}
                readOnly // CPF não deve ser editável
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dataNascimento">Data de Nascimento</label>
              <input
                type="date"
                className="form-control"
                id="dataNascimento"
                name="dataNascimento"
                value={pessoaEditando.dataNascimento}
                onChange={handleInputChange}
              />
            </div>
            {/* Campos de edição de telefone */}
            {pessoaEditando.telefones.map((telefone, index) => (
              <div key={index} className="mb-3">
                <h2>_____________________________</h2>
                <label htmlFor={`numero-${index}`}>Número do Telefone</label>
                <input
                  type="text"
                  className="form-control"
                  name="numero"
                  value={telefone.numero}
                  onChange={(e) => handleTelefoneChange(e, index)}
                /><br></br>
                <select
                  className="form-select"
                  name="tipo"
                  value={telefone.tipo}
                  onChange={(e) => handleTelefoneChange(e, index)}
                >
                  <option value="Celular">Celular</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                </select>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isWhatsApp"
                    checked={telefone.isWhatsApp}
                    onChange={(e) => handleTelefoneChange(e, index)}
                  />
                  <label className="form-check-label" htmlFor={`isWhatsApp-${index}`}>É WhatsApp?</label>
                </div>
                {index > 0 && (
                  <button type="button" className="btn btn-danger" onClick={() => handleRemoveTelefone(index)}>Remover</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={handleAddTelefone}>Adicionar Telefone</button>
            <br/><br/><br></br>
            <button type="button" className="btn btn-primary" onClick={abrirModalSalvar}>Salvar</button>
            <button type="button" className="btn btn-danger" onClick={handleCancelarEdicao}>Cancelar</button>
          </form>
          <br></br>
        </div>
      ) : (
        <>
          <h2>Pesquisar pessoa por qualquer informação:</h2>
          <div className="pesquisa">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar Pessoa"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
          </div>
          <br /><br />
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Data de Nascimento</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoasFiltradas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.cpf}</td>
                  <td>{pessoa.dataNascimento}</td>
                  <td>{pessoa.estaAtivo ? 'Sim' : 'Não'}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEditar(pessoa)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => abrirModalDeletar(pessoa.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

    {showSuccessModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title text-dark">Sucesso</h5>
                <button type="button" className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
                </div>
                <div className="modal-body text-dark">
                <p>A ação foi realizada com sucesso.</p>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSuccessModal(false)}>OK</button>
                </div>
            </div>
            </div>
        </div>
    )}
    {showFailureModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title text-dark">Erro</h5>
                <button type="button" className="btn-close" onClick={() => setShowFailureModal(false)}></button>
                </div>
                <div className="modal-body text-dark">
                <p>Houve um erro na ação.</p>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFailureModal(false)}>OK</button>
                </div>
            </div>
            </div>
        </div>
    )}

        {/* Modal de Confirmação para Salvar */}
        <ModalConfirmacao
      show={showConfirmSalvarModal}
      handleClose={fecharModalSalvar}
      handleConfirm={handleSalvarEdicao}
      titulo="Confirmar Edição"
      mensagem="Você tem certeza que deseja salvar as alterações?"
    />

    {/* Modal de Confirmação para Deletar */}
    <ModalConfirmacao
      show={showConfirmDeletarModal}
      handleClose={fecharModalDeletar}
      handleConfirm={() => handleDeletar(idDeletando)}
      titulo="Confirmar Exclusão"
      mensagem="Você tem certeza que deseja deletar esta pessoa?"
    />

      <button className="btn btn-outline-secondary" onClick={voltarParaInicio}>Voltar para Início</button>
    </div>
  );
}

export default TelaPessoas;