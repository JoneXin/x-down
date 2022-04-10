// #!/usr/bin/env node
import { Command } from 'commander';
import * as readline from 'readline';
import { resolve, join } from 'path';
import Download from './utils/clone';
import { cloneParam } from './typing'
const { yo } = require('yoo-hoo')
const Spinnies = require('spinnies')
import config from './config/defaul.config';

class Xdown {

	program = null; //commander 实例
	rl = null; // readline 实例
	projectName: string = 'my-app' // 项目名
	spinnies = null; // 加载框实例

	constructor() {
		this.program = new Command();
		this.init();
		this.initEvents();
	}

	/**
	 * 初始化
	 */
	private init(): void {

		this.program
			.version('0.1.0')
			.option('-vue2', '基于vue2 js的前端开发模版', 'create vue2 programe')
			.option('-vue3', '基于vue3 ts的前端开发模版', 'create vue2 programe')
			.option('-m', '基于middway的ts的服务端单文件打包的模版', 'create middwat project')
			.option('-p', '基于rollup的ts的第三方库开发的基本模版', '基于rollup的ts的第三方库开发的基本模版')
			.option('-r', '基于react的ts的前端开发模版', '基于rollup的ts的第三方库开发的基本模版')

		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
	}

	// 初始化事件
	private initEvents(): void {

		this.program.parse(process.argv);
		const options = this.program.opts();
		let hasParam = false;

		yo('x-down', {
			color: 'rainbow'
		})

		for (const opt in options) {
			if (options[opt] === true) {
				// 输入项目名
				this.rl.question('项目名(my-app): ', ans => {
					this.projectName = ans;
					// 开启加载
					this.spinner();
					return this.handleCloneProject({ type: opt, lang: 'ts' });
				})
				hasParam = true;
			}
		}

		if (!hasParam) {
			process.exit(0);
		}

		this.rl.on('close', () => {
			process.exit(0);
		})
	}

	/**
	 * 克隆项目
	 * @param params
	 */
	private handleCloneProject(params: cloneParam) {

		const aimDir = join(resolve(), this.projectName);
		const { type, lang } = params;

		// 下载对应的包
		if (!config[type]) return console.log('该功能暂未开放!');
		Download.cloneFromGit(config[type], aimDir, status => {

			if (status == false) {
				this.spinnies.add('spinner-2', { text: '🍇 download suceess!' });
			} else {
				this.spinnies.add('spinner-2', { text: 'download err!' });
				console.log(status);
			}

			// 关闭加载
			this.spinnies.stopAll();
			process.exit(0);
		});
	}

	// 旋转框
	private spinner() {
		// const spinner = { interval: 80, frames: ['🍇', '🍉'] }
		this.spinnies = new Spinnies({ color: 'green', succeedColor: 'green', });
		this.spinnies.add('spinner-1', { text: 'loading~' });
	}
}

new Xdown()