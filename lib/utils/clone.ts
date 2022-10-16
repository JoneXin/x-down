const gitClone = require('download-git-repo')
const shell = require("shelljs");
const fs = require("fs-extra");
const uuid = require('uuid');
class Download {

    public static cloneFromGit(gitAddr: string, dest: string, branch: string, callback) {
        const addr = `direct:${gitAddr}#${branch}`;
        console.log('地址：', addr);
        gitClone(addr, dest, { clone: true }, err => callback(err ? err : false));
    }

    public static async downloadFromGit(addr: string, newName: string): Promise<boolean> {
        if (!shell.which("git")) {
            shell.echo("Sorry, this script requires git");
            shell.exit(1);
            return false;
        }
        const pName = addr.slice(addr.lastIndexOf('/') + 1, addr.lastIndexOf('.'));
        const aimName = fs.pathExistsSync(`./${newName}`);
        if (aimName) {
            console.log(`【${newName}】 file has aready exist, please rename your project name`);
            return false;
        }

        try {
            const floderName = uuid.v4();
            const tempFloderOPath = `./.${floderName}`;
            fs.mkdirpSync(tempFloderOPath);
            shell.cd(tempFloderOPath)
            await shell.exec(`git clone ${addr}`);
            fs.renameSync(`./${pName}`, `../${newName}`);
            shell.cd(`../`);
            fs.removeSync(tempFloderOPath);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
}

export default Download;