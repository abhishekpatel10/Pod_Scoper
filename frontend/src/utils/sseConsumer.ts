/**
 * Consumes real Server-Sent Events (SSE) from a Fetch ReadableStream.
 * Handles TCP chunk fragmentation and dispatches parsed events and JSON payloads.
 */
export async function consumeSSEStream(
  response: Response,
  onChunk: (event: string, data: any) => void
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body does not provide a readable stream.');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    // Keep any trailing incomplete line in the buffer
    buffer = lines.pop() || '';

    let currentEvent = 'message';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        currentEvent = 'message';
        continue;
      }

      if (trimmed.startsWith('event:')) {
        currentEvent = trimmed.replace('event:', '').trim();
      } else if (trimmed.startsWith('data:')) {
        const jsonStr = trimmed.replace('data:', '').trim();
        try {
          const parsed = JSON.parse(jsonStr);
          onChunk(currentEvent || parsed.event || 'message', parsed);
        } catch (err) {
          console.warn('Failed to parse SSE JSON chunk:', jsonStr, err);
        }
      }
    }
  }
}
