import { Command } from 'commander';
import * as readline from 'readline';
import { resolve, join } from 'path';
import Download from './utils/clone';
import { cloneParam } from './typing'
const Spinnies = require('spinnies')
import config from './config/defaul.config';

class Xdown {

    program = null; //commander 实例
    rl = null; // readline 实例
    projectName: string = 'my-app'
    spinnies = null;

    constructor() {
        this.program = new Command();
        this.init();
        this.initEvents();
    }

    private init(): void {

        this.program
            .version('0.1.0')
            .option('-vue2', '--vue2', 'create vue2 programe')
            .option('-j', '--js', 'create js project')
            .option('-m', '--middway', 'create middwat project')

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    private initEvents(): void {

        this.program.parse(process.argv);
        const options = this.program.opts();
        console.log(options);

        // middway 项目
        if (options.m == true) {
            
            // 输入项目名
            this.rl.question('项目名(my-app): ', ans => {
                this.projectName = ans;
                // 开启加载
                this.spinner();
                this.handleCloneProject({ type: 'middway', lang: 'ts' });
            })   
        }

        this.rl.on('close', () => {
            process.exit(0);
        })
    }

    private handleCloneProject(params: cloneParam) {

        const aimDir = join(resolve(), this.projectName);
        const { type, lang } = params;

        if (type == 'middway') {
            
            Download.cloneFromGit(config.middway_address, aimDir, status => {

                if (status == false) {
                    this.spinnies.add('spinner-2', { text: 'download suceess!' });
                } else {
                    this.spinnies.add('spinner-2', { text: 'download err!' });
                    console.log(status);
                }

                // 关闭加载
                this.spinnies.stopAll();
                
                process.exit(0);
            });
        }

    }

    private spinner () {
        const spinner = { interval: 80, frames: ['🍇', '🍉'] }
        this.spinnies = new Spinnies({ color: 'green', succeedColor: 'green', spinner });
        this.spinnies.add('spinner-1', { text: '🍇 loading~' });
    }
}

new Xdown()