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

  // Navegação entre as Abas (Gestão de Usuários e Estatísticas)
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

  // Formulário do Modal de Edição de Usuário
  const editUserForm = document.getElementById('editUserForm');
  if (editUserForm) {
    editUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Dados do usuário atualizados com sucesso pelo Administrador!');
      document.getElementById('editUserModal').close();
    });
  }
});

// Função para abrir e preencher o modal de edição de usuário
function openEditUserModal(name, email, role) {
  const modal = document.getElementById('editUserModal');
  document.getElementById('editUserName').value = name;
  document.getElementById('editUserEmail').value = email;
  if (modal) {
    modal.showModal();
  }
}