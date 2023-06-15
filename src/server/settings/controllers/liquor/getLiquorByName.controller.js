const Liquor = require("../../../../database/model/liquor.model.js");
const { Op } = require("sequelize");

const getLiquorByName = async (req, res) => {
    //wine name
    const { name } = req.query;
    try {
        //Valid if the name comes from the query
        if (Object.keys(req.query).length === 0) return res.status(400).json({ status: 400, error: "The name field is required" });
        //Valid if the name is correct
        if (name === "") return res.status(400).json({ status: 400, error: "The id field is empty" });
        const response = await Liquor.findAll({
            where: {
                name: { [Op.iLike]: `${name}` },
            }
        });
        //Valid if we have a response
        if (!response) return res.status(404).json({ status: 404, message: "Product not found" })
        res.status(200).json({ status: 200, message: "The product was found", data: response })
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Internal server error" })
    }
};

module.exports = getLiquorByName;