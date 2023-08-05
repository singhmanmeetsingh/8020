exports.index = (req, res) => {
    res.render("./index", {id: false});
}

// this is example for dynamic routes
exports.dyn = (req, res) => {
    res.render("./index",{id: req?.params?.id});
}