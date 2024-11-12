<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestionnaire de Budget</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Mon Gestionnaire de Budget</h1>
        <div id="solde">Solde : 0€</div>
    </header>
    <main>
        <section id="ajout-transaction">
            <h2>Ajouter une Transaction</h2>
            <form id="form-transaction">
                <input type="text" id="titre" placeholder="Titre" required>
                <input type="number" id="montant" placeholder="Montant" required>
                <select id="type">
                    <option value="depense">Dépense</option>
                    <option value="revenu">Revenu</option>
                </select>
                <input type="date" id="date" required>
                <input type="text" id="lieu" placeholder="Lieu">
                <textarea id="description" placeholder="Description"></textarea>
                <button type="submit">Ajouter</button>
            </form>
        </section>
        <section id="liste-transactions">
            <h2>Transactions</h2>
            <ul id="transactions"></ul>
        </section>
    </main>
    <script src="script.js"></script>
</body>
</html>
