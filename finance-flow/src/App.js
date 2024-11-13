import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Solde from './components/Solde';
import CategoryChart from './components/CategoryChart';
import HistoryChart from './components/HistoryChart';
import './App.css';
import './chartConfig';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [solde, setSolde] = useState(0);

    // Récupérer les transactions depuis l'API
    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php');
            setTransactions(response.data);
            calculateSolde(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des transactions :", error);
        }
    };

    // Calculer le solde en fonction des transactions
    const calculateSolde = (transactions) => {
        const total = transactions.reduce((acc, tr) => acc + (tr.type === 'revenu' ? parseFloat(tr.montant) : -parseFloat(tr.montant)), 0);
        setSolde(total);
    };

    // Ajouter une transaction et mettre à jour la liste
    const handleAddTransaction = async (transaction) => {
        try {
            const response = await axios.post('http://localhost:8888/finance-flow/finance-flow/src/api.php', transaction);
            if (response.data.status === 'success') {
                fetchTransactions();  // Rafraîchir les transactions après ajout
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la transaction :", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="container">
            <header>
                <h1>Mon Gestionnaire de Budget</h1>
            </header>
            <Solde solde={solde} />
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <TransactionList transactions={transactions} />
            <CategoryChart transactions={transactions} /> {/* Graphique de répartition par catégorie */}
            <HistoryChart transactions={transactions} />  {/* Graphique de l'historique */}
        </div>
    );
}

export default App;
