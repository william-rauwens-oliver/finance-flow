import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionList.css';

function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);
    const [editTransaction, setEditTransaction] = useState(null);

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
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php');
            setTransactions(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des transactions :", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8888/finance-flow/finance-flow/src/api.php?id=${id}`);
            fetchTransactions();
        } catch (error) {
            console.error("Erreur lors de la suppression de la transaction :", error);
        }
    };

    const handleEdit = (transaction) => {
        setEditTransaction(transaction);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:8888/finance-flow/finance-flow/src/api.php', editTransaction);
            fetchTransactions();
            setEditTransaction(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la transaction :", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, []);

    return (
        <div className="transaction-list-container">
            <h2 className="transaction-title">Transactions</h2>
            <ul className="transaction-list">
                {transactions.map((transaction) => (
                    <li key={transaction.id} className="transaction-item">
                        <span className="transaction-date">{transaction.date}</span>
                        <span className="transaction-title">{transaction.titre}</span>
                        <span className="transaction-amount">
                            {parseFloat(transaction.montant).toFixed(2)}€
                        </span>
                        <button onClick={() => handleEdit(transaction)} className="edit-button">Modifier</button>
                        <button onClick={() => handleDelete(transaction.id)} className="delete-button">Supprimer</button>
                    </li>
                ))}
            </ul>

            {editTransaction && (
                <div className="edit-transaction-form">
                    <h3>Modifier la transaction</h3>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            value={editTransaction.titre}
                            onChange={(e) => setEditTransaction({ ...editTransaction, titre: e.target.value })}
                            placeholder="Titre"
                            required
                        />
                        <input
                            type="number"
                            value={editTransaction.montant}
                            onChange={(e) => setEditTransaction({ ...editTransaction, montant: e.target.value })}
                            placeholder="Montant"
                            required
                        />
                        <input
                            type="date"
                            value={editTransaction.date}
                            onChange={(e) => setEditTransaction({ ...editTransaction, date: e.target.value })}
                            required
                        />
                        <button type="submit">Enregistrer les modifications</button>
                        <button type="button" onClick={() => setEditTransaction(null)}>Annuler</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default TransactionList;
