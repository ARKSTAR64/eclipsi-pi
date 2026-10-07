document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const closeBtn = document.getElementById('closeBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navItems = document.querySelectorAll('.nav-item');
  const pageContents = document.querySelectorAll('.page-content');

  // Elementos do Modal de Detalhes do Agendamento
  const detailsModal = document.getElementById('detailsModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalImg = document.getElementById('modalImg');
  const modalPatient = document.getElementById('modalPatient');
  const modalType = document.getElementById('modalType');
  const modalDate = document.getElementById('modalDate');
  const modalPrice = document.getElementById('modalPrice');
  const modalHistory = document.getElementById('modalHistory');
  const saveNotesBtn = document.getElementById('saveNotesBtn');
  const doctorNotes = document.getElementById('doctorNotes');

  // Sidebar e Navegação
  function openSidebar() {
    if (sidebar && sidebarOverlay) {
      sidebar.classList.add('open');
      sidebarOverlay.classList.add('active');
    }
  }

  function closeSidebar() {
    if (sidebar && sidebarOverlay) {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    }
  }

  if (burgerBtn) burgerBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');

      navItems.forEach(nav => {
        if (nav.getAttribute('data-target') === targetId) {
          nav.classList.add('active');
        } else {
          nav.classList.remove('active');
        }
      });

      pageContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });

      closeSidebar();
    });
  });

  // Modal de Detalhes da Consulta / Prontuário
  const appointmentCards = document.querySelectorAll('.appointment-card');
  appointmentCards.forEach(card => {
    card.addEventListener('click', () => {
      const patient = card.getAttribute('data-patient');
      const type = card.getAttribute('data-type');
      const date = card.getAttribute('data-date');
      const price = card.getAttribute('data-price');
      const img = card.getAttribute('data-img');
      const history = card.getAttribute('data-history');

      if (modalPatient) modalPatient.textContent = patient;
      if (modalType) modalType.textContent = type;
      if (modalDate) modalDate.textContent = date;
      if (modalPrice) modalPrice.textContent = price;
      if (modalImg) { modalImg.src = img; modalImg.alt = patient; }
      if (modalHistory) modalHistory.textContent = history;

      detailsModal.showModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => detailsModal.close());
  }

  if (saveNotesBtn) {
    saveNotesBtn.addEventListener('click', () => {
      if (doctorNotes.value.trim() !== '') {
        dbSalvarAnotacao();
      } else {
        alert('Por favor, digite alguma anotação antes de salvar.');
      }
    });
  }

  // Modal de Ficha do Paciente
  const doctorCards = document.querySelectorAll('.doctor-card');
  const doctorModal = document.getElementById('doctorModal');
  const closeDoctorModalBtn = document.getElementById('closeDoctorModalBtn');
  const doctorModalImg = document.getElementById('doctorModalImg');
  const doctorModalName = document.getElementById('doctorModalName');
  const doctorModalProfession = document.getElementById('doctorModalProfession');
  const doctorModalRating = document.getElementById('doctorModalRating');
  const doctorModalBio = document.getElementById('doctorModalBio');

  doctorCards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-name');
      const profession = card.getAttribute('data-profession');
      const rating = card.getAttribute('data-rating');
      const img = card.getAttribute('data-img');
      const bio = card.getAttribute('data-bio');

      if (doctorModalName) doctorModalName.textContent = name;
      if (doctorModalProfession) doctorModalProfession.textContent = profession;
      if (doctorModalRating) doctorModalRating.textContent = rating;
      if (doctorModalImg) { doctorModalImg.src = img; doctorModalImg.alt = name; }
      if (doctorModalBio) doctorModalBio.textContent = bio;

      doctorModal.showModal();
    });
  });

  if (closeDoctorModalBtn) {
    closeDoctorModalBtn.addEventListener('click', () => doctorModal.close());
  }

  // Navegação do Perfil para Configurações
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const backToProfileBtn = document.getElementById('backToProfileBtn');

  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      pageContents.forEach(p => p.classList.remove('active'));
      document.getElementById('configuracoes').classList.add('active');
    });
  }

  if (backToProfileBtn) {
    backToProfileBtn.addEventListener('click', () => {
      pageContents.forEach(p => p.classList.remove('active'));
      document.getElementById('perfil').classList.add('active');
    });
  }
});

