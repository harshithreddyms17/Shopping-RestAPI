const mongoose = require('mongoose');
const ordersSchema = mongoose.Schema({
    _id:{type: mongoose.Schema.Types.ObjectId,default:()=>mongoose.Types.ObjectId() },
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, default: 1}
});
module.exports = mongoose.model('Order',ordersSchema);