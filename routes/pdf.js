
import express from 'express'
import { pdfGenerates } from '../utils/puppeter.js'
const pdfRouter=express.Router()

pdfRouter.post('/generate-pdf', pdfGenerates);

export default pdfRouter;
