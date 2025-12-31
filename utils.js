// CONVERSION NOMBRE EN LETTRES
function numberToLetters(num) {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

    if (num === 0) return 'zéro';

    function convert(n) {
        if (n < 10) return units[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) {
            const unit = n % 10;
            return tens[Math.floor(n / 10)] + (unit !== 0 ? '-' + units[unit] : '');
        }
        if (n < 1000) {
            const hundred = Math.floor(n / 100);
            const rest = n % 100;
            return (hundred === 1 ? '' : units[hundred] + ' ') + 'cent' + (rest !== 0 ? ' ' + convert(rest) : '');
        }
        if (n < 1000000) {
            const thousand = Math.floor(n / 1000);
            const rest = n % 1000;
            return (thousand === 1 ? '' : convert(thousand) + ' ') + 'mille' + (rest !== 0 ? ' ' + convert(rest) : '');
        }
        return n.toString();
    }

    return convert(Math.floor(num)).toUpperCase();
}

// EXPORT EXCEL STRUCTURÉ
function exportToExcel(data, filename) {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    let csvContent = "\ufeff" + headers.join(";") + "\r\n";

    data.forEach(row => {
        const values = headers.map(header => {
            let val = row[header] === null ? "" : row[header];
            if (typeof val === 'string') val = `"${val.replace(/"/g, '""')}"`;
            return val;
        });
        csvContent += values.join(";") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
