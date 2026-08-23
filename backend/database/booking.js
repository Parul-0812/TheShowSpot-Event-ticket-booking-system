const mongoose=require("mongoose");

const bookingSchema=new mongoose.Schema({
userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},
eventName:{
type:String
},
eventDate:{
type:String
},
eventLocation:{
type:String
},
seats:{
type:Array
},
amount:{
type:Number
},
paymentMethod:{
type:String
},
paymentStatus:{
type:String,
default:"Pending"
},
transactionId:{
type:String
},
ticketStatus:{
type:String,
default:"Valid"
}
},{
timestamps:true
});

module.exports=mongoose.model("Booking",bookingSchema);