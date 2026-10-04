document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const closeBtn = document.getElementById('closeBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navItems = document.querySelectorAll('.nav-item');
  const pageContents = document.querySelectorAll('.page-content');

  // Elementos do Modal (<dialog>)
  const detailsModal = document.getElementById('detailsModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalImg = document.getElementById('modalImg');
  const modalDoctor = document.getElementById('modalDoctor');
  const modalSpecialty = document.getElementById('modalSpecialty');
  const modalDate = document.getElementById('modalDate');
  const modalPrice = document.getElementById('modalPrice');
  const modalFeedback = document.getElementById('modalFeedback');

  // Controle de exibição da Sidebar
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

  // Navegação entre seções (Abas - Funciona tanto na Sidebar quanto no Footer)
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');

      // Atualiza o estado ativo de todos os botões com o mesmo target
      navItems.forEach(nav => {
        if (nav.getAttribute('data-target') === targetId) {
          nav.classList.add('active');
        } else {
          nav.classList.remove('active');
        }
      });

      // Alterna a visualização das páginas
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

  // Manipulação dos Cards e preenchimento do Modal
  const cards = document.querySelectorAll('.appointment-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const doctor = card.getAttribute('data-doctor');
      const specialty = card.getAttribute('data-specialty');
      const date = card.getAttribute('data-date');
      const price = card.getAttribute('data-price');
      const img = card.getAttribute('data-img');
      const feedback = card.getAttribute('data-feedback');

      modalDoctor.textContent = doctor;
      modalSpecialty.textContent = specialty;
      modalDate.textContent = date;
      modalPrice.textContent = price;
      modalImg.src = img;
      modalImg.alt = doctor;
      modalFeedback.textContent = feedback;

      detailsModal.showModal();
    });
  });

  // Fechamento do Modal via botão X
  closeModalBtn.addEventListener('click', () => {
    detailsModal.close();
  });

  // Fechamento do Modal ao clicar no backdrop (fora da caixa principal)
  detailsModal.addEventListener('click', (event) => {
    const rect = detailsModal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.bottom &&
      rect.left <= event.clientX &&
      event.clientX <= rect.right
    );
    
    if (!isInDialog) {
      detailsModal.close();
    }
  });
  // --- Lógica de Configurações e Confirmação ---
  const settingsForm = document.getElementById('settingsForm');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

  // Modal de Confirmação
  const confirmModal = document.getElementById('confirmModal');
  const confirmModalTitle = document.getElementById('confirmModalTitle');
  const confirmModalMessage = document.getElementById('confirmModalMessage');
  const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
  const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
  const actionConfirmBtn = document.getElementById('actionConfirmBtn');

  let pendingAction = null; // Armazena a ação a ser executada ao confirmar

  function openConfirmModal(title, message, btnText, isDanger, onConfirm) {
    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    actionConfirmBtn.textContent = btnText;

    if (isDanger) {
      actionConfirmBtn.className = 'btn-danger';
    } else {
      actionConfirmBtn.className = 'btn-primary';
    }

    pendingAction = onConfirm;
    confirmModal.showModal();
  }

  function closeConfirmModal() {
    confirmModal.close();
    pendingAction = null;
  }

  if (closeConfirmModalBtn) closeConfirmModalBtn.addEventListener('click', closeConfirmModal);
  if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', closeConfirmModal);

  if (actionConfirmBtn) {
    actionConfirmBtn.addEventListener('click', () => {
      if (typeof pendingAction === 'function') {
        pendingAction();
      }
      closeConfirmModal();
    });
  }

  // Envio do formulário de alterações
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      openConfirmModal(
        'Salvar Alterações',
        'Deseja realmente salvar as novas configurações e dados pessoais?',
        'Confirmar Alteração',
        false,
        () => {
          dbSalvarConfig();
        }
      );
    });
  }

  // Ação de excluir conta
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
      openConfirmModal(
        'Excluir Conta',
        'Tem certeza absoluta de que deseja excluir sua conta? Esta ação é irreversível.',
        'Excluir Definitivamente',
        true,
        () => {
          alert('Sua conta foi excluída.');
          // Alterna para a tela de encerramento
          navItems.forEach(n => n.classList.remove('active'));
          pageContents.forEach(p => p.classList.remove('active'));
          document.getElementById('sair').classList.add('active');
        }
      );
    });
  }

  // Botão "Sair da Conta" visível apenas em telas pequenas (Mobile)
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', () => {
      openConfirmModal(
        'Sair da Conta',
        'Deseja realmente encerrar sua sessão?',
        'Sair',
        false,
        () => {
          navItems.forEach(n => n.classList.remove('active'));
          pageContents.forEach(p => p.classList.remove('active'));
          document.getElementById('sair').classList.add('active');
        }
      );
    });
  }
  // Adicionar dentro do evento DOMContentLoaded
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const backToProfileBtn = document.getElementById('backToProfileBtn');
    const profileForm = document.getElementById('profileForm');
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatarPreview = document.getElementById('profileAvatarPreview');

    // Navegar do Perfil para Configurações via botão
    if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById('configuracoes').classList.add('active');
    });
    }

    // Voltar do menu de Configurações para o Perfil
    if (backToProfileBtn) {
    backToProfileBtn.addEventListener('click', () => {
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById('perfil').classList.add('active');
    });
    }

    // Preview da alteração da foto de perfil
    if (avatarInput && profileAvatarPreview) {
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            profileAvatarPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
        }
    });
    }

    // Submissão do Formulário de Perfil
    if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        openConfirmModal(
        'Salvar Perfil',
        'Deseja salvar as alterações em seu perfil?',
        'Confirmar',
        false,
        () => {
            dbSalvarPerfil();
        }
        );
    });
    }
});

