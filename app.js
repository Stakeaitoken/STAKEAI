let assistantRuntimeMode = 'checking';

const translations = {
    en: {
        title: 'STAKEAI — AI strategy lab',
        description: 'Explore strategy bots and risk-aware concepts in a transparent way.',
        navPackages: 'AI Bots',
        navTasks: 'Task Center',
        navReferrals: 'Referrals',
        navRoadmap: 'Roadmap',
        navCalculator: 'Calculator',
        navStakePackages: 'Packages',
        avatarChoose: 'Choose photo',
        avatarRemove: 'Remove',
        avatarSaved: 'Profile photo updated.',
        avatarRemoved: 'Profile photo removed.',
        avatarError: 'Could not use this image.',
        roadmapBadge: 'Proposed roadmap',
        roadmapTitle: 'STAKEAI Roadmap',
        roadmapDescription: 'Proposed milestones for 2027. The sequence may change as the project develops.',
        roadmapQ1Title: 'Foundation & token design',
        roadmapQ1Description: 'Draft the whitepaper, confirm tokenomics, choose a blockchain, and review legal requirements.',
        roadmapQ2Title: 'Contracts & testnet',
        roadmapQ2Description: 'Develop token contracts, deploy a testnet prototype, and prepare an independent security review.',
        roadmapQ3Title: 'Platform & closed beta',
        roadmapQ3Description: 'Build account services, the dashboard, and transparent fee-based referral tracking; run a closed beta.',
        roadmapQ4Title: 'Audit & launch readiness',
        roadmapQ4Description: 'Complete security and compliance reviews, then consider a phased launch only when requirements are met.',
        roadmapDisclaimer: 'Internal transfer requests are processed after administrator approval. Balances and approved changes are recorded in the platform. Never share your account password.',
        referralBadge: 'Planned program',
        referralsTitle: 'STAKEAI Referral Program',
        referralsDescription: 'A proposed three-level referral structure. Rates are illustrative and subject to review.',
        referralLevel1: 'Level 1 · Direct referral',
        referralLevel2: 'Level 2',
        referralLevel3: 'Level 3',
        referralFeeBase: 'of eligible platform service fees',
        referralDisclaimer: 'Referral commissions are not active. If introduced, they would be paid only from fees actually collected by the platform, never from user deposits. Rates are proposals, not guaranteed income.',
        login: 'Log in',
        signup: 'Sign up',
        close: 'Close',
        authDemoNotice: 'Demo only: account access is not active. Do not enter a real password.',
        email: 'Email',
        firstName: 'First name',
        lastName: 'Last name',
        trc20Address: 'USDT TRC-20 address',
        password: 'Password',
        confirmPassword: 'Confirm password',
        profileSettings: 'Profile and security',
        currentEmail: 'Current email',
        profileDetails: 'Personal details',
        saveProfile: 'Save profile',
        changeEmail: 'Change email address',
        newEmail: 'New email address',
        currentPassword: 'Current password',
        sendEmailVerification: 'Send verification email',
        changePassword: 'Change password',
        newPassword: 'New password (12 characters minimum)',
        updatePassword: 'Update password',
        twoFactorTitle: 'Two-factor authentication',
        enableTwoFactor: 'Enable authenticator app',
        startTwoFactorSetup: 'Continue setup',
        twoFactorSetupInstructions: 'Add this key in your authenticator app, then enter its current code.',
        confirmEnableTwoFactor: 'Confirm and enable',
        recoveryCodesNotice: 'Save these one-time recovery codes somewhere safe. They are shown only once.',
        disableTwoFactor: 'Disable 2FA',
        authTwoFactorCode: 'Authenticator or recovery code',
        loginTwoFactorPrompt: 'Enter your authenticator code or an unused recovery code.',
        verifyTwoFactor: 'Verify code',
        profileSaved: 'Profile updated.',
        emailVerificationSent: 'Verification link sent to the new email address. Your current email remains active until confirmed.',
        passwordChanged: 'Password updated. Other sessions have been signed out.',
        twoFactorEnabled: 'Authenticator 2FA is enabled.',
        twoFactorDisabled: 'Two-factor authentication is disabled.',
        twoFactorNotEnabled: 'Authenticator app is not enabled.',
        invalidTwoFactorCode: 'The authenticator/recovery code is invalid or already used.',
        invalidCurrentPassword: 'Current password is incorrect.',
        emailAlreadyUsed: 'That email address is already in use.',
        emailServiceUnavailable: 'Email verification is not configured. Your email address was not changed.',
        accountUpdateFailed: 'Could not update account settings. Please try again.',
        invalidProfileName: 'Enter a valid first and last name.',
        setupTwoFactorFirst: 'Start authenticator setup first.',
        passwordMismatch: 'Passwords do not match.',
        nameRequired: 'Enter a valid first and last name.',
        trc20AddressInvalid: 'Enter a valid TRON TRC-20 address.',
        trc20WalletLabel: 'USDT TRC-20 wallet address',
        trc20AddressMissing: 'No TRC-20 address registered',
        authUnavailable: 'Account access is not set up yet. Your details were not sent or saved.',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        welcome: 'STAKEAI · Smart AI, stronger earning potential',
        heroTitle: 'Put intelligence to work',
        heroAccent: 'Meet your AI strategy studio',
        heroDescription: 'Explore strategy bots, understand their signals, and experiment in a transparent environment.',
        ctaPackages: 'Explore AI Bots',
        ctaTasks: 'Explore the community',
        heroPillTransparent: 'Transparent strategy previews',
        heroPillSimulation: 'Simulation only · no exchange connection',
        botsBadge: 'AI strategy lab',
        botsTitle: 'Meet your STAKEAI assistants',
        botsDescription: 'Ask the STAKEAI assistants for coding help, everyday conversation, or clear explanations of crypto strategies.',
        botCodeTitle: 'STAKEAI Coding Assistant',
        botChatTitle: 'STAKEAI Chat Assistant',
        botStrategyTitle: 'STAKEAI Crypto Guide',
        botAssistantLabel: 'AI assistant',
        botBrandBadge: 'STAKEAI',
        botCodeDescription: 'Get help writing code, debugging errors, and understanding code step by step.',
        botChatDescription: 'Ask questions, explore ideas, and get clear explanations of everyday topics.',
        botStrategyDescription: 'Learn about crypto, risk management, and market concepts. It does not give investment advice.',
        botExampleLabel: 'Try asking',
        botCodeExample: '"Can you find the bug in this JavaScript function?"',
        botChatExample: '"How were the STAKEAI assistants created?"',
        botStrategyExample: '"How does DCA work, and what are its risks?"',
        botStartChat: 'Start a chat',
        assistantBrand: 'STAKEAI assistant',
        assistantHistoryNotice: 'Chat history stays temporarily in this page and is not saved by STAKEAI.',
        assistantInputLabel: 'Your message',
        assistantInputPlaceholder: 'Type your message...',
        assistantSend: 'Send',
        assistantWelcome: 'Hello! I am a STAKEAI assistant, powered by OpenAI. How can I help?',
        assistantWelcomeDemo: 'Hello! I am a STAKEAI assistant. I answer common questions from the local STAKEAI knowledge library. What would you like to know?',
        assistantWelcomeOllama: 'Hello! I am your STAKEAI assistant. How can I help?',
        assistantWelcomeUnavailable: 'Hello! I am a STAKEAI assistant. AI replies are not configured on this server yet.',
        assistantThinking: 'Thinking…',
        assistantUnavailable: 'The assistant is temporarily unavailable. Please try again shortly.',
        assistantNotConfigured: 'The AI assistant is not configured yet. Please try again later.',
        assistantRateLimited: 'OpenAI rejected the request (HTTP 429). Check API billing, available credit, and project spending limits. If those are okay, wait briefly before retrying.',
        assistantQuotaExceeded: 'The OpenAI API usage limit or available credit has been reached. Check API billing and project limits in your OpenAI account.',
        assistantEmptyReply: 'The assistant returned an empty reply. Please try again.',
        assistantYou: 'You',
        assistantAi: 'STAKEAI',
        assistantConnectionError: 'Could not connect to the assistant. Check your connection and try again.',
        assistantIdentity: 'I was created for the STAKEAI project. I am an AI assistant powered by OpenAI.',
        assistantClear: 'New chat',
        assistantContextNotice: 'Chat messages are kept temporarily in this page and are not saved by STAKEAI.',
        assistantInputTooLong: 'Please keep your message under 4,000 characters.',
        assistantSafety: 'AI responses may be incorrect. Verify important information independently.',
        assistantInvestmentNotice: 'This assistant provides general information, not financial advice or a recommendation to trade.',
        botModeChecking: 'CHECKING…',
        botTrendTitle: 'Trend Scout',
        botRangeTitle: 'Range Observer',
        botDcaTitle: 'DCA Planner',
        botStrategyLabel: 'Strategy concept',
        botPreviewStatus: 'Preview',
        botTrendDescription: 'Studies hypothetical momentum and highlights possible trend changes.',
        botRangeDescription: 'Explains how a range-based strategy could identify hypothetical price boundaries.',
        botDcaDescription: 'Visualizes a paced-entry plan with user-defined intervals and limits.',
        botChartCaption: 'Illustrative signal · not market data',
        botRiskLabel: 'Illustrative risk profile',
        botRiskHigh: 'Elevated',
        botRiskMedium: 'Variable',
        botRiskConfigurable: 'User-defined',
        botTryButton: 'Try demo state',
        botStopButton: 'Stop demo state',
        botStateIdle: 'Bot is inactive.',
        botStateActive: 'Local demo state active · no orders are placed.',
        previewLabel: 'Preview mode:',
        previewNotice: 'This is a product preview only. Bot cards do not use live data or connect to exchanges; no orders, investment service, or returns are provided.',
        packagesTitle: 'STAKEAI Packages',
        packagesDescription: 'Stake STAKEAI directly from your wallet on BNB Smart Chain testnet.',
        bronzeTerm: '7-Day Stake',
        silverTerm: '30-Day Stake',
        goldTerm: '180-Day Stake',
        bronzePercent: '5%',
        silverPercent: '25%',
        goldPercent: '200%',
        bronzePeriod: 'total over 7 days',
        silverPeriod: 'total over 30 days',
        goldPeriod: 'total over 180 days',
        minimum100: 'Min: 300 USDT',
        minimum500: 'Min: 1,000 USDT',
        minimum2500: 'Min: 5,000 USDT',
        minimum10000: 'Min: 10,000 USDT',
        earlyExit10: 'Early exit penalty: 10%',
        taskBonus12: '1.2x Task Bonus',
        taskBonus15: '1.5x Task Bonus',
        taskBonus20: '2.0x Task Bonus',
        selectPackage: 'Select Package',
        mostPopular: 'Most Popular',
        tasksTitle: 'Task Center',
        tasksDescription: 'Complete social media tasks and earn 10 USDT for each task approved by an administrator.',
        watchAd: 'Watch a Sponsored Ad',
        watchAdDescription: 'Watch a 30-second video advertisement to the end.',
        bonus025: 'Example bonus +0.25%',
        viewTask: 'View Task',
        socialEngagement: 'X (Twitter) Engagement',
        socialDescription: 'Like and repost the latest announcement.',
        bonus020: 'Example bonus +0.20%',
        dailyBonus: 'Daily Check-in Bonus',
        dailyBonusDescription: 'Visit the site every day to keep your streak going.',
        bonus010: 'Example bonus +0.10%',
        demoCheckin: 'Demo Check-in',
        taskNotice: 'Tasks and bonuses are in preview mode and are not active yet.',
        calculatorTitle: 'Illustrative Term Calculator',
        calculatorDescription: 'Illustrative calculations only. Testnet offers are shown above; no mainnet staking is enabled.',
        balanceManagementNotice: 'USDT/STKAI are platform-recorded balances; BTC/ETH/BNB are spot balances, not blockchain assets.',
        accountAssetBalances: 'Asset balances',
        accountEstimatedValue: 'Estimated value',
        usdtBalanceLabel: 'USDT balance',
        stakeaiBalanceLabel: 'STKAI balance',
        investmentAmount: 'Investment Amount (USDT)',
        packageChoice: 'Package',
        bronzeRate: '7 days (5%)',
        silverRate: '30 days (25%)',
        goldRate: '180 days (200%)',
        termEstimate: 'Example profit over selected term',
        totalAfterTerm: 'Example total including principal',
        tokenValueNotice: 'The market simulator shows STKAI at a fixed 1 USDT app reference price. This is not an exchange quote, backing, or redemption guarantee.',
        packageProposalNotice: 'These packages lock STAKEAI on BNB Smart Chain testnet until maturity. Principal can then be withdrawn by the staker; admins send rewards manually.',
        simplePrincipalOnly: 'Simple example on original principal',
        noCompound: 'No compounding or live payout',
        stakingDialogTitle: 'STAKEAI testnet staking',
        stakingDisclaimer: 'BSC testnet only. Principal remains locked until maturity and can then be withdrawn by the staker. Rewards are sent manually by an admin.',
        stakingNotConfigured: 'Testnet contract addresses have not been configured yet.',
        stakingConnectPrompt: 'Connect your wallet to stake.',
        stakingConnect: 'Connect wallet',
        stakingAmountLabel: 'STKAI amount to stake',
        stakingSubmit: 'Stake',
        stakingPositionsTitle: 'My wallet positions',
        stakingRefresh: 'Refresh',
        stakingNoPositions: 'No staking positions yet.',
        stakingPrincipal: 'Principal',
        stakingReward: 'Reward',
        stakingUnlocks: 'Unlocks',
        stakingWithdraw: 'Withdraw',
        stakingLocked: 'Locked until',
        stakingConnected: 'Connected',
        stakingInsufficientBalance: 'Your wallet does not have enough STKAI for this stake.',
        stakingWalletUnavailable: 'No browser wallet was found. Install a wallet such as MetaMask.',
        stakingWrongNetwork: 'Switch your wallet to BNB Smart Chain testnet (chain 97) and try again.',
        stakingInvalidAmount: 'Enter a valid positive amount with up to 18 decimal places.',
        stakingAmountTooSmall: 'Increase the amount so it produces a non-zero reward.',
        stakingConfirmApproval: 'Confirm the token approval in your wallet.',
        stakingConfirmTransaction: 'Confirm the staking transaction in your wallet.',
        stakingTransactionDone: 'Transaction confirmed.',
        stakingOperationFailed: 'The staking transaction failed. Check your wallet and try again.',
        stakingPreview: 'Expected reward',
        stakingLock7: '7-day lock period',
        stakingLock30: '30-day lock period',
        stakingLock180: '180-day lock period',
        stakingPoolOnly: 'Reward is paid manually by an administrator after maturity.',
        days: 'days',
        paymentTitle: 'Manual payment instructions',
        paymentNotice: 'Rates are proposals, not guaranteed returns. Payments are not automatically verified; this does not activate staking or a package.',
        paymentNetworkLabel: 'Choose payment network / asset',
        paymentBsc: 'BNB Smart Chain · BEP-20 (BNB — confirm exact asset)',
        paymentBitcoin: 'Bitcoin · BTC',
        paymentEthereum: 'Ethereum · ERC-20 token (asset not specified)',
        paymentTron: 'TRON · USDT TRC-20',
        paymentBscAssetName: 'BNB Smart Chain · BEP-20',
        paymentBitcoinAssetName: 'Bitcoin · BTC',
        paymentEthereumAssetName: 'Ethereum · ERC-20 token',
        paymentTronAssetName: 'TRON · USDT TRC-20',
        copyAddress: 'Copy address',
        minimumPackageAmount: 'Package minimum (USDT reference):',
        paymentAmountWarning: 'No exchange conversion or on-chain payment verification is available. Confirm the exact coin, network and amount with the project administrator before sending. Transfers to the wrong network may be unrecoverable.',
        paymentAssetWarning: 'Verify the network and asset before sending. Transfers cannot be reversed.',
        paymentEthereumAssetWarning: 'The accepted ERC-20 token was not specified. Do not send until the project administrator confirms the exact token.',
        paymentCopied: 'Address copied.',
        paymentCopyFailed: 'Could not copy the address. Select and copy it manually.',
        closePayment: 'Close',
        totalSupplyLabel: 'Planned Total Supply',
        copyright: '© 2026 STAKEAI. All rights reserved.',
        language: 'Language'
    },
    tr: {
        title: 'STAKEAI — Yapay zeka strateji laboratuvarı',
        description: 'Strateji botlarını ve risk odaklı fikirleri şeffaf biçimde keşfedin.',
        navPackages: 'Yapay Zeka Botları',
        navTasks: 'Görev Merkezi',
        navReferrals: 'Referanslar',
        navRoadmap: 'Yol Haritası',
        navCalculator: 'Hesaplayıcı',
        navStakePackages: 'Paketler',
        avatarChoose: 'Fotoğraf seç',
        avatarRemove: 'Kaldır',
        avatarSaved: 'Profil fotoğrafı güncellendi.',
        avatarRemoved: 'Profil fotoğrafı kaldırıldı.',
        avatarError: 'Bu görsel kullanılamadı.',
        roadmapBadge: 'Önerilen yol haritası',
        roadmapTitle: 'STAKEAI yol haritası',
        roadmapDescription: '2027 için planlanan hedefler. Proje geliştikçe sıralama değişebilir.',
        roadmapQ1Title: 'Temel ve token tasarımı',
        roadmapQ1Description: 'Whitepaper taslağı, token ekonomisi, blockchain seçimi ve yasal gerekliliklerin incelenmesi.',
        roadmapQ2Title: 'Kontratlar ve testnet',
        roadmapQ2Description: 'Token kontratlarının geliştirilmesi, testnet prototipi ve bağımsız güvenlik incelemesinin hazırlanması.',
        roadmapQ3Title: 'Platform ve kapalı beta',
        roadmapQ3Description: 'Hesap altyapısı, panel ve şeffaf hizmet ücreti bazlı referans takibinin geliştirilmesi; kapalı beta.',
        roadmapQ4Title: 'Denetim ve lansman hazırlığı',
        roadmapQ4Description: 'Güvenlik ve mevzuat incelemeleri; koşullar sağlanırsa aşamalı lansmanın değerlendirilmesi.',
        roadmapDisclaimer: 'Platform içi transfer talepleri yönetici onayından sonra işlenir. Bakiyeler ve onaylanan değişiklikler sistem kayıtlarında tutulur. Hesap parolanızı kimseyle paylaşmayın.',
        referralBadge: 'Planlanan program',
        referralsTitle: 'STAKEAI referans programı',
        referralsDescription: 'Önerilen üç seviyeli referans yapısı. Oranlar örnektir ve incelemeye tabidir.',
        referralLevel1: '1. seviye · Doğrudan referans',
        referralLevel2: '2. seviye',
        referralLevel3: '3. seviye',
        referralFeeBase: 'uygun platform hizmet ücretleri üzerinden',
        referralDisclaimer: 'Referans komisyonları etkin değildir. Başlatılırsa yalnızca platformun gerçekten tahsil ettiği hizmet ücretlerinden ödenir; kullanıcı yatırımlarından kesilmez. Oranlar öneridir, garanti gelir değildir.',
        login: 'Giriş Yap',
        signup: 'Kaydol',
        close: 'Kapat',
        authDemoNotice: 'Yalnızca demo: hesap erişimi etkin değil. Gerçek parolanızı girmeyin.',
        email: 'E-posta',
        firstName: 'Ad',
        lastName: 'Soyad',
        trc20Address: 'USDT TRC-20 adresi',
        password: 'Parola',
        confirmPassword: 'Parolayı doğrula',
        profileSettings: 'Profil ve güvenlik',
        currentEmail: 'Mevcut e-posta',
        profileDetails: 'Kişisel bilgiler',
        saveProfile: 'Profili kaydet',
        changeEmail: 'E-posta adresini değiştir',
        newEmail: 'Yeni e-posta adresi',
        currentPassword: 'Mevcut parola',
        sendEmailVerification: 'Doğrulama e-postası gönder',
        changePassword: 'Parolayı değiştir',
        newPassword: 'Yeni parola (en az 12 karakter)',
        updatePassword: 'Parolayı güncelle',
        twoFactorTitle: 'İki faktörlü kimlik doğrulama',
        enableTwoFactor: 'Doğrulayıcı uygulamayı etkinleştir',
        startTwoFactorSetup: 'Kuruluma devam et',
        twoFactorSetupInstructions: 'Bu anahtarı doğrulayıcı uygulamanıza ekleyin ve güncel kodu girin.',
        confirmEnableTwoFactor: 'Onayla ve etkinleştir',
        recoveryCodesNotice: 'Tek kullanımlık kurtarma kodlarını güvenli bir yere kaydedin. Yalnızca bir kez gösterilir.',
        disableTwoFactor: '2FA’yı kapat',
        authTwoFactorCode: 'Doğrulayıcı veya kurtarma kodu',
        loginTwoFactorPrompt: 'Doğrulayıcı kodunuzu veya kullanılmamış kurtarma kodunuzu girin.',
        verifyTwoFactor: 'Kodu doğrula',
        profileSaved: 'Profil güncellendi.',
        emailVerificationSent: 'Yeni e-posta adresinize doğrulama bağlantısı gönderildi. Onaylanana kadar mevcut adresiniz geçerlidir.',
        passwordChanged: 'Parola güncellendi. Diğer oturumlar kapatıldı.',
        twoFactorEnabled: 'Doğrulayıcı uygulamayla 2FA etkin.',
        twoFactorDisabled: 'İki faktörlü kimlik doğrulama kapatıldı.',
        twoFactorNotEnabled: 'Doğrulayıcı uygulama etkin değil.',
        invalidTwoFactorCode: 'Doğrulayıcı/kurtarma kodu geçersiz veya daha önce kullanılmış.',
        invalidCurrentPassword: 'Mevcut parola yanlış.',
        emailAlreadyUsed: 'Bu e-posta adresi başka bir hesapta kullanılıyor.',
        emailServiceUnavailable: 'E-posta doğrulaması yapılandırılmamış. E-posta adresiniz değiştirilmedi.',
        accountUpdateFailed: 'Hesap ayarları güncellenemedi. Lütfen tekrar deneyin.',
        invalidProfileName: 'Geçerli bir ad ve soyad girin.',
        setupTwoFactorFirst: 'Önce doğrulayıcı uygulama kurulumunu başlatın.',
        passwordMismatch: 'Parolalar eşleşmiyor.',
        nameRequired: 'Geçerli ad ve soyad girin.',
        trc20AddressInvalid: 'Geçerli bir TRON TRC-20 adresi girin.',
        trc20WalletLabel: 'USDT TRC-20 cüzdan adresi',
        trc20AddressMissing: 'TRC-20 adresi kayıtlı değil',
        authUnavailable: 'Hesap sistemi henüz hazır değil. Bilgileriniz gönderilmedi veya kaydedilmedi.',
        noAccount: 'Hesabınız yok mu?',
        haveAccount: 'Zaten hesabınız var mı?',
        welcome: 'STAKEAI · Akıllı yapay zeka, güçlü kazanç fırsatı',
        heroTitle: 'Yapay zekayı stratejiye dönüştür',
        heroAccent: 'AI bot stüdyosuyla tanış',
        heroDescription: 'Strateji botlarını keşfedin, sinyallerini inceleyin ve şeffaf bir ortamda deneyin.',
        ctaPackages: 'AI Botlarını Keşfet',
        ctaTasks: 'Topluluğu Keşfet',
        heroPillTransparent: 'Şeffaf strateji önizlemeleri',
        heroPillSimulation: 'Yalnızca simülasyon · borsa bağlantısı yok',
        botsBadge: 'Yapay zeka strateji laboratuvarı',
        botsTitle: 'STAKEAI asistanlarıyla tanışın',
        botsDescription: 'Kodlama desteği, günlük sohbet veya kripto stratejilerinin anlaşılır açıklamaları için STAKEAI asistanlarına sorun.',
        botCodeTitle: 'STAKEAI Kod Asistanı',
        botChatTitle: 'STAKEAI Sohbet Asistanı',
        botStrategyTitle: 'STAKEAI Kripto Rehberi',
        botAssistantLabel: 'Yapay zekâ asistanı',
        botBrandBadge: 'STAKEAI',
        botCodeDescription: 'Kod yazma, hataları ayıklama ve kodu adım adım anlama konusunda yardım alın.',
        botChatDescription: 'Sorular sorun, fikirleri keşfedin ve günlük konularda anlaşılır yanıtlar alın.',
        botStrategyDescription: 'Kripto, risk yönetimi ve piyasa kavramlarını öğrenin. Yatırım tavsiyesi vermez.',
        botExampleLabel: 'Örnek soru',
        botCodeExample: '“Bu JavaScript fonksiyonundaki hatayı bulur musun?”',
        botChatExample: '“STAKEAI asistanları nasıl oluşturuldu?”',
        botStrategyExample: '“DCA nasıl çalışır, riskleri nelerdir?”',
        botStartChat: 'Sohbete başla',
        assistantBrand: 'STAKEAI asistanı',
        assistantHistoryNotice: 'Sohbet geçmişi geçici olarak bu sayfada tutulur ve STAKEAI tarafından kaydedilmez.',
        assistantInputLabel: 'Mesajınız',
        assistantInputPlaceholder: 'Mesajınızı yazın...',
        assistantSend: 'Gönder',
        assistantWelcome: 'Merhaba! OpenAI tarafından desteklenen bir STAKEAI asistanıyım. Size nasıl yardımcı olabilirim?',
        assistantWelcomeDemo: 'Merhaba! Ben STAKEAI asistanıyım. Sık sorulan soruları yerel STAKEAI bilgi kütüphanesinden yanıtlıyorum. Ne öğrenmek istersiniz?',
        assistantWelcomeOllama: 'Merhaba! Ben STAKEAI asistanınızım. Size nasıl yardımcı olabilirim?',
        assistantWelcomeUnavailable: 'Merhaba! Ben STAKEAI asistanıyım. Bu sunucuda yapay zekâ yanıtları henüz yapılandırılmamış.',
        assistantThinking: 'Yanıt hazırlanıyor…',
        assistantUnavailable: 'Asistan şu anda kullanılamıyor. Lütfen biraz sonra tekrar deneyin.',
        assistantNotConfigured: 'Yapay zekâ asistanı henüz yapılandırılmadı. Lütfen daha sonra tekrar deneyin.',
        assistantRateLimited: 'OpenAI isteği 429 hatasıyla reddetti. API faturalandırmasını, kullanılabilir krediyi ve proje harcama limitini kontrol edin. Sorun yoksa biraz bekleyip yeniden deneyin.',
        assistantQuotaExceeded: 'OpenAI API kullanım kotası veya kullanılabilir kredisi dolmuş. OpenAI hesabındaki faturalandırma ve proje limitlerini kontrol edin.',
        assistantEmptyReply: 'Asistan boş bir yanıt verdi. Lütfen tekrar deneyin.',
        assistantYou: 'Siz',
        assistantAi: 'STAKEAI',
        assistantConnectionError: 'Asistana bağlanılamadı. Bağlantınızı kontrol edip tekrar deneyin.',
        assistantIdentity: 'STAKEAI projesi için oluşturuldum. OpenAI tarafından desteklenen bir yapay zekâ asistanıyım.',
        assistantClear: 'Yeni sohbet',
        assistantContextNotice: 'Sohbet mesajları geçici olarak bu sayfada tutulur; STAKEAI tarafından kaydedilmez.',
        assistantInputTooLong: 'Lütfen mesajınızı 4.000 karakterden kısa tutun.',
        assistantSafety: 'Yapay zekâ yanıtları hatalı olabilir. Önemli bilgileri bağımsız olarak doğrulayın.',
        assistantInvestmentNotice: 'Bu asistan genel bilgi sunar; finansal tavsiye veya işlem önerisi vermez.',
        botModeChecking: 'KONTROL EDİLİYOR…',
        botTrendTitle: 'Trend Kaşifi',
        botRangeTitle: 'Aralık Gözlemcisi',
        botDcaTitle: 'DCA Planlayıcısı',
        botStrategyLabel: 'Strateji konsepti',
        botPreviewStatus: 'Önizleme',
        botTrendDescription: 'Varsayımsal momentumu inceler ve olası trend değişimlerini gösterir.',
        botRangeDescription: 'Aralık tabanlı bir stratejinin varsayımsal fiyat sınırlarını nasıl belirleyebileceğini açıklar.',
        botDcaDescription: 'Kullanıcının belirlediği aralık ve limitlerle kademeli giriş planını görselleştirir.',
        botChartCaption: 'Örnek sinyal · piyasa verisi değildir',
        botRiskLabel: 'Örnek risk profili',
        botRiskHigh: 'Yüksek',
        botRiskMedium: 'Değişken',
        botRiskConfigurable: 'Kullanıcı belirler',
        botTryButton: 'Demo durumunu dene',
        botStopButton: 'Demo durumunu durdur',
        botStateIdle: 'Bot etkin değil.',
        botStateActive: 'Yerel demo durumu etkin · emir verilmez.',
        previewLabel: 'Önizleme modu:',
        previewNotice: 'Bu yalnızca ürün önizlemesidir. Bot kartları canlı veri kullanmaz ve borsalara bağlanmaz; emir, yatırım hizmeti veya getiri sunulmaz.',
        packagesTitle: 'STAKEAI paketleri',
        packagesDescription: 'BNB Smart Chain testnet üzerinde cüzdanınızdan doğrudan STAKEAI stake edin.',
        bronzeTerm: '7 Günlük Stake',
        silverTerm: '30 Günlük Stake',
        goldTerm: '180 Günlük Stake',
        bronzePercent: '%5',
        silverPercent: '%25',
        goldPercent: '%200',
        bronzePeriod: '7 gün toplamı',
        silverPeriod: '30 gün toplamı',
        goldPeriod: '180 gün toplamı',
        minimum100: 'En az: 300 USDT',
        minimum500: 'En az: 1.000 USDT',
        minimum2500: 'En az: 5.000 USDT',
        minimum10000: 'Minimum: 10.000 USDT',
        earlyExit10: 'Erken çıkış cezası: %10',
        taskBonus12: '1,2x Görev Bonusu',
        taskBonus15: '1,5x Görev Bonusu',
        taskBonus20: '2,0x Görev Bonusu',
        selectPackage: 'Paketi Seç',
        mostPopular: 'En Popüler',
        tasksTitle: 'Görev merkezi',
        tasksDescription: 'Sosyal medya görevlerini tamamlayın; yönetici onayından geçen her görev için 10 USDT kazanın.',
        watchAd: 'Sponsorlu reklam izle',
        watchAdDescription: '30 saniyelik video reklamı sonuna kadar izleyin.',
        bonus025: 'Örnek bonus +%0.25',
        viewTask: 'Görevi Gör',
        socialEngagement: 'X (Twitter) etkileşimi',
        socialDescription: 'Son duyuru gönderisini beğenin ve yeniden paylaşın.',
        bonus020: 'Örnek bonus +%0.20',
        dailyBonus: 'Günlük giriş bonusu',
        dailyBonusDescription: 'Serinizi korumak için her gün siteyi ziyaret edin.',
        bonus010: 'Örnek bonus +%0.10',
        demoCheckin: 'Demo check-in',
        taskNotice: 'Görev ve bonus sistemi önizleme modunda; henüz etkin değil.',
        calculatorTitle: 'Örnek dönem hesaplayıcısı',
        calculatorDescription: 'Yalnızca örnek hesaplamadır. Testnet paketleri yukarıda gösterilir; ana ağ stake işlemi etkin değildir.',
        balanceManagementNotice: 'USDT/STKAI platformda kaydedilir; BTC/ETH/BNB spot bakiyeleridir, blokzincir varlığı değildir.',
        accountAssetBalances: 'Varlık bakiyeleri',
        accountEstimatedValue: 'Tahmini değer',
        usdtBalanceLabel: 'USDT bakiyesi',
        stakeaiBalanceLabel: 'STKAI bakiyesi',
        investmentAmount: 'Yatırım miktarı (USDT)',
        packageChoice: 'Paket seçimi',
        bronzeRate: '7 gün (%5)',
        silverRate: '30 gün (%25)',
        goldRate: '180 gün (%200)',
        termEstimate: 'Seçilen dönemde örnek kâr',
        totalAfterTerm: 'Ana para dahil örnek toplam',
        tokenValueNotice: 'Piyasa simülatöründe STKAI sabit 1 USDT uygulama referans fiyatıyla gösterilir. Bu, borsa fiyatı, teminat veya geri alım garantisi değildir.',
        packageProposalNotice: 'Bu paketlerde STAKEAI, BNB Smart Chain testnet üzerinde vade sonuna kadar kilitlenir. Vade sonunda kullanıcı ana parasını çeker; ödül admin tarafından manuel gönderilir.',
        simplePrincipalOnly: 'Yalnızca ana para üzerinden basit örnek',
        noCompound: 'Bileşik getiri veya canlı ödeme yok',
        stakingDialogTitle: 'STAKEAI testnet stake',
        stakingDisclaimer: 'Yalnızca BSC testnet. Ana para vade sonuna kadar kilitli kalır; vade sonunda kullanıcı çekebilir. Ödüller admin tarafından manuel gönderilir.',
        stakingNotConfigured: 'Testnet kontrat adresleri henüz yapılandırılmadı.',
        stakingConnectPrompt: 'Stake etmek için cüzdanınızı bağlayın.',
        stakingConnect: 'Cüzdanı bağla',
        stakingAmountLabel: 'Stake edilecek STKAI miktarı',
        stakingSubmit: 'Stake et',
        stakingPositionsTitle: 'Cüzdanımdaki stake pozisyonları',
        stakingRefresh: 'Yenile',
        stakingNoPositions: 'Henüz stake pozisyonu yok.',
        stakingPrincipal: 'Ana para',
        stakingReward: 'Ödül',
        stakingUnlocks: 'Açılma zamanı',
        stakingWithdraw: 'Çek',
        stakingLocked: 'Şu tarihe kadar kilitli',
        stakingConnected: 'Bağlandı',
        stakingInsufficientBalance: 'Cüzdanınızda bu stake için yeterli STKAI yok.',
        stakingWalletUnavailable: 'Tarayıcı cüzdanı bulunamadı. MetaMask gibi bir cüzdan yükleyin.',
        stakingWrongNetwork: 'Cüzdanınızı BNB Smart Chain testnet ağına (chain 97) geçirip yeniden deneyin.',
        stakingInvalidAmount: '18 ondalık basamağa kadar geçerli ve sıfırdan büyük bir tutar girin.',
        stakingAmountTooSmall: 'Sıfırdan büyük ödül oluşması için miktarı artırın.',
        stakingConfirmApproval: 'Cüzdanınızda token onayını doğrulayın.',
        stakingConfirmTransaction: 'Cüzdanınızda stake işlemini doğrulayın.',
        stakingTransactionDone: 'İşlem onaylandı.',
        stakingOperationFailed: 'Stake işlemi başarısız oldu. Cüzdanınızı kontrol edip yeniden deneyin.',
        stakingPreview: 'Beklenen ödül',
        stakingLock7: '7 gün kilit süresi',
        stakingLock30: '30 gün kilit süresi',
        stakingLock180: '180 gün kilit süresi',
        stakingPoolOnly: 'Ödül vade sonunda yönetici tarafından manuel ödenir.',
        days: 'gün',
        paymentTitle: 'Manuel ödeme bilgileri',
        paymentNotice: 'Oranlar öneridir, garanti getiri değildir. Ödemeler otomatik doğrulanmaz; ödeme paketi etkinleştirmez veya stake başlatmaz.',
        paymentNetworkLabel: 'Ödeme ağını / varlığını seçin',
        paymentBsc: 'BNB Smart Chain · BEP-20 (BNB — varlığı teyit edin)',
        paymentBitcoin: 'Bitcoin · BTC',
        paymentEthereum: 'Ethereum · ERC-20 token (varlık belirtilmemiş)',
        paymentTron: 'TRON · USDT TRC-20',
        paymentBscAssetName: 'BNB Smart Chain · BEP-20',
        paymentBitcoinAssetName: 'Bitcoin · BTC',
        paymentEthereumAssetName: 'Ethereum · ERC-20 token',
        paymentTronAssetName: 'TRON · USDT TRC-20',
        copyAddress: 'Adresi kopyala',
        minimumPackageAmount: 'Paket alt limiti (USDT referansı):',
        paymentAmountWarning: 'Kur dönüşümü veya zincir üstü ödeme doğrulaması yoktur. Göndermeden önce coin, ağ ve tutarı proje yöneticisiyle teyit edin. Yanlış ağa gönderilen varlıklar kurtarılamayabilir.',
        paymentAssetWarning: 'Göndermeden önce ağı ve varlığı doğrulayın. Transferler geri alınamaz.',
        paymentEthereumAssetWarning: 'Kabul edilen ERC-20 token belirtilmedi. Yönetici tokeni teyit edene kadar göndermeyin.',
        paymentCopied: 'Adres kopyalandı.',
        paymentCopyFailed: 'Adres kopyalanamadı. Seçip elle kopyalayın.',
        closePayment: 'Kapat',
        totalSupplyLabel: 'Planlanan toplam arz',
        copyright: '© 2026 STAKEAI. Tüm hakları saklıdır.',
        language: 'Dil'
        },
        es: {
            title: 'STAKEAI — Invierte de forma inteligente. Crezcamos juntos.',
            description: 'Explora el ecosistema del token STAKEAI, los paquetes de staking de demostración y los rendimientos estimados.',
            navPackages: 'Paquetes',
            navTasks: 'Centro de tareas',
            navReferrals: 'Referidos',
            navRoadmap: 'Hoja de ruta',
            navCalculator: 'Calculadora',
            roadmapBadge: 'Hoja de ruta propuesta',
            roadmapTitle: 'Hoja de ruta de STAKEAI',
            roadmapDescription: 'Hitos propuestos para 2027. El orden puede cambiar a medida que avance el proyecto.',
            roadmapQ1Title: 'Fundamentos y diseño del token',
            roadmapQ1Description: 'Redactar el documento técnico, confirmar la tokenómica, elegir una blockchain y revisar los requisitos legales.',
            roadmapQ2Title: 'Contratos y testnet',
            roadmapQ2Description: 'Desarrollar los contratos del token, desplegar un prototipo en testnet y preparar una revisión de seguridad independiente.',
            roadmapQ3Title: 'Plataforma y beta cerrada',
            roadmapQ3Description: 'Crear cuentas, el panel y el seguimiento transparente de referidos basado en tarifas; realizar una beta cerrada.',
            roadmapQ4Title: 'Auditoría y preparación del lanzamiento',
            roadmapQ4Description: 'Completar revisiones de seguridad y cumplimiento; considerar un lanzamiento gradual solo si se cumplen los requisitos.',
            roadmapDisclaimer: 'Las solicitudes de transferencia interna se procesan tras la aprobación del administrador. Los saldos y cambios aprobados quedan registrados en la plataforma. No compartas tu contraseña.',
            referralBadge: 'Programa previsto',
            referralsTitle: 'Programa de referidos STAKEAI',
            referralsDescription: 'Estructura propuesta de tres niveles. Las tasas son ilustrativas y están sujetas a revisión.',
            referralLevel1: 'Nivel 1 · Referido directo',
            referralLevel2: 'Nivel 2',
            referralLevel3: 'Nivel 3',
            referralFeeBase: 'de las tarifas de servicio válidas de la plataforma',
            referralDisclaimer: 'Las comisiones por referidos no están activas. Si se habilitan, se pagarían solo con tarifas de servicio realmente cobradas por la plataforma, nunca con depósitos de usuarios. Las tasas son propuestas, no ingresos garantizados.',
            login: 'Iniciar sesión',
            signup: 'Registrarse',
            close: 'Cerrar',
            authDemoNotice: 'Solo demostración: el acceso a cuentas no está activo. No introduzcas una contraseña real.',
            email: 'Correo electrónico',
            password: 'Contraseña',
            confirmPassword: 'Confirmar contraseña',
            passwordMismatch: 'Las contraseñas no coinciden.',
            authUnavailable: 'El servicio de cuentas aún no está configurado. Tus datos no se enviaron ni guardaron.',
            noAccount: '¿No tienes una cuenta?',
            haveAccount: '¿Ya tienes una cuenta?',
            welcome: 'Te damos la bienvenida al ecosistema STAKEAI',
            heroTitle: 'Haz staking con STAKEAI',
            heroAccent: 'Descubre una experiencia de staking más inteligente',
            heroDescription: 'Explora tareas relacionadas con tokens, compara paquetes y estima rendimientos. STAKEAI es un concepto de ecosistema de nueva generación que crece junto a su comunidad.',
            ctaPackages: 'Ver paquetes',
            ctaTasks: 'Centro de tareas',
            previewLabel: 'Modo de vista previa:',
            previewNotice: 'Los paquetes de staking no están conectados a un contrato de staking. Las tasas son ejemplos; no se ofrecen ni garantizan staking, distribución de tokens ni rendimientos. Los pagos se gestionan manualmente.',
            packagesTitle: 'Paquetes STAKEAI',
            packagesDescription: 'Haz staking de STAKEAI desde tu wallet en la testnet de BNB Smart Chain.',
            bronzeTerm: 'Staking de 30 días',
            silverTerm: 'Staking de 90 días',
            goldTerm: 'Staking de 180 días',
            diamondTerm: 'Staking de 365 días',
            bronzePercent: '1,0%',
            silverPercent: '1,75%',
            goldPercent: '2,5%',
            diamondPercent: '4,0%',
            perWeek: '/ semana',
            minimum100: 'Mín.: 300 USDT',
            minimum500: 'Mín.: 1.000 USDT',
            minimum2500: 'Mín.: 5.000 USDT',
            minimum10000: 'Mín.: 10.000 USDT',
            earlyExit10: 'Penalización por salida anticipada: 10%',
            taskBonus12: 'Bonificación por tareas de 1,2x',
            taskBonus15: 'Bonificación por tareas de 1,5x',
            taskBonus20: 'Bonificación por tareas de 2,0x',
            selectPackage: 'Elegir paquete',
            mostPopular: 'Más popular',
            tasksTitle: 'Centro de tareas',
            tasksDescription: 'Completa tareas en redes sociales y recibe 10 USDT por cada tarea aprobada por un administrador.',
            watchAd: 'Ver un anuncio patrocinado',
            watchAdDescription: 'Mira hasta el final un anuncio de vídeo de 30 segundos.',
            bonus025: 'Bonificación de ejemplo +0,25%',
            viewTask: 'Ver tarea',
            socialEngagement: 'Interacción en X (Twitter)',
            socialDescription: 'Dale a Me gusta y republica el último anuncio.',
            bonus020: 'Bonificación de ejemplo +0,20%',
            dailyBonus: 'Bonificación diaria de acceso',
            dailyBonusDescription: 'Visita el sitio cada día para mantener tu racha.',
            bonus010: 'Bonificación de ejemplo +0,10%',
            demoCheckin: 'Acceso de demostración',
            taskNotice: 'Las tareas y bonificaciones están en vista previa y aún no están activas.',
            calculatorTitle: 'Calculadora de rendimientos de demostración',
            calculatorDescription: 'Cálculo ilustrativo. Las ofertas de testnet aparecen arriba; el staking en mainnet no está habilitado.',
            investmentAmount: 'Importe de inversión (USDT)',
            packageChoice: 'Paquete',
            bronzeRate: 'Bronze (1,0% semanal)',
            silverRate: 'Silver (1,75% semanal)',
            goldRate: 'Gold (2,5% semanal)',
            diamondRate: 'Diamond VIP (4,0% semanal)',
            weeklyEstimate: 'Rendimiento semanal estimado',
            monthlyEstimate: 'Rendimiento mensual estimado',
            totalSupplyLabel: 'Suministro total previsto',
            copyright: '© 2026 STAKEAI. Todos los derechos reservados.',
            language: 'Idioma'
        },
        fr: {
            title: 'STAKEAI — Investissez intelligemment. Grandissons ensemble.',
            description: 'Découvrez l’écosystème du jeton STAKEAI, les forfaits de staking de démonstration et les rendements estimés.',
            navPackages: 'Forfaits',
            navTasks: 'Centre de tâches',
            navReferrals: 'Parrainage',
            navRoadmap: 'Feuille de route',
            navCalculator: 'Calculatrice',
            roadmapBadge: 'Feuille de route proposée',
            roadmapTitle: 'Feuille de route STAKEAI',
            roadmapDescription: 'Jalons proposés pour 2027. L’ordre peut évoluer avec le projet.',
            roadmapQ1Title: 'Fondations et conception du jeton',
            roadmapQ1Description: 'Rédiger le livre blanc, confirmer la tokenomics, choisir une blockchain et examiner les exigences légales.',
            roadmapQ2Title: 'Contrats et testnet',
            roadmapQ2Description: 'Développer les contrats du jeton, déployer un prototype sur testnet et préparer un audit de sécurité indépendant.',
            roadmapQ3Title: 'Plateforme et bêta fermée',
            roadmapQ3Description: 'Créer les comptes, le tableau de bord et le suivi transparent du parrainage basé sur les frais ; lancer une bêta fermée.',
            roadmapQ4Title: 'Audit et préparation du lancement',
            roadmapQ4Description: 'Achever les examens de sécurité et de conformité, puis envisager un lancement progressif si les conditions sont réunies.',
            roadmapDisclaimer: 'Les demandes de transfert interne sont traitées après approbation de l’administrateur. Les soldes et changements approuvés sont enregistrés sur la plateforme. Ne partagez jamais votre mot de passe.',
            referralBadge: 'Programme prévu',
            referralsTitle: 'Programme de parrainage STAKEAI',
            referralsDescription: 'Structure de parrainage proposée sur trois niveaux. Les taux sont indicatifs et soumis à validation.',
            referralLevel1: 'Niveau 1 · Parrainage direct',
            referralLevel2: 'Niveau 2',
            referralLevel3: 'Niveau 3',
            referralFeeBase: 'des frais de service admissibles de la plateforme',
            referralDisclaimer: 'Les commissions de parrainage ne sont pas actives. Si elles sont mises en place, elles seront versées uniquement à partir des frais réellement perçus par la plateforme, jamais des dépôts des utilisateurs. Ces taux sont proposés et ne garantissent aucun revenu.',
            login: 'Se connecter',
            signup: 'Créer un compte',
            close: 'Fermer',
            authDemoNotice: 'Démo uniquement : l’accès aux comptes est désactivé. Ne saisissez pas de vrai mot de passe.',
            email: 'Adresse e-mail',
            password: 'Mot de passe',
            confirmPassword: 'Confirmer le mot de passe',
            passwordMismatch: 'Les mots de passe ne correspondent pas.',
            authUnavailable: 'Le service de comptes n’est pas encore configuré. Vos informations n’ont été ni envoyées ni enregistrées.',
            noAccount: 'Pas encore de compte ?',
            haveAccount: 'Vous avez déjà un compte ?',
            welcome: 'Bienvenue dans l’écosystème STAKEAI',
            heroTitle: 'Stakez avec STAKEAI',
            heroAccent: 'Découvrez une expérience de staking plus intelligente',
            heroDescription: 'Découvrez des tâches liées aux jetons, comparez les forfaits et estimez les rendements. STAKEAI est un concept d’écosystème nouvelle génération qui évolue avec sa communauté.',
            ctaPackages: 'Découvrir les forfaits',
            ctaTasks: 'Centre de tâches',
            previewLabel: 'Mode aperçu :',
            previewNotice: 'Les offres de staking ne sont reliées à aucun contrat. Les taux sont des exemples ; aucun staking, aucune distribution de jetons ni aucun rendement n’est proposé ou garanti. Les paiements sont gérés manuellement.',
            packagesTitle: 'Forfaits STAKEAI',
            packagesDescription: 'Stakez du STAKEAI depuis votre portefeuille sur le testnet BNB Smart Chain.',
            bronzeTerm: 'Stake de 30 jours',
            silverTerm: 'Stake de 90 jours',
            goldTerm: 'Stake de 180 jours',
            diamondTerm: 'Stake de 365 jours',
            bronzePercent: '1,0 %',
            silverPercent: '1,75 %',
            goldPercent: '2,5 %',
            diamondPercent: '4,0 %',
            perWeek: '/ semaine',
            minimum100: 'Min. : 300 USDT',
            minimum500: 'Min. : 1 000 USDT',
            minimum2500: 'Min. : 5 000 USDT',
            minimum10000: 'Min. : 10 000 USDT',
            earlyExit10: 'Pénalité de sortie anticipée : 10 %',
            taskBonus12: 'Bonus de tâche x1,2',
            taskBonus15: 'Bonus de tâche x1,5',
            taskBonus20: 'Bonus de tâche x2,0',
            selectPackage: 'Choisir le forfait',
            mostPopular: 'Le plus populaire',
            tasksTitle: 'Centre de tâches',
            tasksDescription: 'Accomplissez des tâches sur les réseaux sociaux et recevez 10 USDT par tâche approuvée par un administrateur.',
            watchAd: 'Regarder une publicité sponsorisée',
            watchAdDescription: 'Regardez une publicité vidéo de 30 secondes jusqu’à la fin.',
            bonus025: 'Bonus indicatif +0,25 %',
            viewTask: 'Voir la tâche',
            socialEngagement: 'Interaction sur X (Twitter)',
            socialDescription: 'Aimez et repartagez la dernière annonce.',
            bonus020: 'Bonus indicatif +0,20 %',
            dailyBonus: 'Bonus de connexion quotidien',
            dailyBonusDescription: 'Visitez le site chaque jour pour préserver votre série.',
            bonus010: 'Bonus indicatif +0,10 %',
            demoCheckin: 'Connexion démo',
            taskNotice: 'Les tâches et bonus sont en aperçu et ne sont pas encore actifs.',
            calculatorTitle: 'Calculateur de rendement démo',
            calculatorDescription: 'Calcul indicatif. Les offres testnet sont affichées ci-dessus ; le staking mainnet est désactivé.',
            investmentAmount: 'Montant investi (USDT)',
            packageChoice: 'Forfait',
            bronzeRate: 'Bronze (1,0 % par semaine)',
            silverRate: 'Silver (1,75 % par semaine)',
            goldRate: 'Gold (2,5 % par semaine)',
            diamondRate: 'Diamond VIP (4,0 % par semaine)',
            weeklyEstimate: 'Rendement hebdomadaire estimé',
            monthlyEstimate: 'Rendement mensuel estimé',
            totalSupplyLabel: 'Offre totale prévue',
            copyright: '© 2026 STAKEAI. Tous droits réservés.',
            language: 'Langue'
        },
        de: {
            title: 'STAKEAI — Clever staken. Gemeinsam wachsen.',
            description: 'Entdecke das STAKEAI-Token-Ökosystem, Demo-Staking-Pakete und geschätzte Erträge.',
            navPackages: 'Pakete',
            navTasks: 'Aufgabenzentrale',
            navReferrals: 'Empfehlungen',
            navRoadmap: 'Fahrplan',
            navCalculator: 'Rechner',
            roadmapBadge: 'Vorgeschlagener Fahrplan',
            roadmapTitle: 'STAKEAI-Fahrplan',
            roadmapDescription: 'Vorgeschlagene Meilensteine für 2027. Der Ablauf kann sich während der Entwicklung ändern.',
            roadmapQ1Title: 'Grundlagen und Token-Design',
            roadmapQ1Description: 'Whitepaper entwerfen, Tokenomics festlegen, Blockchain auswählen und rechtliche Anforderungen prüfen.',
            roadmapQ2Title: 'Verträge und Testnet',
            roadmapQ2Description: 'Token-Verträge entwickeln, einen Testnet-Prototyp bereitstellen und eine unabhängige Sicherheitsprüfung vorbereiten.',
            roadmapQ3Title: 'Plattform und geschlossene Beta',
            roadmapQ3Description: 'Konten, Dashboard und transparente, gebührenbasierte Empfehlungsverfolgung entwickeln; geschlossene Beta starten.',
            roadmapQ4Title: 'Prüfung und Startvorbereitung',
            roadmapQ4Description: 'Sicherheits- und Compliance-Prüfungen abschließen und einen gestaffelten Start nur bei erfüllten Voraussetzungen erwägen.',
            roadmapDisclaimer: 'Interne Überweisungsanfragen werden nach Freigabe durch einen Administrator bearbeitet. Guthaben und genehmigte Änderungen werden auf der Plattform protokolliert. Geben Sie Ihr Passwort niemals weiter.',
            referralBadge: 'Geplantes Programm',
            referralsTitle: 'STAKEAI-Empfehlungsprogramm',
            referralsDescription: 'Vorgeschlagenes Empfehlungsmodell mit drei Ebenen. Die Raten sind Beispiele und müssen geprüft werden.',
            referralLevel1: 'Ebene 1 · Direkte Empfehlung',
            referralLevel2: 'Ebene 2',
            referralLevel3: 'Ebene 3',
            referralFeeBase: 'der anrechenbaren Plattform-Servicegebühren',
            referralDisclaimer: 'Empfehlungsprovisionen sind nicht aktiv. Falls eingeführt, werden sie ausschließlich aus tatsächlich von der Plattform eingenommenen Servicegebühren gezahlt, niemals aus Einzahlungen von Nutzern. Die Raten sind Vorschläge und kein garantiertes Einkommen.',
            login: 'Anmelden',
            signup: 'Registrieren',
            close: 'Schließen',
            authDemoNotice: 'Nur Demo: Der Kontozugang ist nicht aktiv. Gib kein echtes Passwort ein.',
            email: 'E-Mail-Adresse',
            password: 'Passwort',
            confirmPassword: 'Passwort bestätigen',
            passwordMismatch: 'Die Passwörter stimmen nicht überein.',
            authUnavailable: 'Der Kontodienst ist noch nicht eingerichtet. Deine Angaben wurden weder gesendet noch gespeichert.',
            noAccount: 'Noch kein Konto?',
            haveAccount: 'Du hast bereits ein Konto?',
            welcome: 'Willkommen im STAKEAI-Ökosystem',
            heroTitle: 'Stake mit STAKEAI',
            heroAccent: 'Entdecke ein intelligenteres Staking-Erlebnis',
            heroDescription: 'Entdecke tokenbezogene Aufgaben, vergleiche Pakete und schätze Erträge. STAKEAI ist ein Ökosystemkonzept der nächsten Generation, das gemeinsam mit seiner Community wächst.',
            ctaPackages: 'Pakete ansehen',
            ctaTasks: 'Aufgabenzentrale',
            previewLabel: 'Vorschaumodus:',
            previewNotice: 'Die Staking-Pakete sind nicht mit einem Staking-Contract verbunden. Die Raten sind Beispiele; Staking, Token-Verteilung oder Erträge werden weder angeboten noch garantiert. Zahlungen werden manuell abgewickelt.',
            packagesTitle: 'STAKEAI-Pakete',
            packagesDescription: 'Stake STAKEAI direkt aus deiner Wallet im BNB-Smart-Chain-Testnet.',
            bronzeTerm: '30-Tage-Staking',
            silverTerm: '90-Tage-Staking',
            goldTerm: '180-Tage-Staking',
            diamondTerm: '365-Tage-Staking',
            bronzePercent: '1,0 %',
            silverPercent: '1,75 %',
            goldPercent: '2,5 %',
            diamondPercent: '4,0 %',
            perWeek: '/ Woche',
            minimum100: 'Mind.: 300 USDT',
            minimum500: 'Mind.: 1.000 USDT',
            minimum2500: 'Mind.: 5.000 USDT',
            minimum10000: 'Mind.: 10.000 USDT',
            earlyExit10: 'Gebühr bei vorzeitigem Ausstieg: 10 %',
            taskBonus12: '1,2-facher Aufgabenbonus',
            taskBonus15: '1,5-facher Aufgabenbonus',
            taskBonus20: '2,0-facher Aufgabenbonus',
            selectPackage: 'Paket auswählen',
            mostPopular: 'Am beliebtesten',
            tasksTitle: 'Aufgabenzentrale',
            tasksDescription: 'Erledige Social-Media-Aufgaben und erhalte 10 USDT für jede vom Administrator genehmigte Aufgabe.',
            watchAd: 'Gesponserte Anzeige ansehen',
            watchAdDescription: 'Sieh dir eine 30-sekündige Videoanzeige vollständig an.',
            bonus025: 'Beispielbonus +0,25 %',
            viewTask: 'Aufgabe ansehen',
            socialEngagement: 'X-(Twitter-)Interaktion',
            socialDescription: 'Like und teile die neueste Ankündigung erneut.',
            bonus020: 'Beispielbonus +0,20 %',
            dailyBonus: 'Täglicher Check-in-Bonus',
            dailyBonusDescription: 'Besuche die Website täglich, um deine Serie fortzusetzen.',
            bonus010: 'Beispielbonus +0,10 %',
            demoCheckin: 'Demo-Check-in',
            taskNotice: 'Aufgaben und Boni sind in der Vorschau und noch nicht aktiv.',
            calculatorTitle: 'Demo-Ertragsrechner',
            calculatorDescription: 'Nur eine Beispielrechnung. Testnet-Angebote stehen oben; Mainnet-Staking ist nicht aktiviert.',
            investmentAmount: 'Anlagebetrag (USDT)',
            packageChoice: 'Paket',
            bronzeRate: 'Bronze (1,0 % pro Woche)',
            silverRate: 'Silver (1,75 % pro Woche)',
            goldRate: 'Gold (2,5 % pro Woche)',
            diamondRate: 'Diamond VIP (4,0 % pro Woche)',
            weeklyEstimate: 'Geschätzter Wochengewinn',
            monthlyEstimate: 'Geschätzter Monatsgewinn',
            totalSupplyLabel: 'Geplante Gesamtmenge',
            copyright: '© 2026 STAKEAI. Alle Rechte vorbehalten.',
            language: 'Sprache'
        },
        pt: {
            title: 'STAKEAI — Invista com inteligência. Cresçamos juntos.',
            description: 'Explore o ecossistema do token STAKEAI, os pacotes de staking de demonstração e os rendimentos estimados.',
            navPackages: 'Pacotes',
            navTasks: 'Central de tarefas',
            navReferrals: 'Indicações',
            navRoadmap: 'Roteiro',
            navCalculator: 'Calculadora',
            roadmapBadge: 'Roteiro proposto',
            roadmapTitle: 'Roteiro STAKEAI',
            roadmapDescription: 'Marcos propostos para 2027. A sequência pode mudar conforme o projeto evolui.',
            roadmapQ1Title: 'Fundamentos e design do token',
            roadmapQ1Description: 'Preparar o whitepaper, definir a tokenomics, escolher uma blockchain e analisar requisitos legais.',
            roadmapQ2Title: 'Contratos e testnet',
            roadmapQ2Description: 'Desenvolver contratos do token, publicar um protótipo em testnet e preparar uma análise de segurança independente.',
            roadmapQ3Title: 'Plataforma e beta fechado',
            roadmapQ3Description: 'Criar contas, painel e acompanhamento transparente de indicações baseado em taxas; realizar um beta fechado.',
            roadmapQ4Title: 'Auditoria e preparação do lançamento',
            roadmapQ4Description: 'Concluir análises de segurança e conformidade e considerar um lançamento gradual somente após cumprir os requisitos.',
            roadmapDisclaimer: 'Os pedidos de transferência interna são processados após aprovação do administrador. Saldos e alterações aprovadas são registrados na plataforma. Nunca compartilhe sua senha.',
            referralBadge: 'Programa planejado',
            referralsTitle: 'Programa de indicações STAKEAI',
            referralsDescription: 'Estrutura proposta de indicações em três níveis. As taxas são ilustrativas e precisam ser analisadas.',
            referralLevel1: 'Nível 1 · Indicação direta',
            referralLevel2: 'Nível 2',
            referralLevel3: 'Nível 3',
            referralFeeBase: 'das taxas de serviço elegíveis da plataforma',
            referralDisclaimer: 'As comissões por indicação não estão ativas. Se forem implementadas, serão pagas somente com taxas de serviço efetivamente recebidas pela plataforma, nunca com depósitos de usuários. As taxas são propostas, não renda garantida.',
            login: 'Entrar',
            signup: 'Criar conta',
            close: 'Fechar',
            authDemoNotice: 'Apenas demonstração: o acesso à conta não está ativo. Não insira uma senha real.',
            email: 'E-mail',
            password: 'Senha',
            confirmPassword: 'Confirmar senha',
            passwordMismatch: 'As senhas não coincidem.',
            authUnavailable: 'O serviço de contas ainda não foi configurado. Seus dados não foram enviados nem salvos.',
            noAccount: 'Ainda não tem uma conta?',
            haveAccount: 'Já tem uma conta?',
            welcome: 'Boas-vindas ao ecossistema STAKEAI',
            heroTitle: 'Faça staking com STAKEAI',
            heroAccent: 'Descubra uma experiência de staking mais inteligente',
            heroDescription: 'Explore tarefas relacionadas a tokens, compare pacotes e estime rendimentos. STAKEAI é um conceito de ecossistema de nova geração que cresce junto com sua comunidade.',
            ctaPackages: 'Ver pacotes',
            ctaTasks: 'Central de tarefas',
            previewLabel: 'Modo de pré-visualização:',
            previewNotice: 'Os pacotes de staking não estão ligados a um contrato. As taxas são exemplos; staking, distribuição de tokens ou rendimentos não são oferecidos nem garantidos. Os pagamentos são processados manualmente.',
            packagesTitle: 'Pacotes STAKEAI',
            packagesDescription: 'Faça stake de STAKEAI diretamente da sua carteira na testnet da BNB Smart Chain.',
            bronzeTerm: 'Stake de 30 dias',
            silverTerm: 'Stake de 90 dias',
            goldTerm: 'Stake de 180 dias',
            diamondTerm: 'Stake de 365 dias',
            bronzePercent: '1,0%',
            silverPercent: '1,75%',
            goldPercent: '2,5%',
            diamondPercent: '4,0%',
            perWeek: '/ semana',
            minimum100: 'Mín.: 300 USDT',
            minimum500: 'Mín.: 1.000 USDT',
            minimum2500: 'Mín.: 5.000 USDT',
            minimum10000: 'Mín.: 10.000 USDT',
            earlyExit10: 'Penalidade por saída antecipada: 10%',
            taskBonus12: 'Bônus de tarefa de 1,2x',
            taskBonus15: 'Bônus de tarefa de 1,5x',
            taskBonus20: 'Bônus de tarefa de 2,0x',
            selectPackage: 'Selecionar pacote',
            mostPopular: 'Mais popular',
            tasksTitle: 'Central de tarefas',
            tasksDescription: 'Conclua tarefas nas redes sociais e receba 10 USDT por cada tarefa aprovada por um administrador.',
            watchAd: 'Assistir a um anúncio patrocinado',
            watchAdDescription: 'Assista até o fim a um anúncio em vídeo de 30 segundos.',
            bonus025: 'Bônus de exemplo +0,25%',
            viewTask: 'Ver tarefa',
            socialEngagement: 'Interação no X (Twitter)',
            socialDescription: 'Curta e republique o anúncio mais recente.',
            bonus020: 'Bônus de exemplo +0,20%',
            dailyBonus: 'Bônus de acesso diário',
            dailyBonusDescription: 'Acesse o site todos os dias para manter sua sequência.',
            bonus010: 'Bônus de exemplo +0,10%',
            demoCheckin: 'Check-in de demonstração',
            taskNotice: 'As tarefas e os bônus estão em pré-visualização e ainda não estão ativos.',
            calculatorTitle: 'Calculadora de rendimento de demonstração',
            calculatorDescription: 'Cálculo ilustrativo. As ofertas de testnet estão acima; o staking na mainnet não está ativo.',
            investmentAmount: 'Valor do investimento (USDT)',
            packageChoice: 'Pacote',
            bronzeRate: 'Bronze (1,0% semanal)',
            silverRate: 'Silver (1,75% semanal)',
            goldRate: 'Gold (2,5% semanal)',
            diamondRate: 'Diamond VIP (4,0% semanal)',
            weeklyEstimate: 'Rendimento semanal estimado',
            monthlyEstimate: 'Rendimento mensal estimado',
            totalSupplyLabel: 'Oferta total planejada',
            copyright: '© 2026 STAKEAI. Todos os direitos reservados.',
            language: 'Idioma'
        },
        it: {
            title: 'STAKEAI — Fai staking con intelligenza. Cresci insieme a noi.',
            description: 'Scopri l’ecosistema del token STAKEAI, i pacchetti di staking demo e i rendimenti stimati.',
            navPackages: 'Pacchetti',
            navTasks: 'Centro attività',
            navReferrals: 'Inviti',
            navRoadmap: 'Roadmap',
            navCalculator: 'Calcolatore',
            roadmapBadge: 'Roadmap proposta',
            roadmapTitle: 'Roadmap STAKEAI',
            roadmapDescription: 'Traguardi proposti per il 2027. La sequenza può cambiare con l’evoluzione del progetto.',
            roadmapQ1Title: 'Fondamenta e progettazione del token',
            roadmapQ1Description: 'Preparare il whitepaper, definire la tokenomics, scegliere una blockchain e verificare i requisiti legali.',
            roadmapQ2Title: 'Contratti e testnet',
            roadmapQ2Description: 'Sviluppare i contratti del token, distribuire un prototipo testnet e preparare una revisione di sicurezza indipendente.',
            roadmapQ3Title: 'Piattaforma e beta chiusa',
            roadmapQ3Description: 'Realizzare account, dashboard e tracciamento trasparente degli inviti basato sulle commissioni; avviare una beta chiusa.',
            roadmapQ4Title: 'Verifica e preparazione al lancio',
            roadmapQ4Description: 'Completare le verifiche di sicurezza e conformità e valutare un lancio graduale solo dopo aver soddisfatto i requisiti.',
            roadmapDisclaimer: 'Le richieste di trasferimento interno vengono elaborate dopo l’approvazione dell’amministratore. I saldi e le modifiche approvate sono registrati sulla piattaforma. Non condividere mai la password.',
            referralBadge: 'Programma pianificato',
            referralsTitle: 'Programma inviti STAKEAI',
            referralsDescription: 'Struttura proposta su tre livelli. Le percentuali sono indicative e soggette a revisione.',
            referralLevel1: 'Livello 1 · Invito diretto',
            referralLevel2: 'Livello 2',
            referralLevel3: 'Livello 3',
            referralFeeBase: 'delle commissioni di servizio idonee della piattaforma',
            referralDisclaimer: 'Le commissioni per gli inviti non sono attive. Se introdotte, saranno pagate solo con commissioni di servizio effettivamente riscosse dalla piattaforma, mai con i depositi degli utenti. Le percentuali sono proposte, non reddito garantito.',
            login: 'Accedi',
            signup: 'Registrati',
            close: 'Chiudi',
            authDemoNotice: 'Solo demo: l’accesso agli account non è attivo. Non inserire una password reale.',
            email: 'E-mail',
            password: 'Password',
            confirmPassword: 'Conferma password',
            passwordMismatch: 'Le password non corrispondono.',
            authUnavailable: 'Il servizio account non è ancora configurato. I tuoi dati non sono stati inviati né salvati.',
            noAccount: 'Non hai un account?',
            haveAccount: 'Hai già un account?',
            welcome: 'Benvenuto nell’ecosistema STAKEAI',
            heroTitle: 'Fai staking con STAKEAI',
            heroAccent: 'Scopri un’esperienza di staking più intelligente',
            heroDescription: 'Scopri le attività legate ai token, confronta i pacchetti e stima i rendimenti. STAKEAI è un ecosistema di nuova generazione pensato per crescere insieme alla sua community.',
            ctaPackages: 'Scopri i pacchetti',
            ctaTasks: 'Centro attività',
            previewLabel: 'Modalità anteprima:',
            previewNotice: 'I pacchetti di staking non sono collegati a un contratto. I tassi sono esempi; staking, distribuzione di token e rendimenti non sono offerti né garantiti. I pagamenti sono gestiti manualmente.',
            packagesTitle: 'Pacchetti STAKEAI',
            packagesDescription: 'Metti in stake STAKEAI dal tuo wallet sulla testnet di BNB Smart Chain.',
            bronzeTerm: 'Stake di 30 giorni',
            silverTerm: 'Stake di 90 giorni',
            goldTerm: 'Stake di 180 giorni',
            diamondTerm: 'Stake di 365 giorni',
            bronzePercent: '1,0%',
            silverPercent: '1,75%',
            goldPercent: '2,5%',
            diamondPercent: '4,0%',
            perWeek: '/ settimana',
            minimum100: 'Min.: 300 USDT',
            minimum500: 'Min.: 1.000 USDT',
            minimum2500: 'Min.: 5.000 USDT',
            minimum10000: 'Min.: 10.000 USDT',
            earlyExit10: 'Penale per uscita anticipata: 10%',
            taskBonus12: 'Bonus attività 1,2x',
            taskBonus15: 'Bonus attività 1,5x',
            taskBonus20: 'Bonus attività 2,0x',
            selectPackage: 'Seleziona pacchetto',
            mostPopular: 'Più popolare',
            tasksTitle: 'Centro attività',
            tasksDescription: 'Completa le attività sui social media e ricevi 10 USDT per ogni attività approvata da un amministratore.',
            watchAd: 'Guarda un annuncio sponsorizzato',
            watchAdDescription: 'Guarda fino alla fine un annuncio video di 30 secondi.',
            bonus025: 'Bonus di esempio +0,25%',
            viewTask: 'Visualizza attività',
            socialEngagement: 'Interazione su X (Twitter)',
            socialDescription: 'Metti Mi piace e ripubblica l’ultimo annuncio.',
            bonus020: 'Bonus di esempio +0,20%',
            dailyBonus: 'Bonus di accesso giornaliero',
            dailyBonusDescription: 'Visita il sito ogni giorno per mantenere la tua serie.',
            bonus010: 'Bonus di esempio +0,10%',
            demoCheckin: 'Check-in demo',
            taskNotice: 'Le attività e i bonus sono in anteprima e non sono ancora attivi.',
            calculatorTitle: 'Calcolatore rendimenti demo',
            calculatorDescription: 'Calcolo illustrativo. Le offerte testnet sono sopra; lo staking mainnet non è attivo.',
            investmentAmount: 'Importo dell’investimento (USDT)',
            packageChoice: 'Pacchetto',
            bronzeRate: 'Bronze (1,0% settimanale)',
            silverRate: 'Silver (1,75% settimanale)',
            goldRate: 'Gold (2,5% settimanale)',
            diamondRate: 'Diamond VIP (4,0% settimanale)',
            weeklyEstimate: 'Rendimento settimanale stimato',
            monthlyEstimate: 'Rendimento mensile stimato',
            totalSupplyLabel: 'Offerta totale prevista',
            copyright: '© 2026 STAKEAI. Tutti i diritti riservati.',
            language: 'Lingua'
        },
        ru: {
            title: 'STAKEAI — Стейкинг с умом. Растём вместе.',
            description: 'Изучите экосистему токена STAKEAI, демонстрационные пакеты стейкинга и расчётную доходность.',
            navPackages: 'Пакеты',
            navTasks: 'Центр заданий',
            navReferrals: 'Рефералы',
            navRoadmap: 'Дорожная карта',
            navCalculator: 'Калькулятор',
            roadmapBadge: 'Предлагаемый план',
            roadmapTitle: 'Дорожная карта STAKEAI',
            roadmapDescription: 'Предлагаемые этапы на 2027 год. Последовательность может измениться по мере развития проекта.',
            roadmapQ1Title: 'Основы и дизайн токена',
            roadmapQ1Description: 'Подготовка whitepaper, утверждение токеномики, выбор блокчейна и проверка юридических требований.',
            roadmapQ2Title: 'Контракты и тестнет',
            roadmapQ2Description: 'Разработка контрактов токена, запуск прототипа в тестовой сети и подготовка независимой проверки безопасности.',
            roadmapQ3Title: 'Платформа и закрытая бета',
            roadmapQ3Description: 'Разработка аккаунтов, панели и прозрачного отслеживания рефералов на основе комиссий; закрытое бета-тестирование.',
            roadmapQ4Title: 'Аудит и подготовка к запуску',
            roadmapQ4Description: 'Завершение проверок безопасности и соответствия требованиям; рассмотрение поэтапного запуска после выполнения условий.',
            roadmapDisclaimer: 'Запросы на внутренний перевод обрабатываются после одобрения администратора. Балансы и одобренные изменения фиксируются на платформе. Никому не сообщайте пароль.',
            referralBadge: 'Планируемая программа',
            referralsTitle: 'Реферальная программа STAKEAI',
            referralsDescription: 'Предлагаемая реферальная структура из трёх уровней. Ставки предварительные и подлежат проверке.',
            referralLevel1: 'Уровень 1 · Прямое приглашение',
            referralLevel2: 'Уровень 2',
            referralLevel3: 'Уровень 3',
            referralFeeBase: 'от подходящих сервисных комиссий платформы',
            referralDisclaimer: 'Реферальные комиссии пока не действуют. Если программа будет запущена, выплаты будут производиться только из фактически полученных платформой сервисных комиссий, а не из пользовательских депозитов. Ставки являются предложением и не гарантируют доход.',
            login: 'Войти',
            signup: 'Зарегистрироваться',
            close: 'Закрыть',
            authDemoNotice: 'Демонстрационный режим: вход в аккаунт пока недоступен. Не вводите настоящий пароль.',
            email: 'Электронная почта',
            password: 'Пароль',
            confirmPassword: 'Подтвердите пароль',
            passwordMismatch: 'Пароли не совпадают.',
            authUnavailable: 'Сервис учётных записей ещё не настроен. Данные не отправлялись и не сохранялись.',
            noAccount: 'Нет аккаунта?',
            haveAccount: 'Уже есть аккаунт?',
            welcome: 'Добро пожаловать в экосистему STAKEAI',
            heroTitle: 'Стейкинг с STAKEAI',
            heroAccent: 'Оцените более удобный стейкинг',
            heroDescription: 'Изучайте задания, связанные с токенами, сравнивайте пакеты и рассчитывайте доходность. STAKEAI — концепция экосистемы нового поколения, которая развивается вместе с сообществом.',
            ctaPackages: 'Обзор пакетов',
            ctaTasks: 'Центр заданий',
            previewLabel: 'Режим предварительного просмотра:',
            previewNotice: 'Пакеты стейкинга не подключены к контракту стейкинга. Ставки приведены для примера; стейкинг, распределение токенов и доходность не предлагаются и не гарантируются. Платежи обрабатываются вручную.',
            packagesTitle: 'Пакеты STAKEAI',
            packagesDescription: 'Стейкинг STAKEAI напрямую из кошелька в тестовой сети BNB Smart Chain.',
            bronzeTerm: 'Стейкинг на 30 дней',
            silverTerm: 'Стейкинг на 90 дней',
            goldTerm: 'Стейкинг на 180 дней',
            diamondTerm: 'Стейкинг на 365 дней',
            bronzePercent: '1,0%',
            silverPercent: '1,75%',
            goldPercent: '2,5%',
            diamondPercent: '4,0%',
            perWeek: '/ в неделю',
            minimum100: 'Мин.: 300 USDT',
            minimum500: 'Мин.: 1 000 USDT',
            minimum2500: 'Мин.: 5 000 USDT',
            minimum10000: 'Мин.: 10 000 USDT',
            earlyExit10: 'Штраф за досрочный выход: 10%',
            taskBonus12: 'Бонус за задания 1,2x',
            taskBonus15: 'Бонус за задания 1,5x',
            taskBonus20: 'Бонус за задания 2,0x',
            selectPackage: 'Выбрать пакет',
            mostPopular: 'Популярный',
            tasksTitle: 'Центр заданий',
            tasksDescription: 'Выполняйте задания в соцсетях и получайте 10 USDT за каждое задание, одобренное администратором.',
            watchAd: 'Посмотреть рекламный ролик',
            watchAdDescription: 'Посмотрите 30-секундный рекламный ролик до конца.',
            bonus025: 'Пример бонуса +0,25%',
            viewTask: 'Открыть задание',
            socialEngagement: 'Активность в X (Twitter)',
            socialDescription: 'Поставьте отметку «Нравится» и поделитесь последним объявлением.',
            bonus020: 'Пример бонуса +0,20%',
            dailyBonus: 'Ежедневный бонус за вход',
            dailyBonusDescription: 'Заходите на сайт каждый день, чтобы сохранить серию.',
            bonus010: 'Пример бонуса +0,10%',
            demoCheckin: 'Демо-отметка',
            taskNotice: 'Задания и бонусы доступны только в режиме предварительного просмотра.',
            calculatorTitle: 'Демо-калькулятор доходности',
            calculatorDescription: 'Примерный расчёт. Предложения тестовой сети указаны выше; стейкинг в mainnet не включён.',
            investmentAmount: 'Сумма вложения (USDT)',
            packageChoice: 'Пакет',
            bronzeRate: 'Bronze (1,0% в неделю)',
            silverRate: 'Silver (1,75% в неделю)',
            goldRate: 'Gold (2,5% в неделю)',
            diamondRate: 'Diamond VIP (4,0% в неделю)',
            weeklyEstimate: 'Расчётный доход за неделю',
            monthlyEstimate: 'Расчётный доход за месяц',
            totalSupplyLabel: 'Планируемое общее предложение',
            copyright: '© 2026 STAKEAI. Все права защищены.',
            language: 'Язык'
        },
        ar: {
            title: 'STAKEAI — استثمار أذكى ونمو معًا',
            description: 'اكتشف منظومة رمز STAKEAI وباقات التخزين التجريبية والعوائد التقديرية.',
            navPackages: 'الباقات',
            navTasks: 'مركز المهام',
            navReferrals: 'الإحالات',
            navRoadmap: 'خارطة الطريق',
            navCalculator: 'الحاسبة',
            roadmapBadge: 'خارطة طريق مقترحة',
            roadmapTitle: 'خارطة طريق STAKEAI',
            roadmapDescription: 'مراحل مقترحة لعام 2027. قد يتغير الترتيب مع تطور المشروع.',
            roadmapQ1Title: 'الأساسيات وتصميم الرمز',
            roadmapQ1Description: 'إعداد الورقة البيضاء، وتأكيد اقتصاديات الرمز، واختيار شبكة بلوكتشين، ومراجعة المتطلبات القانونية.',
            roadmapQ2Title: 'العقود والشبكة التجريبية',
            roadmapQ2Description: 'تطوير عقود الرمز، وإطلاق نموذج أولي على شبكة تجريبية، والتحضير لمراجعة أمنية مستقلة.',
            roadmapQ3Title: 'المنصة والنسخة التجريبية المغلقة',
            roadmapQ3Description: 'إنشاء الحسابات ولوحة التحكم وتتبع الإحالات بشفافية اعتمادًا على الرسوم؛ وإجراء نسخة تجريبية مغلقة.',
            roadmapQ4Title: 'التدقيق والاستعداد للإطلاق',
            roadmapQ4Description: 'استكمال مراجعات الأمان والامتثال، ثم دراسة إطلاق تدريجي عند استيفاء المتطلبات فقط.',
            roadmapDisclaimer: 'تُعالج طلبات التحويل الداخلي بعد موافقة المسؤول. تُسجّل الأرصدة والتغييرات المعتمدة على المنصة. لا تشارك كلمة مرور حسابك مع أحد.',
            referralBadge: 'برنامج مخطط',
            referralsTitle: 'برنامج إحالات STAKEAI',
            referralsDescription: 'هيكل إحالات مقترح من ثلاثة مستويات. النسب توضيحية وتخضع للمراجعة.',
            referralLevel1: 'المستوى 1 · إحالة مباشرة',
            referralLevel2: 'المستوى 2',
            referralLevel3: 'المستوى 3',
            referralFeeBase: 'من رسوم خدمات المنصة المؤهلة',
            referralDisclaimer: 'عمولات الإحالة غير مفعّلة. وإذا تم إطلاقها، فستُدفع فقط من رسوم الخدمات التي تحصّلها المنصة فعليًا، وليس من إيداعات المستخدمين. هذه النسب مقترحة ولا تضمن أي دخل.',
            login: 'تسجيل الدخول',
            signup: 'إنشاء حساب',
            close: 'إغلاق',
            authDemoNotice: 'للعرض فقط: تسجيل الدخول غير مفعّل. لا تُدخل كلمة مرور حقيقية.',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            confirmPassword: 'تأكيد كلمة المرور',
            passwordMismatch: 'كلمتا المرور غير متطابقتين.',
            authUnavailable: 'لم يتم إعداد خدمة الحسابات بعد. لم يتم إرسال بياناتك أو حفظها.',
            noAccount: 'ليس لديك حساب؟',
            haveAccount: 'لديك حساب بالفعل؟',
            welcome: 'مرحبًا بك في منظومة STAKEAI',
            heroTitle: 'ابدأ التخزين مع STAKEAI',
            heroAccent: 'اكتشف تجربة تخزين أكثر ذكاءً',
            heroDescription: 'استكشف المهام المرتبطة بالرموز، وقارن الباقات، وقدّر العوائد. STAKEAI مفهوم لمنظومة جيل جديد تنمو مع مجتمعها.',
            ctaPackages: 'استكشف الباقات',
            ctaTasks: 'مركز المهام',
            previewLabel: 'وضع المعاينة:',
            previewNotice: 'حزم التخزين غير متصلة بعقد تخزين. النسب المعروضة أمثلة فقط؛ ولا يتم تقديم أو ضمان التخزين أو توزيع الرموز أو العوائد. تتم معالجة المدفوعات يدويًا.',
            packagesTitle: 'باقات STAKEAI',
            packagesDescription: 'قم بتجميد STAKEAI مباشرة من محفظتك على شبكة BNB Smart Chain التجريبية.',
            bronzeTerm: 'تخزين لمدة 30 يومًا',
            silverTerm: 'تخزين لمدة 90 يومًا',
            goldTerm: 'تخزين لمدة 180 يومًا',
            diamondTerm: 'تخزين لمدة 365 يومًا',
            bronzePercent: '٪1.0',
            silverPercent: '٪1.75',
            goldPercent: '٪2.5',
            diamondPercent: '٪4.0',
            perWeek: '/ أسبوعيًا',
            minimum100: 'الحد الأدنى: 300 USDT',
            minimum500: 'الحد الأدنى: 1,000 USDT',
            minimum2500: 'الحد الأدنى: 5,000 USDT',
            minimum10000: 'الحد الأدنى: 10,000 USDT',
            earlyExit10: 'غرامة السحب المبكر: ٪10',
            taskBonus12: 'مكافأة مهام 1.2x',
            taskBonus15: 'مكافأة مهام 1.5x',
            taskBonus20: 'مكافأة مهام 2.0x',
            selectPackage: 'اختر الباقة',
            mostPopular: 'الأكثر شيوعًا',
            tasksTitle: 'مركز المهام',
            tasksDescription: 'أكمل مهام وسائل التواصل الاجتماعي واحصل على 10 USDT عن كل مهمة يوافق عليها المسؤول.',
            watchAd: 'مشاهدة إعلان برعاية',
            watchAdDescription: 'شاهد إعلان فيديو مدته 30 ثانية حتى النهاية.',
            bonus025: 'مكافأة تجريبية +٪0.25',
            viewTask: 'عرض المهمة',
            socialEngagement: 'التفاعل على X (Twitter)',
            socialDescription: 'أعجبك الإعلان الأخير وأعد نشره.',
            bonus020: 'مكافأة تجريبية +٪0.20',
            dailyBonus: 'مكافأة تسجيل الدخول اليومية',
            dailyBonusDescription: 'زُر الموقع يوميًا للحفاظ على استمرارية تسجيلك.',
            bonus010: 'مكافأة تجريبية +٪0.10',
            demoCheckin: 'تسجيل تجريبي',
            taskNotice: 'المهام والمكافآت في وضع المعاينة وليست مفعّلة بعد.',
            calculatorTitle: 'حاسبة العوائد التجريبية',
            calculatorDescription: 'حساب توضيحي. عروض شبكة الاختبار أعلاه؛ التخزين على الشبكة الرئيسية غير مفعّل.',
            investmentAmount: 'مبلغ الاستثمار (USDT)',
            packageChoice: 'الباقة',
            bronzeRate: 'Bronze (٪1.0 أسبوعيًا)',
            silverRate: 'Silver (٪1.75 أسبوعيًا)',
            goldRate: 'Gold (٪2.5 أسبوعيًا)',
            diamondRate: 'Diamond VIP (٪4.0 أسبوعيًا)',
            weeklyEstimate: 'العائد الأسبوعي التقديري',
            monthlyEstimate: 'العائد الشهري التقديري',
            totalSupplyLabel: 'إجمالي المعروض المخطط',
            copyright: '© 2026 STAKEAI. جميع الحقوق محفوظة.',
            language: 'اللغة'
        },
        zh: {
            title: 'STAKEAI — 智能质押，共同成长',
            description: '探索 STAKEAI 代币生态、质押演示方案和预估收益。',
            navPackages: '方案',
            navTasks: '任务中心',
            navReferrals: '推荐计划',
            navRoadmap: '路线图',
            navCalculator: '计算器',
            roadmapBadge: '拟议路线图',
            roadmapTitle: 'STAKEAI 路线图',
            roadmapDescription: '拟定的 2027 年里程碑。项目推进过程中顺序可能调整。',
            roadmapQ1Title: '基础建设与代币设计',
            roadmapQ1Description: '起草白皮书、确认代币经济模型、选择区块链并审查法律要求。',
            roadmapQ2Title: '合约与测试网',
            roadmapQ2Description: '开发代币合约、部署测试网原型，并准备独立安全审查。',
            roadmapQ3Title: '平台与封闭测试',
            roadmapQ3Description: '构建账户服务、控制面板和透明的费用型推荐追踪；开展封闭测试。',
            roadmapQ4Title: '审计与上线准备',
            roadmapQ4Description: '完成安全与合规审查，仅在满足要求后考虑分阶段上线。',
            roadmapDisclaimer: '站内转账申请须经管理员批准后处理。余额及已批准的变更会记录在平台中。请勿向他人透露账户密码。',
            referralBadge: '计划中的方案',
            referralsTitle: 'STAKEAI 推荐计划',
            referralsDescription: '拟议的三级推荐结构。比例仅供参考，仍需审核。',
            referralLevel1: '第 1 级 · 直接推荐',
            referralLevel2: '第 2 级',
            referralLevel3: '第 3 级',
            referralFeeBase: '符合条件的平台服务费',
            referralDisclaimer: '推荐佣金尚未启用。如未来推出，仅从平台实际收取的服务费中支付，不会来自用户存款。比例为提案，不保证收入。',
            login: '登录',
            signup: '注册',
            close: '关闭',
            authDemoNotice: '仅供演示：账户登录尚未启用。请勿输入真实密码。',
            email: '电子邮箱',
            password: '密码',
            confirmPassword: '确认密码',
            passwordMismatch: '两次输入的密码不一致。',
            authUnavailable: '账户服务尚未配置。您的信息未发送或保存。',
            noAccount: '还没有账户？',
            haveAccount: '已有账户？',
            welcome: '欢迎来到 STAKEAI 生态',
            heroTitle: '使用 STAKEAI 进行质押',
            heroAccent: '探索更智能的质押体验',
            heroDescription: '探索代币相关任务、比较方案并估算收益。STAKEAI 是一个与社区共同成长的新一代生态概念。',
            ctaPackages: '查看方案',
            ctaTasks: '任务中心',
            previewLabel: '预览模式：',
            previewNotice: '质押套餐尚未连接质押合约。套餐费率仅供示例；不提供或保证质押、代币分发或收益。付款由人工处理。',
            packagesTitle: 'STAKEAI 方案',
            packagesDescription: '在 BNB Smart Chain 测试网上直接从钱包质押 STAKEAI。',
            bronzeTerm: '30 天质押',
            silverTerm: '90 天质押',
            goldTerm: '180 天质押',
            diamondTerm: '365 天质押',
            bronzePercent: '1.0%',
            silverPercent: '1.75%',
            goldPercent: '2.5%',
            diamondPercent: '4.0%',
            perWeek: '/ 每周',
            minimum100: '最低：300 USDT',
            minimum500: '最低：1,000 USDT',
            minimum2500: '最低：5,000 USDT',
            minimum10000: '最低：10,000 USDT',
            earlyExit10: '提前退出罚金：10%',
            taskBonus12: '1.2 倍任务奖励',
            taskBonus15: '1.5 倍任务奖励',
            taskBonus20: '2.0 倍任务奖励',
            selectPackage: '选择方案',
            mostPopular: '最受欢迎',
            tasksTitle: '任务中心',
            tasksDescription: '完成社交媒体任务，每项经管理员审核通过的任务可获得 10 USDT。',
            watchAd: '观看赞助广告',
            watchAdDescription: '完整观看一段 30 秒的视频广告。',
            bonus025: '示例奖励 +0.25%',
            viewTask: '查看任务',
            socialEngagement: 'X（Twitter）互动',
            socialDescription: '点赞并转发最新公告。',
            bonus020: '示例奖励 +0.20%',
            dailyBonus: '每日签到奖励',
            dailyBonusDescription: '每天访问网站以保持连续签到。',
            bonus010: '示例奖励 +0.10%',
            demoCheckin: '演示签到',
            taskNotice: '任务和奖励处于预览模式，尚未启用。',
            calculatorTitle: '演示收益计算器',
            calculatorDescription: '仅供示例计算。测试网方案见上方；主网质押尚未启用。',
            investmentAmount: '投资金额（USDT）',
            packageChoice: '方案',
            bronzeRate: 'Bronze（每周 1.0%）',
            silverRate: 'Silver（每周 1.75%）',
            goldRate: 'Gold（每周 2.5%）',
            diamondRate: 'Diamond VIP（每周 4.0%）',
            weeklyEstimate: '每周预估收益',
            monthlyEstimate: '每月预估收益',
            totalSupplyLabel: '计划总供应量',
            copyright: '© 2026 STAKEAI。保留所有权利。',
            language: '语言'
        },
        ja: {
            title: 'STAKEAI — 賢くステーキング、ともに成長',
            description: 'STAKEAIトークンのエコシステム、デモ用ステーキングプラン、推定リターンをご覧ください。',
            navPackages: 'プラン',
            navTasks: 'タスクセンター',
            navReferrals: '紹介プログラム',
            navRoadmap: 'ロードマップ',
            navCalculator: '計算ツール',
            roadmapBadge: 'ロードマップ案',
            roadmapTitle: 'STAKEAIロードマップ',
            roadmapDescription: '2027年の目標案です。プロジェクトの進行に伴い順序が変わる場合があります。',
            roadmapQ1Title: '基盤とトークン設計',
            roadmapQ1Description: 'ホワイトペーパーの作成、トークノミクスの確定、ブロックチェーンの選定、法的要件の確認。',
            roadmapQ2Title: 'コントラクトとテストネット',
            roadmapQ2Description: 'トークンコントラクトを開発し、テストネットの試作版を公開。独立したセキュリティレビューを準備。',
            roadmapQ3Title: 'プラットフォームとクローズドベータ',
            roadmapQ3Description: 'アカウント機能、ダッシュボード、手数料に基づく透明な紹介追跡を開発し、限定ベータを実施。',
            roadmapQ4Title: '監査とローンチ準備',
            roadmapQ4Description: 'セキュリティとコンプライアンスの審査を完了し、条件を満たした場合のみ段階的なローンチを検討。',
            roadmapDisclaimer: 'プラットフォーム内の振替申請は、管理者の承認後に処理されます。残高と承認済みの変更はプラットフォームに記録されます。アカウントのパスワードは他人に教えないでください。',
            referralBadge: '導入予定プログラム',
            referralsTitle: 'STAKEAI紹介プログラム',
            referralsDescription: '3段階の紹介制度案です。割合は参考値であり、今後の審査対象です。',
            referralLevel1: 'レベル1 · 直接紹介',
            referralLevel2: 'レベル2',
            referralLevel3: 'レベル3',
            referralFeeBase: '対象となるプラットフォームサービス手数料に対して',
            referralDisclaimer: '紹介コミッションはまだ有効ではありません。導入する場合、ユーザーの預入金ではなく、プラットフォームが実際に受け取ったサービス手数料のみを原資とします。割合は提案であり、収益を保証するものではありません。',
            login: 'ログイン',
            signup: '新規登録',
            close: '閉じる',
            authDemoNotice: 'デモのみ：アカウント機能はまだ利用できません。実際のパスワードは入力しないでください。',
            email: 'メールアドレス',
            password: 'パスワード',
            confirmPassword: 'パスワードを確認',
            passwordMismatch: 'パスワードが一致しません。',
            authUnavailable: 'アカウントサービスはまだ設定されていません。入力内容は送信・保存されていません。',
            noAccount: 'アカウントをお持ちでない方',
            haveAccount: 'すでにアカウントをお持ちの方',
            welcome: 'STAKEAIエコシステムへようこそ',
            heroTitle: 'STAKEAIでステーキング',
            heroAccent: 'よりスマートなステーキング体験を',
            heroDescription: 'トークン関連のタスクを確認し、プランを比較して、リターンを試算できます。STAKEAIはコミュニティとともに成長する次世代エコシステムのコンセプトです。',
            ctaPackages: 'プランを見る',
            ctaTasks: 'タスクセンター',
            previewLabel: 'プレビュー:',
            previewNotice: 'ステーキングプランはステーキングコントラクトに接続されていません。表示レートは例示であり、ステーキング、トークン配布、利益を提供・保証するものではありません。支払いは手動で処理されます。',
            packagesTitle: 'STAKEAIプラン',
            packagesDescription: 'BNB Smart Chainテストネットでウォレットから直接STAKEAIをステークします。',
            bronzeTerm: '30日間ステーキング',
            silverTerm: '90日間ステーキング',
            goldTerm: '180日間ステーキング',
            diamondTerm: '365日間ステーキング',
            bronzePercent: '1.0%',
            silverPercent: '1.75%',
            goldPercent: '2.5%',
            diamondPercent: '4.0%',
            perWeek: '/ 週',
            minimum100: '最小額: 300 USDT',
            minimum500: '最小額: 1,000 USDT',
            minimum2500: '最小額: 5,000 USDT',
            minimum10000: '最小額: 10,000 USDT',
            earlyExit10: '途中解約手数料: 10%',
            taskBonus12: 'タスクボーナス 1.2倍',
            taskBonus15: 'タスクボーナス 1.5倍',
            taskBonus20: 'タスクボーナス 2.0倍',
            selectPackage: 'プランを選択',
            mostPopular: '人気',
            tasksTitle: 'タスクセンター',
            tasksDescription: 'SNSタスクを完了し、管理者が承認したタスクごとに10 USDTを獲得できます。',
            watchAd: 'スポンサー広告を見る',
            watchAdDescription: '30秒の動画広告を最後まで視聴します。',
            bonus025: 'ボーナス例 +0.25%',
            viewTask: 'タスクを見る',
            socialEngagement: 'X（Twitter）での交流',
            socialDescription: '最新のお知らせに「いいね」してリポストします。',
            bonus020: 'ボーナス例 +0.20%',
            dailyBonus: '毎日のチェックインボーナス',
            dailyBonusDescription: '毎日サイトにアクセスして連続記録を維持します。',
            bonus010: 'ボーナス例 +0.10%',
            demoCheckin: 'デモチェックイン',
            taskNotice: 'タスクとボーナスはプレビュー中で、まだ有効ではありません。',
            calculatorTitle: 'デモリターン計算ツール',
            calculatorDescription: '参考計算です。テストネットのプランは上記に表示され、メインネットのステーキングは無効です。',
            investmentAmount: '投資額（USDT）',
            packageChoice: 'プラン',
            bronzeRate: 'Bronze（週 1.0%）',
            silverRate: 'Silver（週 1.75%）',
            goldRate: 'Gold（週 2.5%）',
            diamondRate: 'Diamond VIP（週 4.0%）',
            weeklyEstimate: '週間推定リターン',
            monthlyEstimate: '月間推定リターン',
            totalSupplyLabel: '予定総供給量',
            copyright: '© 2026 STAKEAI. 無断転載を禁じます。',
            language: '言語'
        }
};

