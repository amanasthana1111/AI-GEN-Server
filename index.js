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
          `You are an expert AI agent specializing in automated frontend web development and make complete responsive make full functional ${requestfromclient}. and return html,css,javascript with all linkes with html `,
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









