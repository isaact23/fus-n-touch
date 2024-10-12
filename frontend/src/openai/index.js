import OpenAI from 'openai';
import { OPENAI_API_KEY } from './key.js';

const client = new OpenAI({
    apiKey: OPENAI_API_KEY
});

async function genImage(image) {

    const chatResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                {type: "text", text: "Identify the drawing. Imagine the image professionally drawn with colored pencils and generate a brief prompt to generate this image."},
                {
                    type: "image_url",
                    image_url: {
                        url: "data:image/png;base64," + image
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

