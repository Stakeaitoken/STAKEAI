const copy = {
    en: {
        backToSite: 'Back to site',
        logout: 'Log out',
        adminArea: 'Administration',
        usersTitle: 'User management',
        refresh: 'Refresh',
        searchLabel: 'Search by email',
        search: 'Search',
        userEmail: 'User / email',
        trc20Address: 'USDT TRC-20',
        accountStatus: 'Account',
        usdtBalance: 'USDT balance',
        stakeaiBalance: 'STKAI balance',
        referral: 'Referral',
        registered: 'Registered',
        actions: 'Actions',
        previous: 'Previous',
        next: 'Next',
        adminNotice: 'Admin access is restricted to addresses configured in ADMIN_EMAILS. Account actions are recorded in the server audit log.',
        loading: 'Loading users…',
        loadFailed: 'Could not load users. Please try again.',
        denied: 'Admin access required. Sign in with an administrator account.',
        adminLoginLink: 'Sign in with the administrator account',
        sessionFailed: 'Could not verify the administrator session.',
        verified: 'Verified',
        unverified: 'Unverified',
        active: 'Active',
        disabled: 'Disabled',
        admin: 'Admin',
        disable: 'Disable',
        enable: 'Enable',
        none: 'None',
        results: 'Showing {from}–{to} of {total}',
        noResults: 'No users found.',
        confirmDisable: 'Disable this account? Its active sessions will be revoked.',
        confirmEnable: 'Re-enable this account?',
        updateFailed: 'Could not update account status.',
        updateSuccess: 'Account status updated.',
        editBalances: 'Edit balances',
        saveBalances: 'Save balances',
        cancel: 'Cancel',
        balanceUpdateSuccess: 'Balances updated.',
        balanceUpdateFailed: 'Could not update balances.',
        invalidBalance: 'Enter valid balances with up to 6 USDT and 18 STKAI decimal places.',
        treasuryTitle: 'Simulated admin asset pools',
        refreshTreasury: 'Refresh pools',
        treasuryNotice: 'These are internal simulation balances, not blockchain wallets or real reserves. STKAI starts with 21,000,000 virtual units. Orders atomically move balances between this pool and user portfolios.',
        saveTreasury: 'Save pool balances',
        treasuryHistory: 'Recent pool movements',
        treasuryLoaded: 'Pool balances refreshed.',
        treasurySaved: 'Pool balances saved and audited.',
        treasuryLoadFailed: 'Could not load the simulated pools.',
        treasurySaveFailed: 'Could not save the simulated pools.',
        treasuryInvalid: 'Enter valid balances (USDT: up to 6 decimals; other assets: up to 8).',
        treasuryReasonInitial: 'Opening inventory',
        treasuryReasonAdjustment: 'Admin adjustment',
        treasuryReasonTrade: 'Simulated trade',
        treasuryInsufficient: 'The simulated pool does not have enough of the requested asset.',
        paperFeeTitle: 'Simulated gas-fee commissions',
        paperFeeNotice: 'This pool tracks the 0.5% simulated commission from buy and sell orders. It is not a blockchain gas fee or real funds.',
        refreshPaperFees: 'Refresh fee pool',
        paperFeeHistory: 'Recent collected commissions',
        paperFeePair: 'Pair',
        paperFeeSide: 'Order',
        paperFeeEmpty: 'No simulated commissions have been collected yet.',
        paperFeeLoadFailed: 'Could not load the simulated commission pool.',
        transferRequests: 'Transfer requests',
        refreshTransfers: 'Refresh requests',
        sender: 'Sender',
        recipient: 'Recipient',
        transferAmount: 'Amount',
        requestedAt: 'Requested',
        noPendingTransfers: 'No pending transfer requests.',
        approveTransfer: 'Approve',
        rejectTransfer: 'Reject',
        transferApproved: 'Transfer approved and balances updated.',
        transferRejected: 'Transfer request rejected.',
        transferDecisionFailed: 'Could not process the transfer request.',
        transferBalanceInsufficient: 'Sender balance is no longer sufficient. Request remains pending.',
        transferRecipientUnavailable: 'Sender or recipient account is no longer available. Request remains pending.',
        confirmApproveTransfer: 'Approve this transfer and move the amount between platform balances?',
        confirmRejectTransfer: 'Reject this transfer request?',
        taskRequests: 'Task reward requests',
        refreshTasks: 'Refresh tasks',
        taskUser: 'User',
        taskName: 'Task',
        taskEvidence: 'Submitted evidence',
        taskSubmittedAt: 'Submitted',
        noPendingTasks: 'No pending task submissions.',
        taskReviewNotice: "Approval adds 10 USDT to the user's platform balance and writes an audit record. Verify the evidence manually.",
        taskNameTelegram: 'Join Telegram',
        taskNameX: 'Follow and repost on X',
        taskNameFacebook: 'Follow Facebook page',
        approveTask: 'Approve 10 USDT',
        rejectTask: 'Reject',
        taskApproved: 'Task approved and 10 USDT added to the user balance.',
        taskRejected: 'Task submission rejected.',
        taskDecisionFailed: 'Could not process the task submission.',
        confirmApproveTask: 'Verify the evidence and credit 10 USDT to this account?',
        confirmRejectTask: 'Reject this task submission?',
        stakingRewardsTitle: 'STAKEAI staking reward management',
        connectRewardWallet: 'Connect BSC testnet wallet',
        stakingRewardsNotice: 'Legacy V1 rewards are sent manually after maturity from the connected BSC testnet wallet.',
        stakingRewardPoolNotice: 'The owner funds rewards in advance. Each new stake reserves its full reward; reserved rewards cannot be withdrawn.',
        rewardPoolAmount: 'STKAI amount',
        fundRewardPool: 'Fund reward pool',
        withdrawRewardPool: 'Withdraw unallocated rewards',
        rewardPoolBalance: 'Unallocated STKAI rewards: {amount}',
        rewardPoolOwner: 'Contract owner: {address}',
        rewardPoolConnected: 'Connected staking owner wallet: {address}',
        rewardPoolFunded: 'Reward pool funded. Transaction: {transactionHash}',
        rewardPoolWithdrawn: 'Unallocated rewards withdrawn. Transaction: {transactionHash}',
        rewardPoolNotOwner: 'Connect the staking contract owner wallet to manage this pool.',
        rewardPoolInvalidAmount: 'Enter a valid positive amount with up to 18 decimal places.',
        rewardPoolInsufficientBalance: 'The connected wallet does not have enough STKAI.',
        rewardPoolConfirmFund: 'Fund the staking contract reward pool with {amount} STKAI?',
        rewardPoolConfirmWithdraw: 'Withdraw {amount} unallocated STKAI rewards to the contract owner wallet?',
        rewardPoolTransaction: 'Confirm the reward-pool transaction in your wallet.',
        rewardPoolFailed: 'The reward-pool transaction failed. Check your wallet and try again.',
        rewardPoolUnloaded: 'Connect the owner wallet to load the reward pool.',
        rewardRecipientWallet: 'Recipient wallet',
        rewardRecipientEmail: 'Account email (optional)',
        rewardPositionId: 'Mature position ID',
        prepareRewardPayout: 'Verify position and prepare payout',
        sendRewardPayout: 'Send verified reward',
        verifyRewardTransfer: 'Verify submitted transfer',
        recentRewardPayouts: 'Recent reward payouts',
        rewardAmount: 'Reward',
        rewardTransaction: 'Transaction',
        noRewardPayouts: 'No recorded payouts yet.',
        rewardWalletUnavailable: 'No browser wallet was found. Install a wallet such as MetaMask.',
        rewardWrongNetwork: 'Switch the wallet to BNB Smart Chain testnet (chain 97).',
        rewardWalletConnected: 'Connected payout wallet: {address}',
        rewardPositionPrepared: 'Verified position {positionId}. Send {amount} STKAI to {address} before {expiresAt}.',
        rewardConfirm: 'Send {amount} STKAI to {address} for matured position {positionId}?',
        rewardConfirmWallet: 'Confirm the STKAI transfer in your wallet.',
        rewardPaid: 'Reward transfer confirmed and recorded: {transactionHash}',
        rewardPrepareFailed: 'Could not verify or prepare this reward payout.',
        rewardTransferFailed: 'Could not send or verify the reward transfer. Check transaction status before retrying.',
        rewardPositionLocked: 'This staking position has not matured yet.',
        rewardAlreadyPaid: 'A reward is already reserved or paid for this position.',
        rewardNoPosition: 'The staking position could not be found for this wallet.',
        rewardPoolTransferMismatch: 'The confirmed transaction does not match the exact recipient and reward amount.',
        rewardRpcUnavailable: 'Could not verify the BNB testnet transaction. Try again shortly.',
        rewardStatusUnknown: 'The wallet transfer may have been submitted, but the server could not verify it. Do not send again until checking the transaction hash.',
        signOut: 'This account is not an administrator. Log out, then sign in with the administrator account.',
        notSignedIn: 'You are not signed in. Sign in with the administrator account.',
    },
    tr: {
        backToSite: 'Siteye dön',
        logout: 'Çıkış yap',
        adminArea: 'Yönetim',
        usersTitle: 'Kullanıcı yönetimi',
        refresh: 'Yenile',
        searchLabel: 'E-postada ara',
        search: 'Ara',
        userEmail: 'Kullanıcı / e-posta',
        trc20Address: 'USDT TRC-20',
        accountStatus: 'Hesap',
        usdtBalance: 'USDT bakiyesi',
        stakeaiBalance: 'STKAI bakiyesi',
        referral: 'Referans',
        registered: 'Kayıt tarihi',
        actions: 'İşlemler',
        previous: 'Önceki',
        next: 'Sonraki',
        adminNotice: 'Yönetici erişimi ADMIN_EMAILS içinde tanımlı adreslerle sınırlıdır. Hesap işlemleri sunucu denetim kaydına yazılır.',
        loading: 'Kullanıcılar yükleniyor…',
        loadFailed: 'Kullanıcılar yüklenemedi. Lütfen tekrar deneyin.',
        denied: 'Yönetici erişimi gerekli. Yönetici hesabıyla giriş yapın.',
        adminLoginLink: 'Yönetici hesabıyla giriş yap',
        sessionFailed: 'Yönetici oturumu doğrulanamadı.',
        verified: 'Doğrulanmış',
        unverified: 'Doğrulanmamış',
        active: 'Etkin',
        disabled: 'Devre dışı',
        admin: 'Yönetici',
        disable: 'Devre dışı bırak',
        enable: 'Yeniden etkinleştir',
        none: 'Yok',
        results: '{total} kullanıcıdan {from}–{to} gösteriliyor',
        noResults: 'Kullanıcı bulunamadı.',
        confirmDisable: 'Bu hesap devre dışı bırakılsın mı? Etkin oturumları sonlandırılır.',
        confirmEnable: 'Bu hesap yeniden etkinleştirilsin mi?',
        updateFailed: 'Hesap durumu güncellenemedi.',
        updateSuccess: 'Hesap durumu güncellendi.',
        editBalances: 'Bakiyeleri düzenle',
        saveBalances: 'Bakiyeleri kaydet',
        cancel: 'İptal',
        balanceUpdateSuccess: 'Bakiyeler güncellendi.',
        balanceUpdateFailed: 'Bakiyeler güncellenemedi.',
        invalidBalance: '6 ondalığa kadar USDT ve 18 ondalığa kadar STKAI için geçerli tutar girin.',
        treasuryTitle: 'Yönetici sanal varlık havuzları',
        refreshTreasury: 'Havuzları yenile',
        treasuryNotice: 'Bunlar uygulama içi simülasyon bakiyeleridir; blokzincir cüzdanı veya gerçek rezerv değildir. STKAI havuzu 21.000.000 sanal birimle başlar. Emirler havuz ve kullanıcı portföyü arasındaki bakiyeleri atomik olarak günceller.',
        saveTreasury: 'Havuz bakiyelerini kaydet',
        treasuryHistory: 'Son havuz hareketleri',
        treasuryLoaded: 'Havuz bakiyeleri yenilendi.',
        treasurySaved: 'Havuz bakiyeleri kaydedildi ve denetim kaydına işlendi.',
        treasuryLoadFailed: 'Sanal havuzlar yüklenemedi.',
        treasurySaveFailed: 'Sanal havuzlar kaydedilemedi.',
        treasuryInvalid: 'Geçerli bakiye girin (USDT: en fazla 6; diğer varlıklar: en fazla 8 ondalık).',
        treasuryReasonInitial: 'Açılış envanteri',
        treasuryReasonAdjustment: 'Yönetici düzenlemesi',
        treasuryReasonTrade: 'Sanal işlem',
        treasuryInsufficient: 'Sanal havuzda istenen varlıktan yeterli miktar yok.',
        paperFeeTitle: 'Gaz ücretlerinden gelen komisyonlar',
        paperFeeNotice: 'Bu havuz, alış ve satışlardan kesilen %0,5 simülasyon komisyonlarını izler. Gerçek blokzincir gas ücreti veya gerçek para değildir.',
        refreshPaperFees: 'Komisyon havuzunu yenile',
        paperFeeHistory: 'Son tahsil edilen komisyonlar',
        paperFeePair: 'Parite',
        paperFeeSide: 'Emir',
        paperFeeEmpty: 'Henüz sanal işlem komisyonu tahsil edilmedi.',
        paperFeeLoadFailed: 'Sanal komisyon havuzu yüklenemedi.',
        transferRequests: 'Transfer talepleri',
        refreshTransfers: 'Talepleri yenile',
        sender: 'Gönderen',
        recipient: 'Alıcı',
        transferAmount: 'Miktar',
        requestedAt: 'Talep tarihi',
        noPendingTransfers: 'Onay bekleyen transfer talebi yok.',
        approveTransfer: 'Onayla',
        rejectTransfer: 'Reddet',
        transferApproved: 'Transfer onaylandı ve bakiyeler güncellendi.',
        transferRejected: 'Transfer talebi reddedildi.',
        transferDecisionFailed: 'Transfer talebi işlenemedi.',
        transferBalanceInsufficient: 'Gönderenin bakiyesi artık yetersiz. Talep beklemede kaldı.',
        transferRecipientUnavailable: 'Gönderen veya alıcı hesabı artık kullanılamıyor. Talep beklemede kaldı.',
        confirmApproveTransfer: 'Bu transfer onaylanıp tutar platform bakiyeleri arasında aktarılsın mı?',
        confirmRejectTransfer: 'Bu transfer talebi reddedilsin mi?',
        taskRequests: 'Görev ödül talepleri',
        refreshTasks: 'Görevleri yenile',
        taskUser: 'Kullanıcı',
        taskName: 'Görev',
        taskEvidence: 'Gönderilen kanıt',
        taskSubmittedAt: 'Gönderim tarihi',
        noPendingTasks: 'Onay bekleyen görev gönderimi yok.',
        taskReviewNotice: 'Onay, kullanıcının platform bakiyesine 10 USDT ekler ve denetim kaydı oluşturur. Kanıtı manuel inceleyin.',
        taskNameTelegram: 'Telegram’a katıl',
        taskNameX: 'X hesabını takip et ve paylaş',
        taskNameFacebook: 'Facebook sayfasını takip et',
        approveTask: '10 USDT ile onayla',
        rejectTask: 'Reddet',
        taskApproved: 'Görev onaylandı ve kullanıcı bakiyesine 10 USDT eklendi.',
        taskRejected: 'Görev gönderimi reddedildi.',
        taskDecisionFailed: 'Görev gönderimi işlenemedi.',
        confirmApproveTask: 'Kanıtı doğrulayıp bu hesaba 10 USDT eklensin mi?',
        confirmRejectTask: 'Bu görev gönderimi reddedilsin mi?',
        stakingRewardsTitle: 'STAKEAI stake ödül yönetimi',
        connectRewardWallet: 'BSC testnet cüzdanını bağla',
        stakingRewardsNotice: 'Eski V1 sürümünde ödüller vade sonunda bağlı BSC testnet cüzdanından manuel gönderilir.',
        stakingRewardPoolNotice: 'Sözleşme sahibi ödülleri önceden havuza yatırır. Her stake için gereken ödül ayrılır ve ayrılmış ödüller çekilemez.',
        rewardPoolAmount: 'STKAI miktarı',
        fundRewardPool: 'Ödül havuzunu fonla',
        withdrawRewardPool: 'Ayrılmamış ödülü çek',
        rewardPoolBalance: 'Ayrılmamış STKAI ödülü: {amount}',
        rewardPoolOwner: 'Sözleşme sahibi: {address}',
        rewardPoolConnected: 'Bağlı staking sahibi cüzdanı: {address}',
        rewardPoolFunded: 'Ödül havuzu fonlandı. İşlem: {transactionHash}',
        rewardPoolWithdrawn: 'Ayrılmamış ödül çekildi. İşlem: {transactionHash}',
        rewardPoolNotOwner: 'Bu havuzu yönetmek için staking sözleşmesinin sahibi cüzdanını bağlayın.',
        rewardPoolInvalidAmount: '18 ondalık basamağa kadar geçerli ve sıfırdan büyük bir miktar girin.',
        rewardPoolInsufficientBalance: 'Bağlı cüzdanda yeterli STKAI yok.',
        rewardPoolConfirmFund: 'Staking sözleşmesinin ödül havuzuna {amount} STKAI aktarılsın mı?',
        rewardPoolConfirmWithdraw: '{amount} ayrılmamış STKAI ödülü sözleşme sahibi cüzdanına çekilsin mi?',
        rewardPoolTransaction: 'Cüzdanınızda ödül havuzu işlemini onaylayın.',
        rewardPoolFailed: 'Ödül havuzu işlemi başarısız oldu. Cüzdanınızı kontrol edip yeniden deneyin.',
        rewardPoolUnloaded: 'Ödül havuzunu görüntülemek için sahibi cüzdanını bağlayın.',
        rewardRecipientWallet: 'Alıcı cüzdanı',
        rewardRecipientEmail: 'Hesap e-postası (isteğe bağlı)',
        rewardPositionId: 'Vadesi dolmuş pozisyon kimliği',
        prepareRewardPayout: 'Pozisyonu doğrula ve ödemeyi hazırla',
        sendRewardPayout: 'Doğrulanmış ödülü gönder',
        verifyRewardTransfer: 'Gönderilen transferi doğrula',
        recentRewardPayouts: 'Son ödül ödemeleri',
        rewardAmount: 'Ödül',
        rewardTransaction: 'İşlem',
        noRewardPayouts: 'Henüz kayıtlı ödeme yok.',
        rewardWalletUnavailable: 'Tarayıcı cüzdanı bulunamadı. MetaMask gibi bir cüzdan yükleyin.',
        rewardWrongNetwork: 'Cüzdanı BNB Smart Chain testnet ağına (chain 97) geçirin.',
        rewardWalletConnected: 'Bağlı ödeme cüzdanı: {address}',
        rewardPositionPrepared: '{positionId} numaralı pozisyon doğrulandı. {amount} STKAI tutarını {address} adresine {expiresAt} tarihinden önce gönderin.',
        rewardConfirm: 'Vadesi dolmuş {positionId} numaralı pozisyon için {amount} STKAI, {address} adresine gönderilsin mi?',
        rewardConfirmWallet: 'Cüzdanınızda STKAI transferini onaylayın.',
        rewardPaid: 'Ödül transferi onaylandı ve kaydedildi: {transactionHash}',
        rewardPrepareFailed: 'Bu ödül ödemesi doğrulanamadı veya hazırlanamadı.',
        rewardTransferFailed: 'Ödül transferi gönderilemedi veya doğrulanamadı. Yeniden denemeden önce işlem durumunu kontrol edin.',
        rewardPositionLocked: 'Bu stake pozisyonunun vadesi henüz dolmadı.',
        rewardAlreadyPaid: 'Bu pozisyon için ödül zaten ayrılmış veya ödenmiş.',
        rewardNoPosition: 'Bu cüzdan için stake pozisyonu bulunamadı.',
        rewardPoolTransferMismatch: 'Onaylanan işlem, beklenen alıcı ve ödül tutarıyla eşleşmiyor.',
        rewardRpcUnavailable: 'BNB testnet işlemi doğrulanamadı. Biraz sonra tekrar deneyin.',
        rewardStatusUnknown: 'Cüzdan transferi gönderilmiş olabilir ancak sunucu doğrulayamadı. İşlem hashini kontrol etmeden tekrar göndermeyin.',
        signOut: 'Bu hesap yönetici değil. Oturumu kapatıp yönetici hesabıyla giriş yapın.',
        notSignedIn: 'Giriş yapmadınız. Yönetici hesabıyla giriş yapın.',
    }
};