const walletTranslations = {
        en: {
            demoWalletBadge: 'Demo wallet',
            walletTitle: 'Your STAKEAI Wallet',
            logout: 'Log out',
            walletDemoNotice: 'Preview only: this is a temporary local simulation. No real account, token balance, blockchain transaction, or transfer between users exists.',
            availableBalance: 'Available demo balance',
            notRealFunds: 'This is a sample balance, not real funds.',
            receiveTitle: 'Receive (demo)',
            yourDemoId: 'Your temporary demo ID',
            sendTitle: 'Send STAKEAI (demo)',
            sendDescription: 'Try a simulated transfer. It only changes the sample balance in this browser.',
            recipientId: 'Recipient demo ID',
            transferAmount: 'Amount (STAKEAI)',
            sendButton: 'Simulate transfer',
            historyTitle: 'Recent demo activity',
            noTransactions: 'No demo transfers yet.',
            demoSessionStarted: 'Demo session started. No account was created and no credentials were stored.',
            transferInvalid: 'Enter a valid amount greater than zero.',
            transferInsufficient: 'The amount exceeds your demo balance.',
            transferSuccess: 'Demo transfer completed locally. No other user received tokens.',
            sentTo: 'Simulated transfer to'
        },
        tr: {
            demoWalletBadge: 'Demo cüzdan',
            walletTitle: 'STAKEAI cüzdanın',
            logout: 'Çıkış',
            walletDemoNotice: 'Yalnızca önizleme: bu geçici bir yerel simülasyondur. Gerçek hesap, token bakiyesi, blockchain işlemi veya kullanıcılar arası transfer yoktur.',
            availableBalance: 'Kullanılabilir demo bakiye',
            notRealFunds: 'Bu örnek bakiyedir, gerçek varlık değildir.',
            receiveTitle: 'Al (demo)',
            yourDemoId: 'Geçici demo kimliğin',
            sendTitle: 'STAKEAI gönder (demo)',
            sendDescription: 'Demo transferi dene. Yalnızca bu tarayıcıdaki örnek bakiyeyi değiştirir.',
            recipientId: 'Alıcının demo kimliği',
            transferAmount: 'Miktar (STAKEAI)',
            sendButton: 'Transferi simüle et',
            historyTitle: 'Son demo hareketleri',
            noTransactions: 'Henüz demo transferi yok.',
            demoSessionStarted: 'Demo oturumu açıldı. Hesap oluşturulmadı ve giriş bilgileri kaydedilmedi.',
            transferInvalid: 'Sıfırdan büyük geçerli bir miktar girin.',
            transferInsufficient: 'Bu miktar demo bakiyenizi aşıyor.',
            transferSuccess: 'Demo transferi bu tarayıcıda simüle edildi. Başka bir kullanıcı token almadı.',
            sentTo: 'Simüle edilen transfer alıcısı:'
        },
        es: {
            demoWalletBadge: 'Billetera de demostración',
            walletTitle: 'Tu billetera STAKEAI',
            logout: 'Cerrar sesión',
            walletDemoNotice: 'Solo vista previa: es una simulación local temporal. No hay cuentas, saldos de tokens, transacciones blockchain ni transferencias reales entre usuarios.',
            availableBalance: 'Saldo demo disponible',
            notRealFunds: 'Este es un saldo de muestra, no son fondos reales.',
            receiveTitle: 'Recibir (demo)',
            yourDemoId: 'Tu ID demo temporal',
            sendTitle: 'Enviar STAKEAI (demo)',
            sendDescription: 'Prueba una transferencia simulada. Solo cambia el saldo de muestra en este navegador.',
            recipientId: 'ID demo del destinatario',
            transferAmount: 'Cantidad (STAKEAI)',
            sendButton: 'Simular transferencia',
            historyTitle: 'Actividad demo reciente',
            noTransactions: 'Aún no hay transferencias demo.',
            demoSessionStarted: 'Sesión demo iniciada. No se creó ninguna cuenta ni se guardaron credenciales.',
            transferInvalid: 'Introduce una cantidad válida mayor que cero.',
            transferInsufficient: 'La cantidad supera tu saldo demo.',
            transferSuccess: 'Transferencia demo simulada localmente. Ningún otro usuario recibió tokens.',
            sentTo: 'Transferencia simulada a'
        },
        fr: {
            demoWalletBadge: 'Portefeuille démo',
            walletTitle: 'Votre portefeuille STAKEAI',
            logout: 'Se déconnecter',
            walletDemoNotice: 'Aperçu uniquement : simulation locale temporaire. Aucun compte, solde de jetons, transaction blockchain ou transfert réel entre utilisateurs.',
            availableBalance: 'Solde démo disponible',
            notRealFunds: 'Il s’agit d’un solde fictif, pas de fonds réels.',
            receiveTitle: 'Recevoir (démo)',
            yourDemoId: 'Votre identifiant démo temporaire',
            sendTitle: 'Envoyer des STAKEAI (démo)',
            sendDescription: 'Testez un transfert simulé. Il modifie uniquement le solde fictif de ce navigateur.',
            recipientId: 'Identifiant démo du destinataire',
            transferAmount: 'Montant (STAKEAI)',
            sendButton: 'Simuler le transfert',
            historyTitle: 'Activité démo récente',
            noTransactions: 'Aucun transfert démo pour le moment.',
            demoSessionStarted: 'Session démo démarrée. Aucun compte créé ni identifiant enregistré.',
            transferInvalid: 'Saisissez un montant valide supérieur à zéro.',
            transferInsufficient: 'Le montant dépasse votre solde démo.',
            transferSuccess: 'Transfert simulé localement. Aucun autre utilisateur n’a reçu de jetons.',
            sentTo: 'Transfert simulé vers'
        },
        de: {
            demoWalletBadge: 'Demo-Wallet',
            walletTitle: 'Deine STAKEAI-Wallet',
            logout: 'Abmelden',
            walletDemoNotice: 'Nur Vorschau: Dies ist eine vorübergehende lokale Simulation. Es gibt keine echten Konten, Token-Guthaben, Blockchain-Transaktionen oder Überweisungen zwischen Nutzern.',
            availableBalance: 'Verfügbares Demo-Guthaben',
            notRealFunds: 'Dies ist ein Beispielguthaben, kein echtes Vermögen.',
            receiveTitle: 'Empfangen (Demo)',
            yourDemoId: 'Deine temporäre Demo-ID',
            sendTitle: 'STAKEAI senden (Demo)',
            sendDescription: 'Teste eine simulierte Überweisung. Sie ändert nur das Beispielguthaben in diesem Browser.',
            recipientId: 'Demo-ID des Empfängers',
            transferAmount: 'Betrag (STAKEAI)',
            sendButton: 'Überweisung simulieren',
            historyTitle: 'Letzte Demo-Aktivitäten',
            noTransactions: 'Noch keine Demo-Überweisungen.',
            demoSessionStarted: 'Demo-Sitzung gestartet. Es wurde kein Konto erstellt und keine Anmeldung gespeichert.',
            transferInvalid: 'Gib einen gültigen Betrag größer als null ein.',
            transferInsufficient: 'Der Betrag übersteigt dein Demo-Guthaben.',
            transferSuccess: 'Demo-Überweisung lokal simuliert. Kein anderer Nutzer hat Token erhalten.',
            sentTo: 'Simulierte Überweisung an'
        },
        pt: {
            demoWalletBadge: 'Carteira de demonstração',
            walletTitle: 'Sua carteira STAKEAI',
            logout: 'Sair',
            walletDemoNotice: 'Apenas pré-visualização: esta é uma simulação local temporária. Não há contas, saldos de tokens, transações blockchain ou transferências reais entre usuários.',
            availableBalance: 'Saldo demo disponível',
            notRealFunds: 'Este é um saldo de exemplo, não são fundos reais.',
            receiveTitle: 'Receber (demo)',
            yourDemoId: 'Seu ID demo temporário',
            sendTitle: 'Enviar STAKEAI (demo)',
            sendDescription: 'Experimente uma transferência simulada. Ela altera apenas o saldo de exemplo neste navegador.',
            recipientId: 'ID demo do destinatário',
            transferAmount: 'Valor (STAKEAI)',
            sendButton: 'Simular transferência',
            historyTitle: 'Atividade demo recente',
            noTransactions: 'Ainda não há transferências demo.',
            demoSessionStarted: 'Sessão demo iniciada. Nenhuma conta foi criada e nenhum dado de acesso foi salvo.',
            transferInvalid: 'Insira um valor válido maior que zero.',
            transferInsufficient: 'O valor excede seu saldo demo.',
            transferSuccess: 'Transferência demo simulada localmente. Nenhum outro usuário recebeu tokens.',
            sentTo: 'Transferência simulada para'
        },
        it: {
            demoWalletBadge: 'Wallet demo',
            walletTitle: 'Il tuo wallet STAKEAI',
            logout: 'Esci',
            walletDemoNotice: 'Solo anteprima: è una simulazione locale temporanea. Non esistono account, saldi token, transazioni blockchain o trasferimenti reali tra utenti.',
            availableBalance: 'Saldo demo disponibile',
            notRealFunds: 'Questo è un saldo di esempio, non denaro reale.',
            receiveTitle: 'Ricevi (demo)',
            yourDemoId: 'Il tuo ID demo temporaneo',
            sendTitle: 'Invia STAKEAI (demo)',
            sendDescription: 'Prova un trasferimento simulato. Modifica solo il saldo di esempio in questo browser.',
            recipientId: 'ID demo del destinatario',
            transferAmount: 'Importo (STAKEAI)',
            sendButton: 'Simula trasferimento',
            historyTitle: 'Attività demo recenti',
            noTransactions: 'Nessun trasferimento demo.',
            demoSessionStarted: 'Sessione demo avviata. Non è stato creato alcun account né salvato alcun dato di accesso.',
            transferInvalid: 'Inserisci un importo valido maggiore di zero.',
            transferInsufficient: 'L’importo supera il saldo demo.',
            transferSuccess: 'Trasferimento demo simulato localmente. Nessun altro utente ha ricevuto token.',
            sentTo: 'Trasferimento simulato a'
        },
        ru: {
            demoWalletBadge: 'Демо-кошелёк',
            walletTitle: 'Ваш кошелёк STAKEAI',
            logout: 'Выйти',
            walletDemoNotice: 'Только предварительный просмотр: это временная локальная симуляция. Реальных аккаунтов, балансов токенов, блокчейн-транзакций и переводов между пользователями нет.',
            availableBalance: 'Доступный демо-баланс',
            notRealFunds: 'Это пример баланса, а не реальные средства.',
            receiveTitle: 'Получить (демо)',
            yourDemoId: 'Ваш временный демо-ID',
            sendTitle: 'Отправить STAKEAI (демо)',
            sendDescription: 'Попробуйте симуляцию перевода. Она меняет только пример баланса в этом браузере.',
            recipientId: 'Демо-ID получателя',
            transferAmount: 'Сумма (STAKEAI)',
            sendButton: 'Симулировать перевод',
            historyTitle: 'Последние демо-операции',
            noTransactions: 'Демо-переводов пока нет.',
            demoSessionStarted: 'Демо-сеанс начат. Аккаунт не создан, данные входа не сохранены.',
            transferInvalid: 'Введите корректную сумму больше нуля.',
            transferInsufficient: 'Сумма превышает демо-баланс.',
            transferSuccess: 'Перевод смоделирован локально. Другие пользователи токены не получили.',
            sentTo: 'Симуляция перевода для'
        },
        ar: {
            demoWalletBadge: 'محفظة تجريبية',
            walletTitle: 'محفظة STAKEAI الخاصة بك',
            logout: 'تسجيل الخروج',
            walletDemoNotice: 'للمعاينة فقط: هذه محاكاة محلية مؤقتة. لا توجد حسابات أو أرصدة رموز أو معاملات بلوكتشين أو تحويلات فعلية بين المستخدمين.',
            availableBalance: 'الرصيد التجريبي المتاح',
            notRealFunds: 'هذا رصيد تجريبي وليس أموالًا حقيقية.',
            receiveTitle: 'استلام (تجريبي)',
            yourDemoId: 'معرّفك التجريبي المؤقت',
            sendTitle: 'إرسال STAKEAI (تجريبي)',
            sendDescription: 'جرّب تحويلًا محاكى. سيغيّر رصيد العينة في هذا المتصفح فقط.',
            recipientId: 'المعرّف التجريبي للمستلم',
            transferAmount: 'المبلغ (STAKEAI)',
            sendButton: 'محاكاة التحويل',
            historyTitle: 'النشاط التجريبي الأخير',
            noTransactions: 'لا توجد تحويلات تجريبية بعد.',
            demoSessionStarted: 'بدأت الجلسة التجريبية. لم يتم إنشاء حساب أو حفظ بيانات الدخول.',
            transferInvalid: 'أدخل مبلغًا صالحًا أكبر من صفر.',
            transferInsufficient: 'المبلغ يتجاوز رصيدك التجريبي.',
            transferSuccess: 'تمت محاكاة التحويل محليًا. لم يتلقَّ أي مستخدم آخر رموزًا.',
            sentTo: 'تحويل تجريبي إلى'
        },
        zh: {
            demoWalletBadge: '演示钱包',
            walletTitle: '你的 STAKEAI 钱包',
            logout: '退出',
            walletDemoNotice: '仅供预览：这是临时本地模拟。不存在真实账户、代币余额、区块链交易或用户间转账。',
            availableBalance: '可用演示余额',
            notRealFunds: '这是示例余额，不是真实资产。',
            receiveTitle: '接收（演示）',
            yourDemoId: '你的临时演示 ID',
            sendTitle: '发送 STAKEAI（演示）',
            sendDescription: '试用模拟转账。它只会更改此浏览器中的示例余额。',
            recipientId: '收款方演示 ID',
            transferAmount: '金额（STAKEAI）',
            sendButton: '模拟转账',
            historyTitle: '最近演示活动',
            noTransactions: '暂无演示转账。',
            demoSessionStarted: '演示会话已开始。未创建账户，也未保存登录信息。',
            transferInvalid: '请输入大于零的有效金额。',
            transferInsufficient: '金额超过演示余额。',
            transferSuccess: '已在本地模拟转账。其他用户并未收到代币。',
            sentTo: '模拟转账至'
        },
        ja: {
            demoWalletBadge: 'デモウォレット',
            walletTitle: 'STAKEAIウォレット',
            logout: 'ログアウト',
            walletDemoNotice: 'プレビューのみ：一時的なローカルシミュレーションです。実際のアカウント、トークン残高、ブロックチェーン取引、ユーザー間送金はありません。',
            availableBalance: '利用可能なデモ残高',
            notRealFunds: 'これはサンプル残高であり、実際の資産ではありません。',
            receiveTitle: '受け取り（デモ）',
            yourDemoId: '一時的なデモID',
            sendTitle: 'STAKEAIを送る（デモ）',
            sendDescription: '送金シミュレーションを試せます。このブラウザーのサンプル残高のみが変わります。',
            recipientId: '受取人のデモID',
            transferAmount: '数量（STAKEAI）',
            sendButton: '送金をシミュレート',
            historyTitle: '最近のデモ履歴',
            noTransactions: 'デモ送金はまだありません。',
            demoSessionStarted: 'デモセッションを開始しました。アカウントは作成されず、ログイン情報も保存されません。',
            transferInvalid: '0より大きい有効な数量を入力してください。',
            transferInsufficient: '数量がデモ残高を超えています。',
            transferSuccess: 'ローカルで送金をシミュレートしました。他のユーザーはトークンを受け取っていません。',
            sentTo: 'シミュレート送金先'
        }
};

