import fs from 'fs'

import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity"
import { AzureOpenAI } from "@azure/openai"

const ENDPOINT_DALLE = 'https://gamma-fish.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01'
const ENDPOINT_CHAT = 'https://gamma-fish.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview'


const credential = new DefaultAzureCredential()
const scope = "https://openai.azure.com/.default"
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const deployment1 = "dall-e-3"
const v1 = "2024-02-01"
const client1 = new AzureOpenAI({
    endpoint: ENDPOINT_DALLE,
    deployment: deployment1,
    apiVersion: v1,
    azureADTokenProvider: azureADTokenProvider
})

const deployment2 = "gpt-4o"
const v2 = "2024-08-01-preview"
const client2 = new AzureOpenAI({
    endpoint: ENDPOINT_CHAT,
    deployment: deployment2,
    apiVersion: v2,
    azureADTokenProvider: azureADTokenProvider
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
    const chatResponse = await completion;

    const prompt = chatResponse.choices[0].message.content;

    const newImage = await client1.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
    });

    const imageUrl = newImage.data[0].url;
    return imageUrl;
}

async function getFunFact(image) {
    const chatResponse = await client1.chat.completions.create({
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

let img = fs.readFileSync('/home/shuffles/Repos/fus-n-touch/example_input/house.png', 'base64')
img = 'data:image/png;base64,' + img
analyzeImage(img)
    .then(res => {
        console.log(res.fact)
        console.log(res.url)
    })
    .catch(e => {
        console.error(e)
    })
