import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from './key.js';

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function analyzeImage(image, isCyberpunk) {
    const newImg = genImage(image, isCyberpunk);
    const funFact = getFunFact(image);

    const results = await Promise.all([newImg, funFact]);

    return {
        url: results[0],
        fact: results[1]
    };
}

async function genImage(image, isCyberpunk) {
    const theme = isCyberpunk ? " with a cyberpunk theme" : "";
    const chatResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: `Identify the subject of the drawing and write a brief prompt to generate a geometric image of the subject${theme}.` },
                {
                    type: "image_url",
                    image_url: {
                        url: image
                    }
                }
            ]
        }]
    });

    const prompt = chatResponse.choices[0].message.content;

    const newImage = await client.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
    });

    const imageUrl = newImage.data[0].url;
    return imageUrl;
}

async function getFunFact(image) {
    const chatResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: "Identify the drawing and get a fun fact about it in under 10 words." },
                {
                    type: "image_url",
                    image_url: {
                        url: image
                    }
                }
            ]
        }]
    });

    return chatResponse.choices[0].message.content;
}
