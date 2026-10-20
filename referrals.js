const copy = {
    en: {
        title: 'My referrals',
        back: '← Back to account',
        logout: 'Log out',
        shareTitle: 'Share your referral link',
        notice: 'Referral commissions are not active and no payouts are implemented.',
        count: 'Direct referrals',
        code: 'Your referral code',
        link: 'Your referral link',
        copyCode: 'Copy code',
        copyLink: 'Copy link',
        people: 'People you referred',
        privacy: 'Email addresses are masked to protect privacy.',
        empty: 'No referrals yet.',
        codeCopied: 'Referral code copied.',
        linkCopied: 'Referral link copied.',
        copyFailed: 'Could not copy. Please select and copy it manually.',
        sessionRequired: 'Log in to view your referrals.',
        loadFailed: 'Could not load your referrals. Please try again.',
        login: 'Log in to view your referrals.'
    },
    tr: {
        title: 'Referanslarım',
        back: '← Hesabıma dön',
        logout: 'Çıkış yap',
        shareTitle: 'Referans bağlantını paylaş',
        notice: 'Referans komisyonları etkin değil ve ödeme sistemi uygulanmadı.',
        count: 'Doğrudan referans',
        code: 'Referans kodun',
        link: 'Referans bağlantın',
        copyCode: 'Kodu kopyala',
        copyLink: 'Bağlantıyı kopyala',
        people: 'Davet ettiğin kişiler',
        privacy: 'Gizliliği korumak için e-posta adresleri maskelenir.',
        empty: 'Henüz referansın yok.',
        codeCopied: 'Referans kodu kopyalandı.',
        linkCopied: 'Referans bağlantısı kopyalandı.',
        copyFailed: 'Kopyalanamadı. Lütfen seçip kendiniz kopyalayın.',
        sessionRequired: 'Referanslarını görmek için giriş yap.',
        loadFailed: 'Referanslar yüklenemedi. Lütfen tekrar dene.',
        login: 'Referanslarını görmek için giriş yap.'
    }
};

const languageSelect = document.getElementById('referralLanguage');
const pageStatus = document.getElementById('pageStatus');
let referrals = null;

function currentLanguage() {
    return languageSelect.value;
}

function applyLanguage(language) {
    const selected = Object.hasOwn(copy, language) ? language : 'en';
    const text = copy[selected];
    document.documentElement.lang = selected;
    document.title = `${text.title} — STAKEAI`;
    document.getElementById('pageTitle').textContent = text.title;
    document.getElementById('backToAccount').textContent = text.back;
    document.getElementById('referralLogout').textContent = text.logout;
    document.getElementById('shareTitle').textContent = text.shareTitle;
    document.getElementById('referralNotice').textContent = text.notice;
    document.getElementById('countLabel').textContent = text.count;
    document.getElementById('codeLabel').textContent = text.code;
    document.getElementById('linkLabel').textContent = text.link;
    document.getElementById('copyReferralCode').textContent = text.copyCode;
    document.getElementById('copyReferralLink').textContent = text.copyLink;
    document.getElementById('referredUsersTitle').textContent = text.people;
    document.getElementById('privacyNotice').textContent = text.privacy;
    document.getElementById('noReferrals').textContent = text.empty;
    document.getElementById('loginLink').textContent = text.login;
    languageSelect.value = selected;
    renderReferrals();
}

function renderReferrals() {
    if (!referrals) return;
    document.getElementById('referralCode').textContent = referrals.referralCode;
    const referralUrl = new URL('/', window.location.origin);
    referralUrl.searchParams.set('ref', referrals.referralCode);
    document.getElementById('referralLink').textContent = referralUrl.toString();
    document.getElementById('directReferralCount').textContent = String(referrals.directReferrals);
    const list = document.getElementById('referredUsersList');
    list.replaceChildren();
    for (const referredUser of referrals.referredUsers) {
        const item = document.createElement('li');
        item.className = 'rounded-lg bg-gray-900 px-3 py-2';
        item.textContent = referredUser.email;
        list.append(item);
    }
    document.getElementById('noReferrals').hidden = referrals.referredUsers.length > 0;
}

async function api(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers
        }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(result.error || 'api_error');
        error.status = response.status;
        throw error;
    }
    return result;
}

async function loadReferrals() {
    pageStatus.textContent = '';
    document.getElementById('loginLink').classList.add('hidden');
    try {
        const [session, summary] = await Promise.all([
            api('/api/auth/session'),
            api('/api/referrals/summary')
        ]);
        document.getElementById('accountEmail').textContent = session.email;
        referrals = summary;
        renderReferrals();
    } catch (error) {
        console.error('Could not load the referral page.', error);
        const text = copy[currentLanguage()];
        if (error.status === 401) {
            pageStatus.textContent = text.sessionRequired;
            document.getElementById('loginLink').classList.remove('hidden');
        } else {
            pageStatus.textContent = text.loadFailed;
        }
    }
}

async function copyValue(elementId, successMessage) {
    try {
        await navigator.clipboard.writeText(document.getElementById(elementId).textContent);
        pageStatus.textContent = successMessage;
    } catch (error) {
        console.error('Could not copy referral information.', error);
        pageStatus.textContent = copy[currentLanguage()].copyFailed;
    }
}

document.getElementById('copyReferralCode').addEventListener('click', () => {
    void copyValue('referralCode', copy[currentLanguage()].codeCopied);
});
document.getElementById('copyReferralLink').addEventListener('click', () => {
    void copyValue('referralLink', copy[currentLanguage()].linkCopied);
});
document.getElementById('referralLogout').addEventListener('click', async () => {
    try {
        await api('/api/auth/logout', { method: 'POST' });
        window.location.assign('/');
    } catch (error) {
        console.error('Could not close the account session.', error);
        pageStatus.textContent = copy[currentLanguage()].loadFailed;
    }
});
languageSelect.addEventListener('change', () => {
    applyLanguage(languageSelect.value);
    try {
        localStorage.setItem('stakeai-language', languageSelect.value);
    } catch (error) {
        console.warn('Could not save the language preference.', error);
    }
});

let preferredLanguage = 'en';
try {
    const savedLanguage = localStorage.getItem('stakeai-language');
    preferredLanguage = savedLanguage === 'tr' ? 'tr' : 'en';
} catch (error) {
    console.warn('Could not read the saved language preference.', error);
}
applyLanguage(preferredLanguage);
void loadReferrals();
