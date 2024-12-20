import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Solde from './components/Solde';
import CategoryChart from './components/CategoryChart';
import HistoryChart from './components/HistoryChart';
import BudgetForm from './components/BudgetForm';
import './App.css';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [solde, setSolde] = useState(0);
    const [budgets, setBudgets] = useState({});

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php');
            setTransactions(response.data);
            calculateSolde(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des transactions :", error);
        }
    };

    const fetchBudgets = async () => {
        try {
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getBudgets=true');
            const budgetData = response.data.reduce((acc, { categorie_id, budget }) => ({ ...acc, [categorie_id]: budget }), {});
            setBudgets(budgetData);
        } catch (error) {
            console.error("Erreur lors de la récupération des budgets :", error);
        }
    };

    const calculateSolde = (transactions) => {
        const total = transactions.reduce((acc, tr) => acc + (tr.type === 'revenu' ? parseFloat(tr.montant) : -parseFloat(tr.montant)), 0);
        setSolde(total);
    };

    const handleAddTransaction = async (transaction) => {
        try {
            const response = await axios.post('http://localhost:8888/finance-flow/finance-flow/src/api.php', transaction);
            if (response.data.status === 'success') {
                fetchTransactions(); // Actualise les transactions si l'ajout est réussi
            } else {
                console.warn("Erreur détectée :", response.data.message || "Message d'erreur non défini.");
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la transaction :", error.message || error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchBudgets();
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Mon Gestionnaire de Budget</h1>
                <Solde solde={solde} />
            </header>
            <main className="main-content">
                <div className="charts-container">
                    <CategoryChart transactions={transactions} budgets={budgets} />
                    <HistoryChart transactions={transactions} />
                </div>
                <BudgetForm />
                <TransactionForm onAddTransaction={handleAddTransaction} />
                <TransactionList transactions={transactions} />
            </main>
        </div>
    );
}

export default App;