const rows = document.getElementById('userRows');
const status = document.getElementById('adminStatus');
const resultCount = document.getElementById('resultCount');
const searchInput = document.getElementById('userSearch');
const balanceDialog = document.getElementById('balanceDialog');
const balanceForm = document.getElementById('balanceForm');
const balanceStatus = document.getElementById('balanceStatus');
const transferRows = document.getElementById('transferRows');
const transferStatus = document.getElementById('transferStatus');
const taskRows = document.getElementById('taskRows');
const taskStatus = document.getElementById('taskStatus');
const treasuryForm = document.getElementById('treasuryForm');
const treasuryStatus = document.getElementById('treasuryStatus');
const treasuryMovementRows = document.getElementById('treasuryMovementRows');
const paperFeeStatus = document.getElementById('paperFeeStatus');
const paperFeeBalances = document.getElementById('paperFeeBalances');
const paperFeeMovementRows = document.getElementById('paperFeeMovementRows');
const rewardRows = document.getElementById('rewardPayoutRows');
const rewardStatus = document.getElementById('stakingRewardStatus');
let editingUser = null;
let language = navigator.languages?.some((value) => value.toLowerCase().startsWith('tr')) ? 'tr' : 'en';
let page = 1;
let total = 0;
let authorized = false;
let stakingConfig = null;
let connectedRewardWallet = '';
let rewardPoolOwnerAddress = '';
let preparedRewardPayout = null;
let submittedRewardTransactionHash = '';