Object.keys(walletTranslations).forEach((language) => {
        Object.assign(translations[language], walletTranslations[language]);
});

const accountCopy = {
    en: {
        authNotice: 'Account access requires the STAKEAI API and a verified email.',
        packageAuthRequired: 'Create an account, verify your email, and log in before choosing a package.',
        referralCodeLabel: 'Referral code (optional)',
        passwordTooShort: 'Use a password of at least 12 characters.',
        registrationSent: 'If eligible, a verification email has been sent. Verify your email before logging in.',
        loginSuccess: 'Signed in.',
        emailServiceUnavailable: 'Account registration is unavailable because email verification is not configured.',
        invalidCredentials: 'Email or password is incorrect, or the email has not been verified.',
        apiUnavailable: 'The STAKEAI API is unavailable. Your request was not completed.',
        apiRateLimited: 'Too many requests were made. Please wait a minute and try again.',
        emailVerified: 'Email verified. You can now log in.',
        emailVerificationFailed: 'This verification link is invalid or expired.',
        accountReferralsTitle: 'Your referral code and link',
        referredUsersTitle: 'People you referred',
        noReferredUsers: 'No referrals yet.',
        yourReferralCode: 'Your referral code',
        copyReferralCode: 'Copy code',
        accountReferralsNotice: 'Referral commissions are not active and no payouts are implemented.',
        contactTitle: 'Contact information',
        copyReferralLink: 'Copy link',
        directReferralsCount: 'Direct referrals:',
        referralCodeCopied: 'Referral code copied.',
        referralCopied: 'Referral link copied.',
        taskTelegramTitle: 'Join the Telegram group',
        taskTelegramDescription: 'Join the official STAKEAI Telegram group.',
        taskXTitle: 'Follow and repost on X',
        taskXDescription: 'Follow the official account and repost the linked post.',
        taskFacebookTitle: 'Follow the Facebook page',
        taskFacebookDescription: 'Follow the official STAKEAI Facebook page.',
        taskReward: 'Reward: 10 USDT after admin approval',
        taskProofLabel: 'Your social username or evidence link',
        taskOpenLink: 'Open task link',
        taskFollowLink: 'Open X account',
        taskPostLink: 'Open X post to repost',
        taskSubmit: 'Submit for review',
        taskProgramNotice: 'Submit your social username or evidence link. Approved tasks add 10 USDT to your platform balance after admin review. Social actions are not verified automatically, and no blockchain payment is sent.',
        taskLoginRequired: 'Log in to submit this task.',
        taskLinkMissing: 'Task links are not configured yet.',
        taskStatusAvailable: 'Not submitted',
        taskStatusPending: 'Waiting for admin review',
        taskStatusApproved: 'Approved · 10 USDT added to your platform balance',
        taskStatusRejected: 'Rejected · update your evidence and submit again',
        taskSubmittedSuccess: 'Task submitted for admin review.',
        taskAlreadySubmitted: 'This task has already been submitted.',
        taskSubmitFailed: 'Could not submit this task.',
        invalidReferralCode: 'That referral code is invalid. Check the link and try again.',
        adminPanelLink: 'Open admin panel',
        referralsPageLink: 'My referrals',
        firstName: 'First name',
        lastName: 'Last name',
        trc20Address: 'USDT TRC-20 address',
        nameRequired: 'Enter a valid first and last name.',
        username: 'Username',
        invalidUsername: 'Username must be 3-20 characters: letters, digits and _ only.',
        usernameTaken: 'This username is already taken.',
        trc20AddressInvalid: 'Enter a valid TRON TRC-20 address.',
        balanceManagementNotice: 'USDT/STKAI are platform-recorded balances; BTC/ETH/BNB are spot balances. Estimated values are indicative; STKAI uses the app reference price.',
        accountAssetBalances: 'Asset balances',
        accountEstimatedValue: 'Estimated value',
        usdtBalanceLabel: 'USDT balance',
        stakeaiBalanceLabel: 'STKAI balance',
        transferTitle: 'Request an internal transfer',
        transferNotice: 'BTC, ETH, and BNB requests move spot balances only after administrator approval. They are not blockchain transfers.',
        transferRecipientTrc20: 'Recipient USDT TRC-20 address',
        transferRecipientReferral: 'Recipient account referral code',
        transferAsset: 'Asset',
        transferAmount: 'Amount',
        submitTransferRequest: 'Confirm withdrawal',
        transferHistory: 'Transfer history',
        noTransferHistory: 'No transfer requests yet.',
        noPendingApproval: 'No transfer requests are waiting for approval.',
        transferRequestCreated: 'Transfer request sent to the administrator for approval.',
        transferRequestFailed: 'Could not submit the transfer request.',
        transferRecipientNotFound: 'No active, verified account was found for that address or referral code.',
        transferRecipientAmbiguous: 'That TRC-20 address is registered to more than one account. Contact an administrator.',
        invalidTransferRecipient: 'Enter a valid recipient TRC-20 address or account referral code.',
        cannotTransferToSelf: 'You cannot transfer to your own account.',
        insufficientTransferBalance: 'Your available balance is not enough for this transfer.',
        invalidTransferAmount: 'Enter a valid positive amount with the supported decimal precision.',
        transferStatusPending: 'Pending approval',
        transferStatusApproved: 'Approved',
        transferStatusRejected: 'Rejected',
        transferDirectionSent: 'To',
        transferDirectionReceived: 'From',
        transferBalanceMayChange: 'Your balance can change while the request waits for approval; the administrator will recheck it before approval.',
        navSimulation: 'Buy / Sell',
        paperBadge: 'Live market',
        paperTitle: 'BUY / SELL',
        paperDescription: 'BUY / SELL',
        paperWarning: 'Simulation only. Orders use virtual funds and never connect to a wallet or exchange.',
        paperMarkets: 'Live market prices',
        paperLoading: 'Loading market data…',
        paperMarketError: 'Market data is temporarily unavailable.',
        paperLiveMarketsUnavailable: 'Live BTC, ETH, and BNB prices are unavailable; the STKAI reference remains visible.',
        paperFixedReference: 'Fixed reference',
        paperStkaiNotice: 'STKAI is displayed at a fixed 1.00 USDT app reference price. This is not an exchange quote or a redemption guarantee.',
        paperUpdated: 'Updated {time}',
        paperOrderForm: 'Place an order',
        paperAsset: 'Asset to buy or sell',
        paperPayWith: 'Payment asset',
        paperQuoteHelp: 'USDT is always available. STKAI also supports BTC, ETH, and BNB.',
        paperFeeRate: 'Gas fees · 0.5%',
        paperSide: 'Side',
        paperBuy: 'Buy',
        paperSell: 'Sell',
        paperQuantity: 'Quantity',
        paperQuantityPlaceholder: 'e.g. 0.01',
        paperPlaceOrder: 'Place order',
        paperOrderNote: 'Please log in first to trade.',
        paperFeeLabel: 'Commission',
        paperAvailableCash: 'Cash balance',
        paperEstimatedTotal: 'Estimated portfolio value',
        paperWalletBalances: 'Wallet balances',
        paperAssetBalance: 'Balance',
        paperEstimatedValue: 'Estimated value',
        paperNoPositions: 'No open positions yet.',
        paperRecentTrades: 'Recent orders',
        paperNoTrades: 'No orders yet.',
        paperLoginRequired: 'Log in to view your portfolio.',
        paperLoginButton: 'Log in',
        paperOrderSuccess: 'Order completed.',
        paperInsufficientCash: 'Not enough cash for this order.',
        paperInsufficientPosition: 'You do not have enough of this asset to sell.',
        paperInsufficientQuotePosition: 'You do not have enough of the selected payment asset.',
        paperInsufficientTreasuryInventory: 'The admin pool has insufficient inventory for this asset.',
        paperInsufficientTreasuryQuote: 'The admin pool has insufficient balance to pay this sale.',
        paperBelowMinimum: 'The order value is below the minimum.',
        paperOrderFailed: 'Could not complete the order.',
        paperPortfolioFailed: 'Could not load the portfolio.',
        paperStakingTitle: 'Stake',
        paperStakingNotice: 'Demo only. Coins and rewards are virtual; the listed rates are simulations, not promised returns.',
        paperStakeAsset: 'Coin to stake',
        paperStakeTerm: 'Term and rate',
        paperStakeOffer7: '7 days · 5%',
        paperStakeOffer30: '30 days · 25%',
        paperStakeOffer180: '180 days · 200%',
        paperStakeAmount: 'Amount',
        paperStakeReward: 'Reward',
        paperStakeSubmit: 'Stake',
        paperStakePreview: 'At maturity: {amount} {asset} principal + {reward} {asset} reward.',
        paperStakeNoPositions: 'No stakes yet.',
        paperStakeActive: 'Locked until {date}',
        paperStakeClaim: 'Claim principal + reward',
        paperStakeClaimed: 'Claimed',
        paperStakeWaiting: 'Locked',
        paperStakeSuccess: 'Stake created. Your selected balance is locked until maturity.',
        paperStakeClaimSuccess: 'Principal and reward added to your portfolio.',
        paperStakeLoginRequired: 'Log in to create or claim stakes.',
        paperStakeInsufficient: 'Not enough available balance for this stake.',
        paperStakeLocked: 'This stake is still locked.',
        paperStakeBelowMinimum: 'The amount is too small to earn a non-zero reward.',
        paperStakeFailed: 'Could not process the stake.',
        paperStakeClaimFailed: 'Could not claim this stake.'
    },
    tr: {
        authNotice: 'Hesap erişimi için STAKEAI API’si ve doğrulanmış e-posta gerekir.',
        packageAuthRequired: 'Paket seçmeden önce kayıt olun, e-postanızı doğrulayın ve giriş yapın.',
        referralCodeLabel: 'Referans kodu (isteğe bağlı)',
        passwordTooShort: 'En az 12 karakterli bir parola kullanın.',
        registrationSent: 'Uygunsa doğrulama e-postası gönderildi. Giriş yapmadan önce e-postanızı doğrulayın.',
        loginSuccess: 'Giriş yapıldı.',
        emailServiceUnavailable: 'E-posta doğrulama ayarlanmadığından kayıt kullanılamıyor.',
        invalidCredentials: 'E-posta veya parola hatalı ya da e-posta doğrulanmamış.',
        apiUnavailable: 'STAKEAI API’sine ulaşılamıyor. İsteğiniz tamamlanmadı.',
        apiRateLimited: 'Çok fazla istek gönderildi. Lütfen bir dakika bekleyip tekrar deneyin.',
        emailVerified: 'E-posta doğrulandı. Artık giriş yapabilirsiniz.',
        emailVerificationFailed: 'Doğrulama bağlantısı geçersiz veya süresi dolmuş.',
        accountReferralsTitle: 'Referans kodunuz ve bağlantınız',
        referredUsersTitle: 'Davet ettiğiniz kişiler',
        noReferredUsers: 'Henüz referansınız yok.',
        yourReferralCode: 'Referans kodunuz',
        copyReferralCode: 'Kodu kopyala',
        accountReferralsNotice: 'Referans komisyonları etkin değil ve ödeme sistemi uygulanmadı.',
        contactTitle: 'İletişim bilgileri',
        copyReferralLink: 'Bağlantıyı kopyala',
        directReferralsCount: 'Doğrudan referanslar:',
        referralCodeCopied: 'Referans kodu kopyalandı.',
        referralCopied: 'Referans bağlantısı kopyalandı.',
        taskTelegramTitle: 'Telegram grubuna katıl',
        taskTelegramDescription: 'STAKEAI resmi Telegram grubuna katılın.',
        taskXTitle: 'X hesabını takip et ve gönderiyi yeniden paylaş',
        taskXDescription: 'Resmi hesabı takip edin ve bağlantıdaki gönderiyi yeniden paylaşın.',
        taskFacebookTitle: 'Facebook sayfasını takip et',
        taskFacebookDescription: 'STAKEAI resmi Facebook sayfasını takip edin.',
        taskReward: 'Ödül: Yönetici onayından sonra 10 USDT',
        taskProofLabel: 'Sosyal medya kullanıcı adınız veya kanıt bağlantınız',
        taskOpenLink: 'Görev bağlantısını aç',
        taskFollowLink: 'X hesabını aç',
        taskPostLink: 'Yeniden paylaşılacak X gönderisini aç',
        taskSubmit: 'İncelemeye gönder',
        taskProgramNotice: 'Sosyal medya kullanıcı adınızı veya kanıt bağlantınızı gönderin. Yönetici incelemesinden sonra onaylanan her görev platform bakiyenize 10 USDT ekler. Sosyal medya işlemleri otomatik doğrulanmaz ve blokzincire ödeme gönderilmez.',
        taskLoginRequired: 'Görev göndermek için giriş yapın.',
        taskLinkMissing: 'Görev bağlantıları henüz yapılandırılmadı.',
        taskStatusAvailable: 'Henüz gönderilmedi',
        taskStatusPending: 'Yönetici incelemesi bekleniyor',
        taskStatusApproved: 'Onaylandı · platform bakiyenize 10 USDT eklendi',
        taskStatusRejected: 'Reddedildi · kanıtınızı güncelleyip yeniden gönderebilirsiniz',
        taskSubmittedSuccess: 'Görev yönetici incelemesine gönderildi.',
        taskAlreadySubmitted: 'Bu görev zaten gönderilmiş.',
        taskSubmitFailed: 'Görev gönderilemedi.',
        invalidReferralCode: 'Referans kodu geçersiz. Bağlantıyı kontrol edip tekrar deneyin.',
        adminPanelLink: 'Yönetim panelini aç',
        referralsPageLink: 'Referanslarım',
        firstName: 'Ad',
        lastName: 'Soyad',
        trc20Address: 'USDT TRC-20 adresi',
        nameRequired: 'Geçerli ad ve soyad girin.',
        username: 'Kullanıcı adı',
        invalidUsername: 'Kullanıcı adı 3-20 karakter olmalı; yalnızca harf, rakam ve _ kullanılabilir.',
        usernameTaken: 'Bu kullanıcı adı alınmış.',
        trc20AddressInvalid: 'Geçerli bir TRON TRC-20 adresi girin.',
        balanceManagementNotice: 'USDT/STKAI platformda kaydedilir; BTC/ETH/BNB spot bakiyeleridir. Tahmini değerler gösterge niteliğindedir; STKAI uygulama referans fiyatını kullanır.',
        accountAssetBalances: 'Varlık bakiyeleri',
        accountEstimatedValue: 'Tahmini değer',
        usdtBalanceLabel: 'USDT bakiyesi',
        stakeaiBalanceLabel: 'STKAI bakiyesi',
        transferTitle: 'Kullanıcılar arası transfer talebi',
        transferNotice: 'BTC, ETH ve BNB talepleri yalnızca spot bakiyelerini yönetici onayından sonra aktarır. Blokzincir transferi yapılmaz.',
        transferRecipientTrc20: 'Alıcının USDT TRC-20 adresi',
        transferRecipientReferral: 'Alıcının hesap referans kodu',
        transferAsset: 'Varlık',
        transferAmount: 'Miktar',
        submitTransferRequest: 'Çekimi onayla',
        transferHistory: 'Transfer geçmişi',
        noTransferHistory: 'Henüz transfer talebi yok.',
        noPendingApproval: 'Onay bekleyen transfer talebi yok.',
        transferRequestCreated: 'Transfer talebi yönetici onayına gönderildi.',
        transferRequestFailed: 'Transfer talebi gönderilemedi.',
        transferRecipientNotFound: 'Bu adres veya referans koduna ait etkin ve doğrulanmış hesap bulunamadı.',
        transferRecipientAmbiguous: 'Bu TRC-20 adresi birden fazla hesaba kayıtlı. Yöneticiyle iletişime geçin.',
        invalidTransferRecipient: 'Geçerli bir alıcı TRC-20 adresi veya hesap referans kodu girin.',
        cannotTransferToSelf: 'Kendi hesabınıza transfer yapamazsınız.',
        insufficientTransferBalance: 'Kullanılabilir bakiyeniz bu transfer için yetersiz.',
        invalidTransferAmount: 'Desteklenen ondalık hassasiyetinde geçerli ve pozitif bir miktar girin.',
        transferStatusPending: 'Onay bekliyor',
        transferStatusApproved: 'Onaylandı',
        transferStatusRejected: 'Reddedildi',
        transferDirectionSent: 'Alıcı',
        transferDirectionReceived: 'Gönderen',
        transferBalanceMayChange: 'Talep onay beklerken bakiyeniz değişebilir; yönetici onay öncesinde bakiyeyi tekrar kontrol eder.',
        navSimulation: 'Al / Sat',
        paperBadge: 'Güncel piyasa',
        paperTitle: 'AL / SAT',
        paperDescription: 'AL / SAT',
        paperWarning: 'Yalnızca simülasyon. Emirler bakiye kullanır; cüzdana veya borsaya bağlanmaz.',
        paperMarkets: 'Canlı piyasa fiyatları',
        paperLoading: 'Piyasa verileri yükleniyor…',
        paperMarketError: 'Piyasa verilerine şu anda ulaşılamıyor.',
        paperLiveMarketsUnavailable: 'Canlı BTC, ETH ve BNB fiyatlarına ulaşılamıyor; STKAI referans fiyatı gösterilmeye devam ediyor.',
        paperFixedReference: 'Sabit referans',
        paperStkaiNotice: 'STKAI uygulamada sabit 1,00 USDT referans fiyatıyla gösterilir. Bu, borsa fiyatı veya geri alım garantisi değildir.',
        paperUpdated: 'Güncelleme: {time}',
        paperOrderForm: 'Emir verin',
        paperAsset: 'Alınacak / satılacak varlık',
        paperPayWith: 'Ödeme varlığı',
        paperQuoteHelp: 'USDT her zaman kullanılabilir. STKAI için BTC, ETH ve BNB de seçilebilir.',
        paperFeeRate: 'Gaz ücretleri · %0,5',
        paperSide: 'İşlem yönü',
        paperBuy: 'Al',
        paperSell: 'Sat',
        paperQuantity: 'Miktar',
        paperQuantityPlaceholder: 'örn. 0.01',
        paperPlaceOrder: 'Emir ver',
        paperOrderNote: 'İşlem yapmak için lütfen önce giriş yapın.',
        paperFeeLabel: 'Komisyon',
        paperAvailableCash: 'Nakit bakiye',
        paperEstimatedTotal: 'Tahmini portföy değeri',
        paperWalletBalances: 'Cüzdan bakiyeleri',
        paperAssetBalance: 'Bakiye',
        paperEstimatedValue: 'Tahmini değer',
        paperNoPositions: 'Henüz açık pozisyon yok.',
        paperRecentTrades: 'Son emirler',
        paperNoTrades: 'Henüz emir yok.',
        paperLoginRequired: 'Portföyünüzü görmek için giriş yapın.',
        paperLoginButton: 'Giriş yap',
        paperOrderSuccess: 'Emir tamamlandı.',
        paperInsufficientCash: 'Bu emir için nakit bakiyesi yetersiz.',
        paperInsufficientPosition: 'Satmak için bu varlıktan yeterli miktarınız yok.',
        paperInsufficientQuotePosition: 'Seçilen ödeme varlığından yeterli bakiyeniz yok.',
        paperInsufficientTreasuryInventory: 'Yönetici havuzunda bu varlıktan yeterli miktar yok.',
        paperInsufficientTreasuryQuote: 'Yönetici havuzunda bu satışı karşılayacak bakiye yok.',
        paperBelowMinimum: 'Emir tutarı simülatör alt limitinin altında.',
        paperOrderFailed: 'Emir tamamlanamadı.',
        paperPortfolioFailed: 'Portföy yüklenemedi.',
        paperStakingTitle: 'Stake yap',
        paperStakingNotice: 'Yalnızca demo. Coinler ve ödüller sanaldır; oranlar simülasyondur, getiri garantisi değildir.',
        paperStakeAsset: 'Stake edilecek coin',
        paperStakeTerm: 'Vade ve oran',
        paperStakeOffer7: '7 gün · %5',
        paperStakeOffer30: '30 gün · %25',
        paperStakeOffer180: '180 gün · %200',
        paperStakeAmount: 'Miktar',
        paperStakeReward: 'Ödül',
        paperStakeSubmit: 'Stake et',
        paperStakePreview: 'Vade sonunda: {amount} {asset} anapara + {reward} {asset} ödül.',
        paperStakeNoPositions: 'Henüz stake yok.',
        paperStakeActive: '{date} tarihine kadar kilitli',
        paperStakeClaim: 'Anapara + ödülü al',
        paperStakeClaimed: 'Alındı',
        paperStakeWaiting: 'Kilitli',
        paperStakeSuccess: 'Stake oluşturuldu. Seçilen bakiyeniz vade sonuna kadar kilitlendi.',
        paperStakeClaimSuccess: 'Anapara ve ödül portföyünüze eklendi.',
        paperStakeLoginRequired: 'Stake oluşturmak veya almak için giriş yapın.',
        paperStakeInsufficient: 'Bu stake için yeterli kullanılabilir bakiye yok.',
        paperStakeLocked: 'Bu stake hâlâ kilitli.',
        paperStakeBelowMinimum: 'Miktar, sıfırdan büyük ödül için çok düşük.',
        paperStakeFailed: 'Stake işlemi yapılamadı.',
        paperStakeClaimFailed: 'Stake alınamadı.'
    }
};
Object.entries(accountCopy).forEach(([language, copy]) => Object.assign(translations[language], copy));
const packageOfferLabels = {
    en: ['7-Day Stake', '30-Day Stake', '180-Day Stake', 'total over 7 days', 'total over 30 days', 'total over 180 days'],
    tr: ['7 Günlük Stake', '30 Günlük Stake', '180 Günlük Stake', '7 gün toplamı', '30 gün toplamı', '180 gün toplamı'],
    es: ['Stake de 7 días', 'Stake de 30 días', 'Stake de 180 días', 'total en 7 días', 'total en 30 días', 'total en 180 días'],
    fr: ['Stake de 7 jours', 'Stake de 30 jours', 'Stake de 180 jours', 'total sur 7 jours', 'total sur 30 jours', 'total sur 180 jours'],
    de: ['7-Tage-Stake', '30-Tage-Stake', '180-Tage-Stake', 'gesamt über 7 Tage', 'gesamt über 30 Tage', 'gesamt über 180 Tage'],
    pt: ['Stake de 7 dias', 'Stake de 30 dias', 'Stake de 180 dias', 'total em 7 dias', 'total em 30 dias', 'total em 180 dias'],
    it: ['Stake di 7 giorni', 'Stake di 30 giorni', 'Stake di 180 giorni', 'totale in 7 giorni', 'totale in 30 giorni', 'totale in 180 giorni'],
    ru: ['Стейкинг на 7 дней', 'Стейкинг на 30 дней', 'Стейкинг на 180 дней', 'итого за 7 дней', 'итого за 30 дней', 'итого за 180 дней'],
    ar: ['تجميد لمدة 7 أيام', 'تجميد لمدة 30 يومًا', 'تجميد لمدة 180 يومًا', 'الإجمالي خلال 7 أيام', 'الإجمالي خلال 30 يومًا', 'الإجمالي خلال 180 يومًا'],
    zh: ['7 天质押', '30 天质押', '180 天质押', '7 天总计', '30 天总计', '180 天总计'],
    ja: ['7日間ステーク', '30日間ステーク', '180日間ステーク', '7日間の合計', '30日間の合計', '180日間の合計']
};
Object.entries(packageOfferLabels).forEach(([language, labels]) => {
    Object.assign(translations[language], {
        bronzeTerm: labels[0],
        silverTerm: labels[1],
        goldTerm: labels[2],
        bronzePercent: language === 'tr' ? '%5' : '5%',
        silverPercent: language === 'tr' ? '%25' : '25%',
        goldPercent: language === 'tr' ? '%200' : '200%',
        bronzePeriod: labels[3],
        silverPeriod: labels[4],
        goldPeriod: labels[5],
        bronzeRate: `${labels[0]} (${language === 'tr' ? '%5' : '5%'})`,
        silverRate: `${labels[1]} (${language === 'tr' ? '%25' : '25%'})`,
        goldRate: `${labels[2]} (${language === 'tr' ? '%200' : '200%'})`
    });
});
Object.keys(translations).forEach((language) => {
    for (const [key, value] of Object.entries(translations.en)) {
        if (typeof translations[language][key] !== 'string') translations[language][key] = value;
    }
});

