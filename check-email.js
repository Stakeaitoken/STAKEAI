const email = new URLSearchParams(window.location.search).get('e') || '';
if (/^[^\s@]{1,64}@[^\s@]{1,255}$/.test(email) && email.length <= 254) {
    const target = document.getElementById('mailTo');
    target.textContent = email;
    target.classList.remove('hidden');
}