function text(key, values = {}) {
    return Object.entries(values).reduce(
        (result, [name, value]) => result.replace(`{${name}}`, String(value)),
        copy[language][key]
    );
}

function applyLanguage() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-copy]').forEach((element) => {
        element.textContent = text(element.dataset.copy);
    });
    searchInput.placeholder = text('searchLabel');
    document.getElementById('adminLanguage').value = language;
}

function cell(value, className = 'px-3 py-4 align-top text-gray-300') {
    const element = document.createElement('td');
    element.className = className;
    element.textContent = value;
    return element;
}

function makeUserRow(user) {
    const row = document.createElement('tr');
    const identity = document.createElement('td');
    identity.className = 'max-w-64 break-all px-3 py-4 align-top font-medium text-white';
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
    if (fullName) {
        const name = document.createElement('span');
        name.className = 'mb-1 block';
        name.textContent = fullName;
        identity.append(name);
    }
    const email = document.createElement('span');
    email.className = 'block text-gray-300';
    email.textContent = `${user.email}${user.isAdmin ? ` · ${text('admin')}` : ''}`;
    identity.append(email);
    row.append(identity);
    row.append(cell(user.trc20_address || '—', 'max-w-56 break-all px-3 py-4 align-top font-mono text-xs text-gray-300'));
    const accountStatus = document.createElement('td');
    accountStatus.className = 'px-3 py-4 align-top';
    const emailVerified = document.createElement('span');
    emailVerified.className = `mb-2 inline-block rounded-full px-2.5 py-1 text-xs ${user.email_verified ? 'bg-emerald-400/10 text-emerald-200' : 'bg-amber-400/10 text-amber-200'}`;
    emailVerified.textContent = text(user.email_verified ? 'verified' : 'unverified');
    const enabled = document.createElement('span');
    enabled.className = `inline-block rounded-full px-2.5 py-1 text-xs ${user.disabled_at ? 'bg-rose-400/10 text-rose-200' : 'bg-gray-800 text-gray-300'}`;
    enabled.textContent = text(user.disabled_at ? 'disabled' : 'active');
    accountStatus.append(emailVerified, document.createElement('br'), enabled);
    row.append(accountStatus);
    row.append(cell(user.usdt_balance, 'whitespace-nowrap px-3 py-4 align-top font-mono text-gray-200'));
    row.append(cell(user.stakeai_balance, 'whitespace-nowrap px-3 py-4 align-top font-mono text-gray-200'));
    row.append(cell(`${user.direct_referrals} · ${user.referral_code}`, 'px-3 py-4 align-top text-gray-300'));
    row.append(cell(new Date(`${user.created_at.replace(' ', 'T')}Z`).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US'), 'whitespace-nowrap px-3 py-4 align-top text-gray-300'));

    const actions = document.createElement('td');
    actions.className = 'px-3 py-4 align-top';
    const balanceButton = document.createElement('button');
    balanceButton.type = 'button';
    balanceButton.className = 'mb-2 block rounded-lg border border-cyan-400/30 px-3 py-2 text-xs font-semibold text-cyan-200 hover:border-cyan-300';
    balanceButton.textContent = text('editBalances');
    balanceButton.addEventListener('click', () => openBalanceEditor(user));
    actions.append(balanceButton);
    if (user.isAdmin) {
        const adminLabel = document.createElement('span');
        adminLabel.textContent = text('admin');
        actions.append(adminLabel);
    } else {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `rounded-lg border px-3 py-2 text-xs font-semibold ${user.disabled_at ? 'border-emerald-400/30 text-emerald-200 hover:border-emerald-300' : 'border-rose-400/30 text-rose-200 hover:border-rose-300'}`;
        button.textContent = text(user.disabled_at ? 'enable' : 'disable');
        button.addEventListener('click', () => void changeStatus(user, button));
        actions.append(button);
    }

    function openBalanceEditor(user) {
        editingUser = user;
        document.getElementById('balanceUserEmail').textContent = user.email;
        document.getElementById('editUsdtBalance').value = user.usdt_balance;
        document.getElementById('editStakeaiBalance').value = user.stakeai_balance;
        balanceStatus.textContent = '';
        balanceDialog.showModal();
    }
    row.append(actions);
    return row;
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
        const error = new Error(result.error || 'request_failed');
        error.status = response.status;
        throw error;
    }
    return result;
}

async function loadTreasury() {
    if (!authorized) return;
    try {
        const result = await api('/api/admin/treasury');
        const fieldIds = {
            USDT: 'treasuryUsdt',
            BTC: 'treasuryBtc',
            ETH: 'treasuryEth',
            BNB: 'treasuryBnb',
            STKAI: 'treasuryStkai'
        };
        for (const balance of result.balances) {
            document.getElementById(fieldIds[balance.asset]).value = balance.balance;
        }
        treasuryMovementRows.replaceChildren();
        const reasonKeys = {
            initial_inventory: 'treasuryReasonInitial',
            admin_adjustment: 'treasuryReasonAdjustment',
            simulated_trade: 'treasuryReasonTrade'
        };
        for (const movement of result.movements) {
            const row = document.createElement('tr');
            row.append(cell(
                `${movement.asset} · ${movement.previousBalance} → ${movement.newBalance}`,
                'px-2 py-2 font-mono text-gray-200'
            ));
            row.append(cell(text(reasonKeys[movement.reason] || 'treasuryReasonTrade'), 'px-2 py-2 text-gray-300'));
            row.append(cell(
                new Date(`${movement.createdAt.replace(' ', 'T')}Z`).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US'),
                'px-2 py-2 text-gray-400'
            ));
            treasuryMovementRows.append(row);
        }
        treasuryStatus.textContent = '';
    } catch (error) {
        console.error('Could not load the simulated admin asset pools.', error);
        treasuryStatus.textContent = text('treasuryLoadFailed');
    }
}

async function loadPaperFeePool() {
    if (!authorized) return;
    try {
        const result = await api('/api/admin/paper-fees');
        paperFeeBalances.replaceChildren();
        for (const balance of result.balances) {
            const card = document.createElement('li');
            card.className = 'rounded-xl border border-gray-800 bg-gray-950/70 px-4 py-3';
            const asset = document.createElement('p');
            asset.className = 'text-xs font-semibold uppercase tracking-wider text-gray-500';
            asset.textContent = balance.asset;
            const amount = document.createElement('p');
            amount.className = 'mt-1 font-mono text-lg font-semibold tabular-nums text-amber-100';
            amount.textContent = balance.balance;
            card.append(asset, amount);
            paperFeeBalances.append(card);
        }

        paperFeeMovementRows.replaceChildren();
        if (!result.movements.length) {
            const row = document.createElement('tr');
            const empty = cell(text('paperFeeEmpty'), 'px-2 py-3 text-gray-500');
            empty.colSpan = 4;
            row.append(empty);
            paperFeeMovementRows.append(row);
        }
        for (const movement of result.movements) {
            const row = document.createElement('tr');
            row.append(cell(
                `${movement.asset} · ${movement.amount}`,
                'px-2 py-2 font-mono text-gray-200'
            ));
            row.append(cell(movement.symbol, 'px-2 py-2 text-gray-300'));
            row.append(cell(text(movement.side === 'buy' ? 'buy' : 'sell'), 'px-2 py-2 text-gray-300'));
            row.append(cell(
                new Date(`${movement.createdAt.replace(' ', 'T')}Z`).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US'),
                'px-2 py-2 text-gray-400'
            ));
            paperFeeMovementRows.append(row);
        }
        paperFeeStatus.textContent = '';
    } catch (error) {
        console.error('Could not load the simulated commission pool.', error);
        paperFeeStatus.textContent = text('paperFeeLoadFailed');
    }
}

async function loadUsers() {
    if (!authorized) return;
    status.textContent = text('loading');
    rows.replaceChildren();
    const params = new URLSearchParams({ page: String(page) });
    if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
    try {
        const result = await api(`/api/admin/users?${params}`);
        total = result.total;
        result.users.forEach((user) => rows.append(makeUserRow(user)));
        status.textContent = total ? '' : text('noResults');
        const first = total ? (page - 1) * result.pageSize + 1 : 0;
        const last = Math.min(page * result.pageSize, total);
        resultCount.textContent = text('results', { from: first, to: last, total });
        document.getElementById('previousPage').disabled = page <= 1;
        document.getElementById('nextPage').disabled = page * result.pageSize >= total;
    } catch (error) {
        console.error('Could not load admin user list.', error);
        status.textContent = text(error.status === 401 || error.status === 403 ? 'denied' : 'loadFailed');
    }
}

async function loadTransferRequests() {
    if (!authorized) return;
    transferStatus.textContent = text('loading');
    transferRows.replaceChildren();
    try {
        const { transfers } = await api('/api/admin/transfers');
        document.getElementById('pendingTransferCount').textContent = String(transfers.length);
        for (const transfer of transfers) {
            const row = document.createElement('tr');
            row.append(cell(transfer.senderEmail));
            row.append(cell(transfer.recipientEmail));
            row.append(cell(`${transfer.amount} ${transfer.asset}`, 'whitespace-nowrap px-3 py-4 align-top font-mono text-white'));
            row.append(cell(new Date(`${transfer.createdAt.replace(' ', 'T')}Z`).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')));
            const actions = document.createElement('td');
            actions.className = 'space-x-2 px-3 py-4 align-top';
            for (const decision of ['approve', 'reject']) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = decision === 'approve'
                    ? 'rounded-lg border border-emerald-400/30 px-3 py-2 text-xs font-semibold text-emerald-200 hover:border-emerald-300'
                    : 'rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-semibold text-rose-200 hover:border-rose-300';
                button.textContent = text(decision === 'approve' ? 'approveTransfer' : 'rejectTransfer');
                button.addEventListener('click', () => void decideTransfer(transfer, decision, button));
                actions.append(button);
            }
            row.append(actions);
            transferRows.append(row);
        }
        const hasRequests = transfers.length > 0;
        document.getElementById('noPendingTransfers').hidden = hasRequests;
        document.getElementById('transferTable').hidden = !hasRequests;
        transferStatus.textContent = '';
    } catch (error) {
        console.error('Could not load pending transfer requests.', error);
        transferStatus.textContent = text(error.status === 401 || error.status === 403 ? 'denied' : 'loadFailed');
    }
}

async function loadTaskSubmissions() {
    if (!authorized) return;
    taskStatus.textContent = text('loading');
    taskRows.replaceChildren();
    try {
        const { submissions } = await api('/api/admin/tasks');
        document.getElementById('pendingTaskCount').textContent = String(submissions.length);
        for (const submission of submissions) {
            const row = document.createElement('tr');
            row.append(cell(submission.userEmail));
            row.append(cell(text(`taskName${submission.taskKey[0].toUpperCase()}${submission.taskKey.slice(1)}`)));
            row.append(cell(submission.proof, 'max-w-80 break-words px-3 py-4 align-top text-gray-300'));
            row.append(cell(new Date(`${submission.submittedAt.replace(' ', 'T')}Z`).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')));
            const actions = document.createElement('td');
            actions.className = 'space-x-2 px-3 py-4 align-top';
            for (const decision of ['approve', 'reject']) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = decision === 'approve'
                    ? 'rounded-lg border border-emerald-400/30 px-3 py-2 text-xs font-semibold text-emerald-200 hover:border-emerald-300'
                    : 'rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-semibold text-rose-200 hover:border-rose-300';
                button.textContent = text(decision === 'approve' ? 'approveTask' : 'rejectTask');
                button.addEventListener('click', () => void decideTask(submission, decision, button));
                actions.append(button);
            }
            row.append(actions);
            taskRows.append(row);
        }
        const hasSubmissions = submissions.length > 0;
        document.getElementById('noPendingTasks').hidden = hasSubmissions;
        document.getElementById('taskTable').hidden = !hasSubmissions;
        taskStatus.textContent = '';
    } catch (error) {
        console.error('Could not load pending task submissions.', error);
        taskStatus.textContent = text(error.status === 401 || error.status === 403 ? 'denied' : 'loadFailed');
    }
}

async function decideTask(submission, decision, button) {
    const confirmation = decision === 'approve' ? 'confirmApproveTask' : 'confirmRejectTask';
    if (!window.confirm(`${text(confirmation)}\n\n${submission.userEmail} · ${text(`taskName${submission.taskKey[0].toUpperCase()}${submission.taskKey.slice(1)}`)}`)) {
        return;
    }
    button.disabled = true;
    taskStatus.textContent = '';
    try {
        await api(`/api/admin/tasks/${encodeURIComponent(submission.id)}/decision`, {
            method: 'POST',
            body: JSON.stringify({ decision })
        });
        await Promise.all([loadTaskSubmissions(), loadUsers()]);
        taskStatus.textContent = text(decision === 'approve' ? 'taskApproved' : 'taskRejected');
    } catch (error) {
        console.error('Could not process task submission.', error);
        taskStatus.textContent = text('taskDecisionFailed');
        button.disabled = false;
    }
}

async function decideTransfer(transfer, decision, button) {
    const confirmation = decision === 'approve' ? 'confirmApproveTransfer' : 'confirmRejectTransfer';
    if (!window.confirm(`${text(confirmation)}\n\n${transfer.senderEmail} → ${transfer.recipientEmail}: ${transfer.amount} ${transfer.asset}`)) {
        return;
    }
    button.disabled = true;
    transferStatus.textContent = '';
    try {
        await api(`/api/admin/transfers/${encodeURIComponent(transfer.id)}/decision`, {
            method: 'POST',
            body: JSON.stringify({ decision })
        });
        await loadTransferRequests();
        await loadUsers();
        transferStatus.textContent = text(decision === 'approve' ? 'transferApproved' : 'transferRejected');
    } catch (error) {
        console.error('Could not process transfer request.', error);
        transferStatus.textContent = error.message === 'insufficient_transfer_balance'
            ? text('transferBalanceInsufficient')
            : error.message === 'transfer_account_unavailable'
                ? text('transferRecipientUnavailable')
                : text('transferDecisionFailed');
        button.disabled = false;
    }
}

async function changeStatus(user, button) {
    const disabled = !user.disabled_at;
    if (!window.confirm(text(disabled ? 'confirmDisable' : 'confirmEnable'))) return;
    button.disabled = true;
    status.textContent = '';
    try {
        await api(`/api/admin/users/${encodeURIComponent(user.id)}/status`, {
            method: 'POST',
            body: JSON.stringify({ disabled })
        });
        status.textContent = text('updateSuccess');
        await loadUsers();
    } catch (error) {
        console.error('Could not update user account status.', error);
        status.textContent = text('updateFailed');
        button.disabled = false;
    }
}

const rewardTokenAbi = [
    'function balanceOf(address account) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function transfer(address to, uint256 amount) returns (bool)'
];
const rewardPoolAbi = [
    'function owner() view returns (address)',
    'function availableRewards() view returns (uint256)',
    'function fundRewards(uint256 amount)',
    'function withdrawUnallocatedRewards(uint256 amount)'
];

async function getRewardWallet() {
    if (!window.ethereum || !window.ethers) throw new Error('wallet_unavailable');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts.length) throw new Error('wallet_unavailable');
    let provider = new window.ethers.BrowserProvider(window.ethereum);
    let network = await provider.getNetwork();
    if (network.chainId !== 97n) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x61' }]
            });
        } catch (error) {
            if (error.code === 4902 || error.code === -32603) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x61',
                        chainName: 'BNB Smart Chain Testnet',
                        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
                        blockExplorerUrls: ['https://testnet.bscscan.com']
                    }]
                });
            } else {
                throw error;
            }
        }
        provider = new window.ethers.BrowserProvider(window.ethereum);
        network = await provider.getNetwork();
        if (network.chainId !== 97n) throw new Error('wrong_network');
    }
    const signer = await provider.getSigner();
    return { signer, address: await signer.getAddress() };
}

