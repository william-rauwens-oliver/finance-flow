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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getCategories=true');
                setCategories(response.data.categories || []);
                setSousCategories(response.data.sousCategories || []);
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories :", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory) {
            console.warn("Catégorie non sélectionnée.");
            return;
        }

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

        try {
            const response = await axios.post('http://localhost:8888/finance-flow/finance-flow/src/api.php', transaction);
            if (response.data.status === 'success') {
                console.log("Transaction ajoutée avec succès");
                onAddTransaction(); // Rappel pour mettre à jour la liste
            } else {
                console.warn("Erreur détectée :", response.data.message);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la transaction :", error);
        }
    };

    // Filtrer les sous-catégories en fonction de la catégorie sélectionnée
    const filteredSousCategories = sousCategories.filter(
        (sousCategorie) => sousCategorie.categorie_id === parseInt(selectedCategory)
    );

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Titre"
                required
            />
            <input
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="Montant"
                required
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="depense">Dépense</option>
                <option value="revenu">Revenu</option>
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <input
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                placeholder="Lieu"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            ></textarea>

            <label>Catégorie :</label>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
            >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>
                        {categorie.nom}
                    </option>
                ))}
            </select>

            <label>Sous-catégorie :</label>
            <select
                value={selectedSousCategorie}
                onChange={(e) => setSelectedSousCategorie(e.target.value)}
                required
                disabled={!selectedCategory}
            >
                <option value="">Sélectionnez une sous-catégorie</option>
                {filteredSousCategories.map((sousCategorie) => (
                    <option key={sousCategorie.id} value={sousCategorie.id}>
                        {sousCategorie.nom}
                    </option>
                ))}
            </select>

            <button type="submit">Ajouter</button>
        </form>
    );
}

export default TransactionForm;