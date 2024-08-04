const express = require("express");
const app = express();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = require("path");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));


const connectToDatabase = require("./config/db.js");
if (process.env.NODE_ENV !== "production") {
    (async () => await connectToDatabase())();
}
else {
    app.use(async (req, res, next) => {
        await connectToDatabase();
        next();
    });
}

const { createClient } = require('redis');
let redisClient;
if (process.env.NODE_ENV !== "production") {
    redisClient = createClient();
}
else {
    redisClient = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        }
    });
}
redisClient.connect().catch(console.error);
const RedisStore = require("connect-redis").default;
const redisStore = new RedisStore({ client: redisClient })

const session = require("express-session");
app.use(session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const authRouter = require("./routes/authRouter.js");
const mapRouter = require("./routes/mapRouter.js");
const savedLocationsRouter = require("./routes/savedLocationsRouter.js");
app.use('/auth', authRouter);
app.use("/map", mapRouter);
app.use("/saved-locations", savedLocationsRouter);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

if (process.env.NODE_ENV !== "production") {
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
}

module.exports = app;