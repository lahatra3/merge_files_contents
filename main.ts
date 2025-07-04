import { file, type FileSink } from "bun";
import { readdir, exists } from "node:fs/promises";
import { resolve } from "node:path";
import { styleText } from "node:util";

const fileProcessor = async (source_file_path: string, sink_writer: FileSink) => {
    const source_file = file(source_file_path);
    const stream = source_file.stream();
    const reader = stream.getReader();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                sink_writer.write('\n');
                break;
            }
            sink_writer.write(value);
        }
    } finally {
        reader.releaseLock();
    }
}

const mergeFileContents = async (file_paths: Array<string>, sink_file_path: string) => {
    const sink_file = file(sink_file_path);
    const writer = sink_file.writer({ highWaterMark: 1024 * 1024 * 131 });

    try {
        for (const file_path of file_paths) {
            console.log(`🔄 ${styleText(['bold', 'green'], 'Process:')} ${styleText(['italic', 'yellowBright'], file_path)}`);
            await fileProcessor(file_path, writer);
        }
    } catch (err) {
        console.error("❗️ Error during processing file...", err);
    } finally {
        writer.end();
    }
}


(async () => {
    const args = process.argv.slice(2);
 
    const args_config = args.reduce((accumulator: Record<string, string>, current_value: string) => {
       const [key, value] = current_value.split("=");
       accumulator[key] = value;
       return accumulator;
    }, {});    
 
    if (!args_config['--dir'] || !args_config['--dest']) {
       throw Error(`Missing arguments...
       Help: 
          $ ~ mergefiles --ext=".txt" --dir="/directory_path" --dest="file_destination"
       `
       );
    }
 
    const [directory_path, is_dir] = [
       resolve(args_config['--dir']),
       await exists(args_config['--dir'])
    ];
 
    if (!is_dir) {
       throw Error(`No such directory ${directory_path} ...`);
    }
 
    const directory = await readdir(directory_path);
    const source_file_paths = directory
       .filter((source_file) => source_file.trim().endsWith(args_config['--ext']!))
       .map((source_file) => resolve(directory_path, source_file));

    if (source_file_paths.length < 1) {
        console.log(`${styleText(['yellow', 'bold'], 'No files detected...')}`);
        return;
    }
       
    const sink_file_path = resolve(args_config['--dest']);
    
    console.log(`🚗 ${styleText(['blue'], 'Start processing...')} 🚗\n`);
    await mergeFileContents(source_file_paths, sink_file_path);
    console.log(`\n✅ Successfully sink into ${styleText(['bold', 'blue'], sink_file_path)} ... 💯`);
 })();