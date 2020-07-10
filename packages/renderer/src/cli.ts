#!/usr/bin/env node
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { render } from './index';

const htmlFlag = '--html';
const jsFlag = '--js';

const htmlFlagPos = process.argv.indexOf(htmlFlag);
const jsFlagPos = process.argv.indexOf(jsFlag);

if (htmlFlagPos < 0 || jsFlagPos < 0) {
  throw new Error('You must specify both --html and --js flags with paths');
}

const cwd = process.cwd();
const htmlPath = resolve(cwd, process.argv[htmlFlagPos + 1]);
const jsPath = resolve(cwd, process.argv[jsFlagPos + 1]);

const html = readFileSync(htmlPath, { encoding: 'utf8' });
const js = readFileSync(jsPath, { encoding: 'utf8' });

const renderedHtml = render(html, js);
console.log(renderedHtml);
