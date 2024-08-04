const User = require("../models/User.js");

async function showPage(req, res) {
    const userId = req.session.user.id;
    const userObject = await User.findOne({ _id: userId }, { _id: 0, locations: 1 });
    const locations = userObject.locations;
    res.render("layouts/main", { title: "Saved Locations", page: "savedLocations", locations: locations });
}

async function getLocation(req, res) {
    const userId = req.session.user.id;
    const address = req.params.address;

    const existentAddress = await User.find(
        {
            _id: userId,
            "locations.address": address
        },
        {
            "locations.$": 1
        }
    );

    if (existentAddress.length > 0) {
        res.json(true);
    }
    else {
        res.json(false);
    }
}

async function saveLocation(req, res) {
    const address = req.body.address;
    const dangerLevel = req.body.dangerLevel;

    const newLocation = { address, dangerLevel };

    const userId = req.session.user.id;
    await User.updateOne(
        { _id: userId },
        { $push: { locations: newLocation } }
    );

    res.status(201).send("Location saved successfully");
}

async function deleteLocation(req, res) {
    const userId = req.session.user.id;
    const address = req.body.address;

    await User.updateOne(
        { _id: userId },
        { $pull: { locations: { address: address } } }
    );

    res.status(200).send("Location deleted successfully");
}

module.exports = {
    showPage,
    getLocation,
    saveLocation,
    deleteLocation
};