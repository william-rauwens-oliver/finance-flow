<?php
header('Content-Type: application/json');

try {
    $conn = new PDO("mysql:host=localhost;dbname=finance-flow", 'root', 'root');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['titre'], $data['montant'], $data['type'], $data['date'], $data['categorie_id'], $data['sous_categorie_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Données manquantes pour la transaction']);
            exit;
        }

        $titre = $data['titre'];
        $montant = $data['montant'];
        $type = $data['type'];
        $date = $data['date'];
        $lieu = $data['lieu'] ?? null;
        $description = $data['description'] ?? null;
        $categorie_id = $data['categorie_id'];
        $sous_categorie_id = $data['sous_categorie_id'];

        $query = "INSERT INTO transactions (titre, montant, type, date, lieu, description, categorie_id, sous_categorie_id) 
                  VALUES (:titre, :montant, :type, :date, :lieu, :description, :categorie_id, :sous_categorie_id)";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            ':titre' => $titre,
            ':montant' => $montant,
            ':type' => $type,
            ':date' => $date,
            ':lieu' => $lieu,
            ':description' => $description,
            ':categorie_id' => $categorie_id,
            ':sous_categorie_id' => $sous_categorie_id,
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Transaction ajoutée avec succès']);
        exit;
    }

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
    
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $e->getMessage()]);
    exit;
}