const languageSelect = document.getElementById('languageSelect');
const calcAmount = document.getElementById('calcAmount');
const calcPackage = document.getElementById('calcPackage');
const weeklyReturn = document.getElementById('weeklyReturn');
const monthlyReturn = document.getElementById('monthlyReturn');
const stakingDialog = document.getElementById('stakingDialog');
const authDialog = document.getElementById('authDialog');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubmit = document.getElementById('authSubmit');
const authSwitchPrompt = document.getElementById('authSwitchPrompt');
const authSwitch = document.getElementById('authSwitch');
const authStatus = document.getElementById('authStatus');
const confirmPasswordRow = document.getElementById('confirmPasswordRow');
const authConfirmPassword = document.getElementById('authConfirmPassword');
const referralCodeRow = document.getElementById('referralCodeRow');
const registrationRows = [
    ['firstNameRow', 'authFirstName'],
    ['usernameRow', 'authUsername'],
    ['lastNameRow', 'authLastName'],
    ['trc20AddressRow', 'authTrc20Address']
].map(([rowId, inputId]) => ({
    row: document.getElementById(rowId),
    input: document.getElementById(inputId)
}));
const accountDashboard = document.getElementById('accountDashboard');
let authMode = 'login';
let accountEmail = '';
let activeRequest = false;
let twoFactorChallenge = false;

