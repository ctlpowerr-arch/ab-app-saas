// CONFIGURATION SUPABASE
// Remplacez ces valeurs par celles de votre projet Supabase
const SUPABASE_URL = 'https://VOTRE_PROJET.supabase.co';
const SUPABASE_KEY = 'VOTRE_CLE_ANON_PUBLIQUE';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fonction pour convertir un nombre en lettres (version simplifiée)
function numberToLetters(num) {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
    
    if (num === 0) return 'zéro';
    
    let result = '';
    if (num >= 1000) {
        result += numberToLetters(Math.floor(num / 1000)) + ' mille ';
        num %= 1000;
    }
    if (num >= 100) {
        result += (Math.floor(num / 100) === 1 ? '' : units[Math.floor(num / 100)]) + ' cent ';
        num %= 100;
    }
    if (num >= 10) {
        if (num >= 10 && num <= 19) {
            const special = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
            result += special[num - 10];
            num = 0;
        } else {
            result += tens[Math.floor(num / 10)];
            num %= 10;
        }
    }
    if (num > 0) {
        result += (result ? '-' : '') + units[num];
    }
    return result.trim();
}
