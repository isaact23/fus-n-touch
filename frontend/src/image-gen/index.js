import { KEY_DALLE, KEY_CHAT } from './key.js'
import { AzureOpenAI } from "openai"

const ENDPOINT_DALLE = 'https://gamma-fish.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01'
const ENDPOINT_CHAT = 'https://gamma-fish.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview'

const deployment1 = "dall-e-3"
const v1 = "2024-02-01"
const client1 = new AzureOpenAI({
    endpoint: ENDPOINT_DALLE,
    deployment: deployment1,
    apiVersion: v1,
    apiKey: KEY_DALLE,
    dangerouslyAllowBrowser: true
})

const deployment2 = "gpt-4o"
const v2 = "2024-08-01-preview"
const client2 = new AzureOpenAI({
    endpoint: ENDPOINT_CHAT,
    deployment: deployment2,
    apiVersion: v2,
    apiKey: KEY_CHAT,
    dangerouslyAllowBrowser: true
})

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
    const completion = client2.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: `Identify the drawing, and describe how to re-create a high fidelity version of the drawing ${theme} - make sure the description is truly representative of the input image.` },
                {
                    type: "image_url",
                    image_url: {
                        url: image
                    }
                }
            ]
        }]
    });
    const chatResponse = await completion;

    const prompt = chatResponse.choices[0].message.content;

    const newImage = await client1.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024'
    });

    const imageUrl = newImage.data[0].url;
    return imageUrl;
}

async function getFunFact(image) {
    const chatResponse = await client2.chat.completions.create({
        model: "gpt-4o",
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