async function apiRequest(url, options = {}) {
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

function currentCopy() {
    return translations[document.documentElement.lang] || translations.en;
}

function renderTaskStatus(card, status) {
    const statusElement = card.querySelector('[data-task-status]');
    const button = card.querySelector('[data-submit-task]');
    const proof = card.querySelector('[data-task-proof]');
    statusElement.textContent = currentCopy()[`taskStatus${status[0].toUpperCase()}${status.slice(1)}`]
        || currentCopy().taskStatusAvailable;
    const locked = status === 'pending' || status === 'approved';
    button.disabled = locked || card.dataset.configured !== 'true';
    proof.disabled = locked || card.dataset.configured !== 'true';
}

async function refreshTaskCards() {
    try {
        const { tasks } = await apiRequest('/api/tasks');
        for (const task of tasks) {
            const card = document.querySelector(`[data-task-card="${task.key}"]`);
            if (!card) continue;
            card.dataset.configured = String(task.configured);
            const links = card.querySelectorAll('[data-task-link]');
            links.forEach((link) => {
                const index = Number(link.dataset.taskLinkIndex || 0);
                const url = task.links[index] || '';
                link.href = url || '#';
                link.hidden = !url;
                link.classList.toggle('hidden', !url);
                link.rel = 'noopener noreferrer';
            });
            const statusElement = card.querySelector('[data-task-status]');
            if (!task.configured) {
                statusElement.textContent = currentCopy().taskLinkMissing;
                card.querySelector('[data-submit-task]').disabled = true;
                card.querySelector('[data-task-proof]').disabled = true;
            } else {
                renderTaskStatus(card, 'available');
            }
        }

        let accountTasks;
        try {
            accountTasks = await apiRequest('/api/account/tasks');
        } catch (error) {
            if (error.status !== 401) throw error;
            for (const task of tasks) {
                const card = document.querySelector(`[data-task-card="${task.key}"]`);
                if (card && task.configured) {
                    card.querySelector('[data-task-status]').textContent = currentCopy().taskLoginRequired;
                }
            }
            return;
        }
        for (const task of accountTasks.tasks) {
            const card = document.querySelector(`[data-task-card="${task.key}"]`);
            if (!card || !task.configured) continue;
            const proof = card.querySelector('[data-task-proof]');
            proof.value = task.proof;
            renderTaskStatus(card, task.status);
        }
    } catch (error) {
        console.error('Could not load social task settings or account submissions.', error);
        document.querySelectorAll('[data-task-status]').forEach((element) => {
            element.textContent = currentCopy().taskSubmitFailed;
        });
    }
}

function getSavedLanguage() {
    try {
        return localStorage.getItem('stakeai-language');
    } catch (error) {
        console.warn('Could not read the saved language preference.', error);
        return null;
    }
}

function saveLanguage(language) {
    try {
        localStorage.setItem('stakeai-language', language);
    } catch (error) {
        console.warn('Could not save the language preference.', error);
    }
}

function detectLanguage() {
    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const browserLanguage of browserLanguages) {
        const language = browserLanguage.toLowerCase().split('-')[0];
        if (Object.hasOwn(translations, language)) return language;
    }
    return 'en';
}

