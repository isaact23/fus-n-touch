import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

async function main() {
    const chatCompletion = await client.chat.completions.create({
        messages: [{role: 'user', content: "What is the derivative of ln(x)"}],
        model: 'gpt-3.5-turbo'
    });

    console.log(chatCompletion.choices[0].message.content);
}

main();
