<?php
$conn = new PDO("mysql:host=localhost;dbname=finance-flow", 'root', 'root');

function ajouterTransaction($montant, $date, $lieu, $titre, $description, $categorie_id, $sous_categorie_id, $type) {
    global $conn;
    $query = "INSERT INTO transactions (montant, date, lieu, titre, description, categorie_id, sous_categorie_id, type)
              VALUES (:montant, :date, :lieu, :titre, :description, :categorie_id, :sous_categorie_id, :type)";
    $stmt = $conn->prepare($query);
    $stmt->execute(compact('montant', 'date', 'lieu', 'titre', 'description', 'categorie_id', 'sous_categorie_id', 'type'));
}

function obtenirTransactions() {
    global $conn;
    $stmt = $conn->query("SELECT * FROM transactions ORDER BY date DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


?>