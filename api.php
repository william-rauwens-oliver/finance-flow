<?php
header('Content-Type: application/json');

try {
    $conn = new PDO("mysql:host=localhost;dbname=finance-flow", 'root', 'root');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Récupération et traitement des données envoyées
        $data = json_decode(file_get_contents('php://input'), true);
        $montant = $data['montant'];
        $date = $data['date'];
        $lieu = $data['lieu'];
        $titre = $data['titre'];
        $description = $data['description'];
        $type = $data['type'];

        $query = "INSERT INTO transactions (montant, date, lieu, titre, description, type) VALUES (:montant, :date, :lieu, :titre, :description, :type)";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            'montant' => $montant,
            'date' => $date,
            'lieu' => $lieu,
            'titre' => $titre,
            'description' => $description,
            'type' => $type,
        ]);

        echo json_encode(['status' => 'success']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Récupération des transactions pour l'affichage
        $stmt = $conn->query("SELECT * FROM transactions ORDER BY date DESC");
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($transactions);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}
?>