function setLanguage(language) {
    const selectedLanguage = translations[language] ? language : 'en';
    const copy = translations[selectedLanguage];
    const translated = (key) => copy[key] || translations.en[key] || key;

    document.documentElement.lang = selectedLanguage;
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.title = copy.title;
    document.querySelector('meta[name="description"]').content = copy.description;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        element.textContent = translated(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
        element.setAttribute('aria-label', translated(element.dataset.i18nAria));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        element.setAttribute('placeholder', translated(element.dataset.i18nPlaceholder));
    });
    if (languageSelect) {
        languageSelect.value = selectedLanguage;
        languageSelect.setAttribute('aria-label', copy.language);
        document.querySelector('label[for="languageSelect"]').textContent = copy.language;
    }

    setAuthMode(authMode, copy);
    updateTransferRecipientField();
    if (authStatus) authStatus.textContent = '';
    updateReturns();
}

if (languageSelect) {
    const savedLanguage = getSavedLanguage();
    const initialLanguage = Object.hasOwn(translations, savedLanguage) ? savedLanguage : detectLanguage();
    setLanguage(initialLanguage);
    languageSelect.addEventListener('change', () => {
        setLanguage(languageSelect.value);
        saveLanguage(languageSelect.value);
        void refreshPaperTrading();
        updatePaperStakePreview();
        if (!accountDashboard.hidden) void refreshAccountBalances();
    });
}

function setAuthMode(mode, copy = translations[document.documentElement.lang] || translations.en) {
    authMode = mode;
    twoFactorChallenge = false;
    if (!authTitle || !authSubmit || !authSwitchPrompt || !authSwitch) return;

    authTitle.textContent = copy[mode];
    authSubmit.textContent = copy[mode];
    authSwitchPrompt.textContent = copy[mode === 'login' ? 'noAccount' : 'haveAccount'];
    authSwitch.textContent = copy[mode === 'login' ? 'signup' : 'login'];
    authSwitch.dataset.authMode = mode === 'login' ? 'signup' : 'login';
    if (confirmPasswordRow && authConfirmPassword) {
        confirmPasswordRow.hidden = mode !== 'signup';
        authConfirmPassword.required = mode === 'signup';
        authConfirmPassword.setCustomValidity('');
    }
    if (referralCodeRow) referralCodeRow.hidden = mode !== 'signup';
    const factorRow = document.getElementById('authTwoFactorRow');
    const factorInput = document.getElementById('authTwoFactorCode');
    if (factorRow) factorRow.hidden = true;
    if (factorInput) {
        factorInput.required = false;
        factorInput.value = '';
    }
    document.getElementById('authEmail').closest('div').hidden = false;
    document.getElementById('authPassword').closest('div').hidden = false;
    authSwitch.hidden = false;
    authSwitchPrompt.hidden = false;
    registrationRows.forEach(({ row, input }) => {
        if (row) row.hidden = mode !== 'signup';
        if (input) input.required = mode === 'signup';
    });
    document.getElementById('authPassword')?.setAttribute(
        'autocomplete',
        mode === 'signup' ? 'new-password' : 'current-password'
    );
    if (authStatus) authStatus.textContent = '';
}

document.querySelectorAll('[data-auth-mode]').forEach((button) => {
    button.addEventListener('click', () => {
        const mode = button.dataset.authMode;
        setAuthMode(mode);
        if (authDialog && !authDialog.open) authDialog.showModal();
    });
});

