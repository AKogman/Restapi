import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: false,
            minlength: 2,
        },
        middle: {
            type: String,
            required: false,
        },
        last: {
            type: String,
            required: false,
            minlength: 2,
        },
    },

    phone: {
        type: String,
        required: false,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },

    image: {
        url: {
            type: String,
            required: false,
            minlength: 0,
        },
        alt: {
            type: String,
            required: false,
            minlength: 0,
        },
    },
    address: {
        country: {
            type: String,
            required: false,
            minlength: 2,
        },
        state: {
            type: String,
            required: false,
            minlength: 0,
        },
        city: {
            type: String,
            required: false,
            minlength: 2,
        },
        street: {
            type: String,
            required: false,
            minlength: 2,
        },
        houseNumber: {
            type: String,
            required: false,
            minlength: 1,
        },
        zip: {
            type: String,
            required: false,
            minlength: 0,
        },
    },
    loginAttempts: {
        type: Number,
        default: 0,
        required: false,
    },
    lockedFrom: {
        type: Date,
        default: null,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: false,
    },
    isBusiness: {
        type: Boolean,
        default: false,
        required: false,
    }
}, 
{
    timestamps: {
        createdAt: 'createdAt'
    }
});

const User = mongoose.model("users", userSchema);
export default User;
