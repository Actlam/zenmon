export async function GET() {
  return Response.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length || 0
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return Response.json({ 
      message: 'POST request received',
      body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ 
      error: 'Invalid JSON',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}