document.getElementById('form-transaction').addEventListener('submit', async (e) => {
    e.preventDefault();

    const transaction = {
        titre: document.getElementById('titre').value,
        montant: parseFloat(document.getElementById('montant').value),
        type: document.getElementById('type').value,
        date: document.getElementById('date').value,
        lieu: document.getElementById('lieu').value,
        description: document.getElementById('description').value,
        categorie_id: parseInt(document.getElementById('categorie').value),
        sous_categorie_id: parseInt(document.getElementById('sous-categorie').value)
    };

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });
        
        console.log("Réponse POST :", response);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        document.getElementById('form-transaction').reset();
        afficherTransactions();
    } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction :", error);
    }
});

async function appliquerFiltres() {
    const categorie = document.getElementById('filtre-categorie').value;
    const sousCategorie = document.getElementById('filtre-sous-categorie').value;
    const date = document.getElementById('filtre-date').value;
    const triMontant = document.getElementById('tri-montant').value;

    try {
        const response = await fetch(`api.php?categorie=${categorie}&sous_categorie=${sousCategorie}&date=${date}&tri_montant=${triMontant}`);
        
        console.log("Réponse GET :", response);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const transactions = await response.json();
        console.log("Transactions reçues :", transactions);

        if (!Array.isArray(transactions)) {
            throw new Error("La réponse de l'API n'est pas un tableau");
        }

        const transactionsList = document.getElementById('transactions');
        transactionsList.innerHTML = transactions.map(tr => `<li>${tr.date} - ${tr.titre} : ${tr.montant}€</li>`).join('');

        const solde = transactions.reduce((acc, tr) => acc + (tr.type === 'revenu' ? tr.montant : -tr.montant), 0);
        document.getElementById('solde').textContent = `Solde : ${solde.toFixed(2)}€`;
    } catch (error) {
        console.error("Erreur lors du chargement des transactions :", error);
    }
}

async function afficherTransactions() {
    await appliquerFiltres();
}

afficherTransactions();
