<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestionnaire de Budget</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
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

                    <label for="categorie">Catégorie :</label>
                    <select id="categorie" required>
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="1">Alimentaire</option>
                        <option value="2">Loisirs</option>
                    </select>

                    <label for="sous-categorie">Sous-catégorie :</label>
                    <select id="sous-categorie" required>
                        <option value="">Sélectionnez une sous-catégorie</option>
                        <option value="1">Restaurant</option>
                        <option value="2">Cinéma</option>
                    </select>

                    <button type="submit">Ajouter</button>
                </form>
            </section>

            <section id="filtres">
                <h2>Filtres et Tri</h2>
                <form id="form-filtres">
                    <label for="categorie">Catégorie :</label>
                    <select id="filtre-categorie">
                        <option value="">Toutes</option>
                        <option value="1">Alimentaire</option>
                        <option value="2">Loisirs</option>
                    </select>

                    <label for="sous-categorie">Sous-catégorie :</label>
                    <select id="filtre-sous-categorie">
                        <option value="">Toutes</option>
                        <option value="1">Restaurant</option>
                        <option value="2">Cinéma</option>
                    </select>

                    <label for="date">Date :</label>
                    <input type="date" id="filtre-date">

                    <label for="tri-montant">Trier par montant :</label>
                    <select id="tri-montant">
                        <option value="">Aucun</option>
                        <option value="asc">Croissant</option>
                        <option value="desc">Décroissant</option>
                    </select>

                    <button type="button" onclick="appliquerFiltres()">Appliquer les Filtres</button>
                </form>
            </section>

            <section id="liste-transactions">
                <h2>Transactions</h2>
                <ul id="transactions"></ul>
            </section>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>
