document.addEventListener('DOMContentLoaded', () => {

    // 1. CADASTRO DE PACIENTE / USUÁRIO
    const formUser = document.getElementById('form-user');
    if (formUser) {
        formUser.addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            const payload = {
                nome: document.getElementById('name').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('phone') ? document.getElementById('phone').value : '',
                idade: document.getElementById('age') ? document.getElementById('age').value : null,
                genero: document.getElementById('gender') ? document.getElementById('gender').value : '',
                senha: password
            };

            try {
                const response = await fetch('/api/register/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    window.location.href = '/pages/login.html';
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Ocorreu um erro ao conectar ao servidor.');
            }
        });
    }

    // 2. CADASTRO DE MÉDICO / PROFISSIONAL
    const formMedico = document.getElementById('form-medico');
    if (formMedico) {
        formMedico.addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            const payload = {
                nome: document.getElementById('name').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('phone').value,
                especialidade: document.getElementById('specialty').value,
                registro: document.getElementById('council-number').value,
                uf: document.getElementById('council-uf').value,
                descricao: document.getElementById('description') ? document.getElementById('description').value : '',
                senha: password
            };

            try {
                const response = await fetch('/api/register/doctor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    window.location.href = '/pages/login.html';
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Ocorreu um erro ao conectar ao servidor.');
            }
        });
    }

    // 3. LOGIN DE USUÁRIO (ADMIN, MÉDICO OU PACIENTE)
    const loginForm = document.getElementById('registerForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            if (!emailInput || !passwordInput) return;

            const payload = {
                email: emailInput.value.trim(),
                senha: passwordInput.value
            };

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Salva dados do utilizador logado para utilizar no painel
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redireciona para o painel correto retornado pela API (/pages/admin.html, /pages/medico.html ou /pages/user.html)
                    window.location.href = data.redirect_url;
                } else {
                    alert(data.message || 'E-mail ou senha incorretos.');
                }
            } catch (error) {
                console.error('Erro na requisição de login:', error);
                alert('Ocorreu um erro ao conectar ao servidor.');
            }
        });
    }

});