// Manipulação dos Cards de Profissionais e Modal
const doctorCards = document.querySelectorAll('.doctor-card');
const doctorModal = document.getElementById('doctorModal');
const closeDoctorModalBtn = document.getElementById('closeDoctorModalBtn');

const doctorModalImg = document.getElementById('doctorModalImg');
const doctorModalName = document.getElementById('doctorModalName');
const doctorModalProfession = document.getElementById('doctorModalProfession');
const doctorModalRating = document.getElementById('doctorModalRating');
const doctorModalPrice = document.getElementById('doctorModalPrice');
const doctorModalBio = document.getElementById('doctorModalBio');
const scheduleBtn = document.getElementById('scheduleBtn');

doctorCards.forEach(card => {
  card.addEventListener('click', () => {
    const name = card.getAttribute('data-name');
    const profession = card.getAttribute('data-profession');
    const rating = card.getAttribute('data-rating');
    const price = card.getAttribute('data-price');
    const img = card.getAttribute('data-img');
    const bio = card.getAttribute('data-bio');

    doctorModalName.textContent = name;
    doctorModalProfession.textContent = profession;
    doctorModalRating.textContent = rating;
    doctorModalPrice.textContent = price;
    doctorModalImg.src = img;
    doctorModalImg.alt = name;
    doctorModalBio.textContent = bio;

    doctorModal.showModal();
  });
});

// Fechar modal de profissionais
if (closeDoctorModalBtn) {
  closeDoctorModalBtn.addEventListener('click', () => {
    doctorModal.close();
  });
}

// Fechar ao clicar no backdrop
if (doctorModal) {
  doctorModal.addEventListener('click', (event) => {
    const rect = doctorModal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.bottom &&
      rect.left <= event.clientX &&
      event.clientX <= rect.right
    );
    
    if (!isInDialog) {
      doctorModal.close();
    }
  });
}

const offlineAppointmentsKey = 'eclipsiOfflineAppointments';
let offlineForm = null;

