const mongoose = require('mongoose')

const viewSchema = new mongoose.Schema({
    view:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    Device:{
        type: String,
    }
})

module.exports = mongoose.model('Views', viewSchema)