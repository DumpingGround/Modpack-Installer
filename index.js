const fs = require('fs');
const chalk = require('chalk');
const request = require('request');
const progress = require('request-progress');
const prompt = require('prompt-sync')();

//const DOWNLOADURL = 'https://github.com/HexDevv/KeyCraft-Modpack/archive/main.zip';

function error(msg, exitcode) {
    console.log(`There was an error whilst attempting to run this.`);
    console.log(`Error Message: ${msg}`);
    process.exit(exitcode);
}

console.log(`Welcome to the ${chalk.italic('unofficial')} ${chalk.bold(chalk.cyan('KeyCraft'))} Modpack Installer.\nThis is for lazy cunts who don't know how to install mods.`);
console.log(`${chalk.underline('Few things before we get started:')}\n${chalk.bold('- This will delete ALL mods in the mods folder. If you\'re using this installer it probably means you don\'t have anything in your mods folder.')}\n- If you have any issues, please DM HexDev#0001 on Discord, or open up an issue on the Github.\n- If you\'d like to suggest a mod, open up an issue on the Github.\n- This is a bodged installer. I cannot guarantee this will work. By using this installer you agree that I am not liable for any damages caused, and i provide no warranty.`);
const yn = prompt('[Y/n] ');

if (yn.toLowerCase().includes('n')) {
    console.log('Cancelled');
    prompt('[Press anything to continue] ');
    process.exit(0);
}

if (!fs.existsSync(process.env.APPDATA + '/.minecraft/mods/')) {
    error('Your /mods directory is non existent. Please install Forge', 0);
}

console.log('Deleting mods folder...');
fs.rmdirSync(process.env.APPDATA + '/.minecraft/mods', {recursive:true});
fs.mkdirSync(process.env.APPDATA + '/.minecraft/mods');


let aaa = request.get('https://gist.githubusercontent.com/HexDevv/4fe538f9189e6150121f32949b7179dc/raw/38740fe419184a403c400691b1fa538d18b0f381/KeyCraft-Config.json')
aaa = aaa.json();
const downloadURL = aaa.downloadURL;

const modFILE = fs.createWriteStream('./mods.zip');
const download = progress(request.get(downloadURL));

download.on('progress', function (state) {
    let downloadPercentage = '';
    for (let i=0;i<20;i++) {
        if (i<state.percent) downloadPercentage = downloadPercentage + '#';
        else downloadPercentage = downloadPercentage + '-';
    }
    console.log(`[${downloadPercentage}] ${state/1000000}MB/s`);
});

download.on('response', (res) => {
    if (res.statusCode != 200) error(`HTTP Error Status is ${res.statusCode}`, 0);
    res.pipe(modFILE);
});

download.on('finish', () => fs.unlink('./mods.zip', () => {}));
