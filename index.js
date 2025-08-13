import { GoogleGenAI } from "@google/genai";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({});
app.get("/", (req ,res)=>{res.json({"message ": " running"})})
app.post("/api", async (req, res) => {
  const requestfromclient = req.body.prompt;
  console.log("user enter with prompt :  " + requestfromclient);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${requestfromclient}`,
      config: {
        systemInstruction:
         "You are an expert AI agent specializing in automated frontend web development. Based on the user's request , generate a complete, functional, and responsive website. Include all required HTML, CSS, and JavaScript to meet the specified features and design expectations. code in JSON format containing HTML, CSS, and JavaScript. The websites you generate must be error free and css and javascript link with html responsive,have attractive styling and color schemes, and include all necessary functionality. Never include any explanatory text or sentences and no any comment - only pure code in the specified format. and write all html, css , javascript code . and css and javascript also link with html file",
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










