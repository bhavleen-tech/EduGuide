const axios = require('axios');
//Imported GoogleGenerativeAI correctly
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
//Initialized the correct constructor class directly with the key
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChat = async (req, res) => {
    const { userQuery, chatId } = req.body;

    if (!userQuery) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        let chatSession = null;
        let history = [];

        if (chatId) {
            try {
                chatSession = await Chat.findById(chatId);
                if (chatSession) {
                    history = chatSession.messages.map(msg => ({
                        role: msg.role,
                        parts: [{ text: msg.content }]
                    }));
                }
            } catch (dbError) {
                console.error("Invalid or missing Chat ID format, starting fresh chat.");
            }
        }

        if (!chatSession) {
            chatSession = new Chat({ messages: [] });
        }

        console.log(`Searching browser for: ${userQuery}`);
        let liveSearchContext = "";
        
        try {
            const searchResponse = await axios.post(
                'https://google.serper.dev/search',
                { q: `${userQuery} courses fields after 12th India` },
                {
                    headers: {
                        'X-API-KEY': process.env.SERPER_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (searchResponse.data && searchResponse.data.organic) {
                liveSearchContext = searchResponse.data.organic
                    .slice(0, 4) // Get top 4 search results
                    .map(result => `Source Title: ${result.title}\nInformation: ${result.snippet}`)
                    .join("\n\n");
            }
        } catch (searchError) {
            console.error("Web Search API failed, falling back to standalone AI logic:", searchError.message);
            liveSearchContext = "No real-time web search information could be fetched.";
        }

        const model = ai.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `You are an expert career counselor for Indian students exploring options after completing class 12. 
            Use the provided live web search results as your source of truth for the latest admission dates, eligibility criteria, and newly emerging fields.
            Break your answers down cleanly using bullet points or headers. If a course has streams (Science, Commerce, Arts), clearly state who is eligible.`
        });

        const chat = model.startChat({ history: history });

        const promptWithContext = `
        [LIVE WEB SEARCH RESULTS]
        ${liveSearchContext}
        
        [STUDENT QUESTION]
        ${userQuery}
        
        Please synthesize a detailed, accurate response using the live search results above if relevant. Ensure the output is clean and structured.`;

        const result = await chat.sendMessage(promptWithContext);
        const aiResponseText = result.response.text();

        chatSession.messages.push({ role: 'user', content: userQuery });
        chatSession.messages.push({ role: 'model', content: aiResponseText });
        await chatSession.save();

        res.status(200).json({
            chatId: chatSession._id,
            reply: aiResponseText
        });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ error: "Something went wrong while processing your request." });
    }
};

module.exports = { handleChat };