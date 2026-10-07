document.addEventListener('DOMContentLoaded', () => {
  // Carrega dados da consulta gravados no localStorage
  const doctorName = localStorage.getItem('selectedDoctorName') || 'Profissional';
  const doctorProfession = localStorage.getItem('selectedDoctorProfession') || '';
  const doctorPrice = localStorage.getItem('selectedDoctorPrice') || 'R$ 0,00';

  document.getElementById('summaryDoctor').textContent = doctorName;
  document.getElementById('summaryProfession').textContent = doctorProfession;
  document.getElementById('summaryPrice').textContent = doctorPrice;

  const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
  const cardForm = document.getElementById('cardForm');
  const pixArea = document.getElementById('pixArea');
  const copyPixBtn = document.getElementById('copyPixBtn');
  const pixCodeInput = document.getElementById('pixCodeInput');

  // Alterna entre formulário de cartão e exibição do PIX
  paymentOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected === 'pix') {
        cardForm.style.display = 'none';
        pixArea.style.display = 'block';
      } else {
        cardForm.style.display = 'flex';
        pixArea.style.display = 'none';
      }
    });
  });

  // Evento de envio do formulário de cartão
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Pagamento processado com sucesso! Sua consulta está agendada.');
    window.location.href = '/';
  });

  // Copiar código PIX
  if (copyPixBtn) {
    copyPixBtn.addEventListener('click', () => {
      pixCodeInput.select();
      document.execCommand('copy');
      alert('Código PIX copiado para a área de transferência!');
    });
  }

  // Confirmar pagamento PIX
  const confirmPixBtn = document.getElementById('confirmPixBtn');
  if (confirmPixBtn) {
    confirmPixBtn.addEventListener('click', () => {
      alert('Pagamento via PIX confirmado! Sua consulta está agendada.');
      window.location.href = '/';
    });
  }
});