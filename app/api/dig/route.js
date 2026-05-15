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

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'interleaved-thinking-2025-05-14'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: `Startup idea: "${idea}"` }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }]
    })
  })

  const data = await resp.json()
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
  const clean = text.replace(/```json|```/g, '').trim()

  return Response.json(JSON.parse(clean))
}
