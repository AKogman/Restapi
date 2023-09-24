import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 0
    },
    subtitle: {
        type: String,
        required: false,
        minlength: 0
    },
    description: {
        type: String,
        required: true,
        minlength: 0
    },
    phone: {
        type: String,
        required: true,
        minlength: 0
    },
    email: {
        type: String,
        required: true,
        minlength: 0
    },
    web: {
        type: String,
        required: true,
        minlength: 0
    },
    bizNumber: {
        type: Number,
        required: false,
    },
    address: {
        country: {
            type: String,
            required: true,
            minlength: 0
        },
        state: {
            type: String,
            required: false,
            minlength: 0
        },
        city: {
            type: String,
            required: true,
            minlength: 0
        },
        street: {
            type: String,
            required: true,
            minlength: 0
        },
        houseNumber: {
            type: String,
            required: true,
            minlength: 0
        },
        zip: {
            type: String,
            required: true,
            minlength: 0
        }
    },
    likes: {
        type: Array,
        default: [],
        required: false,
    },
},
{
    timestamps: {
        createdAt: 'createdAt'
    }
})

const Card = mongoose.model("cards", cardSchema);
export default Card