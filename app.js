// LOGIQUE PRINCIPALE AB-APP SAAS
let currentUser = null;
let currentCompany = null;

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier si une session existe
    checkSession();
});

async function checkSession() {
    const session = localStorage.getItem('ab_app_session');
    if (session) {
        const data = JSON.parse(session);
        await login(data.username, data.password, true);
    }
}

// Système de connexion Multi-Entreprises
async function login(username, password, isAuto = false) {
    try {
        // Dans une version réelle, on interroge Supabase
        // const { data, error } = await supabase.from('profiles').select('*, companies(*)').eq('username', username).eq('password_hash', password).single();
        
        // Simulation pour le déploiement initial (à remplacer par les appels Supabase réels)
        if (username === 'admin' && password === 'admin') {
            currentUser = { username: 'admin', role: 'super_admin' };
            showSuperAdminDashboard();
        } else {
            // Logique pour Boss et Vendeurs
            // ...
        }
        
        if (!isAuto) {
            localStorage.setItem('ab_app_session', JSON.stringify({ username, password }));
        }
        
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        
    } catch (error) {
        alert("Erreur de connexion : " + error.message);
    }
}

// Correction de la facture (Logo et Nom Entreprise)
function updateInvoiceTemplate(companyData) {
    const logoImg = document.getElementById('invoice-logo-preview');
    const companyName = document.getElementById('invoice-company-name');
    
    if (companyData.logo_url) {
        logoImg.src = companyData.logo_url;
        logoImg.style.display = 'block';
    }
    
    companyName.textContent = companyData.name || "ALPHA PRO";
}

// Fonction pour générer le montant en lettres sur la facture
function setAmountInLetters(amount) {
    const amountLettersElement = document.getElementById('invoice-amount-letters');
    if (amountLettersElement) {
        amountLettersElement.textContent = numberToLetters(amount) + " Francs CFA";
    }
}

// Exportation de la base de données
async function exportDatabase() {
    const tables = ['products', 'sales', 'clients', 'debts', 'categories'];
    let fullData = {};
    
    for (const table of tables) {
        const { data } = await supabase.from(table).select('*').eq('company_id', currentCompany.id);
        fullData[table] = data;
    }
    
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${currentCompany.name}_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}
