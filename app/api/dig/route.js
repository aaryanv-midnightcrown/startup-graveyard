export async function POST(req) {
  const { idea } = await req.json()

  const system = `You are the Startup Idea Graveyard. Return ONLY a JSON object, no markdown, no backticks:
{
  "survival_score": <0-100>,
  "dead_startups": [{ "name": "...", "founded": "YYYY", "died": "YYYY", "raised": "$XM", "cause_of_death": "specific reason" }],
  "lessons": ["..."],
  "how_to_survive": ["..."],
  "verdict": "2-3 sentence brutal take"
}
Up to 4 real dead companies. Cause of death must be specific. Score: 0-20 dead on arrival, 21-40 long odds, 41-65 possible, 66-80 real shot, 81-100 greenfield.`

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Startup idea: "${idea}"` }
      ],
      max_tokens: 1000
    })
  })

  const data = await resp.json()

  if (!data.choices?.[0]) {
    return Response.json({ error: JSON.stringify(data) }, { status: 500 })
  }

  const text = data.choices[0].message.content
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    return Response.json(JSON.parse(clean))
  } catch(e) {
    return Response.json({ error: 'parse failed', raw: text }, { status: 500 })
  }
}
