const bcrypt = require("bcrypt");
const User = require("../../../../database/model/user.model");
const { generarJWT } = require("../../helper/user/generarJWT");



// Enpoint for user login
const login = async (req, res) => {
    try {
        // We take the data that comes by body
        const { email, password } = req.body;
        // We look for the user by email
        const user = await User.findOne({ where: { email: email } });
        // We verify that it does not exist
        if (!user) return res.status(404).json({ message: "User not exist" })
        // We compare the database password with the one the user sends us
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(404).json({ message: "Password incorrect" })
        // We confirm that they are correct
        if (!user.accountConfirmed) {
            const error = new Error('Tu usuario no ha sido confirmado')
            return res.status(403).json({ msg: error.message })
        }
        // // si la cuenta del usuario esta activa 
        // if(!user.is_active) { 
        //     return res.status(404).json({ message: "Account is not active" })
        // }
        // We show the data of the authenticated user
        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            date_birth: user.date_birth,
            email: user.email,
            token: generarJWT(user.id),
            profile_picture:user.profile_picture
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = login;