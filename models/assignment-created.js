const mongooss=require("mongoose");
const AssignmentCreated=new mongooss.Schema({
    assignmentName:{
    type:String,
    require:true,
  },
    deadline:{
    type:String,
    require:true,
  },
    assignmentCompleted :{
    type:mongooss.Schema.Types.ObjectId,
    ref:"AssignmentCompleted",
    require:true,
  },
});
module.exports=mongooss.model("AssignmentCreated",AssignmentCreated);