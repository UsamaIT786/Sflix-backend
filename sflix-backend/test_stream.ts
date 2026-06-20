import axios from 'axios';
import fs from 'fs';

async function test() {
  try {
    const SAMPLE_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const response = await axios({
      method: 'GET',
      url: SAMPLE_VIDEO_URL,
      responseType: 'stream'
    });

    console.log('Headers:', response.headers);

    response.data.pipe(fs.createWriteStream('test.mp4'));
    
    response.data.on('end', () => console.log('Finished'));
    response.data.on('error', (err: any) => console.log('Error:', err));
  } catch (err: any) {
    console.error('Catch error:', err.message);
  }
}

test();
