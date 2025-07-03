# mergefiles

**` mergefiles `** is a tool for merging the contents of files in a directory into a single file.


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run main.ts
```

To build

- For Linux (arch x86_64)

```bash
bun build --compile --minify *.ts  --target=bun-linux-x64 --outfile=mergefiles
```

- For Windows (arch x86_64):

```bash
bun build --compile --minify *.ts  --target=bun-windows-x64 --outfile=mergefiles
```

How to use it ?

```bash
$ ~ mergefiles --ext=".txt" --dir="directory_path" --dest="file_destination"
```


This project was created using `bun init` in bun v1.2.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
