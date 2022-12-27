import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
Write me the core bullet points of a Harvard Business Review article with the below title. These bullet points should be in the style of an executive summary for an academic document, using relevant business jargon and complex terms where helpful.

Title:
`;

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.8,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt =
  `Take the bullet points below and generate a twitter thread written in the style of a viral twitter writer, like Trung Phan or Shaan Puri. Make it fun to read, explaining any complex business terminology along the way. Make each tweet punchy, with high value added per word. Don't just re-list the bullet points. Add some style and flair. Optimise for virality. Also include relevant data points where helpful, and focus on non-obvious insights.

  Title: ${req.body.userInput}

  Bullet points: ${basePromptOutput.text}

  Twitter thread:
  `
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.85,
    max_tokens: 1250,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
