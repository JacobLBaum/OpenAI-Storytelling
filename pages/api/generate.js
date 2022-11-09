import { Configuration, OpenAIApi } from "openai";

const starterStory = `Give the intro of a fantastical story.

Character: knight
Intro: A brave knight is called upon by the newly crowned emperor. Little does the emperor know that the knight is the reason he sits on the throne.
Character: beetle
Intro: A tired beetle wakes up to the soft sound of rain from outside its home. The beetle suddenly hears a great rumbling as the ground beneath it begins to crack!
Character:`

let story = []

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  let prompt
  if (req.body.first) {
    prompt = generateFirstPrompt(req.body.character)
  } else {
    console.log("req.body.story", req.body.story)
    story = req.body.story
    story.push(req.body.storyInput)
    prompt = generatePrompt(story)
  }
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    max_tokens: 200,
    temperature: 0.7,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generateFirstPrompt(character) {
  return `${starterStory} ${character}
Intro:`;
}

function generatePrompt(story) {
  let prompt = "Continue the fantastical story."
  story.forEach(block => {
    prompt += `\nStoryteller: ${block}`
  });
  prompt = `${prompt}\nStoryteller:`
  console.log('Prompt:', prompt)
  return prompt
}
