document.getElementById('form-transaction').addEventListener('submit', async (e) => {
    e.preventDefault();

    const transaction = {
        titre: document.getElementById('titre').value,
        montant: parseFloat(document.getElementById('montant').value),
        type: document.getElementById('type').value,
        date: document.getElementById('date').value,
        lieu: document.getElementById('lieu').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // Réinitialise le formulaire
        document.getElementById('form-transaction').reset();
        afficherTransactions(); // Rafraîchit la liste des transactions
    } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction :", error);
    }
});

async function afficherTransactions() {
    try {
        const response = await fetch('api.php');

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const transactions = await response.json();

        const transactionsList = document.getElementById('transactions');
        transactionsList.innerHTML = transactions.map(tr => `<li>${tr.date} - ${tr.titre} : ${tr.montant}€</li>`).join('');

        const solde = transactions.reduce((acc, tr) => acc + (tr.type === 'revenu' ? tr.montant : -tr.montant), 0);
        document.getElementById('solde').textContent = `Solde : ${solde.toFixed(2)}€`;
    } catch (error) {
        console.error("Erreur lors du chargement des transactions :", error);
    }
}

afficherTransactions();
