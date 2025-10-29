import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        default: null
    },
    password: {
        type: String,
        required: true
    },

    token: {
        type: String
    }

})

const User = mongoose.model('users', UserSchema);
export default User