function setRewardStatus(message, isError = false) {
    rewardStatus.textContent = message;
    rewardStatus.className = `mt-3 min-h-5 text-sm ${isError ? 'text-rose-300' : 'text-amber-200'}`;
}

function parseRewardPoolAmount() {
    const value = document.getElementById('rewardPoolAmount').value.trim();
    if (!/^(?:0|[1-9]\d*)(?:\.\d{1,18})?$/.test(value)) {
        throw new Error('invalid_amount');
    }
    const amount = window.ethers.parseUnits(value, 18);
    if (amount <= 0n) throw new Error('invalid_amount');
    return { amount, display: window.ethers.formatUnits(amount, 18) };
}

async function loadRewardPool() {
    if (!authorized || !stakingConfig?.enabled || stakingConfig.contractVersion !== 2) return;
    if (!connectedRewardWallet) {
        rewardPoolOwnerAddress = '';
        document.getElementById('fundRewardPool').disabled = true;
        document.getElementById('withdrawRewardPool').disabled = true;
        document.getElementById('rewardPoolBalance').textContent = text('rewardPoolUnloaded');
        return;
    }
    try {
        const { signer, address } = await getRewardWallet();
        connectedRewardWallet = address;
        const staking = new window.ethers.Contract(stakingConfig.stakingAddress, rewardPoolAbi, signer);
        const [owner, availableRewards] = await Promise.all([staking.owner(), staking.availableRewards()]);
        rewardPoolOwnerAddress = owner;
        document.getElementById('rewardPoolOwner').textContent = text('rewardPoolOwner', { address: owner });
        document.getElementById('rewardAdminWallet').textContent = text('rewardPoolConnected', { address });
        document.getElementById('rewardPoolBalance').textContent = text('rewardPoolBalance', {
            amount: `${window.ethers.formatUnits(availableRewards, 18)} STKAI`
        });
        const isOwner = owner.toLowerCase() === address.toLowerCase();
        document.getElementById('fundRewardPool').disabled = !isOwner;
        document.getElementById('withdrawRewardPool').disabled = !isOwner;
        if (!isOwner) setRewardStatus(text('rewardPoolNotOwner'), true);
    } catch (error) {
        console.error('Could not load the on-chain STAKEAI reward pool.', error);
        setRewardStatus(text(error.message === 'wallet_unavailable'
            ? 'rewardWalletUnavailable'
            : error.message === 'wrong_network'
                ? 'rewardWrongNetwork'
                : 'rewardPoolFailed'), true);
    }
}

