require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/db");
const centreCommercialRoutes = require('./routes/centre_commercial/CentreCommercial.route');
const authRoutes = require('./routes/authentification/Authentification.route');
const roleRoutes = require('./routes/authentification/Role.route');
const boxeRoutes = require('./routes/centre_commercial/Boxe.route');
const offreRoutes = require('./routes/centre_commercial/OffreDeLocation.route');
const proprietaireRoutes = require('./routes/proprietaire/Proprietaire.route');
const {getAuthParams} = require("./controllers/Upload.controller");
const fileTypeRoutes = require('./routes/fichier/FileType.route');
const fileRoutes = require('./routes/fichier/File.route');
const demandeLocationRoutes = require('./routes/proprietaire/DemandeLocation.route');
const boutiqueRoutes = require('./routes/proprietaire/Boutique.route');
const categorieRoutes = require('./routes/proprietaire/produit/Categorie.route');
const produitRoutes = require('./routes/proprietaire/produit/Produit.route');
const stockRoutes = require('./routes/proprietaire/stock/Stock.route');
const clientRoutes = require('./routes/client/Client.route');
const venteRoutes = require('./routes/proprietaire/vente/Vente.route');
const caisseRoutes = require('./routes/caisse/Caisse.route');
const mouvementCaisseRoutes = require('./routes/caisse/MouvementCaisse.route');
const panierRoutes = require('./routes/client/panier/Panier.route');
const commandeRoutes = require('./routes/client/commande/Commande.route');
const bonDeCommandeRoutes = require('./routes/client/commande/BonDeCommande.route');
const notificationsRoutes = require('./routes/notification/Notification.route');
const managerRoutes = require('./routes/proprietaire/manager/Manager.route');
const paymentLoyerRoutes = require('./routes/proprietaire/loyer/PaymentLoyer.route');
const followerRoutes = require('./routes/followers/Follower.route');
const locationBoxeRoutes = require('./routes/proprietaire/LocationBoxe.route');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS - Version simplifiée pour Render
const corsOptions = {
  // origin: function (origin, callback) {
  //   // Liste des origines autorisées
  //   const allowedOrigins = [
  //     'http://localhost:4200',
  //     'http://localhost:3000',
  //     'https://s7-mall-client-v2.vercel.app',
  //     // Ajoute l'URL de ton frontend si différent
  //   ];
  //
  //   // Permettre les requêtes sans origin (comme les appels server-to-server)
  //   if (!origin) return callback(null, true);
  //
  //   if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
  //     callback(null, true);
  //   } else {
  //     console.log('Origin bloquée:', origin);
  //     callback(new Error('Non autorisé par CORS'));
  //   }
  // },
  origin:'*', // Permet toutes les origines (à utiliser avec précaution en production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: false,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Logger pour debug (optionnel en production)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use("/api/centre", centreCommercialRoutes);
app.use("/api/authentification", authRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/boxe", boxeRoutes);
app.use("/api/offre", offreRoutes);
app.use("/api/proprietaire", proprietaireRoutes);
app.get('/api/imagekit/auth', getAuthParams);
app.use("/api/filetype", fileTypeRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/demande", demandeLocationRoutes);
app.use("/api/boutique", boutiqueRoutes);
app.use("/api/categorie", categorieRoutes);
app.use("/api/produit", produitRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/vente", venteRoutes);
app.use("/api/caisse", caisseRoutes);
app.use("/api/mouvement_caisse", mouvementCaisseRoutes);
app.use("/api/panier", panierRoutes);
app.use("/api/commande", commandeRoutes);
app.use("/api/bon_de_commande", bonDeCommandeRoutes);
app.use("/api/notification", notificationsRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/payment_loyer", paymentLoyerRoutes);
app.use("/api/follower", followerRoutes);
app.use("/api/location_boxe", locationBoxeRoutes);

// Middleware pour gérer les erreurs CORS
app.use((err, req, res, next) => {
  if (err.message === 'Non autorisé par CORS') {
    res.status(403).json({ error: 'CORS non autorisé' });
  } else {
    next(err);
  }
});

// Connexion à MongoDB
connectDB();

// 🌟 DÉMARRAGE DU SERVEUR POUR RENDER (MODIFICATION ICI) 🌟
if (require.main === module) {
  // Si ce fichier est exécuté directement (pas importé)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Serveur Render démarré sur le port ${PORT}`);
    console.log(`🌍 Acceptant les connexions sur toutes les interfaces`);
    console.log(`🚀 Environnement: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export pour éventuel usage serverless (optionnel, gardé pour compatibilité)
module.exports = app;
