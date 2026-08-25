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
enum:["Pending","Processing","Successful","Failed","Cancelled"],
default:"Pending"
},
transactionId:{
type:String,
unique:true,
sparse:true
},
razorpayPaymentId:{
type:String
},
paymentSignature:{
type:String
},

ticketStatus:{
type:String,
enum:["Valid","Used"],
default:"Valid"
}
},{
timestamps:true
});

module.exports=mongoose.model("Booking",bookingSchema);