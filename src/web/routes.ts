import express = require("express");
import { resolve } from "path";
import Web from ".";

class Routes {
    constructor(client: Web) {

        client.app.use('/static', express.static(resolve(__dirname, 'public')));

        client.app.get('/', (req, res) => 
            res.sendFile(resolve(__dirname, 'views', 'index.html')));
    }
}

export default Routes