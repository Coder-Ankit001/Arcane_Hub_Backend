import mongoose from 'mongoose'

const WishlistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    details: [{
        key: String,
        title: String,
        main: String,
        price: String,
        top_seller: Boolean,
        release_date: String,
        rating: String,
        genres: [String],
    }]

})

const Wishlist = mongoose.model('user_wishlist', WishlistSchema)
export default Wishlist