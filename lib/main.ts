// #!/usr/bin/env node
const { Command } = require('commander');
import * as readline from 'readline';
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
	config = {}; // 仓库配置

	constructor() {
		this.program = new Command();
		this.config = config;
		this.init();
		this.initEvents();
	}

	/**
	 * 初始化
	 */
	private init(): void {

		this.program
			.version('0.1.0')
			.option('-v2, --vue2', '基于vue2 js的前端开发模版')
			.option('-v3, --vue3', '基于vue3 ts的前端开发模版')
			.option('-rh, --react', '基于react hooks ts的前端开发模版')
			.option('-mdw, --middway', '基于middway的ts的服务端单文件打包的模版')
			.option('-rut, --rollup-ts', '基于rollup的ts的第三方库开发的基本模版')
			.option('-es, --express', '基于express sequelize node_schedule 后端模版')
			.option('-nt, --nest-typeorm', '基于nest typeorm  后端模版')
			.option('-ns, --nest-sequelize', '基于nest sequelize  后端模版')
			.option('-trv3, --tauri', '基于rust tauri vue3  桌面端模版')
		// .option('-ru, --rust', '基于rust 及其常用依赖的 服务端开发模版')

		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})
	}

	// 初始化事件
	private initEvents(): void {

		this.program.parse(process.argv);
		const options = this.program.opts();
		let hasParam = '';

		yo('x-down', {
			color: 'rainbow'
		})

		for (const opt in options) {
			if (options[opt] === true && !!config[opt]) {
				// 输入项目名
				this.rl.question('项目名(my-app): ', ans => {
					this.projectName = ans;
					// 开启加载
					this.spinner();
					return this.handleCloneProject({ type: opt, lang: 'ts' });
				})
				hasParam = opt;
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
	private async handleCloneProject(params: cloneParam) {
		const { type } = params;
		const aimAddr = this.config[type];

		// 下载对应的包
		if (!aimAddr) return console.log('该功能暂未开放!');

		const status = await Download.downloadFromGit(aimAddr, this.projectName);
		if (!status) {
			// this.spinnies.add('spinner-2', { text: 'download err!' });
			this.spinnies.fail('spinner-1', { text: 'download Error!' });
		} else {
			this.spinnies.succeed('spinner-1', { text: '🍇 download suceess!' });
		}

		// 关闭加载
		this.spinnies.stopAll();
		process.exit(0);
	}

	// 旋转框
	private spinner() {
		// const spinner = { interval: 80, frames: ['🍇', '🍉'] }
		this.spinnies = new Spinnies({ color: 'green', succeedColor: 'green', });
		this.spinnies.add('spinner-1', { text: 'loading~' });
	}
}

new Xdown()