function readOfflineAppointments() {
  try {
    const stored = JSON.parse(localStorage.getItem(offlineAppointmentsKey) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveOfflineAppointments(appointments) {
  localStorage.setItem(offlineAppointmentsKey, JSON.stringify(appointments));
}

function renderOfflineAppointments() {
  const homeSection = document.getElementById('home');

  if (!homeSection) {
    return;
  }

  let panel = document.getElementById('offlineAppointmentsPanel');
  if (!panel) {
    const cardsGrid = homeSection.querySelector('.cards-grid');
    panel = document.createElement('div');
    panel.id = 'offlineAppointmentsPanel';
    panel.style.margin = '20px 0';
    panel.style.padding = '16px';
    panel.style.borderRadius = '12px';
    panel.style.border = '1px solid rgba(108, 92, 231, 0.2)';
    panel.style.background = '#f8f8ff';
    panel.style.boxShadow = '0 8px 24px rgba(81, 70, 153, 0.08)';
    panel.innerHTML = `
      <h3 style="margin: 0 0 12px;">Agenda offline</h3>
      <form id="offlineAppointmentsForm" style="display: grid; gap: 10px; margin-bottom: 12px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
          <input id="offlineDoctor" type="text" placeholder="Nome do profissional" style="padding: 10px 12px; border: 1px solid #dfe3f0; border-radius: 8px;" required>
          <input id="offlineSpecialty" type="text" placeholder="Especialidade" style="padding: 10px 12px; border: 1px solid #dfe3f0; border-radius: 8px;" required>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
          <input id="offlineDate" type="date" style="padding: 10px 12px; border: 1px solid #dfe3f0; border-radius: 8px;" required>
          <input id="offlinePrice" type="text" placeholder="Valor" style="padding: 10px 12px; border: 1px solid #dfe3f0; border-radius: 8px;" required>
        </div>
        <button type="submit" style="padding: 10px 16px; border: none; border-radius: 8px; background: #6c5ce7; color: white; font-weight: 600; cursor: pointer;">Salvar agendamento</button>
      </form>
      <div id="offlineAppointmentsList"></div>
    `;

    if (cardsGrid) {
      homeSection.insertBefore(panel, cardsGrid);
    } else {
      homeSection.appendChild(panel);
    }
  }

  const list = document.getElementById('offlineAppointmentsList');
  offlineForm = document.getElementById('offlineAppointmentsForm');
  const appointments = readOfflineAppointments();

  if (offlineForm && !offlineForm.dataset.bound) {
    offlineForm.dataset.bound = 'true';
    offlineForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const doctorInput = document.getElementById('offlineDoctor');
      const specialtyInput = document.getElementById('offlineSpecialty');
      const dateInput = document.getElementById('offlineDate');
      const priceInput = document.getElementById('offlinePrice');

      if (!doctorInput || !specialtyInput || !dateInput || !priceInput) {
        return;
      }

      const appointment = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        doctor: doctorInput.value.trim() || 'Consulta offline',
        specialty: specialtyInput.value.trim(),
        date: new Date(dateInput.value).toLocaleDateString('pt-BR'),
        price: priceInput.value.trim(),
        feedback: 'Agendamento gerado localmente em modo offline.'
      };

      const currentAppointments = readOfflineAppointments();
      currentAppointments.unshift(appointment);
      saveOfflineAppointments(currentAppointments);
      offlineForm.reset();
      renderOfflineAppointments();
    });
  }

  if (!appointments.length) {
    list.innerHTML = '<p style="margin: 0; color: #555;">Nenhum agendamento offline salvo ainda.</p>';
    return;
  }

  list.innerHTML = appointments.map((appointment) => `
    <div style="display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 10px 12px; margin-bottom: 8px; border-radius: 10px; background: white; border: 1px solid rgba(108, 92, 231, 0.12);">
      <div>
        <strong>${appointment.doctor}</strong><br>
        <small>${appointment.specialty} · ${appointment.date} · ${appointment.price}</small>
      </div>
      <button type="button" class="offline-delete" data-id="${appointment.id}" style="border: none; background: #ff6b6b; color: white; border-radius: 8px; padding: 8px 10px; cursor: pointer;">Excluir</button>
    </div>
  `).join('');

  list.querySelectorAll('.offline-delete').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-id');
      const filteredAppointments = readOfflineAppointments().filter((item) => item.id !== targetId);
      saveOfflineAppointments(filteredAppointments);
      renderOfflineAppointments();
    });
  });
}

