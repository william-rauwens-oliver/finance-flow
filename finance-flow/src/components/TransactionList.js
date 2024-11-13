import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [categorie, setCategorie] = useState('');
    const [sousCategorie, setSousCategorie] = useState('');
    const [date, setDate] = useState('');
    const [triMontant, setTriMontant] = useState('');

    const appliquerFiltres = async () => {
        try {
            const response = await axios.get(`http://localhost:8888/finance-flow/finance-flow/src/api.php`, {
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

    useEffect(() => {
        appliquerFiltres();
    }, [categorie, sousCategorie, date, triMontant]);

    return (
        <div>
            <h2>Filtres et Tri</h2>
            <form>
                <label>Catégorie :</label>
                <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                    <option value="">Toutes</option>
                    {/* Mappez les catégories ici */}
                </select>

                <label>Sous-catégorie :</label>
                <select value={sousCategorie} onChange={(e) => setSousCategorie(e.target.value)}>
                    <option value="">Toutes</option>
                    {/* Mappez les sous-catégories ici */}
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
            <ul>
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
