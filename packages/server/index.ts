import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";

const app = express();
app.use(cors());
app.use(express.static('public'));
const port = 3333;
const prisma = new PrismaClient();

app.get("/default", (req, res) => {
  res.send(JSON.stringify({
    lang: 'en',
    name: 'Default Layout',
    description: 'The default layout for FreeSpeech AAC',
    author: 'FreeSpeech AAC',
    createdAt: '',
    updatedAt: '',
    pages: {
      home: [
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
        {text: 'First tile', iconsrc: 'http://localhost:3333/images/user.png'},
      ]
    }
  }));
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
