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

      if (targetId === 'sair') {
        window.location.href = '/pages/login.html';
        return;
      }

      navItems.forEach(nav => {
        nav.classList.toggle('active', nav.getAttribute('data-target') === targetId);
      });

      pageContents.forEach(content => {
        content.classList.toggle('active', content.id === targetId);
      });

      closeSidebar();
    });
  });

  // Carrega dados iniciais
  loadUsers();
  loadStats();
  loadAdminProfile();

  // Formulário de Edição do Perfil de Usuário
  const editUserForm = document.getElementById('editUserForm');
  if (editUserForm) {
    editUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editUserId').value;
      const data = {
        nome: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        role: document.getElementById('editUserRole').value,
        telefone: document.getElementById('editUserPhone').value,
        registro: document.getElementById('editUserDoc').value
      };

      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        alert(result.message);
        if (result.success) {
          document.getElementById('editUserModal').close();
          loadUsers();
        }
      } catch (err) {
        alert('Erro ao atualizar usuário.');
      }
    });
  }

  // Formulário do Perfil do Administrador
  const adminProfileForm = document.getElementById('adminProfileForm');
  if (adminProfileForm) {
    adminProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;

      const data = {
        id: currentUser ? currentUser.id : 1,
        nome: document.getElementById('adminName').value,
        email: document.getElementById('adminEmail').value,
        senha: document.getElementById('adminPassword').value
      };

      try {
        const res = await fetch('/api/admin/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        alert(result.message);
      } catch (err) {
        alert('Erro ao atualizar perfil de administrador.');
      }
    });
  }
});

//Criando Função para colocar os valores do Admin da nova variável
async function loadAdminProfile() {
  try {
    const res = await fetch('/api/admin/profile');
    const data = await res.json();

    if (data.success) {
      document.getElementById('adminName').value = data.admin.nome || '';
      document.getElementById('adminEmail').value = data.admin.email || '';
    }
  } catch (e) {
    console.error('Erro ao carregar perfil do administrador:', e);
  }
}

// Carrega os usuários na tabela
async function loadUsers() {
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();

    if (data.success) {
      const tbody = document.getElementById('usersTableBody');
      if (!tbody) return;

      tbody.innerHTML = '';
      data.users.forEach(user => {
        const badgeClass = user.role === 'medico' ? 'badge-medico' : 'badge-paciente';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.nome}</td>
          <td>${user.email}</td>
          <td><span class="badge ${badgeClass}">${user.role}</span></td>
          <td>
            <button class="btn-edit-user" onclick='openEditUserModal(${JSON.stringify(user)})'>Editar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (e) {
    console.error('Erro ao carregar usuários:', e);
  }
}

// Carrega as estatísticas do banco de dados e atualiza a interface
async function loadStats() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();

    if (data.success) {
      const stats = data.stats;

      const patientTotal = document.getElementById('totalPacientes');
      if (patientTotal) patientTotal.textContent = stats.total_pacientes;

      const doctorTotal = document.getElementById('totalMedicos');
      if (doctorTotal) doctorTotal.textContent = stats.total_medicos;

      const specGrid = document.getElementById('specialtiesGrid');
      if (specGrid) {
        specGrid.innerHTML = '';
        const totalMedicos = stats.total_medicos || 1;
        const especialidades = stats.especialidades || {};

        if (Object.keys(especialidades).length === 0) {
          specGrid.innerHTML = '<p style="color: #666;">Nenhum profissional cadastrado por enquanto.</p>';
          return;
        }

        for (const [esp, count] of Object.entries(especialidades)) {
          const percentage = ((count / totalMedicos) * 100).toFixed(1);
          const espName = esp.charAt(0).toUpperCase() + esp.slice(1);

          const card = document.createElement('div');
          card.className = 'category-card';
          card.innerHTML = `
            <h4>${espName}s</h4>
            <div class="count">${count}</div>
            <small style="color: #666;">${percentage}% do total</small>
          `;
          specGrid.appendChild(card);
        }
      }
    }
  } catch (e) {
    console.error('Erro ao carregar estatísticas:', e);
  }
}

// Abre o modal de edição preenchendo com as informações do usuário selecionado
function openEditUserModal(user) {
  const modal = document.getElementById('editUserModal');
  
  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUserName').value = user.nome || '';
  document.getElementById('editUserEmail').value = user.email || '';
  document.getElementById('editUserRole').value = user.role || 'paciente';
  document.getElementById('editUserDoc').value = user.registro || '';
  document.getElementById('editUserPhone').value = user.telefone || '';

  if (modal) {
    modal.showModal();
  }
}

// Exclui o usuário após confirmação enviando DELETE para a API
async function deleteUserProfile() {
  const id = document.getElementById('editUserId').value;
  const userName = document.getElementById('editUserName').value;

  if (!id) return;

  const confirmDelete = confirm(`Tem certeza que deseja EXCLUIR permanentemente o perfil de "${userName}"? Esta ação não pode ser desfeita.`);
  
  if (confirmDelete) {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        document.getElementById('editUserModal').close();
        loadUsers();
      }
    } catch (e) {
      alert('Erro ao excluir o perfil.');
    }
  }
}