import { Readable } from 'stream';

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: any = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
