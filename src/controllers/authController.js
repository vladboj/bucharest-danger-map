const User = require("../models/User");
const bcrypt = require("bcrypt");

function showSignupPage(req, res) {
    res.render("layouts/main", { title: "Signup", page: "signup" });
}

async function handleSignup(req, res) {
    try {
        if (!User) {
            return res.status(500).send("Database not initialized");
        }
        const { username, password } = req.body;

        const existingUser = await User.where("username").equals(username).exec();
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "username_exists" });
        }

        const saltRounds = 5;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({ username: username, password: encryptedPassword });
        await user.save();

        req.session.user = {
            id: user._id,
            username: user.username
        }

        res.status(200).send("Logged in successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
}
function showLoginPage(req, res) {
    res.render("layouts/main", { title: "Login", page: "login" });
}

async function handleLogin(req, res) {
    try {
        if (!User) {
            return res.status(500).send("Database not initialized");
        }
        const { username, password } = req.body;

        const existingUserArray = await User.where("username").equals(username).exec();
        const existingUser = existingUserArray[0];
        if (!existingUser) {
            return res.status(400).json({ error: 'username_not_exist' });
        }

        const encryptedPasswordArray = await User.where("username").equals(username).select("password -_id").exec();
        const encryptedPassword = encryptedPasswordArray[0].password;
        const matches = await bcrypt.compare(password, encryptedPassword);

        if (!matches) {
            return res.status(400).json({ error: 'password_incorrect' });
        }

        req.session.user = {
            id: existingUser._id,
            username: existingUser.username
        }

        res.status(200).send("Logged in successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging in user");
    }
}

function handleLogout(req, res) {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('connect.sid', { path: '/' });
    }
    res.status(200).send('Logout successful');
}

module.exports = {
    showSignupPage,
    handleSignup,
    showLoginPage,
    handleLogin,
    handleLogout
};