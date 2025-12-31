// CONFIGURATION & ETAT GLOBAL
let currentUser = null;
let currentCompany = null;
let cart = [];

// ROLES & PERMISSIONS
const ROLES = {
    ADMIN: 'admin',
    VENDEUSE: 'vendeuse'
};

// INITIALISATION
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier session locale ou redirection login
});

async function handleLogin() {
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;

    // Simulation de 7 comptes vendeuses + 1 Admin
    if (user === 'admin' && pass === 'admin123') {
        currentUser = { id: 'u1', username: 'Admin', role: ROLES.ADMIN, permissions: { can_modify: true, can_change_price: true } };
    } else if (user.startsWith('vendeuse') && pass === 'vendeuse123') {
        currentUser = { id: user, username: user, role: ROLES.VENDEUSE, permissions: { can_modify: false, can_change_price: false } };
    } else {
        alert("Identifiants incorrects");
        return;
    }

    // Simulation Entreprise
    currentCompany = {
        id: 'c1',
        name: 'CODARK-J BUSINESS',
        logo_url: 'https://via.placeholder.com/150',
        settings: { allow_vendeuse_expense: false }
    };

    setupUI();
}

function setupUI() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    document.getElementById('user-display-name').textContent = currentUser.username;
    document.getElementById('nav-company-name').textContent = currentCompany.name;
    document.getElementById('nav-logo').src = currentCompany.logo_url;

    // Appliquer les restrictions de rôle
    if (currentUser.role === ROLES.ADMIN) {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    } else {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
}

// GESTION DES VENTES
async function processSale() {
    const clientId = document.getElementById('sale-client-select').value;
    if (!clientId) {
        alert("ERREUR : Vous devez sélectionner un client avant de valider la vente.");
        return;
    }

    if (cart.length === 0) {
        alert("Le panier est vide.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const paid = prompt(`Total: ${total} FCFA. Montant versé ?`, total);
    
    if (paid === null) return;

    const saleData = {
        id: 'FAC-' + Date.now(),
        clientId: clientId,
        items: cart,
        total: total,
        amountPaid: parseFloat(paid),
        date: new Date().toLocaleDateString(),
        seller: currentUser.username
    };

    // Logique de restriction vendeuse
    if (currentUser.role === ROLES.VENDEUSE) {
        // Vérifier si elle a le droit de modifier le prix (si différent du prix stock)
        // Par défaut: Bloqué
    }

    generateInvoice(saleData);
    alert("Vente enregistrée avec succès !");
    cart = [];
    updateCartUI();
}

// FACTURATION INTELLIGENTE
function generateInvoice(sale) {
    const remaining = sale.total - sale.amountPaid;
    
    document.getElementById('invoice-id').textContent = sale.id;
    document.getElementById('invoice-date').textContent = sale.date;
    document.getElementById('invoice-company-name').textContent = currentCompany.name;
    document.getElementById('invoice-logo').src = currentCompany.logo_url;
    document.getElementById('invoice-total').textContent = sale.total;
    document.getElementById('invoice-paid').textContent = sale.amountPaid;
    
    // Montant en lettres (via utils.js)
    document.getElementById('invoice-amount-letters').textContent = numberToLetters(sale.amountPaid) + " FRANCS CFA";

    // Reste à payer : Uniquement si avance faite
    const remainingRow = document.getElementById('invoice-remaining-row');
    if (remaining > 0) {
        remainingRow.style.display = 'block';
        document.getElementById('invoice-remaining').textContent = remaining;
    } else {
        remainingRow.style.display = 'none';
    }

    // Impression / PDF
    const element = document.getElementById('invoice-content');
    document.getElementById('invoice-template').style.display = 'block';
    
    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save(`${sale.id}.pdf`);
        document.getElementById('invoice-template').style.display = 'none';
    });
}

// EXPORT EXCEL
function exportData(type) {
    if (currentUser.role !== ROLES.ADMIN) {
        alert("Accès refusé : Seul l'Admin peut exporter les données.");
        return;
    }
    
    // Simulation de données
    const data = [
        { Date: '2025-12-31', Vendeur: 'Vendeuse 1', Client: 'Client A', Total: 15000, Payé: 15000 },
        { Date: '2025-12-31', Vendeur: 'Vendeuse 2', Client: 'Client B', Total: 25000, Payé: 10000 }
    ];
    
    exportToExcel(data, "Rapport_Ventes_Global");
}

function logout() {
    location.reload();
}
