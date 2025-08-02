import { GoogleGenAI } from "@google/genai";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({});
app.get("/", (req ,res)=>{res.json({"message ": "running"})})
app.post("/api", async (req, res) => {
  const requestfromclient = req.body.prompt;
  console.log("enter " + requestfromclient);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${requestfromclient}`,
      config: {
        systemInstruction:
          "You are a best in html , css , js. You only respond with complete and functional website code in JSON format, containing html, css, and js keys. The websites you generate must be: Fully responsive,Free of errors Using modern HTML5, CSS3, and JavaScript Styled with attractive color schemes, animations, and hover effects Including all necessary functionality as requested CSS and JavaScript must be properly linked to the HTML. Do not include any explanations, comments, or extra text — only output pure, working code in the specified JSON format.",
      },
    });

    let raw = response.text;
    raw = raw
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
      
    const webData = JSON.parse(raw);
    // console.log(webData)
    const htmlData = webData.html;
    const cssData = webData.css;
    const jsDATA = webData.javascript;

    res.json({
      html: htmlData,
      css: cssData,
      js: jsDATA,
    });
  } catch (error) {
    res
      .json({
        message: "Something Wrong",
        error: error,
      })
      .status(500);
  }
});

app.listen(3000);

