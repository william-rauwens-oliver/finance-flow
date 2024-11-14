
import React from 'react';

function Solde({ solde }) {
    return (
        <div id="solde">
            <h2>Solde : {solde.toFixed(2)}€</h2>
        </div>
    );
}

export default Solde;
