import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `Você é a NEXO AI, a inteligência artificial oficial do aplicativo NEXO.
Seu objetivo é ser útil, rápida, amigável e precisa. Responder a qualquer dúvida dos usuários sobre diversos assuntos, negócios e automações.`;

app.post('/api/nexo-ai', async (req, res) => {
  try {
    const { prompt, historico } = req.body;
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });

    const chat = model.startChat({ history: historico || [] });
    const result = await chat.sendMessage(prompt);
    const respostaTexto = result.response.text();

    res.json({ sucesso: true, resposta: respostaTexto });
  } catch (error) {
    console.error('Erro na NEXO AI:', error);
    res.status(500).json({ sucesso: false, erro: 'Falha ao processar resposta.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor NEXO AI rodando na porta ${PORT}`));
