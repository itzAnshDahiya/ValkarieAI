import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config.js";
import { Promt } from "../model/promt.model.js";

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export const sendPromt = async (req, res) => {
  const { content, deepThink, search, fileContent } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Prompt content is required" });
  }

  try {
    // Prepare the content with file context if provided
    let fullContent = content;
    if (fileContent && fileContent.content) {
      fullContent = `[File: ${fileContent.name}]\n\`\`\`\n${fileContent.content}\n\`\`\`\n\nUser question: ${content}`;
    }

    // Add search context if enabled
    if (search) {
      fullContent = `[Search enabled - provide current information if available]\n${fullContent}`;
    }

    // Save user prompt
    await Promt.create({
      userId,
      role: "user",
      content: content,
      deepThink,
      search,
      fileAttached: !!fileContent,
    });

    // Choose model based on deepThink flag
    const modelName = deepThink ? "gemini-2.5-flash" : "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const generationConfig = {
      temperature: 1,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    // Send to Gemini API
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullContent }] }],
      generationConfig,
    });
    
    if (!response || !response.response) {
      throw new Error("Invalid response from Gemini API");
    }

    const aiContent = response.response.text();

    if (!aiContent) {
      throw new Error("No content received from Gemini API");
    }

    // Save assistant prompt
    await Promt.create({
      userId,
      role: "assistant",
      content: aiContent,
      deepThink,
      search,
    });

    return res.status(200).json({ 
      success: true,
      reply: aiContent 
    });
  } catch (error) {
    console.error("Error in Promt:", error.message);
    console.error("Full Error:", error);
    
    return res.status(500).json({ 
      error: error.message || "Something went wrong with the AI response",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};
