const Commande = require("../../models/client/commande/Commande.model");
const CommandeDetails = require("../../models/client/commande/CommandeDetails.model");
const BonDeCommandeDetails = require("../../models/client/commande/BonDeCommandeDetails.model");
const BonDeCommande = require("../../models/client/commande/BonDeCommande.model");
const Produit = require("../../models/proprietaire/produit/Produit.model");
const Notification = require("../../models/notification/Notification.model");
const Client = require("../../models/client/Client.model");
class PanierService {
    static async genererCommande(listePanier){
        let commande = new Commande({
            idClient: listePanier[0].idClient,
            designation: `Commande du client ${listePanier[0].idClient} - ${new Date().toLocaleString()}`
        });
        await commande.save();
        let commandeDetails = [];
        listePanier.forEach(item => {
            let detail = new CommandeDetails({
                idMere: commande._id,
                idProduit: item.idProduit,
                quantite: item.quantite,
                prixUnitaire: item.prixUnitaire
            });
            commandeDetails.push(detail);
        });
        for (const detail of commandeDetails) {
            await detail.save();
        }

        let listeCommandeParBoutique = {};
        let listeBoutiqueIds = new Set();
        for (const detail of listePanier) {
            const idBoutique = detail?.idBoutique;
            listeBoutiqueIds.has(idBoutique) || listeBoutiqueIds.add(idBoutique);
            if (!listeCommandeParBoutique[idBoutique]) listeCommandeParBoutique[idBoutique] = [];
            listeCommandeParBoutique[idBoutique].push({
                idProduit: detail.idProduit,
                quantite: detail.quantite,
                prixUnitaire: detail.prixUnitaire
            });
        }

        for (const idBoutique of listeBoutiqueIds) {
            let bonDeCommande = new BonDeCommande({
                idCommande: commande._id,
                idClient: commande.idClient,
                idBoutique: idBoutique,
                designation: `Bon de commande pour la boutique ${idBoutique} - Commande ${commande._id}`
            });
            await bonDeCommande.save();
            let details = listeCommandeParBoutique[idBoutique].map(item => {
                return new BonDeCommandeDetails({
                    idMere: bonDeCommande._id,
                    idProduit: item.idProduit,
                    quantite: item.quantite,
                    prixUnitaire: item.prixUnitaire
                });
            });
            for (const detail of details) {
                await detail.save();
            }
            const client = await Client.findById(bonDeCommande.idClient);
            const notification = new Notification({
                idUser: idBoutique,
                title: "Nouvelle commande",
                message: `Vous avez reçu une nouvelle commande du client ${client.nom} ${client.prenom}.`,
                lien: `boutique/bon_commande/details/${bonDeCommande._id}`,
                badge: "<div class=\"notification-icon\" style=\"background-color: #dbeafe;color: #3b82f6;\">\n" +
                    "                    <i class=\"fa fa-info-circle\"></i>\n" +
                    "                  </div>",
            });
            await notification.save();
        }
        return commande;
    }
}

module.exports = {PanierService}