// Estrutura de dados contendo o histórico de consultas de cada paciente
  const patientConsultationsData = {
    "João da Silva": [
      {
        date: "15/09/2026 - 14:00",
        type: "Sessão TCC / Acompanhamento",
        notes: "Paciente relatou melhora nos episódios de ansiedade após início do diário de pensamentos. Trabalhado reestruturação cognitiva."
      },
      {
        date: "08/09/2026 - 14:00",
        type: "Sessão TCC / Acompanhamento",
        notes: "Identificados gatilhos de estresse no ambiente de trabalho. Recomendado exercícios de respiração diafragmática."
      },
      {
        date: "01/09/2026 - 14:00",
        type: "Sessão TCC / Primeira Consulta",
        notes: "Acolhimento e levantamento do histórico clínico. Paciente relata sintomas compatíveis com Burnout."
      }
    ]
  };

  // Modal de Ficha do Paciente e Consultas
  const doctorCards = document.querySelectorAll('.doctor-card');
  const doctorModal = document.getElementById('doctorModal');
  const closeDoctorModalBtn = document.getElementById('closeDoctorModalBtn');
  const doctorModalImg = document.getElementById('doctorModalImg');
  const doctorModalName = document.getElementById('doctorModalName');
  const doctorModalProfession = document.getElementById('doctorModalProfession');
  const doctorModalRating = document.getElementById('doctorModalRating');
  const doctorModalBio = document.getElementById('doctorModalBio');
  const patientConsultationsList = document.getElementById('patientConsultationsList');

  doctorCards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-name');
      const profession = card.getAttribute('data-profession');
      const rating = card.getAttribute('data-rating');
      const img = card.getAttribute('data-img');
      const bio = card.getAttribute('data-bio');

      if (doctorModalName) doctorModalName.textContent = name;
      if (doctorModalProfession) doctorModalProfession.textContent = profession;
      if (doctorModalRating) doctorModalRating.textContent = rating;
      if (doctorModalImg) { doctorModalImg.src = img; doctorModalImg.alt = name; }
      if (doctorModalBio) doctorModalBio.textContent = bio;

      // Renderiza as consultas do paciente selecionado
      if (patientConsultationsList) {
        patientConsultationsList.innerHTML = '';
        const consultations = patientConsultationsData[name] || [];

        if (consultations.length === 0) {
          patientConsultationsList.innerHTML = '<p style="font-size:0.9rem; color:#666;">Nenhuma consulta registrada para este paciente.</p>';
        } else {
          consultations.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.style.backgroundColor = '#f9f9f9';
            itemDiv.style.borderLeft = '4px solid #7500a8';
            itemDiv.style.padding = '10px 12px';
            itemDiv.style.borderRadius = '6px';

            itemDiv.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="font-size:0.95rem; color:#7500a8;">${item.type}</strong>
                <small style="color:#666; font-size:0.8rem;">🗓 ${item.date}</small>
              </div>
              <p style="font-size:0.88rem; color:#333; margin:0;">${item.notes}</p>
            `;

            patientConsultationsList.appendChild(itemDiv);
          });
        }
      }

      doctorModal.showModal();
    });
  });

  if (closeDoctorModalBtn) {
    closeDoctorModalBtn.addEventListener('click', () => doctorModal.close());
  }
// =====================================================================
// INTEGRAÇÃO COM O BANCO (bloco novo, colar no FINAL do medico.js)
// =====================================================================

const dbUser = JSON.parse(localStorage.getItem('user') || 'null');
if (!dbUser || dbUser.role !== 'medico') {
    window.location.href = '/pages/login.html';
}

const dbPH = 'https://via.placeholder.com/150';
const dbId = id => document.getElementById(id);

const dbEsc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ 
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' 
}[c]));

const dbBrl = n => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dbData = iso => new Date(iso).toLocaleString('pt-BR', { 
    timeZone: 'America/Recife', 
    dateStyle: 'short', 
    timeStyle: 'short' 
});

async function dbApi(method, url, body) {
    try {
        const r = await fetch(url, { 
            method, 
            headers: { 'Content-Type': 'application/json' }, 
            body: body ? JSON.stringify(body) : undefined 
        });
        return await r.json();
    } catch (e) { 
        return { success: false, message: 'Falha ao conectar ao servidor.' }; 
    }
}

let dbConsultas = [], dbFiltro = '';
const dbOk = nome => !dbFiltro || nome.toLowerCase().includes(dbFiltro);

// ---------- AGENDA ----------
async function dbCarregar() {
    const r = await dbApi('GET', `/api/consultas?medico_id=${dbUser.id}`);
    dbConsultas = r.success ? r.consultas : [];
    dbAgenda(); 
    dbPacientes();
}

function dbAgenda() {
    const lista = dbConsultas.filter(c => c.status === 'agendada' && dbOk(c.paciente_nome));
    
    document.querySelector('#home .cards-grid').innerHTML = lista.map(c => `
        <article class="appointment-card" data-id="${c.id}">
            <img src="${dbPH}" alt="Foto do Paciente" class="card-img">
            <div class="card-info">
                <h3>${dbEsc(c.paciente_nome)}</h3>
                <span class="specialty">Consulta agendada</span>
                <p class="card-date">🗓 ${dbData(c.data_hora)}</p>
                <p class="card-price">💰 ${dbBrl(c.valor)}</p>
                <p class="card-preview">${dbEsc((c.paciente_bio || 'Paciente sem descrição.').slice(0, 90))}</p>
                <button class="view-btn">Ver prontuário / Laudo</button>
            </div>
        </article>
    `).join('') || '<p>Nenhuma consulta agendada.</p>';
}

dbId('home').addEventListener('click', e => {
    const card = e.target.closest('.appointment-card');
    if (!card) return;
    
    const c = dbConsultas.find(x => String(x.id) === card.dataset.id);
    
    dbId('detailsModal').dataset.id = c.id;
    dbId('modalPatient').textContent = c.paciente_nome;
    dbId('modalType').textContent = 'Consulta agendada';
    dbId('modalDate').textContent = dbData(c.data_hora);
    dbId('modalPrice').textContent = dbBrl(c.valor);
    dbId('modalHistory').textContent = c.paciente_bio || 'Paciente sem descrição.';
    dbId('modalImg').src = dbPH;
    dbId('doctorNotes').value = c.anotacoes || '';
    
    dbId('detailsModal').showModal();
});

async function dbPatch(corpo, msg) {
    const m = dbId('detailsModal');
    const r = await dbApi('PATCH', `/api/consultas/${m.dataset.id}`, corpo);
    
    alert(r.success ? msg : r.message);
    
    if (r.success) { 
        m.close(); 
        dbCarregar(); 
        dbGanhos(); 
    }
}

function dbSalvarAnotacao() { 
    dbPatch({ anotacoes: dbId('doctorNotes').value }, 'Anotações salvas com sucesso no prontuário!'); 
}

dbId('saveNotesBtn').insertAdjacentHTML('afterend', `
    <button class="schedule-btn" id="dbConcluirBtn" style="margin-top:12px;margin-left:8px">
        Concluir consulta
    </button>
`);

dbId('dbConcluirBtn').addEventListener('click', () => {
    dbPatch({ 
        anotacoes: dbId('doctorNotes').value, 
        status: 'realizada' 
    }, 'Consulta concluída!');
});

// ---------- MEUS PACIENTES (derivados das consultas) ----------
function dbListaPacientes() {
    const mapa = {};
    
    dbConsultas.filter(c => c.status !== 'cancelada').forEach(c => {
        const p = (mapa[c.paciente_id] ||= { 
            id: c.paciente_id, 
            nome: c.paciente_nome, 
            bio: c.paciente_bio, 
            feitas: 0, 
            ultima: null 
        });
        
        if (c.status === 'realizada') { 
            p.feitas++; 
            p.ultima = c.data_hora; 
        }
    });
    
    return Object.values(mapa).filter(p => dbOk(p.nome));
}

function dbPacientes() {
    document.querySelector('#pacientes .cards-grid').innerHTML = dbListaPacientes().map(p => `
        <article class="doctor-card" data-id="${p.id}">
            <img src="${dbPH}" alt="${dbEsc(p.nome)}" class="card-img">
            <div class="card-info">
                <h3>${dbEsc(p.nome)}</h3>
                <span class="specialty">${p.ultima ? 'Última consulta: ' + dbData(p.ultima).split(',')[0] : 'Sem consulta realizada'}</span>
                <p class="card-rating">✔ ${p.feitas} atendimentos realizados</p>
                <p class="card-preview">${dbEsc((p.bio || '').slice(0, 90))}</p>
                <button class="view-doctor-btn">Acessar Ficha Completa</button>
            </div>
        </article>
    `).join('') || '<p>Nenhum paciente vinculado ainda.</p>';
}

dbId('pacientes').addEventListener('click', e => {
    const card = e.target.closest('.doctor-card');
    if (!card) return;
    
    const p = dbListaPacientes().find(x => String(x.id) === card.dataset.id);
    
    doctorModalName.textContent = p.nome;
    doctorModalProfession.textContent = p.ultima ? 'Última consulta: ' + dbData(p.ultima) : '';
    doctorModalRating.textContent = `✔ ${p.feitas} atendimentos realizados`;
    doctorModalBio.textContent = p.bio || 'Paciente sem descrição.';
    doctorModalImg.src = dbPH;
    
    const hist = dbConsultas.filter(c => c.paciente_id === p.id && c.status === 'realizada').reverse();
    
    patientConsultationsList.innerHTML = hist.map(c => `
        <div style="background-color:#f9f9f9;border-left:4px solid #7500a8;padding:10px 12px;border-radius:6px;margin-bottom:8px;">
            <small style="color:#666;font-size:0.8rem">🗓 ${dbData(c.data_hora)}</small>
            <p style="font-size:0.88rem;color:#333;margin:4px 0 0">${dbEsc(c.anotacoes || 'Sem anotações.')}</p>
        </div>
    `).join('') || '<p style="font-size:0.9rem;color:#666;">Nenhuma consulta registrada para este paciente.</p>';
    
    doctorModal.showModal();
});

// Busca do cabeçalho: filtra agenda e pacientes
let dbTimer;
document.querySelector('.search-input')?.addEventListener('input', e => {
    clearTimeout(dbTimer);
    dbTimer = setTimeout(() => { 
        dbFiltro = e.target.value.trim().toLowerCase(); 
        dbAgenda(); 
        dbPacientes(); 
    }, 250);
});

// ---------- PERFIL PROFISSIONAL + GANHOS ----------
function dbSelect(sel, valor) {
    if (!valor) return;
    if (![...sel.options].some(o => o.value === valor)) {
        sel.add(new Option(valor, valor));
    }
    sel.value = valor;
}

async function dbCarregarPerfil() {
    const r = await dbApi('GET', `/api/profile/${dbUser.id}`);
    if (!r.success) return;
    
    const p = r.profile;
    dbId('profileName').value = p.nome || '';
    dbSelect(dbId('profileSpecialty'), p.especialidade);
    dbId('councilNumber').value = p.registro || '';
    dbSelect(dbId('councilUf'), p.uf);
    dbId('hourlyRate').value = p.valor_hora != null ? p.valor_hora.toFixed(2).replace('.', ',') : '';
    dbId('profileBio').value = p.descricao || '';
    dbId('userEmail').value = p.email || '';
    dbId('userPhone').value = p.telefone || '';
}

async function dbGanhos() {
    const r = await dbApi('GET', `/api/medico/${dbUser.id}/ganhos`);
    if (!r.success) return;
    
    const v = document.querySelectorAll('#perfil .earnings-value');
    const l = document.querySelectorAll('#perfil .earnings-label');
    const s = document.querySelectorAll('#perfil .earnings-subtext');
    const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', timeZone: 'America/Recife' });
    
    l[0].textContent = `Ganhos neste Mês (${mes[0].toUpperCase() + mes.slice(1)})`;
    l[1].textContent = `Ganhos Acumulados no Ano (${new Date().getFullYear()})`;
    
    v[0].textContent = dbBrl(r.mes);
    v[1].textContent = dbBrl(r.ano);
    
    s[0].textContent = r.variacao_pct == null 
        ? 'Sem dados do mês anterior'
        : `${r.variacao_pct >= 0 ? '+' : ''}${r.variacao_pct}% em relação ao mês anterior`;
        
    s[1].textContent = `${r.consultas_ano} consultas realizadas`;
}

async function dbSalvar(campos, msg) {
    const r = await dbApi('PUT', `/api/profile/${dbUser.id}`, campos);
    alert(r.success ? msg : r.message);
}

dbId('profileForm').addEventListener('submit', e => {
    e.preventDefault();
    const bruto = dbId('hourlyRate').value.trim();
    const valor = bruto === '' ? null : Number(bruto.replace(/\./g, '').replace(',', '.'));
    
    if (valor !== null && (Number.isNaN(valor) || valor < 0)) {
        return alert('Valor da consulta inválido.');
    }
    
    dbSalvar({ 
        nome: dbId('profileName').value, 
        especialidade: dbId('profileSpecialty').value,
        registro: dbId('councilNumber').value, 
        uf: dbId('councilUf').value, 
        valor_hora: valor,
        descricao: dbId('profileBio').value 
    }, 'Perfil profissional atualizado!');
});

dbId('settingsForm').addEventListener('submit', e => {
    e.preventDefault();
    dbSalvar({ 
        email: dbId('userEmail').value, 
        telefone: dbId('userPhone').value 
    }, 'Configurações salvas!');
});

// Inicialização
dbCarregar(); 
dbCarregarPerfil(); 
dbGanhos();