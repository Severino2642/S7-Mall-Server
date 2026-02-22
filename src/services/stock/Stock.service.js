const Stock = require("../../models/proprietaire/stock/Stock.model");
const StockDetails = require("../../models/proprietaire/stock/StockDetails.model");
const {ConstanteEtat} = require("../../config/constante");
const Produit = require("../../models/proprietaire/produit/Produit.model");

class StockService {
    static async validateStockMouvement(stock, filles) {
        if (filles == null) {
            filles = await StockDetails.find({idMere: stock._id});
        }

        const totalsByProduit = new Map();
        for (const detail of filles) {
            const key = String(detail.idProduit);
            const current = totalsByProduit.get(key) || {entree: 0, sortie: 0};
            totalsByProduit.set(key, {
                entree: current.entree + (detail.entree || 0),
                sortie: current.sortie + (detail.sortie || 0),
            });
        }

        let listProduits = [];
        for (const [idProduit, totals] of totalsByProduit.entries()) {
            const produit = await Produit.findById(idProduit);
            if (!produit) continue;

            const quantiteInitiale = produit.quantite || 0;
            const quantiteApresEntree = quantiteInitiale + (totals.entree || 0);

            if ((totals.sortie || 0) > 0 && quantiteApresEntree < totals.sortie) {
                throw new Error(`Stock insuffisant pour le produit ${produit.nom}. Disponible: ${quantiteApresEntree}, Demandé: ${totals.sortie}`);
            }

            produit.quantite = quantiteApresEntree - (totals.sortie || 0);
            listProduits.push(produit);
        }

        // Mettre à jour la quantité de chaque produit
        for (const produit of listProduits) {
            await produit.save();
        }

        if (stock.status !== ConstanteEtat.VALIDER) {
            stock.status = ConstanteEtat.VALIDER;
            await stock.save();
        }
        return stock;
    }
}

module.exports = {StockService};
