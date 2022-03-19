import type { NextApiRequest, NextApiResponse } from "next";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Transfer-Encoding", "binary");
  // ffmpeg -i pages/api/input.mp4
  // -movflags "+faststart"
  // -threads:1 1
  // -filter_complex "reverse;areverse"
  // -filter_complex_threads:1 1
  // -c:v h264 -c:a aac
  // rev-input.mp4
  ffmpeg()
    .input(`${process.cwd()}/pages/api/input.mp4`)
    .videoCodec("libx264")
    .audioCodec("aac")
    .videoFilter("reverse")
    .audioFilter("areverse")
    .outputOptions("-movflags frag_keyframe+empty_moov")
    .toFormat("mp4")
    .pipe(res, { end: true });
}
