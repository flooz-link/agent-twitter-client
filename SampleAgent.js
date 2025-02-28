import { Scraper, SpaceParticipant, SttTtsPlugin } from 'agent-twitter-client';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const scraper = new Scraper();
  // v1 login
  await scraper.login(
    process.env.TWITTER_USERNAME ?? '',
    process.env.TWITTER_PASSWORD ?? '',
  );
  // v2 login
  await scraper.login(
    process.env.TWITTER_USERNAME ?? '',
    process.env.TWITTER_PASSWORD ?? '',
    undefined,
    undefined,
    process.env.TWITTER_API_KEY,
    process.env.TWITTER_API_SECRET_KEY,
    process.env.TWITTER_ACCESS_TOKEN,
    process.env.TWITTER_ACCESS_TOKEN_SECRET,
  );
  console.log('Logged in successfully!');
  // Example: Posting a new tweet with a poll
  // await scraper.sendTweetV2(
  //   `When do you think we'll achieve AGI (Artificial General Intelligence)? 🤖 Cast your prediction!`,
  //   undefined,
  //   {
  //     poll: {
  //       options: [
  //         { label: '2025 🗓️' },
  //         { label: '2026 📅' },
  //         { label: '2027 🛠️' },
  //         { label: '2030+ 🚀' },
  //       ],
  //       durationMinutes: 1440,
  //     },
  //   },
  // );
  // console.log(await scraper.getTweet('1856441982811529619'));
  // const tweet = await scraper.getTweetV2('1856441982811529619');
  // console.log({ tweet });
  // console.log('tweet', tweet);
  // const tweets = await scraper.getTweetsV2([
  //   '1856441982811529619',
  //   '1856429655215260130',
  // ]);
  // console.log('tweets', tweets);

  // const audioSpaceId = '1OdKrDarBWPJX';
  // const participant = new SpaceParticipant(scraper, {
  //   spaceId: audioSpaceId,
  //   debug: false,
  // });

  // // Create our TTS/STT plugin instance, just for demonstration
  // const sttTtsPlugin = new SttTtsPlugin();
  // participant.use(sttTtsPlugin, {
  //   openAiApiKey: process.env.OPENAI_API_KEY,
  //   elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  //   voiceId: 'D38z5RcWu1voky8WS1ja', // example voice
  //   // systemPrompt: "You are a calm and friendly AI assistant."
  // });

  // // 3) Join the Space in listener mode
  // await participant.joinAsListener();
  // console.log('[TestParticipant] HLS URL =>', participant.getHlsUrl());

  // // 4) Request the speaker role => returns { sessionUUID }
  // const { sessionUUID } = await participant.requestSpeaker();
  // console.log('[TestParticipant] Requested speaker =>', sessionUUID);

  // // 5) Wait for host acceptance with a maximum wait time (e.g., 15 seconds).
  // try {
  //   await waitForApproval(participant, sessionUUID, 15000);
  //   console.log(
  //     '[TestParticipant] Speaker approval sequence completed (ok or timed out).',
  //   );
  // } catch (err) {
  //   console.error('[TestParticipant] Approval error or timeout =>', err);
  //   // Optionally cancel the request if we timed out or got an error
  //   try {
  //     await participant.cancelSpeakerRequest();
  //     console.log(
  //       '[TestParticipant] Speaker request canceled after timeout or error.',
  //     );
  //   } catch (cancelErr) {
  //     console.error(
  //       '[TestParticipant] Could not cancel the request =>',
  //       cancelErr,
  //     );
  //   }
  // }

  // // (Optional) Mute/unmute test
  // await participant.muteSelf();
  // console.log('[TestParticipant] Muted.');
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // await participant.unmuteSelf();
  // console.log('[TestParticipant] Unmuted.');

  // // ---------------------------------------------------------
  // // Example beep generation (sends PCM frames if we're speaker)
  // // ---------------------------------------------------------
  // const beepDurationMs = 500;
  // const sampleRate = 16000;
  // const totalSamples = (sampleRate * beepDurationMs) / 1000; // 8000
  // const beepFull = new Int16Array(totalSamples);

  // // Sine wave at 440Hz, amplitude ~12000
  // const freq = 440;
  // const amplitude = 12000;
  // for (let i = 0; i < beepFull.length; i++) {
  //   const t = i / sampleRate;
  //   beepFull[i] = amplitude * Math.sin(2 * Math.PI * freq * t);
  // }

  // const FRAME_SIZE = 160;
  // async function sendBeep() {
  //   console.log('[TestParticipant] Starting beep...');
  //   for (let offset = 0; offset < beepFull.length; offset += FRAME_SIZE) {
  //     const portion = beepFull.subarray(offset, offset + FRAME_SIZE);
  //     const frame = new Int16Array(FRAME_SIZE);
  //     frame.set(portion);
  //     participant.pushAudio(frame, sampleRate);
  //     await new Promise((r) => setTimeout(r, 10));
  //   }
  //   console.log('[TestParticipant] Finished beep.');
  // }

  // // Example: send beep every 10s
  // const beepInterval = setInterval(() => {
  //   sendBeep().catch((err) =>
  //     console.error('[TestParticipant] beep error =>', err),
  //   );
  // }, 10000);

  // // Graceful shutdown after 60s
  // const shutdownTimer = setTimeout(async () => {
  //   await participant.leaveSpace();
  //   console.log('[TestParticipant] Left space. Bye!');
  //   process.exit(0);
  // }, 60000);

  // // Catch SIGINT for manual stop
  // process.on('SIGINT', async () => {
  //   console.log('\n[TestParticipant] Caught interrupt signal, stopping...');
  //   clearInterval(beepInterval);
  //   clearTimeout(shutdownTimer);
  //   await participant.leaveSpace();
  //   console.log('[TestParticipant] Space left. Bye!');
  //   process.exit(0);
  // });
}

function waitForApproval(participant, sessionUUID, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    let resolved = false;

    const handler = async (evt) => {
      if (evt.sessionUUID === sessionUUID) {
        resolved = true;
        participant.off('newSpeakerAccepted', handler);
        try {
          await participant.becomeSpeaker();
          console.log('[TestParticipant] Successfully became speaker!');
          resolve('');
        } catch (err) {
          reject(err);
        }
      }
    };

    // Listen to "newSpeakerAccepted" from participant
    participant.on('newSpeakerAccepted', handler);

    // Timeout to reject if not approved in time
    setTimeout(() => {
      if (!resolved) {
        participant.off('newSpeakerAccepted', handler);
        reject(
          new Error(
            `[TestParticipant] Timed out waiting for speaker approval after ${timeoutMs}ms.`
          )
        );
      }
    }, timeoutMs);
  });
}

main();
