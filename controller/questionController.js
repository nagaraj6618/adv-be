const questionModel = require('../model/qustionModel');

async function getAllQuestionData (req,res){
   const allData = await questionModel.find();
   // console.log(allData)
   if(allData.length <= 0){
      return res.status(404).json({
         message:"No question added..",
         status:false,
         data:allData
      })
   }
   res.status(200).json({
      message:"All the question data retrived...",
      status:true,
      data:allData,
   })
}

module.exports = {getAllQuestionData}