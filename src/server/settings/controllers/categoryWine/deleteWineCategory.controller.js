const Wine_category = require("../../../../database/model/wineCategory.model");
const { User } = require('../../../../database/model/relationships');
//Function that checks if the id has a UUID structure.
function esUUID(id) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(id);
}

const deleteWineCategory = async (req, res) => {
    //User id
    const { userId } = req.query;
    //Wine id
    const { id } = req.params;
    try {
        //Valid if the user id comes from the query
        if (Object.keys(req.query).length === 0) return res.status(400).json({ status: 400, error: "The id field is required" });
        //Valid if the id is correct
        if (id === "") return res.status(400).json({ status: 400, error: "The product id field is empty" });
        if (userId === "") return res.status(400).json({ status: 400, error: "The user id field is empty" });
        if (!esUUID(id)) return res.status(409).json({ status: 409, error: "The product id field has no UUID structure" });
        if (!esUUID(userId)) return res.status(409).json({ status: 409, error: "The user id field has no UUID structure" });
        //Valid if the user exists
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ status: 404, error: "The user does not exist" });
        //Valid if the user is an administrator
        if (user.is_Admin === false) return res.status(401).json({ status: 401, error: "User is not an administrator" });
        const response = await Wine_category.findByPk(id);
        //Valid if we have a response
        if (!response) return res.status(404).json({ status: 404, message: "response not found" })
        await response.destroy();
        res.status(200).json({ status: 200, message: "The category was been deleted", data: response })
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Internal server error" })
    }
};

module.exports = deleteWineCategory;