import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionForm({ onAddTransaction }) {
    const [titre, setTitre] = useState('');
    const [montant, setMontant] = useState('');
    const [type, setType] = useState('depense');
    const [date, setDate] = useState('');
    const [lieu, setLieu] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSousCategorie, setSelectedSousCategorie] = useState('');
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [selectedUtilisateurs, setSelectedUtilisateurs] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getCategories=true');
            setCategories(response.data.categories || []);
            setSousCategories(response.data.sousCategories || []);
        };

        const fetchUtilisateurs = async () => {
            const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getUtilisateurs=true');
            setUtilisateurs(response.data || []);
        };

        fetchCategories();
        fetchUtilisateurs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const transaction = {
            titre,
            montant: parseFloat(montant),
            type,
            date,
            lieu,
            description,
            categorie_id: selectedCategory,
            sous_categorie_id: selectedSousCategorie
        };

        const response = await axios.post('http://localhost:8888/finance-flow/finance-flow/src/api.php', transaction);
        if (response.data.status === 'success') {
            // Partager la transaction avec les utilisateurs sélectionnés
            await axios.post('http://localhost:8888/finance-flow/finance-flow/src/api.php', {
                shareTransaction: true,
                transaction_id: response.data.transaction_id,
                utilisateur_ids: selectedUtilisateurs
            });
            alert('Transaction ajoutée et partagée');
            onAddTransaction();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Formulaire pour ajouter une transaction */}
            <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre" required />
            <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="Montant" required />
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="depense">Dépense</option>
                <option value="revenu">Revenu</option>
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <input type="text" value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Lieu" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>

            <label>Catégorie :</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>{categorie.nom}</option>
                ))}
            </select>

            <label>Sous-catégorie :</label>
            <select value={selectedSousCategorie} onChange={(e) => setSelectedSousCategorie(e.target.value)} required>
                <option value="">Sélectionnez une sous-catégorie</option>
                {sousCategories.map((sousCategorie) => (
                    <option key={sousCategorie.id} value={sousCategorie.id}>{sousCategorie.nom}</option>
                ))}
            </select>

            <label>Partager avec :</label>
            <select multiple value={selectedUtilisateurs} onChange={(e) => setSelectedUtilisateurs([...e.target.selectedOptions].map(option => option.value))}>
                {utilisateurs.map((user) => (
                    <option key={user.id} value={user.id}>{user.nom}</option>
                ))}
            </select>

            <button type="submit">Ajouter et Partager</button>
        </form>
    );
}

export default TransactionForm;
