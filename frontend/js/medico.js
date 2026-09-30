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
        alert('Anotações salvas com sucesso no prontuário do paciente!');
        doctorNotes.value = '';
        detailsModal.close();
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