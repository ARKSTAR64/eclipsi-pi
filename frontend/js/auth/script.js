function makeLogin() {
    window.location.href = "/pages/auth/login.html";
}

function makeRegister() {
    window.location.href = "/pages/auth/cadastro.html";
}

function medChange() {
    window.location.href = "/pages/auth/cadastro-medico.html";
}

function pacChange() {
    window.location.href = "/pages/auth/cadastro-user.html";
}

function goBack() {
    window.location.href = "/";
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service Worker registrado:', reg))
      .catch((err) => console.error('Erro ao registrar Service Worker:', err));
  });
}
