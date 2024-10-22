#!/usr/bin/env node

import { Braille } from "./braille";
import { HanBraille } from "./hanbraille";
import * as fs from 'fs';
import * as path from 'path';
import JSON5 from 'json5';

let help: string = 
`HanBraille - Hangul Braille Converter
Usage: hanbraille [-a] [-i] [-q] "Some string"
  -a    print results as Braille ASCII
  -i    consider isolated vowel 'i' as postpositions, rather than jamo themselves
  -q    consider final 'ieung' as null symbols
`;

let args: string[] = process.argv.slice(2);

if (process.stdin.isTTY && args.length < 1) {
    console.log(help);
    process.exit(1);
}
let ascii: boolean = false;
let text = '';
let u11bc_null = false;
let u3163_isolate = false;
for (let q of args) {
    if (q === '-a') {
        ascii = true;
    }
    else if (q === '-q') {
        u11bc_null = true;
    }
    else if (q === '-i') {
        u3163_isolate = true;
    }
    else if (text === '') {
        text = '' + q;
    }
    else {
        text = text.concat(' ', q);
    }
}
var hanbraille = new HanBraille(u11bc_null, u3163_isolate);

// 재귀적으로 JSON 객체를 탐색하는 함수
function findValueByKey(obj: any, targetKey: string): string | null {
    if (typeof obj !== 'object' || obj === null) {
        return null;
    }

    if (targetKey in obj) {
        return obj[targetKey];
    }

    if (Array.isArray(obj)) {
        for (const item of obj) {
            const result = findValueByKey(item, targetKey);
            if (result !== null) {
                return result;
            }
        }
    } else {
        for (const key in obj) {
            const result = findValueByKey(obj[key], targetKey);
            if (result !== null) {
                return result;
            }
        }
    }

    return null;
}

// JSON 문자열을 정리하는 함수
function cleanJSONString(jsonString: string): string {
    // 주석 제거
    jsonString = jsonString.replace(/\/\/.*$/gm, '');
    jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');

    // 불필요한 공백 제거
    jsonString = jsonString.replace(/^\s+|\s+$/gm, '');

    // 줄바꿈 문자 제거
    jsonString = jsonString.replace(/\n/g, '');

    // 탭 문자 제거
    jsonString = jsonString.replace(/\t/g, '');

    // 연속된 공백을 하나의 공백으로 변경
    jsonString = jsonString.replace(/\s+/g, ' ');

    return jsonString;
}

// JSON 파일을 처리하고 점자로 변환하는 함수
function processJSONFile(filePath: string, targetKey: string, ascii: boolean = false): void {
    try {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        fileContent = cleanJSONString(fileContent);
        const jsonData = JSON.parse(fileContent);
        const textToTranslate = findValueByKey(jsonData, targetKey);

        if (typeof textToTranslate !== 'string') {
            console.error(`Error: The key "${targetKey}" does not contain a string value or was not found in file ${filePath}`);
            return;
        }

        const hanbraille = new HanBraille(u11bc_null, u3163_isolate);
        let out = hanbraille.HangBrai(textToTranslate);
        
        if (ascii) {
            out = hanbraille.BraiUCSToASCII(out);
        }

        // 원본 JSON에 점자 번역 추가
        if (Array.isArray(jsonData.data)) {
            jsonData.data[0].corpus_braille = out;
        } else {
            jsonData.corpus_braille = out;
        }

        // 결과를 새로운 JSON 파일로 저장
        const outputDir = path.join(__dirname, 'data', 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const outputPath = path.join(outputDir, `${path.basename(filePath, '.json')}_with_braille.json`);
        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
        console.log(`Result saved to: ${outputPath}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error processing JSON file ${filePath}: ${error.message}`);
        } else {
            console.error(`Error processing JSON file ${filePath}: ${String(error)}`);
        }
    }
}

// 폴더 내의 JSON 파일을 처리하는 함수 (시작과 끝 인덱스 추가)
function processJSONFolder(folderPath: string, targetKey: string, ascii: boolean = false, startIndex: number = 0, endIndex: number = Infinity): void {
    const files = fs.readdirSync(folderPath).filter(file => path.extname(file).toLowerCase() === '.json');
    const totalFiles = files.length;
    endIndex = Math.min(endIndex, totalFiles);

    console.log(`Processing files from index ${startIndex} to ${endIndex - 1} (Total files: ${totalFiles})`);

    for (let i = startIndex; i < endIndex; i++) {
        const file = files[i];
        const filePath = path.join(folderPath, file);
        console.log(`Processing file ${i + 1}/${endIndex}: ${file}`);
        processJSONFile(filePath, targetKey, ascii);
    }

    console.log(`Processed ${endIndex - startIndex} files.`);
}

// 명령줄 인터페이스에 JSON 처리 옵션 추가
if (args.includes('-j')) {
    const jsonIndex = args.indexOf('-j');
    if (jsonIndex + 2 >= args.length) {
        console.error('Error: -j option requires a JSON file/folder path and a key name.');
        process.exit(1);
    }
    const jsonPath = args[jsonIndex + 1];
    const jsonKey = args[jsonIndex + 2];
    
    // 시작과 끝 인덱스 옵션 추가
    let startIndex = 0;
    let endIndex = Infinity;
    const startIndexOption = args.indexOf('-s');
    const endIndexOption = args.indexOf('-e');

    if (startIndexOption !== -1 && startIndexOption + 1 < args.length) {
        startIndex = parseInt(args[startIndexOption + 1], 10);
        if (isNaN(startIndex) || startIndex < 0) {
            console.error('Error: -s option requires a non-negative integer.');
            process.exit(1);
        }
    }

    if (endIndexOption !== -1 && endIndexOption + 1 < args.length) {
        endIndex = parseInt(args[endIndexOption + 1], 10);
        if (isNaN(endIndex) || endIndex <= 0) {
            console.error('Error: -e option requires a positive integer.');
            process.exit(1);
        }
    }

    if (fs.lstatSync(jsonPath).isDirectory()) {
        processJSONFolder(jsonPath, jsonKey, ascii, startIndex, endIndex);
    } else {
        processJSONFile(jsonPath, jsonKey, ascii);
    }
} else {
    if (!process.stdin.isTTY) {
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            text = chunk.toString().replace(/\r\n/g, '\n');
        })
        .on('end', () => {
            let out = hanbraille.HangBrai(text);
            if (ascii) {
                out = hanbraille.BraiUCSToASCII(out);
            }
            console.log(out);
        });
    } else {
        let out = hanbraille.HangBrai(text);
        if (ascii) {
            out = hanbraille.BraiUCSToASCII(out);
        }
        console.log(out);
    }
}
