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

        <?php
        try {
            $conn = new PDO("mysql:host=localhost;dbname=finance-flow", 'root', 'root');
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $categoriesStmt = $conn->query("SELECT * FROM categories");
            $categories = $categoriesStmt->fetchAll(PDO::FETCH_ASSOC);

            $sousCategoriesStmt = $conn->query("SELECT * FROM sous_categories");
            $sousCategories = $sousCategoriesStmt->fetchAll(PDO::FETCH_ASSOC);

            $sousCategoriesByCategorie = [];
            foreach ($sousCategories as $sousCategorie) {
                $sousCategoriesByCategorie[$sousCategorie['categorie_id']][] = $sousCategorie;
            }

            $transactionsStmt = $conn->query("SELECT * FROM transactions");
            $transactions = $transactionsStmt->fetchAll(PDO::FETCH_ASSOC);

            $solde = 0;
            foreach ($transactions as $transaction) {
                $solde += ($transaction['type'] === 'revenu' ? 1 : -1) * $transaction['montant'];
            }

        } catch (PDOException $e) {
            echo "Erreur de connexion : " . $e->getMessage();
        }
        ?>

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
                    <select id="categorie" name="categorie" required onchange="updateSousCategories()">
                        <option value="">Sélectionnez une catégorie</option>
                        <?php foreach ($categories as $categorie): ?>
                            <option value="<?= $categorie['id'] ?>"><?= htmlspecialchars($categorie['nom']) ?></option>
                        <?php endforeach; ?>
                    </select>

                    <label for="sous-categorie">Sous-catégorie :</label>
                    <select id="sous-categorie" name="sous-categorie" required>
                        <option value="">Sélectionnez une sous-catégorie</option>
                    </select>

                    <button type="submit">Ajouter</button>
                </form>
            </section>

            <section id="filtres">
                <h2>Filtres et Tri</h2>
                <form id="form-filtres">
                    <label for="categorie">Catégorie :</label>
                    <select id="filtre-categorie" onchange="updateSousCategoriesFilter()">
                        <option value="">Toutes</option>
                        <?php foreach ($categories as $categorie): ?>
                            <option value="<?= $categorie['id'] ?>"><?= htmlspecialchars($categorie['nom']) ?></option>
                        <?php endforeach; ?>
                    </select>

                    <label for="sous-categorie">Sous-catégorie :</label>
                    <select id="filtre-sous-categorie">
                        <option value="">Toutes</option>
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
                <ul id="transactions">
                    <?php foreach ($transactions as $transaction): ?>
                        <li>
                            <?= htmlspecialchars($transaction['date']) ?> - <?= htmlspecialchars($transaction['titre']) ?> : <?= htmlspecialchars($transaction['montant']) ?>€
                        </li>
                    <?php endforeach; ?>
                </ul>
            </section>
        </main>

        <script>
            const sousCategoriesByCategorie = <?= json_encode($sousCategoriesByCategorie) ?>;
            const solde = <?= $solde ?>;

            document.getElementById('solde').textContent = `Solde : ${solde.toFixed(2)}€`;

            function updateSousCategories() {
                const categorieId = document.getElementById('categorie').value;
                const sousCategorieSelect = document.getElementById('sous-categorie');

                sousCategorieSelect.innerHTML = '<option value="">Sélectionnez une sous-catégorie</option>';

                if (sousCategoriesByCategorie[categorieId]) {
                    sousCategoriesByCategorie[categorieId].forEach(function(sousCategorie) {
                        const option = document.createElement('option');
                        option.value = sousCategorie.id;
                        option.textContent = sousCategorie.nom;
                        sousCategorieSelect.appendChild(option);
                    });
                }
            }

            function updateSousCategoriesFilter() {
                const categorieId = document.getElementById('filtre-categorie').value;
                const sousCategorieSelect = document.getElementById('filtre-sous-categorie');

                sousCategorieSelect.innerHTML = '<option value="">Toutes</option>';

                if (sousCategoriesByCategorie[categorieId]) {
                    sousCategoriesByCategorie[categorieId].forEach(function(sousCategorie) {
                        const option = document.createElement('option');
                        option.value = sousCategorie.id;
                        option.textContent = sousCategorie.nom;
                        sousCategorieSelect.appendChild(option);
                    });
                }
            }

            async function appliquerFiltres() {
                const categorie = document.getElementById('filtre-categorie').value;
                const sousCategorie = document.getElementById('filtre-sous-categorie').value;
                const date = document.getElementById('filtre-date').value;
                const triMontant = document.getElementById('tri-montant').value;

                const response = await fetch(`api.php?categorie=${categorie}&sous_categorie=${sousCategorie}&date=${date}&tri_montant=${triMontant}`);
                const transactions = await response.json();

                const transactionsList = document.getElementById('transactions');
                transactionsList.innerHTML = transactions.map(tr => `<li>${tr.date} - ${tr.titre} : ${tr.montant}€</li>`).join('');
            }
        </script>

        <script src="script.js"></script>
    </div>
</body>
</html>