if (new URLSearchParams(window.location.search).get('auth') === 'login' && authDialog && !authDialog.open) {
    setAuthMode('login');
    authDialog.showModal();
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`);
}

document.getElementById('closeAuthDialog')?.addEventListener('click', () => {
    authDialog?.close();
});

authDialog?.addEventListener('close', () => {
    authForm?.reset();
    authConfirmPassword?.setCustomValidity('');
    twoFactorChallenge = false;
    setAuthMode('login');
    if (authStatus) authStatus.textContent = '';
});

authForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (activeRequest) return;
    const copy = currentCopy();
    const password = document.getElementById('authPassword');
    const factorInput = document.getElementById('authTwoFactorCode');
    if (authMode === 'signup' && password.value !== authConfirmPassword.value) {
        authConfirmPassword.setCustomValidity(copy.passwordMismatch);
        authConfirmPassword.reportValidity();
        return;
    }
    if (authMode === 'signup' && password.value.length < 12) {
        authStatus.textContent = copy.passwordTooShort;
        return;
    }
    if (authMode === 'signup') {
        const formData = new FormData(authForm);
        const firstName = String(formData.get('firstName') || '').trim();
        const lastName = String(formData.get('lastName') || '').trim();
        const trc20Address = String(formData.get('trc20Address') || '').trim();
        if (!/^[A-Za-z0-9_]{3,20}$/.test(String(formData.get('username') || '').trim())) {
            authStatus.textContent = copy.invalidUsername;
            return;
        }
        if (!/^[\p{L}\p{M}][\p{L}\p{M} .'’-]{0,79}$/u.test(firstName)
            || !/^[\p{L}\p{M}][\p{L}\p{M} .'’-]{0,79}$/u.test(lastName)) {
            authStatus.textContent = copy.nameRequired;
            return;
        }
        if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(trc20Address)) {
            authStatus.textContent = copy.trc20AddressInvalid;
            return;
        }
    }
    activeRequest = true;
    authSubmit.disabled = true;
    try {
        const formData = new FormData(authForm);
        if (authMode === 'signup') {
            await apiRequest('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                    referralCode: formData.get('referralCode'),
                    firstName: formData.get('firstName'),
                    username: formData.get('username'),
                    lastName: formData.get('lastName'),
                    trc20Address: formData.get('trc20Address')
                })
            });
            authStatus.textContent = copy.registrationSent;
            return;
        }
        if (twoFactorChallenge) {
            await apiRequest('/api/auth/verify-2fa', {
                method: 'POST',
                body: JSON.stringify({ code: factorInput.value })
            });
        } else {
            const login = await apiRequest('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            });
            if (login.twoFactorRequired) {
                twoFactorChallenge = true;
                document.getElementById('authTwoFactorRow').hidden = false;
                factorInput.required = true;
                document.getElementById('authEmail').closest('div').hidden = true;
                password.closest('div').hidden = true;
                authSwitch.hidden = true;
                authSwitchPrompt.hidden = true;
                authTitle.textContent = copy.twoFactorTitle;
                authSubmit.textContent = copy.verifyTwoFactor || translations.en.verifyTwoFactor;
                authStatus.textContent = copy.loginTwoFactorPrompt;
                factorInput.focus();
                return;
            }
        }
        await showAuthenticatedDashboard();
        authDialog.close();
        authForm.reset();
        accountDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        const errorCopy = currentCopy();
        authStatus.textContent = error.status === 503
            ? errorCopy.emailServiceUnavailable
            : error.status === 401
                ? twoFactorChallenge ? errorCopy.invalidTwoFactorCode : errorCopy.invalidCredentials
            : error.status === 429
                ? errorCopy.apiRateLimited
                : error.message === 'invalid_referral_code'
                    ? errorCopy.invalidReferralCode
                : error.message === 'invalid_username'
                    ? errorCopy.invalidUsername
                : error.message === 'username_taken'
                    ? errorCopy.usernameTaken
                : error.message === 'invalid_name'
                    ? errorCopy.nameRequired
                : error.message === 'invalid_trc20_address'
                    ? errorCopy.trc20AddressInvalid
                : authMode === 'signup' && error.status === 400
                    ? errorCopy.passwordTooShort
            : errorCopy.apiUnavailable;
    } finally {
        activeRequest = false;
        authSubmit.disabled = false;
    }
});

function accountErrorMessage(error) {
    const copy = currentCopy();
    if (error.message === 'current_password_incorrect') return copy.invalidCurrentPassword;
    if (error.message === 'invalid_two_factor_code') return copy.invalidTwoFactorCode;
    if (error.message === 'email_already_in_use') return copy.emailAlreadyUsed;
    if (error.message === 'email_service_not_configured'
        || error.message === 'verification_email_unavailable') return copy.emailServiceUnavailable;
    if (error.message === 'invalid_name') return copy.invalidProfileName;
    if (error.message === 'two_factor_setup_required') return copy.setupTwoFactorFirst;
    if (error.message === 'two_factor_not_enabled') return copy.twoFactorNotEnabled;
    return copy.accountUpdateFailed;
}

let twoFactorSetupStarted = false;
let twoFactorSetupComplete = false;
function updateTwoFactorUi(enabled) {
    const copy = currentCopy();
    document.getElementById('twoFactorStatus').textContent = enabled
        ? copy.twoFactorEnabled
        : copy.twoFactorNotEnabled;
    document.getElementById('twoFactorStart').hidden = enabled || twoFactorSetupStarted;
    document.getElementById('twoFactorSetupForm').hidden = enabled || !twoFactorSetupStarted || twoFactorSetupComplete;
    document.getElementById('twoFactorPending').hidden = enabled || !document.getElementById('twoFactorSecret').textContent;
    document.getElementById('twoFactorDisableForm').hidden = !enabled;
    for (const id of ['emailChangeTwoFactorRow', 'passwordChangeTwoFactorRow']) {
        const row = document.getElementById(id);
        row.hidden = !enabled;
        row.querySelector('input').required = enabled;
    }
}

document.getElementById('profileForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('profileStatus');
    try {
        const result = await apiRequest('/api/account/profile', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        document.getElementById('profileFirstName').value = result.firstName;
        document.getElementById('profileLastName').value = result.lastName;
        status.textContent = currentCopy().profileSaved;
    } catch (error) {
        status.textContent = accountErrorMessage(error);
    }
});

document.getElementById('changeEmailForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('emailChangeStatus');
    const data = new FormData(form);
    try {
        await apiRequest('/api/account/change-email', {
            method: 'POST',
            body: JSON.stringify({
                email: data.get('email'),
                currentPassword: data.get('currentPassword'),
                twoFactorCode: data.get('twoFactorCode')
            })
        });
        status.textContent = currentCopy().emailVerificationSent;
        form.reset();
        document.getElementById('newAccountEmail').value = accountEmail;
    } catch (error) {
        status.textContent = accountErrorMessage(error);
    }
});

document.getElementById('changePasswordForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('passwordChangeStatus');
    const data = new FormData(form);
    if (data.get('newPassword') !== data.get('confirmPassword')) {
        status.textContent = currentCopy().passwordMismatch;
        return;
    }
    try {
        await apiRequest('/api/account/change-password', {
            method: 'POST',
            body: JSON.stringify({
                currentPassword: data.get('currentPassword'),
                newPassword: data.get('newPassword'),
                twoFactorCode: data.get('twoFactorCode')
            })
        });
        form.reset();
        updateTwoFactorUi(document.getElementById('twoFactorDisableForm').hidden === false);
        status.textContent = currentCopy().passwordChanged;
    } catch (error) {
        status.textContent = accountErrorMessage(error);
    }
});

document.getElementById('twoFactorStart')?.addEventListener('click', () => {
    twoFactorSetupStarted = true;
    twoFactorSetupComplete = false;
    updateTwoFactorUi(false);
    document.querySelector('#twoFactorSetupForm input[name="password"]').focus();
});

document.getElementById('twoFactorSetupForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('twoFactorActionStatus');
    try {
        const result = await apiRequest('/api/account/2fa/setup', {
            method: 'POST',
            body: JSON.stringify({ password: new FormData(form).get('password') })
        });
        document.getElementById('twoFactorSecret').textContent = result.secret;
        const link = document.getElementById('twoFactorOtpAuth');
        link.href = result.otpauthUrl;
        link.textContent = result.otpauthUrl;
        twoFactorSetupComplete = true;
        document.getElementById('twoFactorSetupForm').hidden = true;
        document.getElementById('twoFactorPending').hidden = false;
        status.textContent = '';
    } catch (error) {
        status.textContent = accountErrorMessage(error);
    }
});

document.getElementById('twoFactorEnableForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('twoFactorActionStatus');
    const data = new FormData(form);
    try {
        const result = await apiRequest('/api/account/2fa/enable', {
            method: 'POST',
            body: JSON.stringify({ password: data.get('password'), code: data.get('code') })
        });
        document.getElementById('twoFactorRecoveryCodes').textContent = result.recoveryCodes.join('\n');
        document.getElementById('twoFactorRecovery').hidden = false;
        form.reset();
        twoFactorSetupStarted = false;
        updateTwoFactorUi(true);
        status.textContent = currentCopy().twoFactorEnabled;
    } catch (error) {
        status.textContent = accountErrorMessage(error);
    }
});

document.getElementById('twoFactorDisableForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('twoFactorActionStatus');
    const data = new FormData(form);
    try {
        await apiRequest('/api/account/2fa/disable', {
            method: 'POST',
            body: JSON.stringify({ password: data.get('password'), code: data.get('code') })
        });
        form.reset();
        document.getElementById('twoFactorRecovery').hidden = true;
        document.getElementById('twoFactorRecoveryCodes').textContent = '';
        document.getElementById('twoFactorSecret').textContent = '';
        document.getElementById('twoFactorOtpAuth').removeAttribute('href');
        document.getElementById('twoFactorOtpAuth').textContent = '';
        twoFactorSetupStarted = false;
        twoFactorSetupComplete = false;
        updateTwoFactorUi(false);
        status.textContent = currentCopy().twoFactorDisabled;
    } catch (error) {
        status.textContent = accountErrorMessage(error);
    }
});

authConfirmPassword?.addEventListener('input', () => {
    authConfirmPassword.setCustomValidity('');
});

function getNumberFormatter() {
    const language = document.documentElement.lang === 'en' ? 'en-US' : document.documentElement.lang;
    return new Intl.NumberFormat(language, { maximumFractionDigits: 2 });
}

function formatTokenBalance(value, decimals) {
    if (typeof value !== 'string' || !new RegExp(`^\\d+(?:\\.\\d{1,${decimals}})?$`).test(value)) {
        throw new Error('The server returned an invalid account balance.');
    }
    const [whole, fraction = ''] = value.split('.');
    const trimmedFraction = fraction.replace(/0+$/, '');
    const locale = document.documentElement.lang === 'en' ? 'en-US' : document.documentElement.lang;
    const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const decimalSeparator = new Intl.NumberFormat(locale).formatToParts(1.1)
        .find((part) => part.type === 'decimal')?.value || '.';
    return `${formatter.format(BigInt(whole))}${trimmedFraction ? `${decimalSeparator}${trimmedFraction}` : ''}`;
}

async function refreshAccountBalances() {
    try {
        const [balances, portfolioResult, marketsResult] = await Promise.allSettled([
            apiRequest('/api/account/summary'),
            apiRequest('/api/paper/portfolio'),
            apiRequest('/api/market/summary')
        ]);
        if (balances.status === 'rejected') throw balances.reason;
        document.getElementById('profileCurrentEmail').textContent = balances.value.email || accountEmail;
        document.getElementById('profileFirstName').value = balances.value.firstName || '';
        document.getElementById('profileLastName').value = balances.value.lastName || '';
        document.getElementById('newAccountEmail').value = balances.value.email || accountEmail;
        updateTwoFactorUi(Boolean(balances.value.twoFactorEnabled));
        document.getElementById('accountTrc20Address').textContent =
            typeof balances.value.trc20Address === 'string' && balances.value.trc20Address
                ? balances.value.trc20Address
                : currentCopy().trc20AddressMissing;
        const portfolioLoaded = portfolioResult.status === 'fulfilled';
        const paperPositions = portfolioLoaded
            ? new Map(portfolioResult.value.positions.map((position) => [position.asset, position.quantity]))
            : new Map();
        if (portfolioResult.status === 'rejected') {
            console.error('Could not load simulated asset balances for the account dashboard.', portfolioResult.reason);
        }
        const marketPrices = marketsResult.status === 'fulfilled'
            ? new Map(marketsResult.value.markets.map((market) => [market.asset, market.price]))
            : new Map();
        if (marketsResult.status === 'rejected') {
            console.error('Could not load asset prices for the account dashboard.', marketsResult.reason);
        }
        const assets = {
            USDT: { quantity: balances.value.usdtBalance, decimals: 6 },
            STKAI: { quantity: balances.value.stakeaiBalance, decimals: 18 },
            BTC: { quantity: paperPositions.get('BTC') ?? (portfolioLoaded ? '0' : null), decimals: 8 },
            ETH: { quantity: paperPositions.get('ETH') ?? (portfolioLoaded ? '0' : null), decimals: 8 },
            BNB: { quantity: paperPositions.get('BNB') ?? (portfolioLoaded ? '0' : null), decimals: 8 }
        };
        const elements = {
            USDT: ['accountUsdtBalance', 'accountUsdtValue'],
            STKAI: ['accountStakeaiBalance', 'accountStakeaiValue'],
            BTC: ['accountBtcBalance', 'accountBtcValue'],
            ETH: ['accountEthBalance', 'accountEthValue'],
            BNB: ['accountBnbBalance', 'accountBnbValue']
        };
        for (const [asset, { quantity, decimals }] of Object.entries(assets)) {
            const [balanceId, valueId] = elements[asset];
            document.getElementById(balanceId).textContent =
                quantity === null ? '—' : `${formatTokenBalance(quantity, decimals)} ${asset}`;
            const price = asset === 'USDT' ? '1' : marketPrices.get(asset);
            document.getElementById(valueId).textContent = quantity === null || price === undefined
                ? '—'
                : paperCurrency(Number(quantity) * Number(price));
        }
    } catch (error) {
        console.error('Could not load account balances.', error);
        document.getElementById('accountTrc20Address').textContent = '—';
        document.getElementById('accountUsdtBalance').textContent = '—';
        document.getElementById('accountStakeaiBalance').textContent = '—';
        for (const id of [
            'accountUsdtValue', 'accountStakeaiValue', 'accountBtcBalance',
            'accountBtcValue', 'accountEthBalance', 'accountEthValue',
            'accountBnbBalance', 'accountBnbValue'
        ]) {
            document.getElementById(id).textContent = '—';
        }
    }
}

const accountMenu = document.getElementById('accountMenu');
const profilePanel = document.getElementById('profilePanel');
const accountMenuButton = document.getElementById('accountMenuButton');

function setProfilePanel(open) {
    profilePanel.hidden = !open;
    accountMenuButton.setAttribute('aria-expanded', String(open));
}

let currentAvatar = '';

function renderAvatar(target, avatar, name) {
    target.textContent = '';
    if (avatar) {
        const image = document.createElement('img');
        image.src = avatar;
        image.alt = '';
        image.className = 'h-full w-full object-cover';
        target.append(image);
    } else {
        target.textContent = (name[0] || '?').toUpperCase();
    }
}

function setAccountMenu(visible, name = '', avatar = currentAvatar) {
    accountMenu.hidden = !visible;
    if (!visible) setProfilePanel(false);
    currentAvatar = avatar || '';
    document.getElementById('accountMenuName').textContent = name;
    renderAvatar(document.getElementById('accountAvatar'), currentAvatar, name);
    renderAvatar(document.getElementById('profileAvatarPreview'), currentAvatar, name);
}

function resizeAvatar(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            URL.revokeObjectURL(url);
            const size = 96;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const side = Math.min(image.width, image.height);
            canvas.getContext('2d').drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, size, size);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('invalid_image')); };
        image.src = url;
    });
}

async function saveAvatar(avatar, messageKey) {
    const status = document.getElementById('avatarStatus');
    try {
        await apiRequest('/api/account/avatar', { method: 'POST', body: JSON.stringify({ avatar }) });
        setAccountMenu(true, document.getElementById('accountMenuName').textContent, avatar);
        status.textContent = currentCopy()[messageKey];
    } catch {
        status.textContent = currentCopy().avatarError;
    }
}

document.getElementById('avatarInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    try {
        await saveAvatar(await resizeAvatar(file), 'avatarSaved');
    } catch {
        document.getElementById('avatarStatus').textContent = currentCopy().avatarError;
    }
});
document.getElementById('avatarRemove').addEventListener('click', () => saveAvatar('', 'avatarRemoved'));

accountMenuButton.addEventListener('click', () => setProfilePanel(profilePanel.hidden));
document.getElementById('profilePanelClose').addEventListener('click', () => setProfilePanel(false));
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setProfilePanel(false);
});
document.addEventListener('click', (event) => {
    if (!profilePanel.hidden && !profilePanel.contains(event.target) && !accountMenu.contains(event.target)) {
        setProfilePanel(false);
    }
});

async function showAuthenticatedDashboard(session = null) {
    session = session || await apiRequest('/api/auth/session');
    accountEmail = session.email;
    accountDashboard.hidden = false;
    document.getElementById('accountStatus').textContent = `${session.username || accountEmail} · ${currentCopy().loginSuccess}`;
    document.getElementById('authActions').hidden = true;
    setAccountMenu(true, session.username || accountEmail.split('@')[0], session.avatar || '');
    await refreshAccountBalances();
    await refreshTaskCards();
    try {
        const referral = await apiRequest('/api/referrals/summary');
        document.getElementById('referralCodeValue').textContent = referral.referralCode;
        const referralUrl = new URL('/', window.location.origin);
        referralUrl.searchParams.set('ref', referral.referralCode);
        document.getElementById('referralInviteLink').textContent = referralUrl.toString();
        document.getElementById('directReferralCount').textContent = String(referral.directReferrals);
        const referredUsersList = document.getElementById('referredUsersList');
        referredUsersList.replaceChildren();
        for (const referredUser of referral.referredUsers) {
            const item = document.createElement('li');
            item.className = 'rounded-lg bg-gray-900 px-3 py-2';
            item.textContent = referredUser.email;
            referredUsersList.append(item);
        }

        document.getElementById('noReferredUsers').hidden = referral.referredUsers.length > 0;
    } catch (error) {
        console.error('Could not load the referral summary.', error);
        document.getElementById('referralStatus').textContent = currentCopy().apiUnavailable;
    }
    await loadAccountTransferHistory();
    void refreshPaperTrading();
}

async function loadAccountTransferHistory() {
    try {
        const { transfers } = await apiRequest('/api/account/transfers');
        const list = document.getElementById('accountTransferHistory');
        list.replaceChildren();
        for (const transfer of transfers) {
            const item = document.createElement('li');
            item.className = 'flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-900 px-3 py-2';
            const detail = document.createElement('span');
            const decimals = transfer.asset === 'USDT' ? 6 : ['BTC', 'ETH', 'BNB'].includes(transfer.asset) ? 8 : 18;
            detail.textContent = `${transfer.direction === 'sent' ? currentCopy().transferDirectionSent : currentCopy().transferDirectionReceived} ${transfer.counterpartyEmail} · ${formatTokenBalance(transfer.amount, decimals)} ${transfer.asset}`;
            const state = document.createElement('span');
            state.className = 'text-xs text-amber-200';
            state.textContent = currentCopy()[`transferStatus${transfer.status[0].toUpperCase()}${transfer.status.slice(1)}`];
            item.append(detail, state);
            list.append(item);
        }
        document.getElementById('noTransferHistory').hidden = transfers.length > 0;
    } catch (error) {
        console.error('Could not load account transfer history.', error);
        document.getElementById('transferRequestStatus').textContent = currentCopy().apiUnavailable;
    }
}

function updateTransferRecipientField() {
    const asset = document.getElementById('transferAsset').value;
    const labelKey = asset === 'USDT' ? 'transferRecipientTrc20' : 'transferRecipientReferral';
    const input = document.getElementById('transferRecipientInfo');
    document.getElementById('transferRecipientLabel').textContent = currentCopy()[labelKey];
    input.value = '';
    input.maxLength = asset === 'USDT' ? 34 : 16;
    input.autocapitalize = asset === 'USDT' ? 'off' : 'characters';
    input.placeholder = asset === 'USDT' ? 'T…' : '16-character code';
    input.pattern = asset === 'USDT'
        ? 'T[1-9A-HJ-NP-Za-km-z]{33}'
        : '[A-Fa-f0-9]{16}';
    input.setAttribute('aria-label', currentCopy()[labelKey]);
}

document.getElementById('transferAsset')?.addEventListener('change', updateTransferRecipientField);
updateTransferRecipientField();

document.getElementById('transferRequestForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = document.getElementById('submitTransferRequest');
    const status = document.getElementById('transferRequestStatus');
    const data = new FormData(form);
    submitButton.disabled = true;
    status.textContent = '';
    try {
        await apiRequest('/api/account/transfers', {
            method: 'POST',
            body: JSON.stringify({
                recipientInfo: data.get('recipientInfo'),
                asset: data.get('asset'),
                amount: data.get('amount')
            })
        });
        status.textContent = currentCopy().transferRequestCreated;
        form.reset();
        updateTransferRecipientField();
        await loadAccountTransferHistory();
    } catch (error) {
        console.error('Could not submit account transfer request.', error);
        const messages = {
            transfer_recipient_not_found: 'transferRecipientNotFound',
            transfer_recipient_ambiguous: 'transferRecipientAmbiguous',
            invalid_transfer_recipient: 'invalidTransferRecipient',
            cannot_transfer_to_self: 'cannotTransferToSelf',
            insufficient_transfer_balance: 'insufficientTransferBalance',
            invalid_transfer_amount: 'invalidTransferAmount'
        };
        status.textContent = currentCopy()[messages[error.message] || 'transferRequestFailed'];
    } finally {
        submitButton.disabled = false;
    }
});

async function copyReferralValue(elementId, successMessage) {
    const value = document.getElementById(elementId).textContent;
    if (!value || value === '—') return;
    try {
        await navigator.clipboard.writeText(value);
        document.getElementById('referralStatus').textContent = successMessage;
    } catch (error) {
        console.error('Could not copy referral information.', error);
        document.getElementById('referralStatus').textContent = currentCopy().apiUnavailable;
    }
}

document.getElementById('copyReferralLink')?.addEventListener('click', () => {
    void copyReferralValue('referralInviteLink', currentCopy().referralCopied);
});
document.getElementById('copyReferralCode')?.addEventListener('click', () => {
    void copyReferralValue('referralCodeValue', currentCopy().referralCodeCopied);
});

const referralParameter = new URLSearchParams(window.location.search).get('ref');
if (referralParameter && /^[a-fA-F0-9]{16}$/.test(referralParameter)) {
    document.getElementById('signupReferralCode').value = referralParameter.toUpperCase();
}

document.getElementById('logoutDemo')?.addEventListener('click', async () => {
    try {
        await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Could not close the account session on the server.', error);
        document.getElementById('accountStatus').textContent = currentCopy().apiUnavailable;
        return;
    }
    accountEmail = '';
    const sessionStatus = document.getElementById('accountStatus');
    if (sessionStatus) sessionStatus.textContent = '';
    accountDashboard.hidden = true;
    document.getElementById('authActions').hidden = false;
    setAccountMenu(false);
    clearPaperPortfolio();
    void refreshPaperTrading();
});

async function initializePlatform() {
    document.getElementById('authActions').hidden = false;
    try {
        await showAuthenticatedDashboard();
    } catch (error) {
        if (error.status !== 401) console.error('Could not initialize the account session.', error);
    }
}
void initializePlatform();
window.setInterval(() => {
    if (!accountDashboard.hidden) {
        void refreshAccountBalances();
        void loadAccountTransferHistory();
        void refreshTaskCards();
    }
}, 30000);

const paperMarketCards = document.getElementById('paperMarketCards');
const paperOrderForm = document.getElementById('paperOrderForm');
const paperAssetSelect = document.getElementById('paperAsset');
const paperQuoteAssetSelect = document.getElementById('paperQuoteAsset');
const paperStakeForm = document.getElementById('paperStakeForm');
const paperStakeAmount = paperStakeForm.elements.amount;
const paperStakeAsset = paperStakeForm.elements.asset;
const paperStakeOffer = paperStakeForm.elements.offerId;
let paperMarkets = [];

function paperCurrency(value) {
    const locale = document.documentElement.lang === 'tr' ? 'tr-TR' : document.documentElement.lang;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 4
    }).format(Number(value));
}

function renderPaperMarkets() {
    paperMarketCards.replaceChildren();
    for (const market of paperMarkets) {
        const item = document.createElement('li');
        item.className = 'rounded-xl border border-gray-800 bg-gray-950/70 p-4';
        const heading = document.createElement('div');
        heading.className = 'flex items-center justify-between gap-2';
        const symbol = document.createElement('span');
        symbol.className = 'font-bold text-white';
        symbol.textContent = market.asset;
        const movement = document.createElement('span');
        if (market.priceType === 'fixed-reference') {
            movement.className = 'text-xs font-semibold text-amber-200';
            movement.textContent = currentCopy().paperFixedReference;
        } else {
            movement.className = `text-xs font-semibold ${market.changePercent >= 0 ? 'text-emerald-300' : 'text-rose-300'}`;
            movement.textContent = `${market.changePercent >= 0 ? '+' : ''}${new Intl.NumberFormat(
                document.documentElement.lang,
                { maximumFractionDigits: 2 }
            ).format(market.changePercent)}%`;
        }
        const price = document.createElement('p');
        price.className = 'mt-3 text-lg font-semibold text-gray-200';
        price.textContent = paperCurrency(market.price);
        heading.append(symbol, movement);
        item.append(heading, price);
        paperMarketCards.append(item);
    }
}

function renderPaperPortfolio(portfolio) {
    document.getElementById('paperCashBalance').textContent = paperCurrency(portfolio.cashBalance);
    const positionList = document.getElementById('paperPositionList');
    positionList.replaceChildren();
    const positionsByAsset = new Map(portfolio.positions.map((position) => [position.asset, position]));
    const marketsByAsset = new Map(paperMarkets.map((market) => [market.asset, market]));
    let totalValue = Number(portfolio.cashBalance);
    const assetNames = { BTC: 'Bitcoin', ETH: 'Ethereum', BNB: 'BNB', STKAI: 'STAKEAI' };
    const assetColors = {
        BTC: 'bg-amber-400/10 text-amber-200',
        ETH: 'bg-slate-400/10 text-slate-200',
        BNB: 'bg-yellow-400/10 text-yellow-200',
        STKAI: 'bg-emerald-400/10 text-emerald-200'
    };
    for (const asset of ['BTC', 'ETH', 'BNB', 'STKAI']) {
        const position = positionsByAsset.get(asset);
        const market = marketsByAsset.get(asset);
        const quantity = Number(position?.quantity || 0);
        if (market) totalValue += quantity * Number(market.price);
        const item = document.createElement('li');
        item.className = 'flex items-center justify-between gap-3 rounded-xl border border-gray-800/80 bg-gray-950/70 px-3 py-2';
        const identity = document.createElement('div');
        identity.className = 'flex min-w-0 items-center gap-3';
        const icon = document.createElement('span');
        icon.className = `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${assetColors[asset]}`;
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = asset;
        const name = document.createElement('span');
        name.className = 'block text-xs font-semibold text-gray-200';
        name.textContent = assetNames[asset];
        const balance = document.createElement('span');
        balance.className = 'mt-0.5 block text-[11px] tabular-nums text-gray-500';
        balance.textContent = `${new Intl.NumberFormat(document.documentElement.lang, {
            maximumFractionDigits: 8
        }).format(quantity)} ${asset}`;
        const assetDetails = document.createElement('span');
        assetDetails.className = 'min-w-0';
        assetDetails.append(name, balance);
        identity.append(icon, assetDetails);
        const estimatedValue = document.createElement('span');
        estimatedValue.className = 'shrink-0 text-right text-xs font-medium tabular-nums text-gray-200';
        estimatedValue.textContent = `${currentCopy().paperEstimatedValue}: ${
            market ? paperCurrency(quantity * Number(market.price)) : '—'
        }`;
        item.append(identity, estimatedValue);
        positionList.append(item);
    }
    const stakes = portfolio.stakes || [];
    const stakeList = document.getElementById('paperStakeList');
    const stakeEmpty = document.getElementById('paperStakeNoPositions');
    stakeList.replaceChildren();
    for (const stake of stakes) {
        if (stake.status === 'active') {
            const market = marketsByAsset.get(stake.asset);
            totalValue += Number(stake.amount) * (stake.asset === 'USDT' ? 1 : Number(market?.price || 0));
        }
        const item = document.createElement('li');
        item.className = 'rounded-xl border border-gray-800/80 bg-gray-950/70 p-3';
        const details = document.createElement('p');
        details.className = 'text-sm font-medium text-gray-200';
        details.textContent = `${stake.asset} · ${currentCopy().paperStakeAmount}: ${stake.amount} · ${currentCopy().paperStakeReward}: ${stake.reward}`;
        const maturity = document.createElement('p');
        maturity.className = 'mt-1 text-xs text-gray-500';
        maturity.textContent = stake.status === 'claimed'
            ? currentCopy().paperStakeClaimed
            : currentCopy().paperStakeActive.replace(
                '{date}',
                new Date(stake.unlockAt).toLocaleString(document.documentElement.lang === 'tr' ? 'tr-TR' : document.documentElement.lang)
            );
        item.append(details, maturity);
        if (stake.status === 'active') {
            const claim = document.createElement('button');
            claim.type = 'button';
            claim.dataset.paperStakeClaim = stake.id;
            claim.disabled = !stake.canClaim;
            claim.className = 'mt-3 min-h-10 w-full rounded-lg border border-emerald-400/30 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-45';
            claim.textContent = currentCopy()[stake.canClaim ? 'paperStakeClaim' : 'paperStakeWaiting'];
            claim.addEventListener('click', () => void claimPaperStake(claim));
            item.append(claim);
        }
        stakeList.append(item);
    }
    stakeEmpty.hidden = stakes.length > 0;
    document.getElementById('paperTotalValue').textContent =
        ['BTC', 'ETH', 'BNB', 'STKAI'].every((asset) => marketsByAsset.has(asset))
            ? paperCurrency(totalValue)
            : '—';
    document.getElementById('paperNoPositions').hidden = true;

    const tradeList = document.getElementById('paperTradeList');
    tradeList.replaceChildren();
    for (const trade of portfolio.trades.slice(0, 5)) {
        const item = document.createElement('li');
        item.className = 'rounded-xl border border-gray-800/80 bg-gray-950/70 px-3 py-2.5';
        const side = currentCopy()[trade.side === 'buy' ? 'paperBuy' : 'paperSell'];
        const baseAsset = trade.symbol.replace(trade.quoteAsset || 'USDT', '');
        const detail = document.createElement('p');
        detail.className = 'text-sm font-medium text-gray-200';
        detail.textContent = `${side} ${baseAsset}/${trade.quoteAsset || 'USDT'} · ${trade.quantity} · ${paperCurrency(trade.notional)}`;
        const fee = document.createElement('p');
        fee.className = 'mt-1 text-xs text-gray-500';
        fee.textContent = `${currentCopy().paperFeeLabel}: ${trade.fee} ${trade.quoteAsset || 'USDT'}`;
        item.append(detail, fee);
        tradeList.append(item);
    }
    document.getElementById('paperNoTrades').hidden = portfolio.trades.length > 0;
}

function clearPaperPortfolio() {
    document.getElementById('paperCashBalance').textContent = '—';
    document.getElementById('paperTotalValue').textContent = '—';
    document.getElementById('paperPositionList').replaceChildren();
    document.getElementById('paperTradeList').replaceChildren();
    document.getElementById('paperStakeList').replaceChildren();
    document.getElementById('paperNoPositions').hidden = false;
    document.getElementById('paperNoTrades').hidden = false;
    document.getElementById('paperStakeNoPositions').hidden = false;
    document.getElementById('paperLoginNotice').hidden = false;
}

const updatePaperStakePreview = () => {
    const amountText = paperStakeAmount.value.trim();
    const amount = Number(amountText);
    const asset = paperStakeAsset.value;
    const rewardRates = [0.05, 0.25, 2];
    const rate = rewardRates[Number(paperStakeOffer.value)];
    const preview = document.getElementById('paperStakePreview');
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(rate)) {
        preview.textContent = '';
        return;
    }
    const format = (value) => new Intl.NumberFormat(
        document.documentElement.lang === 'tr' ? 'tr-TR' : document.documentElement.lang,
        { maximumFractionDigits: asset === 'USDT' ? 6 : 8 }
    ).format(value);
    preview.textContent = currentCopy().paperStakePreview
        .replace('{amount}', format(amount))
        .replaceAll('{asset}', asset)
        .replace('{reward}', format(amount * rate));
};

async function claimPaperStake(button) {
    button.disabled = true;
    const status = document.getElementById('paperStakeStatus');
    status.textContent = '';
    try {
        const result = await apiRequest(`/api/paper/stakes/${encodeURIComponent(button.dataset.paperStakeClaim)}/claim`, {
            method: 'POST',
            body: JSON.stringify({})
        });
        renderPaperPortfolio(result.portfolio);
        status.textContent = currentCopy().paperStakeClaimSuccess;
    } catch (error) {
        const messages = {
            paper_stake_locked: 'paperStakeLocked',
            paper_stake_not_found: 'paperStakeClaimFailed',
            paper_stake_already_claimed: 'paperStakeClaimFailed'
        };
        status.textContent = error.status === 401
            ? currentCopy().paperStakeLoginRequired
            : currentCopy()[messages[error.message] || 'paperStakeClaimFailed'];
        if (error.status !== 409 && error.status !== 401) {
            console.error('Could not claim the simulated stake.', error);
        }
    } finally {
        if (button.isConnected) button.disabled = false;
    }
}

async function refreshPaperTrading() {
    const marketStatus = document.getElementById('paperMarketStatus');
    try {
        const summary = await apiRequest('/api/market/summary');
        paperMarkets = summary.markets;
        renderPaperMarkets();
        const locale = document.documentElement.lang === 'tr' ? 'tr-TR' : document.documentElement.lang;
        document.getElementById('paperMarketUpdated').textContent = currentCopy().paperUpdated.replace(
            '{time}',
            new Date(summary.fetchedAt).toLocaleTimeString(locale)
        );
        marketStatus.textContent = summary.marketDataUnavailable
            ? currentCopy().paperLiveMarketsUnavailable
            : '';
    } catch (error) {
        console.error('Could not load market data for the paper-trading simulator.', error);
        paperMarkets = [];
        renderPaperMarkets();
        document.getElementById('paperMarketUpdated').textContent = currentCopy().paperMarketError;
        marketStatus.textContent = currentCopy().paperMarketError;
    }

    try {
        const portfolio = await apiRequest('/api/paper/portfolio');
        renderPaperPortfolio(portfolio);
        document.getElementById('paperLoginNotice').hidden = true;
    } catch (error) {
        if (error.status === 401) {
            clearPaperPortfolio();
            return;
        }
        console.error('Could not load the paper-trading portfolio.', error);
        document.getElementById('paperOrderStatus').textContent = currentCopy().paperPortfolioFailed;
    }
}

paperOrderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = document.getElementById('paperSubmit');
    const status = document.getElementById('paperOrderStatus');
    const data = new FormData(paperOrderForm);
    submit.disabled = true;
    status.textContent = '';
    try {
        const result = await apiRequest('/api/paper/orders', {
            method: 'POST',
            body: JSON.stringify({
                symbol: `${data.get('asset')}USDT`,
                side: data.get('side'),
                quantity: data.get('quantity'),
                quoteAsset: data.get('asset') === 'STKAI' ? data.get('quoteAsset') : 'USDT'
            })
        });
        renderPaperPortfolio(result.portfolio);
        status.textContent = currentCopy().paperOrderSuccess;
        paperOrderForm.elements.quantity.value = '';
        document.getElementById('paperLoginNotice').hidden = true;
    } catch (error) {
        if (error.status === 401) {
            document.getElementById('paperLoginNotice').hidden = false;
            status.textContent = currentCopy().paperLoginRequired;
        } else {
            const errorMessages = {
                paper_insufficient_cash: 'paperInsufficientCash',
                paper_insufficient_position: 'paperInsufficientPosition',
                paper_insufficient_quote_position: 'paperInsufficientQuotePosition',
                paper_insufficient_treasury_inventory: 'paperInsufficientTreasuryInventory',
                paper_insufficient_treasury_quote: 'paperInsufficientTreasuryQuote',
                paper_order_below_minimum: 'paperBelowMinimum',
                market_data_unavailable: 'paperMarketError'
            };
            status.textContent = currentCopy()[errorMessages[error.message] || 'paperOrderFailed'];
            if (error.status === 503) {
                console.error('Paper-trading order could not be priced.', error);
            } else if (!errorMessages[error.message]) {
                console.error('Could not place a paper-trading order.', error);
            }
        }
    } finally {
        submit.disabled = false;
    }
});

for (const input of [paperStakeAmount, paperStakeAsset, paperStakeOffer]) {
    input.addEventListener(input === paperStakeAmount ? 'input' : 'change', updatePaperStakePreview);
}
paperStakeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = document.getElementById('paperStakeSubmit');
    const status = document.getElementById('paperStakeStatus');
    const data = new FormData(paperStakeForm);
    submit.disabled = true;
    status.textContent = '';
    try {
        const result = await apiRequest('/api/paper/stakes', {
            method: 'POST',
            body: JSON.stringify({
                asset: data.get('asset'),
                amount: data.get('amount'),
                offerId: data.get('offerId')
            })
        });
        renderPaperPortfolio(result.portfolio);
        paperStakeForm.elements.amount.value = '';
        updatePaperStakePreview();
        document.getElementById('paperLoginNotice').hidden = true;
        status.textContent = currentCopy().paperStakeSuccess;
    } catch (error) {
        const messages = {
            paper_stake_insufficient_balance: 'paperStakeInsufficient',
            paper_stake_below_minimum: 'paperStakeBelowMinimum',
            invalid_paper_stake: 'paperStakeFailed'
        };
        status.textContent = error.status === 401
            ? currentCopy().paperStakeLoginRequired
            : currentCopy()[messages[error.message] || 'paperStakeFailed'];
        if (!messages[error.message] && error.status !== 401) {
            console.error('Could not create the simulated stake.', error);
        }
    } finally {
        submit.disabled = false;
    }
});

const updatePaperQuoteAssetVisibility = () => {
    const isStkai = paperAssetSelect.value === 'STKAI';
    for (const option of paperQuoteAssetSelect.options) {
        option.disabled = !isStkai && option.value !== 'USDT';
    }
    if (!isStkai) paperQuoteAssetSelect.value = 'USDT';
};
paperAssetSelect.addEventListener('change', updatePaperQuoteAssetVisibility);
updatePaperQuoteAssetVisibility();

void refreshPaperTrading();
window.setInterval(() => void refreshPaperTrading(), 30000);

if (new URLSearchParams(window.location.search).get('login') === '1') {
    setAuthMode('login');
    if (!authDialog.open) authDialog.showModal();
}

const packageOffers = [
    { nameKey: 'bronzeTerm', rateKey: 'bronzePercent', rateBps: 500, durationDays: 7 },
    { nameKey: 'silverTerm', rateKey: 'silverPercent', rateBps: 2_500, durationDays: 30 },
    { nameKey: 'goldTerm', rateKey: 'goldPercent', rateBps: 20_000, durationDays: 180 }
];
let stakingConfig = null;
let selectedStakeOfferId = 0;

const stakingTokenAbi = [
    'function balanceOf(address account) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)'
];
const stakingContractAbi = [
    'function previewReward(uint8 offerId, uint256 amount) view returns (uint256)',
    'function stake(uint8 offerId, uint256 amount)',
    'function withdrawPrincipal(uint256 positionId)',
    {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'getUserPositions',
        outputs: [{
            components: [
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                { internalType: 'uint256', name: 'reward', type: 'uint256' },
                { internalType: 'uint64', name: 'unlockAt', type: 'uint64' },
                { internalType: 'uint8', name: 'offerId', type: 'uint8' },
                { internalType: 'bool', name: 'principalWithdrawn', type: 'bool' }
            ],
            internalType: 'struct STAKEAIStaking.Position[]',
            name: '',
            type: 'tuple[]'
        }],
        stateMutability: 'view',
        type: 'function'
    }
];

function setStakingStatus(message, isError = false) {
    const status = document.getElementById('stakingStatus');
    status.textContent = message;
    status.className = `min-h-5 text-sm ${isError ? 'text-rose-300' : 'text-gray-300'}`;
}

async function loadStakingConfig() {
    try {
        stakingConfig = await apiRequest('/api/staking/config');
        document.getElementById('stakingConfigNotice').hidden = stakingConfig.enabled;
        document.getElementById('stakingControls').hidden = !stakingConfig.enabled;
    } catch (error) {
        console.error('Could not load testnet staking configuration.', error);
        document.getElementById('stakingConfigNotice').textContent = currentCopy().stakingNotConfigured;
    }
}

async function getStakingWallet() {
    if (!window.ethereum || !window.ethers) {
        throw new Error('wallet_unavailable');
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    let provider = new window.ethers.BrowserProvider(window.ethereum);
    let network = await provider.getNetwork();
    if (network.chainId !== BigInt(stakingConfig.chainId)) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${stakingConfig.chainId.toString(16)}` }]
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
                provider = new window.ethers.BrowserProvider(window.ethereum);
                network = await provider.getNetwork();
                if (network.chainId !== BigInt(stakingConfig.chainId)) {
                    throw new Error('wrong_network');
                }
            } else {
                throw error;
            }
        }
        provider = new window.ethers.BrowserProvider(window.ethereum);
        network = await provider.getNetwork();
        if (network.chainId !== BigInt(stakingConfig.chainId)) {
            throw new Error('wrong_network');
        }
    }
    const signer = await provider.getSigner();
    return { provider, signer, account: await signer.getAddress() };
}

