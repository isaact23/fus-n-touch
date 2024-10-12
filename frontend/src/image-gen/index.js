import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from './key.js';

export async function genImage(image) {

    const client = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });

    const chatResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                {type: "text", text: "Identify the subject of the drawing and generate a brief prompt to generate an interesting wall pattern."},
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

