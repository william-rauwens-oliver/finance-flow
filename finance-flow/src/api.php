<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

try {
    $conn = new PDO("mysql:host=localhost;dbname=finance-flow", 'root', 'root');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupérer les catégories et sous-catégories
    if (isset($_GET['getCategories'])) {
        $categoriesQuery = "SELECT id, nom FROM categories";
        $categoriesStmt = $conn->query($categoriesQuery);
        $categories = $categoriesStmt->fetchAll(PDO::FETCH_ASSOC);

        $sousCategoriesQuery = "SELECT id, nom, categorie_id FROM sous_categories";
        $sousCategoriesStmt = $conn->query($sousCategoriesQuery);
        $sousCategories = $sousCategoriesStmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['categories' => $categories, 'sousCategories' => $sousCategories]);
        exit;
    }

    // Récupérer les utilisateurs
    if (isset($_GET['getUtilisateurs'])) {
        $stmt = $conn->query("SELECT id, nom, email FROM utilisateurs");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // Partager une transaction
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['shareTransaction'])) {
        $transaction_id = $_POST['transaction_id'];
        $utilisateur_ids = $_POST['utilisateur_ids'];

        foreach ($utilisateur_ids as $utilisateur_id) {
            $stmt = $conn->prepare("INSERT INTO transactions_partagees (transaction_id, utilisateur_id) VALUES (:transaction_id, :utilisateur_id)");
            $stmt->execute([':transaction_id' => $transaction_id, ':utilisateur_id' => $utilisateur_id]);
        }

        echo json_encode(['status' => 'success', 'message' => 'Transaction partagée avec succès']);
        exit;
    }

    // Récupérer les budgets existants
    if (isset($_GET['getBudgets'])) {
        $stmt = $conn->query("SELECT categorie_id, budget FROM budgets");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // Ajouter ou mettre à jour un budget pour une catégorie
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'updateBudget') {
        $categoryId = $_POST['categoryId'] ?? null;
        $budget = $_POST['budget'] ?? null;

        if ($categoryId && $budget !== null) {
            // Vérifier si le budget existe déjà
            $stmt = $conn->prepare("SELECT * FROM budgets WHERE categorie_id = :categorie_id");
            $stmt->execute([':categorie_id' => $categoryId]);
            $existingBudget = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existingBudget) {
                // Mettre à jour le budget existant
                $updateStmt = $conn->prepare("UPDATE budgets SET budget = :budget WHERE categorie_id = :categorie_id");
                $updateStmt->execute([':budget' => $budget, ':categorie_id' => $categoryId]);
            } else {
                // Insérer un nouveau budget
                $insertStmt = $conn->prepare("INSERT INTO budgets (categorie_id, budget) VALUES (:categorie_id, :budget)");
                $insertStmt->execute([':categorie_id' => $categoryId, ':budget' => $budget]);
            }

            echo json_encode(['status' => 'success', 'message' => 'Budget mis à jour ou ajouté avec succès']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Données manquantes pour mettre à jour le budget']);
        }
        exit;
    }

    // Récupérer les transactions avec filtres
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $query = "SELECT * FROM transactions WHERE 1=1";
        $params = [];

        if (!empty($_GET['categorie'])) {
            $query .= " AND categorie_id = :categorie";
            $params[':categorie'] = $_GET['categorie'];
        }

        if (!empty($_GET['sous_categorie'])) {
            $query .= " AND sous_categorie_id = :sous_categorie";
            $params[':sous_categorie'] = $_GET['sous_categorie'];
        }

        if (!empty($_GET['date'])) {
            $query .= " AND date = :date";
            $params[':date'] = $_GET['date'];
        }

        if (!empty($_GET['tri_montant'])) {
            $query .= ($_GET['tri_montant'] === 'asc') ? " ORDER BY montant ASC" : " ORDER BY montant DESC";
        } else {
            $query .= " ORDER BY date DESC";
        }

        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($transactions);
        exit;
    }

    // Ajouter une transaction
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $titre = $data['titre'] ?? '';
        $montant = $data['montant'] ?? 0;
        $type = $data['type'] ?? '';
        $date = $data['date'] ?? '';
        $lieu = $data['lieu'] ?? '';
        $description = $data['description'] ?? '';
        $categorie_id = $data['categorie_id'] ?? null;
        $sous_categorie_id = $data['sous_categorie_id'] ?? null;

        $stmt = $conn->prepare("INSERT INTO transactions (titre, montant, type, date, lieu, description, categorie_id, sous_categorie_id) VALUES (:titre, :montant, :type, :date, :lieu, :description, :categorie_id, :sous_categorie_id)");
        $stmt->bindParam(':titre', $titre);
        $stmt->bindParam(':montant', $montant);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':lieu', $lieu);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':categorie_id', $categorie_id);
        $stmt->bindParam(':sous_categorie_id', $sous_categorie_id);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Transaction ajoutée']);
        exit;
    }

    // Mettre à jour une transaction
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        $titre = $data['titre'] ?? '';
        $montant = $data['montant'] ?? 0;
        $date = $data['date'] ?? '';
        $lieu = $data['lieu'] ?? '';
        $description = $data['description'] ?? '';
        $categorie_id = $data['categorie_id'] ?? null;
        $sous_categorie_id = $data['sous_categorie_id'] ?? null;

        if ($id) {
            $stmt = $conn->prepare("UPDATE transactions SET titre = :titre, montant = :montant, date = :date, lieu = :lieu, description = :description, categorie_id = :categorie_id, sous_categorie_id = :sous_categorie_id WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':titre', $titre);
            $stmt->bindParam(':montant', $montant);
            $stmt->bindParam(':date', $date);
            $stmt->bindParam(':lieu', $lieu);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':categorie_id', $categorie_id);
            $stmt->bindParam(':sous_categorie_id', $sous_categorie_id);
            $stmt->execute();

            echo json_encode(['status' => 'success', 'message' => 'Transaction mise à jour']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'ID manquant']);
        }
        exit;
    }

    // Supprimer une transaction
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("DELETE FROM transactions WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode(['status' => 'success', 'message' => 'Transaction supprimée']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'ID manquant']);
        }
        exit;
    }

    echo json_encode(['status' => 'error', 'message' => 'Méthode de requête non prise en charge']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $e->getMessage()]);
    exit;
}
