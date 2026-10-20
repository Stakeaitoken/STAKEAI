const copy = navigator.language?.toLowerCase().startsWith('tr')
    ? {
        title: 'E-posta doğrulanıyor',
        waiting: 'Lütfen bekleyin…',
        success: 'E-posta adresiniz doğrulandı. Artık STAKEAI hesabınıza giriş yapabilirsiniz.',
        emailChangeSuccess: 'E-posta adresiniz güncellendi. Yeni adresinizle tekrar giriş yapın.',
        failure: 'Bu doğrulama bağlantısı geçersiz veya süresi dolmuş. Hesap ayarlarından yeni bir bağlantı isteyin ya da yeniden kaydolun.',
        back: 'Giriş yap'
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
const setResult = (ok, text) => {
    const icon = document.getElementById('verifyIcon');
    icon.textContent = ok ? '✓' : '!';
    icon.className = 'mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border text-4xl ' + (ok ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-rose-400/30 bg-rose-400/10 text-rose-300');
    document.getElementById('verifyTitle').textContent = ok
        ? (document.documentElement.lang === 'tr' ? 'E-posta onaylandı' : 'Email verified')
        : (document.documentElement.lang === 'tr' ? 'Doğrulama başarısız' : 'Verification failed');
    document.getElementById('verifyStatus').textContent = text;
};

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
        setResult(true, copy.emailChangeSuccess);
        window.history.replaceState({}, document.title, window.location.pathname);
    }).catch((error) => {
        console.error('Email change verification failed.', error);
        setResult(false, copy.failure);
    });
} else if (!token) {
    setResult(false, copy.failure);
} else {
    fetch('/api/auth/verify-email', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    }).then(async (response) => {
        if (!response.ok) throw new Error('verification_failed');
        setResult(true, copy.success);
        window.history.replaceState({}, document.title, window.location.pathname);
    }).catch((error) => {
        console.error('Email verification failed.', error);
        setResult(false, copy.failure);
    });
}
