// src/chartConfig.js
import { Chart, ArcElement, LineElement, BarElement, PointElement, LineController, PieController, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les éléments nécessaires
Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    LineController,
    PieController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);
