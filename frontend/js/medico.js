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