const copy = navigator.language?.toLowerCase().startsWith('tr')
    ? {
        title: 'E-posta doğrulanıyor',
        waiting: 'Lütfen bekleyin…',
        success: 'E-posta adresiniz doğrulandı. Artık STAKEAI hesabınıza giriş yapabilirsiniz.',
        emailChangeSuccess: 'E-posta adresiniz güncellendi. Yeni adresinizle tekrar giriş yapın.',
        failure: 'Bu doğrulama bağlantısı geçersiz veya süresi dolmuş. Hesap ayarlarından yeni bir bağlantı isteyin ya da yeniden kaydolun.',
        back: 'STAKEAI girişine dön'
    }
    : {
        title: 'Verifying your email',
        waiting: 'Please wait…',
        success: 'Your email address has been verified. You can now log in to STAKEAI.',
        emailChangeSuccess: 'Your email address has been updated. Sign in again with the new address.',
        failure: 'This verification link is invalid or expired. Request a new link from account settings or sign up again.',
        back: 'Return to STAKEAI'
    };

document.documentElement.lang = navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
document.getElementById('verifyTitle').textContent = copy.title;
document.getElementById('verifyStatus').textContent = copy.waiting;
document.getElementById('loginLink').textContent = copy.back;

const token = new URLSearchParams(window.location.search).get('token');
const emailChangeToken = new URLSearchParams(window.location.search).get('emailChangeToken');
if (emailChangeToken) {
    fetch('/api/account/verify-email-change', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: emailChangeToken })
    }).then(async (response) => {
        if (!response.ok) throw new Error('email_change_verification_failed');
        document.getElementById('verifyStatus').textContent = copy.emailChangeSuccess;
        window.history.replaceState({}, document.title, window.location.pathname);
    }).catch((error) => {
        console.error('Email change verification failed.', error);
        document.getElementById('verifyStatus').textContent = copy.failure;
    });
} else if (!token) {
    document.getElementById('verifyStatus').textContent = copy.failure;
} else {
    fetch('/api/auth/verify-email', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    }).then(async (response) => {
        if (!response.ok) throw new Error('verification_failed');
        document.getElementById('verifyStatus').textContent = copy.success;
        window.history.replaceState({}, document.title, window.location.pathname);
    }).catch((error) => {
        console.error('Email verification failed.', error);
        document.getElementById('verifyStatus').textContent = copy.failure;
    });
}
