import fs from 'fs';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

async function genImage(imagePath) {
    const image = fs.readFileSync(imagePath, 'base64');

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

genImage("/home/shuffles/Repos/fus-n-touch/example_input/tree.jpg")
    .then(url => {
        console.log(url)
    })
