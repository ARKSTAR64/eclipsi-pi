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
          alert('Configurações salvas com sucesso!');
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
            alert('Perfil atualizado com sucesso!');
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

if (scheduleBtn) {
  scheduleBtn.addEventListener('click', () => {
    // Salva as informações da consulta selecionada no localStorage
    localStorage.setItem('selectedDoctorName', doctorModalName.textContent);
    localStorage.setItem('selectedDoctorProfession', doctorModalProfession.textContent);
    localStorage.setItem('selectedDoctorPrice', doctorModalPrice.textContent);

    // Redireciona para a página de pagamento
    window.location.href = 'pagamento.html';
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

if (ratingForm) {
  ratingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ratingValue = ratingForm.querySelector('input[name="rating"]:checked')?.value;
    alert(`Obrigado! Sua avaliação de ${ratingValue} estrelas foi registrada com sucesso.`);
    ratingModal.close();
  });
}
