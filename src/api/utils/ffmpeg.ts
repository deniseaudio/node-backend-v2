import ffmpeg from "fluent-ffmpeg";

/**
 * Given a FLAC input filepath, transcode it to MP3 and write the output to the
 * given output filepath. Wait for the transcoding to be done before returning.
 *
 * @param sourcefile Source file path.
 * @param outputfile Output file path.
 * @param bitrate Audio bitrate in kbps.
 */
export const flacToMp3 = async (
  sourcefile: string,
  outputfile: string,
  bitrate: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    ffmpeg(sourcefile)
      .outputFormat("mp3")
      .audioBitrate(bitrate)
      .outputOptions([
        // Includes only audio (omits all images).
        "-map 0:a",
        // Omits all metadata.
        "-map_metadata -1",
      ])
      .save(outputfile)
      .on("end", () => resolve(outputfile))
      .on("error", (err) => reject(err));
  });
};

/**
 * Create a transcoded file using ffmpeg by detecting the file codec and
 * transcoding it to MP3. Returns the path to the transcoded file.
 *
 * @param codec Source file codec.
 * @param sourcefile Source file path.
 * @param outputfile Output file path.
 * @param bitrate Audio bitrate in kbps.
 * @returns A string which is the path to the transcoded file.
 */
export const transcode = async (
  codec: string,
  sourcefile: string,
  outputfile: string,
  bitrate: number
) => {
  if (codec.toLowerCase().includes("flac")) {
    return flacToMp3(sourcefile, outputfile, bitrate);
  }

  return null;
};