async function refreshStakingPositions() {
    const list = document.getElementById('stakingPositions');
    const empty = document.getElementById('stakingNoPositions');
    if (!stakingConfig?.enabled || !window.ethereum) return;

    const { signer, account } = await getStakingWallet();
    const staking = new window.ethers.Contract(stakingConfig.stakingAddress, stakingContractAbi, signer);
    const token = new window.ethers.Contract(stakingConfig.tokenAddress, stakingTokenAbi, signer);
    const [positions, tokenBalance] = await Promise.all([
        staking.getUserPositions(account),
        token.balanceOf(account)
    ]);
    const copy = currentCopy();
    list.replaceChildren();

    positions.forEach((position, index) => {
        if (position.principalWithdrawn) return;
        const row = document.createElement('li');
        row.className = 'flex flex-col gap-3 rounded-lg border border-gray-800 bg-gray-950/70 p-3 sm:flex-row sm:items-center sm:justify-between';
        const details = document.createElement('p');
        details.className = 'text-sm text-gray-300';
        const unlockDate = new Date(Number(position.unlockAt) * 1000);
        details.textContent = `${copy.stakingPrincipal}: ${formatTokenBalance(position.amount.toString(), 18)} STKAI · ${copy.stakingReward}: ${formatTokenBalance(position.reward.toString(), 18)} STKAI · ${copy.stakingUnlocks}: ${unlockDate.toLocaleString(document.documentElement.lang)}`;
        const withdraw = document.createElement('button');
        withdraw.type = 'button';
        withdraw.className = 'shrink-0 rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 disabled:opacity-60';
        const isMature = BigInt(Math.floor(Date.now() / 1000)) >= position.unlockAt;
        withdraw.disabled = !isMature;
        withdraw.textContent = isMature ? copy.stakingWithdraw : `${copy.stakingLocked} ${unlockDate.toLocaleDateString(document.documentElement.lang)}`;
        withdraw.addEventListener('click', () => void withdrawStakePosition(index, withdraw));
        row.append(details, withdraw);
        list.append(row);
    });
    empty.hidden = list.childElementCount > 0;
    document.getElementById('stakingWalletAddress').textContent =
        `${copy.stakingConnected}: ${account} · ${formatTokenBalance(tokenBalance.toString(), 18)} STKAI`;
}

async function withdrawStakePosition(positionId, button) {
    button.disabled = true;
    try {
        const { signer } = await getStakingWallet();
        const staking = new window.ethers.Contract(stakingConfig.stakingAddress, stakingContractAbi, signer);
        const transaction = await staking.withdrawPrincipal(positionId);
        setStakingStatus(currentCopy().stakingConfirmTransaction);
        await transaction.wait();
        setStakingStatus(currentCopy().stakingTransactionDone);
        await refreshStakingPositions();
    } catch (error) {
        console.error('Could not withdraw a matured STAKEAI staking position.', error);
        setStakingStatus(error.message === 'wrong_network'
            ? currentCopy().stakingWrongNetwork
            : currentCopy().stakingOperationFailed, true);
        button.disabled = false;
    }
}

function updateStakingPreview() {
    const input = document.getElementById('stakingAmount');
    const preview = document.getElementById('stakingPreview');
    const value = input.value.trim();
    if (!/^\d+(?:\.\d{1,18})?$/.test(value) || Number(value) <= 0) {
        preview.textContent = '';
        return;
    }
    try {
        const amount = window.ethers.parseUnits(value, 18);
        const offer = packageOffers[selectedStakeOfferId];
        const reward = amount * BigInt(offer.rateBps) / 10_000n;
        if (reward === 0n) {
            preview.textContent = currentCopy().stakingAmountTooSmall;
            return;
        }
        preview.textContent = `${currentCopy().stakingPreview}: ${formatTokenBalance(reward.toString(), 18)} STAKEAI`;
    } catch {
        preview.textContent = '';
    }
}

async function submitStake() {
    const copy = currentCopy();
    const input = document.getElementById('stakingAmount');
    const value = input.value.trim();
    if (!/^\d+(?:\.\d{1,18})?$/.test(value) || Number(value) <= 0) {
        setStakingStatus(copy.stakingInvalidAmount, true);
        return;
    }

    const submit = document.getElementById('submitStake');
    submit.disabled = true;
    try {
        const { signer, account } = await getStakingWallet();
        const amount = window.ethers.parseUnits(value, 18);
        const token = new window.ethers.Contract(stakingConfig.tokenAddress, stakingTokenAbi, signer);
        const staking = new window.ethers.Contract(stakingConfig.stakingAddress, stakingContractAbi, signer);
        if (await token.balanceOf(account) < amount) {
            setStakingStatus(copy.stakingInsufficientBalance, true);
            return;
        }
        const reward = await staking.previewReward(selectedStakeOfferId, amount);
        if (reward === 0n) {
            setStakingStatus(copy.stakingAmountTooSmall, true);
            return;
        }

        if (await token.allowance(account, stakingConfig.stakingAddress) < amount) {
            setStakingStatus(copy.stakingConfirmApproval);
            await (await token.approve(stakingConfig.stakingAddress, amount)).wait();
        }
        setStakingStatus(copy.stakingConfirmTransaction);
        await (await staking.stake(selectedStakeOfferId, amount)).wait();
        input.value = '';
        updateStakingPreview();
        setStakingStatus(copy.stakingTransactionDone);
        await refreshStakingPositions();
    } catch (error) {
        console.error('Could not create a STAKEAI testnet staking position.', error);
        setStakingStatus(error.message === 'wallet_unavailable'
            ? copy.stakingWalletUnavailable
            : error.message === 'wrong_network'
                ? copy.stakingWrongNetwork
                : copy.stakingOperationFailed, true);
    } finally {
        submit.disabled = false;
    }
}

document.querySelectorAll('[data-stake-package]').forEach((button) => {
    button.addEventListener('click', () => {
        const offerId = Number(button.dataset.stakePackage);
        const offer = packageOffers[offerId];
        if (!offer) return;
        selectedStakeOfferId = offerId;
        document.getElementById('stakingOfferSummary').textContent =
            `${currentCopy()[offer.nameKey]} · ${currentCopy()[offer.rateKey]} · ${offer.durationDays} ${currentCopy().days}`;
        document.getElementById('stakingAmount').value = '';
        document.getElementById('stakingPreview').textContent = '';
        setStakingStatus('');
        stakingDialog.showModal();
    });
});

document.getElementById('stakingAmount').addEventListener('input', updateStakingPreview);
document.getElementById('connectStakingWallet').addEventListener('click', async () => {
    try {
        const { account } = await getStakingWallet();
        document.getElementById('stakingWalletAddress').textContent = `${currentCopy().stakingConnected}: ${account}`;
        await refreshStakingPositions();
    } catch (error) {
        console.error('Could not connect a wallet for STAKEAI testnet staking.', error);
        setStakingStatus(error.message === 'wallet_unavailable'
            ? currentCopy().stakingWalletUnavailable
            : error.message === 'wrong_network'
                ? currentCopy().stakingWrongNetwork
                : currentCopy().stakingOperationFailed, true);
    }
});
document.getElementById('submitStake').addEventListener('click', () => void submitStake());
document.getElementById('refreshStakingPositions').addEventListener('click', () => {
    void refreshStakingPositions().catch((error) => {
        console.error('Could not refresh STAKEAI testnet staking positions.', error);
        setStakingStatus(error.message === 'wrong_network'
            ? currentCopy().stakingWrongNetwork
            : currentCopy().stakingOperationFailed, true);
    });
});
document.getElementById('closeStakingDialog').addEventListener('click', () => stakingDialog.close());
document.getElementById('closeStakingDone').addEventListener('click', () => stakingDialog.close());

function updateReturns() {
    if (!calcAmount || !calcPackage || !weeklyReturn || !monthlyReturn) return;

    const amount = parseFloat(calcAmount.value) || 0;
    const rate = parseFloat(calcPackage.value) || 0;
    const locale = document.documentElement.lang === 'en' ? 'en-US' : document.documentElement.lang;
    const currency = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD'
    });

    const exampleProfit = amount * rate;
    weeklyReturn.textContent = currency.format(exampleProfit);
    monthlyReturn.textContent = currency.format(amount + exampleProfit);
}

if (calcAmount && calcPackage) {
    calcAmount.addEventListener('input', updateReturns);
    calcPackage.addEventListener('change', updateReturns);

    updateReturns();
}

document.querySelectorAll('[data-submit-task]').forEach((button) => {
    button.addEventListener('click', async () => {
        const taskKey = button.dataset.submitTask;
        const card = button.closest('[data-task-card]');
        const proof = card.querySelector('[data-task-proof]');
        const status = card.querySelector('[data-task-status]');
        if (!proof.reportValidity()) return;
        button.disabled = true;
        status.textContent = '';
        try {
            await apiRequest('/api/account/tasks', {
                method: 'POST',
                body: JSON.stringify({ taskKey, proof: proof.value })
            });
            await refreshTaskCards();
            status.textContent = currentCopy().taskSubmittedSuccess;
        } catch (error) {
            console.error('Could not submit the social task for review.', error);
            if (error.status === 401) {
                status.textContent = currentCopy().taskLoginRequired;
                setAuthMode('login');
                authStatus.textContent = currentCopy().taskLoginRequired;
                if (!authDialog.open) authDialog.showModal();
            } else if (error.message === 'task_already_submitted') {
                status.textContent = currentCopy().taskAlreadySubmitted;
                await refreshTaskCards();
            } else if (error.message === 'task_not_configured') {
                status.textContent = currentCopy().taskLinkMissing;
                button.disabled = true;
            } else {
                status.textContent = currentCopy().taskSubmitFailed;
                button.disabled = false;
            }
        }
    });
});
const assistantDialog = document.getElementById('assistantDialog');
const assistantDialogTitle = document.getElementById('assistantDialogTitle');
const assistantMessages = document.getElementById('assistantMessages');
const assistantForm = document.getElementById('assistantForm');
const assistantInput = document.getElementById('assistantInput');
const assistantSend = document.getElementById('assistantSend');
const assistantStatus = document.getElementById('assistantStatus');
const assistantChatHistory = new Map();
let activeAssistant = '';

function renderAssistantMessage(role, content) {
    const isUser = role === 'user';
    const message = document.createElement('article');
    message.dataset.role = role;
    message.className = `max-w-[90%] rounded-2xl px-4 py-3 ${isUser ? 'ml-auto bg-emerald-500/10 text-emerald-50' : 'mr-auto border border-gray-700 bg-gray-900 text-gray-100'}`;
    const speaker = document.createElement('p');
    speaker.className = `mb-1 text-xs font-semibold ${isUser ? 'text-emerald-300' : 'text-cyan-300'}`;
    speaker.textContent = currentCopy()[isUser ? 'assistantYou' : 'assistantAi'];
    const text = document.createElement('p');
    text.className = 'whitespace-pre-wrap break-words text-sm leading-6';
    text.textContent = content;
    message.append(speaker, text);
    assistantMessages.append(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
    return message;
}

function openAssistant(assistant) {
    const copy = currentCopy();
    const titles = {
        code: copy.botCodeTitle,
        companion: copy.botChatTitle,
        strategy: copy.botStrategyTitle
    };
    if (!titles[assistant]) return;
    activeAssistant = assistant;
    assistantDialog.dataset.assistantTheme = assistant;
    assistantDialogTitle.textContent = titles[assistant];
    assistantStatus.textContent = '';
    assistantMessages.replaceChildren();
    const history = assistantChatHistory.get(assistant) || [];
    assistantChatHistory.set(assistant, history);
    if (history.length) {
        history.forEach(({ role, content }) => renderAssistantMessage(role, content));
    } else {
        const welcomeKey = assistantRuntimeMode === 'demo'
            ? 'assistantWelcomeDemo'
            : assistantRuntimeMode === 'ollama'
                ? 'assistantWelcomeOllama'
                : assistantRuntimeMode === 'openai'
                    ? 'assistantWelcome'
                    : 'assistantWelcomeUnavailable';
        renderAssistantMessage('assistant', copy[welcomeKey]);
    }
    assistantDialog.showModal();
    assistantInput.focus();
}

document.querySelectorAll('[data-open-assistant]').forEach((button) => {
    button.addEventListener('click', () => openAssistant(button.dataset.openAssistant));
});
document.getElementById('closeAssistantDialog').addEventListener('click', () => assistantDialog.close());
assistantDialog.addEventListener('click', (event) => {
    if (event.target === assistantDialog) assistantDialog.close();
});
document.getElementById('newAssistantChat').addEventListener('click', () => {
    if (!activeAssistant) return;
    assistantChatHistory.set(activeAssistant, []);
    assistantMessages.replaceChildren();
    const welcomeKey = assistantRuntimeMode === 'demo'
        ? 'assistantWelcomeDemo'
        : assistantRuntimeMode === 'ollama'
            ? 'assistantWelcomeOllama'
            : assistantRuntimeMode === 'openai'
                ? 'assistantWelcome'
                : 'assistantWelcomeUnavailable';
    renderAssistantMessage('assistant', currentCopy()[welcomeKey]);
    assistantStatus.textContent = '';
    assistantInput.focus();
});
assistantForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const content = assistantInput.value.trim();
    if (!content) return;
    if (content.length > 4000) {
        assistantStatus.textContent = currentCopy().assistantInputTooLong;
        return;
    }

    const history = assistantChatHistory.get(activeAssistant) || [];
    const pendingMessages = [...history, { role: 'user', content }].slice(-10);
    renderAssistantMessage('user', content);
    assistantInput.value = '';
    assistantStatus.textContent = currentCopy().assistantThinking;
    assistantStatus.className = 'mt-3 min-h-5 text-sm text-gray-400';
    assistantSend.disabled = true;
    try {
        const result = await apiRequest('/api/assistants/chat', {
            method: 'POST',
            body: JSON.stringify({ assistant: activeAssistant, messages: pendingMessages })
        });
        if (typeof result.reply !== 'string' || !result.reply.trim()) {
            throw new Error('ai_provider_invalid_response');
        }
        assistantRuntimeMode = ['demo', 'openai', 'ollama'].includes(result.mode) ? result.mode : 'unavailable';
        const nextHistory = [...pendingMessages, { role: 'assistant', content: result.reply }].slice(-10);
        assistantChatHistory.set(activeAssistant, nextHistory);
        renderAssistantMessage('assistant', result.reply);
        assistantStatus.textContent = '';
    } catch (error) {
        console.error('Could not get a reply from the configured AI assistant.', error.message);
        const copy = currentCopy();
        const errorMessages = {
            ai_assistant_not_configured: copy.assistantNotConfigured,
            ai_assistant_rate_limited: copy.assistantRateLimited,
            ai_assistant_quota_exceeded: copy.assistantQuotaExceeded,
            ai_local_model_unavailable: copy.assistantUnavailable,
            ai_local_model_not_found: copy.assistantUnavailable,
            ai_provider_invalid_response: copy.assistantEmptyReply,
            ai_provider_unavailable: copy.assistantUnavailable,
            ai_assistant_timeout: copy.assistantUnavailable
        };
        assistantStatus.className = 'mt-3 min-h-5 text-sm text-amber-200';
        assistantStatus.textContent = errorMessages[error.message]
            || (error.status === 429 ? copy.assistantRateLimited : copy.assistantConnectionError);
    } finally {
        assistantSend.disabled = false;
        assistantInput.focus();
    }
});

async function loadAssistantRuntimeMode() {
    try {
        const result = await apiRequest('/api/assistants/status');
        assistantRuntimeMode = ['demo', 'openai', 'ollama'].includes(result.mode) ? result.mode : 'unavailable';
    } catch {
        assistantRuntimeMode = 'unavailable';
    }
}

void loadAssistantRuntimeMode();
void refreshTaskCards();
void loadStakingConfig();
