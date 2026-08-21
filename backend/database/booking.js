const mongoose=require("mongoose");

const bookingSchema=new mongoose.Schema({
userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
user:{
type:String
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
type:String,
enum:["UPI","Card","Net Banking"]
},
paymentStatus:{
type:String,
enum:["Pending","Successful","Failed","Cancelled"],
default:"Pending"
},
transactionId:{
type:String
},
ticketStatus:{
type:String,
enum:["Valid","Used","Cancelled"],
default:"Valid"
},
usedAt:{
type:Date,
default:null
},
cancelledAt:{
type:Date,
default:null
}
},{
timestamps:true
});

module.exports=mongoose.model("Booking",bookingSchema);