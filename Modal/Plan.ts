import mongoose, {Document,Schema,Model} from "mongoose";

export interface IPlan extends Document{
    name:String,
    duration:number,
    price:number
}

const planSchema :Schema<IPlan>=new Schema({
    name:{
        type:String,
        required:true
    },

    duration:{
        type:Number,
        required:true
    },

    price:{
        type:Number,
        required:true
    }
},{timestamps:true})

const Plan=mongoose.model<IPlan>("Plan",planSchema);
export default Plan 
