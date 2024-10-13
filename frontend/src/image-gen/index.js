import { AZURE_KEY } from './key.js'
import { AzureOpenAI } from "openai"

const ENDPOINT_DALLE = 'https://gamma-fish.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01'
const ENDPOINT_CHAT = 'https://gamma-fish.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview'

const deployment1 = "dall-e-3"
const v1 = "2024-02-01"
const client1 = new AzureOpenAI({
    endpoint: ENDPOINT_DALLE,
    deployment: deployment1,
    apiVersion: v1,
    apiKey: AZURE_KEY,
    dangerouslyAllowBrowser: true
})

const deployment2 = "gpt-4o"
const v2 = "2024-08-01-preview"
const client2 = new AzureOpenAI({
    endpoint: ENDPOINT_CHAT,
    deployment: deployment2,
    apiVersion: v2,
    apiKey: AZURE_KEY,
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

    console.time('identify')
    const chatResponse = await client2.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: `Identify the drawing, and describe how to re-create a high fidelity version of the drawing ${theme} ` },
                {
                    type: "image_url",
                    image_url: {
                        url: image
                    }
                }
            ]
        }]
    });
    console.timeEnd('identify')

    const prompt = chatResponse.choices[0].message.content;

    console.time('imageGen')
    const newImage = await client1.images.generate({
        model: 'dall-e-2',
        prompt: prompt,
        n: 1,
        size: '512x512'
    });

    console.timeEnd('imageGen')

    const imageUrl = newImage.data[0].url;
    return imageUrl;
}

async function getFunFact(image) {
    console.time('fun')
    const chatResponse = await client2.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: "Identify the drawing. Return an obscure fun fact about this drawing." },
                {
                    type: "image_url",
                    image_url: {
                        url: image
                    }
                }
            ]
        }]
    });

    console.timeEnd('fun')

    return chatResponse.choices[0].message.content;
}
