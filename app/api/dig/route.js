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
  
  if (!data.choices || !data.choices[0]) {
    return Response.json({ error: JSON.stringify(data) }, { status: 500 })
  }

  const text = data.choices[0].message.content
  const clean = text.replace(/```json|```/g, '').trim()
  
  try {
    return Response.json(JSON.parse(clean))
  } catch(e) {
    return Response.json({ error: 'parse failed', raw: text }, { status: 500 })
  }
