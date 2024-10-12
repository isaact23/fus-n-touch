import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from './key.js';

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function analyzeImage(image) {

    const newImg = genImage(image)
    const funFact = getFunFact(image)

    const results = await Promise.all([newImg, funFact])

    return {
        url: results[0],
        fact: results[1]
    }
}

async function genImage(image) {
    const chatResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                {type: "text", text: "Identify the drawing. Imagine a realistic cyberpunk rendition of that object, and generate a brief prompt to generate this image."},
                {
                    type: "image_url",
                    image_url: {
                        url: image
                    }
                }
            ]
        }]
    })

    const prompt = chatResponse.choices[0].message.content

    const newImage = await client.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
    })

    const imageUrl = newImage.data[0].url
    return imageUrl
}

async function getFunFact(image) {
    const chatResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                {type: "text", text: "Identify the drawing and get a fun fact about it in under 10 words."},
                {
                    type: "image_url",
                    image_url: {
                        url: image
                    }
                }
            ]
        }]
    })

    return chatResponse.choices[0].message.content
}
