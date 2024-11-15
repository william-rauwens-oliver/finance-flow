import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionList.css';

function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);
    const [categorie, setCategorie] = useState('');
    const [sousCategorie, setSousCategorie] = useState('');
    const [date, setDate] = useState('');
    const [triMontant, setTriMontant] = useState('');
    const [editTransactionId, setEditTransactionId] = useState(null);
    const [editedTransaction, setEditedTransaction] = useState({});

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getCategories=true');
            setCategories(response.data.categories || []);
            setSousCategories(response.data.sousCategories || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    };

    const fetchTransactions = async () => {
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

    // Fonction pour supprimer une transaction
    const deleteTransaction = async (id) => {
        try {
            await axios.delete(`http://localhost:8888/finance-flow/finance-flow/src/api.php?id=${id}`);
            setTransactions(transactions.filter((transaction) => transaction.id !== id));
            alert('Transaction supprimée avec succès.');
        } catch (error) {
            console.error("Erreur lors de la suppression de la transaction :", error);
        }
    };

    // Fonction pour gérer le clic sur "Modifier"
    const handleEditClick = (transaction) => {
        setEditTransactionId(transaction.id);
        setEditedTransaction({ ...transaction });
    };

    // Fonction pour mettre à jour une transaction
    const updateTransaction = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:8888/finance-flow/finance-flow/src/api.php', editedTransaction);
            setTransactions(transactions.map((t) => (t.id === editedTransaction.id ? editedTransaction : t)));
            alert('Transaction mise à jour avec succès.');
            setEditTransactionId(null); // Fermer le formulaire
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la transaction :", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [categorie, sousCategorie, date, triMontant]);

    const filteredSousCategories = sousCategories.filter(
        (subCat) => subCat.categorie_id === parseInt(categorie)
    );

    return (
        <div className="transaction-list-container">
            <h2 className="transaction-title">Trier et Filtrer les Transactions</h2>
            <form className="filter-form">
                <div className="form-group">
                    <label>Catégorie :</label>
                    <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="filter-select">
                        <option value="">Toutes</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nom}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Sous-catégorie :</label>
                    <select
                        value={sousCategorie}
                        onChange={(e) => setSousCategorie(e.target.value)}
                        className="filter-select"
                        disabled={!categorie}
                    >
                        <option value="">Toutes</option>
                        {filteredSousCategories.map((subCat) => (
                            <option key={subCat.id} value={subCat.id}>{subCat.nom}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Date :</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="form-group">
                    <label>Trier par montant :</label>
                    <select
                        value={triMontant}
                        onChange={(e) => setTriMontant(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Aucun</option>
                        <option value="asc">Croissant</option>
                        <option value="desc">Décroissant</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={fetchTransactions}
                    className="filter-button"
                >
                    Appliquer les Filtres
                </button>
            </form>

            <h2 className="transaction-title">Transactions</h2>
            <ul className="transaction-list">
                {transactions.map((transaction) => (
                    <li key={transaction.id} className="transaction-item">
                        <span className="transaction-date">{transaction.date}</span>
                        <span className="transaction-title">{transaction.titre}</span>
                        <span className="transaction-amount">
                            {Number(transaction.montant).toFixed(2)} €
                        </span>
                        <div className="transaction-actions">
                            <button
                                className="edit-button"
                                onClick={() => handleEditClick(transaction)}
                            >
                                Modifier
                            </button>
                            <button
                                className="delete-button"
                                onClick={() => deleteTransaction(transaction.id)}
                            >
                                Supprimer
                            </button>
                        </div>
                        {editTransactionId === transaction.id && (
                            <form className="edit-form" onSubmit={updateTransaction}>
                                <input
                                    type="text"
                                    value={editedTransaction.titre}
                                    onChange={(e) =>
                                        setEditedTransaction({ ...editedTransaction, titre: e.target.value })
                                    }
                                    placeholder="Titre"
                                    required
                                />
                                <input
                                    type="number"
                                    value={editedTransaction.montant}
                                    onChange={(e) =>
                                        setEditedTransaction({ ...editedTransaction, montant: e.target.value })
                                    }
                                    placeholder="Montant"
                                    required
                                />
                                <input
                                    type="date"
                                    value={editedTransaction.date}
                                    onChange={(e) =>
                                        setEditedTransaction({ ...editedTransaction, date: e.target.value })
                                    }
                                    required
                                />
                                <textarea
                                    value={editedTransaction.description}
                                    onChange={(e) =>
                                        setEditedTransaction({ ...editedTransaction, description: e.target.value })
                                    }
                                    placeholder="Description"
                                />
                                <button type="submit" className="save-button">
                                    Enregistrer
                                </button>
                            </form>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TransactionList;
