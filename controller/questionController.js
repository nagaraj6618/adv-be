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
   const filteredData = allData.map(item => ({
      id: item._id,
      question: item.question,
      answer: item.answer,
   }));
   res.status(200).json({
      message:"All the question data retrived...",
      status:true,
      data:filteredData
   })
}

async function addNewQuestion (req,res) {
   const {question,answer} = req.body;
   if(!question || !answer) {
      return res.status(404).json({
         message:"Please provide question or answer..",
         status:false
      })
   }
   const newData = await questionModel({
      question,answer
   });
   // console.log(newData);
   newData.save();
   res.status(200).json({
      message:"Question added successfull...",
      status:true,
      data:newData
   })
}

module.exports = {getAllQuestionData,addNewQuestion}