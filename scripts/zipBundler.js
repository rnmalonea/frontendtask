const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const inquirer = require('inquirer');

const ignoreDirs = [
    'dist',
    'node_modules',
    'package-lock.json', // sometimes read as a dir
    '.idea',
    '.git',
    'coverage'
];

const ignoreFiles = [
    'package-lock.json'
];

const questions = [
    {
        type: 'input',
        name: 'filename',
        message: "Enter file name (your full name)",
        validate: function (string) {
            return Boolean(string) || 'Please enter your name.'
        }
    },
    {
        type: 'input',
        name: 'path',
        message: "Enter file destination",
        validate: function (path) {
            return fs.existsSync(path) || 'That path does not exist on your file system.'
        }
    }
];

inquirer.prompt(questions).then(function (answers) {
    const projectRoot = path.join(__dirname, '..');
    const file = `${answers.filename}.zip`;
    const output = fs.createWriteStream(`${answers.path}/${file}`, {mode: 0o755});
    const archive = archiver('zip', {zlib: {level: 9}});

    output.on('close', function () {
        console.log();
        console.log('COMPRESSING COMPLETE');
        console.log();
        console.log(`${file} ${archive.pointer()} bytes`);
    });

    output.on('end', function () {
        console.log('Data has been drained');
    });

    archive.on('error', function (err) {
        console.error('Error while building zip file.', err);
        process.exit(1)
    });

    archive.pipe(output);
    ignoreFiles.push(file);

    const fileEnts = fs.readdirSync(projectRoot, {withFileTypes: true});

    fileEnts.forEach(function (fileEnt) {
        const name = fileEnt.name;
        if (fileEnt.isFile() && !ignoreFiles.includes(name)) {
            console.log('Writing FILE ', name);
            archive.file(name)
        } else if (!ignoreDirs.includes(name)) {
            console.log('Writing DIRECTORY ', name);
            archive.directory(
                name,
                name
            )
        }
    });

    archive.finalize();
});
