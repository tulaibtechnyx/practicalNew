// pages/api/crud.js

import { dataResdeco } from "./mock-decoration-quiz-b";

// NOTE: Writing to a file within a serverless function like Next.js API routes 
// is usually not persistent or scalable. This is a conceptual structure.

export default async function handler(req, res) {
    const { method } = req;

    // Simulate a delay as in your original file
    await new Promise(resolve => setTimeout(resolve, 500)); 

    switch (method) {
        case 'GET':
            // R - Read All: Get all questions
            res.status(200).json(dataResdeco);
            break;

        case 'POST':
            // C - Create: Add a new question
            // In a real app, you'd add the question to the database
            const newQuestion = req.body;
            // Simplified: Add to in-memory array (won't persist across requests)
            dataResdeco.push(newQuestion); 
            res.status(201).json({ message: 'Question created', id: newQuestion.questionId });
            break;

        case 'PUT':
            // U - Update: Update an existing question
            // The request body should contain the updated question object
            const updatedQuestion = req.body;
            const index = dataResdeco.findIndex(q => q.questionId === updatedQuestion.questionId);
            
            if (index !== -1) {
                dataResdeco[index] = updatedQuestion; // Update in-memory
                res.status(200).json({ message: 'Question updated', question: updatedQuestion });
            } else {
                res.status(404).json({ message: 'Question not found' });
            }
            break;

        case 'DELETE':
            // D - Delete: Remove a question
            const { questionId } = req.body;
            // Simplified: Filter out the deleted question (won't persist)
            const initialLength = dataResdeco.length;
            const updatedData = dataResdeco.filter(q => q.questionId !== questionId);
            
            if (updatedData.length < initialLength) {
                // To actually update the original array:
                dataResdeco.length = 0; // Clear the original array
                dataResdeco.push(...updatedData); // Push the new array content
                res.status(200).json({ message: `Question ${questionId} deleted` });
            } else {
                res.status(404).json({ message: 'Question not found' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}