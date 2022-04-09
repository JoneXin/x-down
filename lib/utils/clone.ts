const gitClone = require('download-git-repo')

class Download {

    public static cloneFromGit(gitAddr: string, dest: string, callback) {
        gitClone('direct:' + gitAddr + '#master', dest, { clone: true }, err => callback(err ? err : false));
    }
}

export default Download;