async function submitRewardPoolFunding(event) {
    event.preventDefault();
    const button = document.getElementById('fundRewardPool');
    button.disabled = true;
    try {
        const { amount, display } = parseRewardPoolAmount();
        const { signer, address } = await getRewardWallet();
        const staking = new window.ethers.Contract(stakingConfig.stakingAddress, rewardPoolAbi, signer);
        const owner = await staking.owner();
        if (owner.toLowerCase() !== address.toLowerCase()) throw new Error('reward_pool_not_owner');
        if (!window.confirm(text('rewardPoolConfirmFund', { amount: display }))) return;

        const token = new window.ethers.Contract(stakingConfig.tokenAddress, rewardTokenAbi, signer);
        if (await token.balanceOf(address) < amount) throw new Error('reward_pool_insufficient_balance');
        if (await token.allowance(address, stakingConfig.stakingAddress) < amount) {
            setRewardStatus(text('rewardPoolTransaction'));
            await (await token.approve(stakingConfig.stakingAddress, amount)).wait();
        }
        setRewardStatus(text('rewardPoolTransaction'));
        const transaction = await staking.fundRewards(amount);
        await transaction.wait();
        setRewardStatus(text('rewardPoolFunded', { transactionHash: transaction.hash }));
        document.getElementById('rewardPoolAmount').value = '';
        await loadRewardPool();
    } catch (error) {
        console.error('Could not fund the on-chain STAKEAI reward pool.', error);
        const message = error.message === 'wallet_unavailable'
            ? 'rewardWalletUnavailable'
            : error.message === 'wrong_network'
                ? 'rewardWrongNetwork'
                : error.message === 'reward_pool_not_owner'
                    ? 'rewardPoolNotOwner'
                    : error.message === 'invalid_amount'
                        ? 'rewardPoolInvalidAmount'
                        : error.message === 'reward_pool_insufficient_balance'
                            ? 'rewardPoolInsufficientBalance'
                            : 'rewardPoolFailed';
        setRewardStatus(text(message), true);
    } finally {
        button.disabled = !connectedRewardWallet
            || !rewardPoolOwnerAddress
            || rewardPoolOwnerAddress.toLowerCase() !== connectedRewardWallet.toLowerCase();
    }
}

