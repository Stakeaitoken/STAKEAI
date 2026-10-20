'use strict';

const setupEmail = document.getElementById('setupEmail');
const setupStatus = document.getElementById('setupStatus');
const setupForm = document.getElementById('adminSetupForm');
const passwordInput = document.getElementById('adminPassword');
const confirmationInput = document.getElementById('adminPasswordConfirmation');
const submitButton = document.getElementById('createAdminButton');

const readSetupState = async () => {
    const response = await fetch('/api/admin/bootstrap', { credentials: 'same-origin' });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        setupEmail.textContent = response.status === 409
            ? 'Bu e-posta için yönetici hesabı zaten oluşturulmuş.'
            : 'Yönetici kurulumu yalnızca yerel bilgisayarda kullanılabilir.';
        return;
    }
    setupEmail.textContent = `Yönetici e-postası: ${result.email}`;
    setupForm.hidden = false;
};

setupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!setupForm.reportValidity()) return;
    if (passwordInput.value !== confirmationInput.value) {
        setupStatus.textContent = 'Parola alanları eşleşmiyor.';
        confirmationInput.focus();
        return;
    }

    submitButton.disabled = true;
    setupStatus.textContent = '';
    try {
        const response = await fetch('/api/admin/bootstrap', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                password: passwordInput.value,
                confirmation: confirmationInput.value
            })
        });
        const result = await response.json().catch(() => ({}));
        passwordInput.value = '';
        confirmationInput.value = '';
        if (!response.ok) {
            setupStatus.textContent = result.error === 'admin_account_already_exists'
                ? 'Bu e-posta için yönetici hesabı zaten oluşturulmuş. Giriş yapmayı deneyin.'
                : result.error === 'password_must_be_12_to_128_bytes'
                    ? 'Parola en az 12, en fazla 128 bayt olmalıdır.'
                    : 'Yönetici hesabı oluşturulamadı. Lütfen daha sonra tekrar deneyin.';
            if (response.status === 409) setupForm.hidden = true;
            return;
        }
        window.location.assign('/admin.html');
    } catch {
        setupStatus.textContent = 'Sunucuya ulaşılamadı. Sunucunun çalıştığını kontrol edin.';
    } finally {
        submitButton.disabled = false;
    }
});

void readSetupState().catch(() => {
    setupEmail.textContent = 'Kurulum durumu alınamadı. Sunucunun çalıştığını kontrol edin.';
});
