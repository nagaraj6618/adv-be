const questionModel = require('../model/qustionModel');

// async function getAllQuestionData(req, res) {
//    try {
//       const allData = await questionModel.find();
//       // console.log(allData)
//       if (allData.length <= 0) {
//          return res.status(404).json({
//             message: "No question added..",
//             status: false,
//             data: allData
//          })
//       }
//       const filteredData = allData.map(item => ({
//          id: item._id,
//          question: item.question,
//          answer: item.answer,
//       }));
//       res.status(200).json({
//          message: "All the question data retrived...",
//          status: true,
//          data: filteredData
//       })
//    }
//    catch (error) {
//       res.status(500).json({
//          message: error.message,
//          status: false
//       })
//    }
// }
// const questionModel = require("../model/qustionModel");

async function getAllQuestionData(req, res) {
   try {

      const batchSize = 1000; // fetch 1000 records at a time
      let skip = 0;

      let allQuestions = [];
      let hasMoreData = true;

      while (hasMoreData) {

         // fetch chunk
         const questions = await questionModel.find(
            {},
            {
               question: 1,
               answer: 1
            }
         )
         .skip(skip)
         .limit(batchSize)
         .lean();

         // stop loop
         if (questions.length === 0) {
            hasMoreData = false;
            break;
         }

         // format data
         const formattedData = questions.map(item => ({
            id: item._id,
            question: item.question,
            answer: item.answer
         }));

         // merge chunk into final array
         allQuestions.push(...formattedData);

         // next batch
         skip += batchSize;

         console.log(`Fetched ${skip} records`);
      }

      // send json file
      res.setHeader(
         "Content-Disposition",
         "attachment; filename=questions.json"
      );

      res.setHeader(
         "Content-Type",
         "application/json"
      );

      return res.status(200).send(
         JSON.stringify({
            status: true,
            total: allQuestions.length,
            data: allQuestions
         })
      );

   } catch (error) {

      return res.status(500).json({
         status: false,
         message: error.message
      });
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