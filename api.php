<?php
header('Content-Type: application/json');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error_log.txt');

try {
    $conn = new PDO("mysql:host=localhost;dbname=finance-flow", 'root', 'root');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $montant = $data['montant'];
        $date = $data['date'];
        $lieu = $data['lieu'];
        $titre = $data['titre'];
        $description = $data['description'];
        $type = $data['type'];
        $categorie_id = $data['categorie_id'];
        $sous_categorie_id = $data['sous_categorie_id'];

        $query = "INSERT INTO transactions (montant, date, lieu, titre, description, type, categorie_id, sous_categorie_id)
                  VALUES (:montant, :date, :lieu, :titre, :description, :type, :categorie_id, :sous_categorie_id)";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            'montant' => $montant,
            'date' => $date,
            'lieu' => $lieu,
            'titre' => $titre,
            'description' => $description,
            'type' => $type,
            'categorie_id' => $categorie_id,
            'sous_categorie_id' => $sous_categorie_id,
        ]);

        echo json_encode(['status' => 'success']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $query = "SELECT * FROM transactions WHERE 1=1";
        $params = [];

        if (!empty($_GET['categorie'])) {
            $query .= " AND categorie_id = :categorie";
            $params['categorie'] = $_GET['categorie'];
        }

        if (!empty($_GET['sous_categorie'])) {
            $query .= " AND sous_categorie_id = :sous_categorie";
            $params['sous_categorie'] = $_GET['sous_categorie'];
        }

        if (!empty($_GET['date'])) {
            $query .= " AND date = :date";
            $params['date'] = $_GET['date'];
        }

        if (!empty($_GET['tri_montant'])) {
            $query .= $_GET['tri_montant'] === 'asc' ? " ORDER BY montant ASC" : " ORDER BY montant DESC";
        } else {
            $query .= " ORDER BY date DESC";
        }

        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($transactions ?: []);
        exit;
    }
} catch (PDOException $e) {
    error_log("Erreur PDO : " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erreur interne du serveur']);
    exit;
}
