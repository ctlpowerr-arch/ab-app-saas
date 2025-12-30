// LOGIQUE SAAS AB-APP V4.1
let currentUser = null;
let currentCompany = null;

// Rôles et Permissions
const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    VENDEUSE: 'vendeuse'
};

async function login(username, password) {
    // Simulation de connexion (à lier à Supabase)
    // const { data, error } = await supabase.from('profiles').select('*, companies(*)').eq('username', username).eq('password_hash', password).single();
    
    // Exemple de données après connexion
    currentUser = {
        id: 'user-1',
        username: username,
        role: username === 'admin' ? ROLES.ADMIN : ROLES.VENDEUSE,
        permissions: {
            can_modify_sale: false,
            can_change_price: false
        }
    };
    
    currentCompany = {
        id: 'comp-1',
        name: 'MA SUPER ENTREPRISE',
        logo_url: 'https://via.placeholder.com/150',
        settings: { allow_vendeuse_expense: false }
    };

    initApp();
}

function initApp() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    
    updateUIBasedOnRole();
    loadDashboardData();
}

function updateUIBasedOnRole() {
    const isAdmin = currentUser.role === ROLES.ADMIN;
    
    // Cacher/Montrer les éléments selon le rôle
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
    
    // Désactiver les champs de prix pour les vendeuses
    const priceInput = document.getElementById('sale-price');
    if (priceInput) {
        priceInput.readOnly = !isAdmin && !currentUser.permissions.can_change_price;
    }
}

// Gestion de la vente avec sélection client obligatoire
async function validateSale(saleData) {
    if (!saleData.clientId) {
        alert("Erreur : Vous devez sélectionner un client avant de valider la vente.");
        return;
    }

    // Vérification des restrictions de quantité
    for (const item of saleData.items) {
        if (item.max_sale_qty && item.qty > item.max_sale_qty) {
            alert(`Action bloquée : La quantité max pour ${item.name} est de ${item.max_sale_qty}.`);
            return;
        }
    }

    // Enregistrement Supabase...
    console.log("Vente validée", saleData);
    generateInvoice(saleData);
}

// Génération de facture intelligente
function generateInvoice(sale) {
    const total = sale.total;
    const paid = sale.amountPaid;
    const remaining = total - paid;

    // Mise à jour du template
    document.getElementById('invoice-company-name').textContent = currentCompany.name;
    document.getElementById('invoice-logo-preview').src = currentCompany.logo_url;
    
    // Montant en lettres
    document.getElementById('invoice-amount-letters').textContent = numberToLetters(paid) + " FRANCS CFA";

    // Reste à payer (uniquement si > 0)
    const remainingEl = document.getElementById('invoice-remaining-row');
    if (remaining > 0) {
        remainingEl.style.display = 'table-row';
        document.getElementById('invoice-remaining-amount').textContent = remaining + " FCFA";
    } else {
        remainingEl.style.display = 'none';
    }

    // Affichage de la facture...
}
