document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const closeBtn = document.getElementById('closeBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navItems = document.querySelectorAll('.nav-item');
  const pageContents = document.querySelectorAll('.page-content');

  // Alternar Menu Lateral
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

  // Navegação entre as Abas
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

  // Formulário de Edição do Perfil de Usuário
  const editUserForm = document.getElementById('editUserForm');
  if (editUserForm) {
    editUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Informações do usuário atualizadas com sucesso pelo Administrador!');
      document.getElementById('editUserModal').close();
    });
  }

  // Formulário do Perfil do Administrador
  const adminProfileForm = document.getElementById('adminProfileForm');
  if (adminProfileForm) {
    adminProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Configurações do perfil do Administrador salvas!');
    });
  }
});

// Função para abrir e preencher o modal com o perfil completo do usuário
function openEditUserModal(name, email, role, doc = '', phone = '', status = 'ativo') {
  const modal = document.getElementById('editUserModal');
  
  document.getElementById('editUserName').value = name;
  document.getElementById('editUserEmail').value = email;
  document.getElementById('editUserRole').value = role;
  document.getElementById('editUserDoc').value = doc;
  document.getElementById('editUserPhone').value = phone;
  document.getElementById('editUserStatus').value = status;

  if (modal) {
    modal.showModal();
  }
}

// Função para excluir o perfil somente após visualização
function deleteUserProfile() {
  const userName = document.getElementById('editUserName').value;
  const confirmDelete = confirm(`Tem certeza que deseja EXCLUIR permanentemente o perfil de "${userName}"? Esta ação não pode ser desfeita.`);
  
  if (confirmDelete) {
    alert(`O perfil de ${userName} foi excluído com sucesso.`);
    document.getElementById('editUserModal').close();
  }
}