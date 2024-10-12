import fs from 'fs';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

async function chatTest() {
    const chatCompletion = await client.chat.completions.create({
        messages: [{role: 'user', content: "What is the derivative of ln(x)"}],
        model: 'gpt-3.5-turbo'
    });

    console.log(chatCompletion.choices[0].message.content);
}

async function genImage(imagePath) {
    const image = fs.readFileSync("/home/shuffles/Repos/fus-n-touch/example_input/house.png", 'base64');

    console.log("data:image/png;base64," + image)

    const chatResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                {type: "text", text: "Identify and describe this drawing."},
                {
                    type: "image_url",
                    image_url: {
                        url: "data:image/png;base64," + image
                    }
                }
            ]
        }]
    });

    console.log(chatResponse.choices[0].message.content);
}

genImage();