renderOfflineAppointments();
// --- Lógica do Modal de Avaliação de Consultas Realizadas ---
const ratingModal = document.getElementById('ratingModal');
const closeRatingModalBtn = document.getElementById('closeRatingModalBtn');
const ratingDoctorName = document.getElementById('ratingDoctorName');
const ratingForm = document.getElementById('ratingForm');
const rateButtons = document.querySelectorAll('.rate-btn');

rateButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita abrir o modal de detalhes da consulta ao clicar em avaliar
    const doctorName = btn.getAttribute('data-doctor-name');
    ratingDoctorName.textContent = `Profissional: ${doctorName}`;
    ratingForm.reset();
    ratingModal.showModal();
  });
});

if (closeRatingModalBtn) {
  closeRatingModalBtn.addEventListener('click', () => {
    ratingModal.close();
  });
}

if (ratingModal) {
  ratingModal.addEventListener('click', (e) => {
    const rect = ratingModal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right
    );
    if (!isInDialog) ratingModal.close();
  });
}
// =====================================================================
// INTEGRAÇÃO COM O BANCO (bloco novo, colar no FINAL do user.js)
// =====================================================================

const dbUser = JSON.parse(localStorage.getItem('user') || 'null');
if (!dbUser || dbUser.role !== 'paciente') {
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

// ---------- HOME: consultas do paciente ----------
let dbMedicos = {}, dbResumo = {};

function dbCardConsulta(c) {
    const feita = c.status === 'realizada';
    return `
    <article class="appointment-card ${feita ? 'completed' : 'upcoming'}" data-id="${c.id}"
        data-doctor="${dbEsc(c.medico_nome)}" data-specialty="${dbEsc(c.especialidade || '')}"
        data-date="${dbData(c.data_hora)}" data-price="${dbBrl(c.valor)}" data-img="${dbPH}"
        data-feedback="${dbEsc(c.anotacoes || 'Sem anotações até o momento.')}">
        
        <img src="${dbPH}" alt="${dbEsc(c.medico_nome)}" class="card-img">
        <div class="card-info">
            <h3>${dbEsc(c.medico_nome)}</h3>
            <span class="specialty">${dbEsc(c.especialidade || '')}</span>
            <p class="card-date">🗓 ${dbData(c.data_hora)}</p>
            <p class="card-price">💰 ${dbBrl(c.valor)}</p>
            ${feita ? `<p class="card-preview">${dbEsc((c.anotacoes || 'Sem anotações.').slice(0, 80))}</p>` : '<span class="status-badge upcoming-badge">Agendada</span>'}
            
            <div class="card-actions">
                <button class="view-btn">Ver detalhes</button>
                ${feita && !c.avaliada ? `<button class="rate-btn" data-id="${c.id}" data-doctor-name="${dbEsc(c.medico_nome)}"><i class="fa-solid fa-star"></i> Avaliar</button>` : ''}
                ${!feita ? `<button class="rate-btn" data-cancel="${c.id}">Cancelar</button>` : ''}
            </div>
        </div>
    </article>`;
}

async function dbCarregarHome() {
    const r = await dbApi('GET', `/api/consultas?paciente_id=${dbUser.id}`);
    const lista = r.success ? r.consultas : [];
    const grids = document.querySelectorAll('#home .cards-grid');
    
    grids[0].innerHTML = lista.filter(c => c.status === 'agendada').map(dbCardConsulta).join('') || '<p>Nenhuma consulta agendada.</p>';
    grids[1].innerHTML = lista.filter(c => c.status === 'realizada').reverse().map(dbCardConsulta).join('') || '<p>Nenhuma consulta realizada ainda.</p>';
}

dbId('home').addEventListener('click', async e => {
    const cancel = e.target.closest('[data-cancel]');
    if (cancel) {
        if (confirm('Deseja cancelar esta consulta?')) {
            const r = await dbApi('PATCH', `/api/consultas/${cancel.dataset.cancel}`, { status: 'cancelada' });
            if (!r.success) alert(r.message);
            dbCarregarHome();
        }
        return;
    }
    
    const rate = e.target.closest('.rate-btn');
    if (rate) {
        ratingModal.dataset.id = rate.dataset.id;
        ratingDoctorName.textContent = `Profissional: ${rate.dataset.doctorName}`;
        ratingForm.reset();
        ratingModal.showModal();
        return;
    }
    
    const card = e.target.closest('.appointment-card');
    if (!card) return;
    
    dbId('modalDoctor').textContent = card.dataset.doctor;
    dbId('modalSpecialty').textContent = card.dataset.specialty;
    dbId('modalDate').textContent = card.dataset.date;
    dbId('modalPrice').textContent = card.dataset.price;
    dbId('modalImg').src = card.dataset.img;
    dbId('modalFeedback').textContent = card.dataset.feedback;
    dbId('detailsModal').showModal();
});

ratingForm.addEventListener('submit', async e => {
    e.preventDefault();
    const nota = ratingForm.querySelector('input[name="rating"]:checked')?.value;
    const r = await dbApi('POST', '/api/avaliacoes', {
        consulta_id: ratingModal.dataset.id, 
        nota, 
        comentario: dbId('ratingComment').value 
    });
    
    alert(r.message);
    if (r.success) { 
        ratingModal.close(); 
        dbCarregarHome(); 
        dbCarregarMedicos(); 
    }
});

// ---------- BUSCAR CONSULTAS: médicos do banco ----------
dbId('consultas').querySelector('p').insertAdjacentHTML('afterend', `
    <input type="text" id="dbBuscaMedico" placeholder="Buscar por nome, registro ou descrição..." maxlength="100"
        style="width:100%;max-width:360px;padding:10px 14px;border:1px solid #ddd;border-radius:20px;margin:8px 0 16px;">
`);

async function dbCarregarMedicos(q = '') {
    const [r, rs] = await Promise.all([
        dbApi('GET', `/api/doctors?q=${encodeURIComponent(q)}`), 
        dbApi('GET', '/api/avaliacoes/resumo')
    ]);
    
    dbResumo = rs.success ? rs.resumo : {};
    const lista = r.success ? r.doctors : [];
    dbMedicos = Object.fromEntries(lista.map(d => [d.id, d]));
    
    document.querySelector('#consultas .cards-grid').innerHTML = lista.map(d => {
        const rt = dbResumo[d.id];
        return `
        <article class="doctor-card" data-id="${d.id}">
            <img src="${dbPH}" alt="${dbEsc(d.nome)}" class="card-img">
            <div class="card-info">
                <h3>${dbEsc(d.nome)}</h3>
                <span class="specialty">${dbEsc(d.especialidade || '')} (${dbEsc(d.registro || '')}${d.uf ? '/' + dbEsc(d.uf) : ''})</span>
                <p class="card-rating">${rt ? `⭐ ${rt.media} (${rt.total} avaliações)` : 'Sem avaliações ainda'}</p>
                <p class="card-price">💰 ${d.valor_hora != null ? dbBrl(d.valor_hora) + ' / hora' : 'Valor a combinar'}</p>
                <p class="card-preview">${dbEsc((d.descricao || '').slice(0, 100))}</p>
                <button class="view-doctor-btn">Ver perfil completo</button>
            </div>
        </article>`;
    }).join('') || '<p>Nenhum profissional encontrado.</p>';
}

dbId('consultas').addEventListener('click', e => {
    const card = e.target.closest('.doctor-card');
    if (!card) return;
    
    const d = dbMedicos[card.dataset.id];
    const rt = dbResumo[d.id];
    
    doctorModal.dataset.id = d.id;
    doctorModalName.textContent = d.nome;
    doctorModalProfession.textContent = `${d.especialidade || ''} (${d.registro || ''}${d.uf ? '/' + d.uf : ''})`;
    doctorModalRating.textContent = rt ? `⭐ ${rt.media} (${rt.total} avaliações)` : 'Sem avaliações ainda';
    doctorModalPrice.textContent = d.valor_hora != null ? dbBrl(d.valor_hora) : 'A combinar';
    doctorModalBio.textContent = d.descricao || 'Sem apresentação.';
    doctorModalImg.src = dbPH;
    dbId('dbDataConsulta').value = '';
    doctorModal.showModal();
});

scheduleBtn.insertAdjacentHTML('beforebegin', `
    <label style="display:block;margin-top:12px">Data e hora:</label>
    <input type="datetime-local" id="dbDataConsulta" style="width:100%;padding:10px;margin-bottom:8px;border:1px solid #ccc;border-radius:8px;">
`);

scheduleBtn.addEventListener('click', async () => {
    if (!dbId('dbDataConsulta').value) return alert('Escolha a data e a hora da consulta.');
    
    const r = await dbApi('POST', '/api/consultas', {
        paciente_id: dbUser.id, 
        medico_id: doctorModal.dataset.id,
        data_hora: new Date(dbId('dbDataConsulta').value).toISOString() 
    });
    
    alert(r.message);
    
    if (r.success) { 
        doctorModal.close(); 
        await dbCarregarHome(); 
        dbId('home').classList.add('active'); 
        document.querySelector('.nav-item[data-target="home"]').click(); 
    }
});

let dbTimer;
function dbBuscar(v) {
    clearTimeout(dbTimer);
    dbTimer = setTimeout(() => {
        document.querySelector('.nav-item[data-target="consultas"]').click();
        dbId('dbBuscaMedico').value = v;
        dbCarregarMedicos(v.trim());
    }, 250);
}

dbId('dbBuscaMedico').addEventListener('input', e => dbBuscar(e.target.value));
document.querySelector('.search-input')?.addEventListener('input', e => dbBuscar(e.target.value));

// ---------- PERFIL ----------
async function dbCarregarPerfil() {
    const r = await dbApi('GET', `/api/profile/${dbUser.id}`);
    if (!r.success) return;
    
    const p = r.profile;
    dbId('profileName').value = p.nome || '';
    if (p.genero && [...dbId('profileGender').options].some(o => o.value === p.genero)) {
        dbId('profileGender').value = p.genero;
    }
    dbId('profileBio').value = p.descricao || '';
    dbId('userEmail').value = p.email || '';
    dbId('userPhone').value = p.telefone || '';
}

async function dbSalvar(campos, msg) {
    const r = await dbApi('PUT', `/api/profile/${dbUser.id}`, campos);
    alert(r.success ? msg : r.message);
}

function dbSalvarPerfil() {
    dbSalvar({ 
        nome: dbId('profileName').value, 
        genero: dbId('profileGender').value, 
        descricao: dbId('profileBio').value 
    }, 'Perfil atualizado com sucesso!');
}

function dbSalvarConfig() {
    dbSalvar({ 
        email: dbId('userEmail').value, 
        telefone: dbId('userPhone').value 
    }, 'Configurações salvas com sucesso!');
}

// Inicialização
dbCarregarHome(); 
dbCarregarMedicos(); 
dbCarregarPerfil();
