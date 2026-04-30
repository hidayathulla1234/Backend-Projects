const express = require('express');
const app = express();

app.use(express.json());



const authRoutes=require("./routes/auth.routes")
const songRoutes = require('./routes/song.route');


app.use('/api/auth',authRoutes);
app.use('/api/songs', songRoutes);

module.exports = app;