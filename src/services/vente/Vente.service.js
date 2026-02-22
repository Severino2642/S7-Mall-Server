const Stock = require("../../models/proprietaire/stock/Stock.model");
const StockDetails = require("../../models/proprietaire/stock/StockDetails.model");
const VenteDetails = require("../../models/proprietaire/vente/VenteDetails.model");
const {StockService} = require("../stock/Stock.service");
const {ConstanteEtat} = require("../../config/constante");
class VenteService {
    static async genererMouvementStock(vente, filles) {
        try {
            if (filles == null) {
                filles = await VenteDetails.find({ idMere: vente._id });
            }

            let mouvementStock = new Stock({
                idSource: vente._id,
                idBoutique: vente.idBoutique,
                idTypeMvtStock: ConstanteEtat.idTypeMvtStock.SORTIE,
                designation: `Vente ${vente._id} - Client ${vente.idClient}`,
                status: 11
            });

            let mvtStockDetails = [];

            for (let detail of filles) {
                let mvtStockDetail = new StockDetails({
                    idProduit: detail.idProduit,
                    sortie: detail.quantite,
                    remarque: detail.remarque
                });
                mvtStockDetails.push(mvtStockDetail);
            }

            await StockService.validateStockMouvement(mouvementStock, mvtStockDetails);

            await mouvementStock.save();
            for (const detail of mvtStockDetails) {
                detail.idMere = mouvementStock._id;
                await detail.save();
            }

            return mouvementStock;

        } catch (error) {
            // ✅ Log et propagation
            console.error("Erreur dans genererMouvementStock:", error);
            throw error; // ✅ Important : propage l'erreur
        }
    }
}

module.exports = {VenteService};