async function withdrawUnallocatedRewards() {
    const button = document.getElementById('withdrawRewardPool');
    button.disabled = true;
    try {
        const { amount, display } = parseRewardPoolAmount();
        const { signer, address } = await getRewardWallet();
        const staking = new window.ethers.Contract(stakingConfig.stakingAddress, rewardPoolAbi, signer);
        const owner = await staking.owner();
        if (owner.toLowerCase() !== address.toLowerCase()) throw new Error('reward_pool_not_owner');
        if (!window.confirm(text('rewardPoolConfirmWithdraw', { amount: display }))) return;

        setRewardStatus(text('rewardPoolTransaction'));
        const transaction = await staking.withdrawUnallocatedRewards(amount);
        await transaction.wait();
        setRewardStatus(text('rewardPoolWithdrawn', { transactionHash: transaction.hash }));
        document.getElementById('rewardPoolAmount').value = '';
        await loadRewardPool();
    } catch (error) {
        console.error('Could not withdraw unallocated STAKEAI rewards.', error);
        const message = error.message === 'wallet_unavailable'
            ? 'rewardWalletUnavailable'
            : error.message === 'wrong_network'
                ? 'rewardWrongNetwork'
                : error.message === 'reward_pool_not_owner'
                    ? 'rewardPoolNotOwner'
                    : error.message === 'invalid_amount'
                        ? 'rewardPoolInvalidAmount'
                        : 'rewardPoolFailed';
        setRewardStatus(text(message), true);
    } finally {
        button.disabled = !connectedRewardWallet
            || !rewardPoolOwnerAddress
            || rewardPoolOwnerAddress.toLowerCase() !== connectedRewardWallet.toLowerCase();
    }
}

