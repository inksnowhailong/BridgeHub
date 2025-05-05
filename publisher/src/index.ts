#!/usr/bin/env node

import { Command } from "commander";
import { commandCreater, commandOption } from "./commandCreater";
import { linkHub } from "./linkhub";
import { configCommand } from "./config";

console.log(`
██████╗ ██╗   ██╗██████╗ ██╗  ██╗██╗   ██╗███████╗██╗   ██╗██████╗ ███████╗██████╗
██╔══██╗██║   ██║██╔══██╗██║ ██╔╝██║   ██║██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗
██████╔╝██║   ██║██████╔╝█████╔╝ ██║   ██║███████╗██║   ██║██████╔╝█████╗  ██████╔╝
██╔═══╝ ██║   ██║██╔═══╝ ██╔═██╗ ██║   ██║╚════██║██║   ██║██╔══██╗██╔══╝  ██╔══██╗
██║     ╚██████╔╝██║     ██║  ██╗╚██████╔╝███████║╚██████╔╝██║  ██║███████╗██║  ██║
╚═╝      ╚═════╝ ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
`);

const program = new Command();
const creater = new commandCreater(program);

program.name("hub-publisher").description("发布者命令行工具").version("1.0.0");
creater.createCommand(linkHub);
creater.createCommand(configCommand);
program.parse(process.argv);
