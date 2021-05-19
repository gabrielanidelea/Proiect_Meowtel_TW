const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidv1 = require('uuid/v1');

const fs = require("fs");

const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

app.use("/", express.static('hotel'));

app.listen("3010", () =>
    console.log("Server started at: http://localhost:3010")
);

app.get("/pisici", (req, res) => {
    const pisiciList = readPisiciJSONFile();
    res.send(pisiciList); // se trimite json inapoi sub forma de lista
});

function readPisiciJSONFile() {
    return JSON.parse(fs.readFileSync("pisici.json"))["pisici"]; // citeste din pisici.json
}

function writePisiciJSONFile(content) { // scrie in fisierul pisici.json
    fs.writeFileSync(
        "pisici.json",
        JSON.stringify({ pisici: content }), // face jsonul lista de obiecte
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

app.post("/pisici", (req, res) => {
    const pisiciList = readPisiciJSONFile();
    const newPisica = req.body;
    newPisica.id = uuidv1(); //creez un id prin uuidv1 
    const newPisiciList = [...pisiciList, newPisica]; //copiez lista de pisici initiale si adaug noua pisica
    writePisiciJSONFile(newPisiciList);
    res.json(newPisica);
});

app.put("/pisici/:id", (req, res) => { // se apeleaza la update
    const pisiciList = readPisiciJSONFile();
    const id = req.params.id; // iau id ul primit ca param
    const newPisica = req.body;
    newPisica.id = id; // suprascriu id ul
    idFound = false;
    const newPisiciList = pisiciList.map((pisica) => { //verific daca am deja id ul
        if (pisica.id === id) {
            idFound = true;
            return newPisica // editez pisica
        }
        return pisica
    })

    writePisiciJSONFile(newPisiciList);

    if (idFound) {
        res.json(newPisica);
    } else {
        res.status(404).send(`Pisica nu a fost gasita!`);
    }

});

app.delete("/pisici/:id", (req, res) => {
    const pisiciList = readPisiciJSONFile();
    const id = req.params.id;
    const newPisiciList = pisiciList.filter((pisica) => pisica.id !== id) // luam toate pisicile pt care id-ul e diferit decat cel primit

    if (pisiciList.length !== newPisiciList.length) {
        res.status(200).send(`Pisica a fost stearsa`);
        writePisiciJSONFile(newPisiciList);
    } else {
        res.status(404).send(`Pisica nu a fost gasita`);
    }
});