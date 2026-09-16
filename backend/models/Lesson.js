const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true,
        trim:true
    },

    module:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Module",
        required:true
    },

    description:{
        type:String,
        default:""
    },

    videoUrl:{
        type:String,
        default:""
    },

    pdf:{
        type:String,
        default:""
    },

    duration:{
        type:String,
        default:"0 Min"
    },

    order:{
        type:Number,
        default:1
    },

    isPublished:{
        type:Boolean,
        default:false
    },

    resources:[
        {
            title:String,
            link:String
        }
    ],

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Lesson",lessonSchema);