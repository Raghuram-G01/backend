const mongooss=require("mongoose");
const AssignmentCompleted=new mongooss.Schema({
    users:{
        type:mongooss.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    assignmentName:{
        type:mongooss.Schema.Types.ObjectId,
        res:"AssignmentCreated",
        require:true,
    },
    marks:{
        type:Number,
    },
    completedDate:{
        type:Date,
        require:true,
    }
});
module.exports=mongooss.model("AssignmentCompleted",AssignmentCompleted);