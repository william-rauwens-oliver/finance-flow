<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');


// Configuration de la connexion à la base de données
try {
    $conn = new PDO("mysql:host=localhost;dbname=finance-flow", 'root', 'root');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Gestion des requêtes pour récupérer les catégories et sous-catégories
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

    // Gestion des requêtes GET pour récupérer les transactions
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

    // Réponse par défaut pour les autres méthodes de requête
    echo json_encode(['status' => 'error', 'message' => 'Méthode de requête non prise en charge']);
    
} catch (PDOException $e) {
    $errorResponse = ['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $e->getMessage()];
    echo json_encode($errorResponse);
    error_log("Erreur de connexion à la base de données : " . $e->getMessage());
    exit;
}
