import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [categorie, setCategorie] = useState('');
    const [sousCategorie, setSousCategorie] = useState('');
    const [date, setDate] = useState('');
    const [triMontant, setTriMontant] = useState('');
    const [categories, setCategories] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);

    // Fonction pour récupérer les catégories et sous-catégories
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getCategories=true');
            setCategories(response.data.categories || []);
            setSousCategories(response.data.sousCategories || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    };

    // Fonction pour appliquer les filtres
    const appliquerFiltres = async () => {
        try {
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php', {
                params: {
                    categorie,
                    sous_categorie: sousCategorie,
                    date,
                    tri_montant: triMontant
                }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des transactions :", error);
        }
    };

    // Charger les catégories et appliquer les filtres au chargement du composant
    useEffect(() => {
        fetchCategories();
        appliquerFiltres();
    }, []);

    // Mettre à jour les transactions quand les filtres changent
    useEffect(() => {
        appliquerFiltres();
    }, [categorie, sousCategorie, date, triMontant]);

    // Filtrer les sous-catégories en fonction de la catégorie sélectionnée
    const filteredSousCategories = sousCategories.filter(
        (sousCategorie) => sousCategorie.categorie_id === parseInt(categorie)
    );

    return (
        <div className="transaction-list-container">
            <h2>Filtres et Tri</h2>
            <form className="filter-form">
                <label>Catégorie :</label>
                <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                    <option value="">Toutes</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                </select>

                <label>Sous-catégorie :</label>
                <select value={sousCategorie} onChange={(e) => setSousCategorie(e.target.value)} disabled={!categorie}>
                    <option value="">Toutes</option>
                    {filteredSousCategories.map((subCat) => (
                        <option key={subCat.id} value={subCat.id}>{subCat.nom}</option>
                    ))}
                </select>

                <label>Date :</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <label>Trier par montant :</label>
                <select value={triMontant} onChange={(e) => setTriMontant(e.target.value)}>
                    <option value="">Aucun</option>
                    <option value="asc">Croissant</option>
                    <option value="desc">Décroissant</option>
                </select>

                <button type="button" onClick={appliquerFiltres}>Appliquer les Filtres</button>
            </form>

            <h2>Transactions</h2>
            <ul className="transaction-list">
                {transactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.date} - {transaction.titre} : {transaction.montant}€
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TransactionList;
