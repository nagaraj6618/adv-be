const questionModel = require('../model/qustionModel');

async function getAllQuestionData(req, res) {
   try {
      const allData = await questionModel.find();
      // console.log(allData)
      if (allData.length <= 0) {
         return res.status(404).json({
            message: "No question added..",
            status: false,
            data: allData
         })
      }
      const filteredData = allData.map(item => ({
         id: item._id,
         question: item.question,
         answer: item.answer,
      }));
      res.status(200).json({
         message: "All the question data retrived...",
         status: true,
         data: filteredData
      })
   }
   catch (error) {
      res.status(500).json({
         message: error.message,
         status: false
      })
   }
}

async function addNewQuestion(req, res) {
   try {
      const { question, answer } = req.body;
      if (!question || !answer) {
         return res.status(404).json({
            message: "Please provide question or answer..",
            status: false
         })
      }
      const newData = await questionModel({
         question, answer
      });
      // console.log(newData);
      newData.save();
      res.status(200).json({
         message: "Question added successfull...",
         status: true,
         data: newData
      })
   }
   catch (error) {
      res.status(500).json({
         message: error.message,
         status: false
      })
   }

}
async function deleteQuestionById(req, res) {

   try {
      const { id } = req.params;
      if (!id) {
         return res.status(404).json({
            message: "Send the question Id",
            status: false,
         })
      }
      await questionModel.findByIdAndDelete(id);
      res.status(200).json({
         message: "Question Deleted successfully",
         status: true,
      });
   }
   catch (error) {
      res.status(500).json({
         message: error.message,
         status: false
      })
   }
}

module.exports = { getAllQuestionData, addNewQuestion, deleteQuestionById }