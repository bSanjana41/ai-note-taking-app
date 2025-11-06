import {Schema,model} from "mongoose";

const userSchema=new Schema({
name:{
    type:String,
    required:true,
    maxlength:50,
    minlength:3
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
    minlength:6 
},
isActive:{
    type:Boolean,
    default:true
},
isDeleted:{
    type:Boolean,
    default:false
}
},
{timestamps:true})

const User= model("User",userSchema);
export default User;