async function loadRewardPayouts() {
    if (!authorized || !stakingConfig?.enabled) return;
    try {
        const { payouts } = await api('/api/admin/staking-reward-payouts');
        rewardRows.replaceChildren();
        for (const payout of payouts) {
            const row = document.createElement('tr');
            row.append(cell(`${payout.recipientEmail || '—'} · ${payout.recipientWallet}`, 'max-w-80 break-all px-3 py-4 align-top font-mono text-xs text-gray-300'));
            row.append(cell(`${window.ethers.formatUnits(payout.amountBaseUnits, 18)} STKAI`, 'whitespace-nowrap px-3 py-4 align-top font-mono text-white'));
            row.append(cell(payout.positionId));
            const link = document.createElement('a');
            link.href = `https://testnet.bscscan.com/tx/${encodeURIComponent(payout.transactionHash)}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'break-all text-emerald-200 underline';
            link.textContent = payout.transactionHash;
            const txCell = document.createElement('td');
            txCell.className = 'max-w-64 px-3 py-4 align-top';
            txCell.append(link);
            row.append(txCell);
            row.append(cell(new Date(`${payout.paidAt.replace(' ', 'T')}Z`).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')));
            rewardRows.append(row);
        }
        document.getElementById('noRewardPayouts').hidden = payouts.length > 0;
    } catch (error) {
        console.error('Could not load STAKEAI reward payout records.', error);
        setRewardStatus(text('rewardRpcUnavailable'), true);
    }
}

async function prepareRewardPayout(event) {
    event.preventDefault();
    if (!stakingConfig?.enabled) {
        setRewardStatus(text('rewardPrepareFailed'), true);
        return;
    }
    const prepareButton = document.getElementById('prepareRewardPayout');
    prepareButton.disabled = true;
    const sendButton = document.getElementById('sendRewardPayout');
    sendButton.disabled = true;
    sendButton.textContent = text('sendRewardPayout');
    preparedRewardPayout = null;
    submittedRewardTransactionHash = '';
    setRewardStatus('');
    try {
        const { address } = await getRewardWallet();
        connectedRewardWallet = address;
        document.getElementById('rewardAdminWallet').textContent = text('rewardWalletConnected', { address });
        const result = await api('/api/admin/staking-reward-payouts/prepare', {
            method: 'POST',
            body: JSON.stringify({
                adminWallet: address,
                recipientWallet: document.getElementById('rewardRecipientWallet').value.trim(),
                recipientEmail: document.getElementById('rewardRecipientEmail').value.trim(),
                positionId: document.getElementById('rewardPositionId').value
            })
        });
        preparedRewardPayout = result;
        document.getElementById('rewardPositionSummary').textContent = text('rewardPositionPrepared', {
            positionId: result.positionId,
            amount: result.amount,
            address: result.recipientWallet,
            expiresAt: new Date(result.expiresAt).toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US')
        });
        document.getElementById('sendRewardPayout').disabled = false;
    } catch (error) {
        console.error('Could not prepare a mature STAKEAI reward payout.', error);
        const messages = {
            wallet_unavailable: 'rewardWalletUnavailable',
            wrong_network: 'rewardWrongNetwork',
            staking_position_locked: 'rewardPositionLocked',
            staking_reward_already_reserved_or_paid: 'rewardAlreadyPaid',
            staking_position_not_found: 'rewardNoPosition',
            staking_rpc_unavailable: 'rewardRpcUnavailable',
            staking_not_configured: 'rewardPrepareFailed'
        };
        setRewardStatus(text(messages[error.message] || 'rewardPrepareFailed'), true);
    } finally {
        prepareButton.disabled = false;
    }
}

async function sendRewardPayout() {
    if (!preparedRewardPayout || !connectedRewardWallet) return;
    const button = document.getElementById('sendRewardPayout');
    button.disabled = true;
    try {
        if (!submittedRewardTransactionHash) {
            if (preparedRewardPayout.expiresAt <= Date.now()) {
                preparedRewardPayout = null;
                document.getElementById('rewardPositionSummary').textContent = '';
                setRewardStatus(text('rewardPrepareFailed'), true);
                button.disabled = false;
                return;
            }
            if (!window.confirm(text('rewardConfirm', {
                amount: preparedRewardPayout.amount,
                address: preparedRewardPayout.recipientWallet,
                positionId: preparedRewardPayout.positionId
            }))) {
                button.disabled = false;
                return;
            }
            const { signer, address } = await getRewardWallet();
            if (address.toLowerCase() !== connectedRewardWallet.toLowerCase()) {
                throw new Error('wrong_network');
            }
            const token = new window.ethers.Contract(stakingConfig.tokenAddress, rewardTokenAbi, signer);
            setRewardStatus(text('rewardConfirmWallet'));
            const transaction = await token.transfer(
                preparedRewardPayout.recipientWallet,
                BigInt(preparedRewardPayout.amountBaseUnits)
            );
            submittedRewardTransactionHash = transaction.hash;
            await transaction.wait();
        }

        const result = await api(
            `/api/admin/staking-reward-payouts/${encodeURIComponent(preparedRewardPayout.payoutId)}/confirm`,
            {
                method: 'POST',
                body: JSON.stringify({ transactionHash: submittedRewardTransactionHash })
            }
        );
        setRewardStatus(text('rewardPaid', { transactionHash: result.transactionHash }));
        preparedRewardPayout = null;
        submittedRewardTransactionHash = '';
        button.textContent = text('sendRewardPayout');
        document.getElementById('rewardPositionSummary').textContent = '';
        await loadRewardPayouts();
    } catch (error) {
        console.error('Could not send or verify a manual STAKEAI staking reward.', error);
        const messages = {
            wallet_unavailable: 'rewardWalletUnavailable',
            wrong_network: 'rewardWrongNetwork',
            staking_position_locked: 'rewardPositionLocked',
            staking_reward_transfer_mismatch: 'rewardPoolTransferMismatch',
            staking_rpc_unavailable: 'rewardRpcUnavailable',
            staking_reward_payout_expired: 'rewardPrepareFailed',
            staking_reward_sender_mismatch: 'rewardPoolTransferMismatch'
        };
        setRewardStatus(
            submittedRewardTransactionHash
                ? text('rewardStatusUnknown')
                : text(messages[error.message] || 'rewardTransferFailed'),
            true
        );
        button.textContent = submittedRewardTransactionHash
            ? text('verifyRewardTransfer')
            : text('sendRewardPayout');
        button.disabled = false;
    }
}

async function loadStakingRewardConfig() {
    try {
        stakingConfig = await api('/api/staking/config');
        document.getElementById('stakingRewardSection').hidden = !stakingConfig.enabled;
        document.getElementById('legacyRewardControls').hidden =
            !stakingConfig.enabled || stakingConfig.contractVersion !== 1;
        document.getElementById('autoRewardPoolControls').hidden =
            !stakingConfig.enabled || stakingConfig.contractVersion !== 2;
        if (stakingConfig.enabled && stakingConfig.contractVersion === 1) {
            await loadRewardPayouts();
        } else if (stakingConfig.enabled && stakingConfig.contractVersion === 2) {
            await loadRewardPool();
        }
    } catch (error) {
        console.error('Could not load BSC testnet staking configuration in admin.', error);
        document.getElementById('stakingRewardSection').hidden = true;
    }
}

async function initialize() {
    applyLanguage();
    try {
        const admin = await api('/api/admin/session');
        authorized = true;
        document.getElementById('adminLoginLink').hidden = true;
        document.getElementById('adminIdentity').textContent = admin.email;
        await Promise.all([
            loadUsers(),
            loadTreasury(),
            loadPaperFeePool(),
            loadTransferRequests(),
            loadTaskSubmissions(),
            loadStakingRewardConfig()
        ]);
    } catch (error) {
        console.error('Could not initialize administrator panel.', error);
        status.textContent = text(error.status === 401 || error.status === 403 ? 'denied' : 'sessionFailed');
        document.getElementById('adminIdentity').textContent = text(error.status === 403 ? 'signOut' : 'notSignedIn');
        document.getElementById('adminLoginLink').hidden = false;
        document.getElementById('searchForm').hidden = true;
        document.getElementById('refreshUsers').hidden = true;
        document.getElementById('userTable').hidden = true;
        document.getElementById('paginationControls').hidden = true;
        document.getElementById('transferRequestsSection').hidden = true;
        document.getElementById('treasurySection').hidden = true;
        document.getElementById('paperFeeSection').hidden = true;
        document.getElementById('taskRequestsSection').hidden = true;
        document.getElementById('stakingRewardSection').hidden = true;
    }
}

document.getElementById('adminLanguage').addEventListener('change', (event) => {
    language = event.target.value;
    applyLanguage();
    if (authorized) void loadUsers();
});
document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    page = 1;
    void loadUsers();
});
document.getElementById('refreshUsers').addEventListener('click', () => void loadUsers());
document.getElementById('refreshTreasury').addEventListener('click', () => void loadTreasury());
document.getElementById('refreshPaperFees').addEventListener('click', () => void loadPaperFeePool());
treasuryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = treasuryForm.querySelector('button[type="submit"]');
    button.disabled = true;
    treasuryStatus.textContent = '';
    const formData = new FormData(treasuryForm);
    const balances = Object.fromEntries(formData);
    try {
        await api('/api/admin/treasury', {
            method: 'POST',
            body: JSON.stringify({ balances })
        });
        await loadTreasury();
        treasuryStatus.textContent = text('treasurySaved');
    } catch (error) {
        console.error('Could not save simulated admin asset pools.', error);
        treasuryStatus.textContent = error.message === 'invalid_treasury_balance'
            || error.message === 'invalid_treasury_balances'
            ? text('treasuryInvalid')
            : text('treasurySaveFailed');
    } finally {
        button.disabled = false;
    }
});
document.getElementById('refreshTransfers').addEventListener('click', () => void loadTransferRequests());
document.getElementById('refreshTasks').addEventListener('click', () => void loadTaskSubmissions());
document.getElementById('refreshRewardPayouts').addEventListener('click', () => void loadRewardPayouts());
document.getElementById('stakingRewardForm').addEventListener('submit', (event) => void prepareRewardPayout(event));
document.getElementById('sendRewardPayout').addEventListener('click', () => void sendRewardPayout());
document.getElementById('rewardPoolForm').addEventListener('submit', (event) => void submitRewardPoolFunding(event));
document.getElementById('withdrawRewardPool').addEventListener('click', () => void withdrawUnallocatedRewards());
document.getElementById('refreshRewardPool').addEventListener('click', () => void loadRewardPool());
document.getElementById('connectRewardWallet').addEventListener('click', async () => {
    try {
        const { address } = await getRewardWallet();
        connectedRewardWallet = address;
        document.getElementById('rewardAdminWallet').textContent = text(
            stakingConfig.contractVersion === 2 ? 'rewardPoolConnected' : 'rewardWalletConnected',
            { address }
        );
        setRewardStatus('');
        if (stakingConfig.contractVersion === 2) await loadRewardPool();
    } catch (error) {
        console.error('Could not connect the administrator reward wallet.', error);
        setRewardStatus(text(error.message === 'wallet_unavailable'
            ? 'rewardWalletUnavailable'
            : 'rewardWrongNetwork'), true);
    }
});
document.getElementById('closeBalanceDialog').addEventListener('click', () => balanceDialog.close());
document.getElementById('cancelBalanceEdit').addEventListener('click', () => balanceDialog.close());
balanceForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!editingUser) return;
    const saveButton = document.getElementById('saveBalances');
    saveButton.disabled = true;
    balanceStatus.textContent = '';
    try {
        await api(`/api/admin/users/${encodeURIComponent(editingUser.id)}/balances`, {
            method: 'POST',
            body: JSON.stringify({
                usdtBalance: document.getElementById('editUsdtBalance').value,
                stakeaiBalance: document.getElementById('editStakeaiBalance').value
            })
        });
        balanceDialog.close();
        editingUser = null;
        await loadUsers();
        status.textContent = text('balanceUpdateSuccess');
    } catch (error) {
        console.error('Could not update user balances.', error);
        balanceStatus.textContent = error.message === 'invalid_balance_amount'
            ? text('invalidBalance')
            : text('balanceUpdateFailed');
    } finally {
        saveButton.disabled = false;
    }
});
document.getElementById('adminLogout').addEventListener('click', async () => {
    try {
        await api('/api/auth/logout', { method: 'POST' });
        window.location.assign('/');
    } catch (error) {
        console.error('Could not close administrator session.', error);
        status.textContent = text('sessionFailed');
    }
});
document.getElementById('previousPage').addEventListener('click', () => {
    if (page > 1) {
        page -= 1;
        void loadUsers();
    }
});
document.getElementById('nextPage').addEventListener('click', () => {
    if (page * 25 < total) {
        page += 1;
        void loadUsers();
    }
});

void initialize();
window.setInterval(() => {
    if (authorized) {
        void loadTreasury();
        void loadPaperFeePool();
        void loadTransferRequests();
        void loadTaskSubmissions();
    }
}, 30000);
