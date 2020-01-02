const packager = require('electron-packager');
const rebuild = require('electron-rebuild');

const options = {
    dir: './dist',
    overwrite: true,
    asar: true,
    platform: 'win32',
    arch: 'ia32',
    icon: './public/favicon.ico',
    prune: true,
    out: 'release',
    executableName: 'melody',
    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
        rebuild.rebuild({ buildPath, electronVersion, arch })
            .then(() => callback())
            .catch((error) => callback(error));
    }],
}

async function build() {
    try {
        const appPaths = await packager(options);
        console.log(`Electron app bundles created:\n${appPaths.join("\n")}`);
    } catch (err) {
        console.log(err);
    }
}

build();