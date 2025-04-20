#!/usr/bin/env node

import { Command } from "commander";
import { commandCreater, commandOption } from "./commandCreater.ts";
import { linkHub } from "./linkhub.ts";
import { configCommand } from "./config.ts";
import { SubscriberCommand } from "./commands/subscriber.command.ts";

const program = new Command();
const creater = new commandCreater(program);

program.name("hub-subscriber").description("订阅者命令行工具").version("1.0.0");
creater.createCommand(linkHub);
creater.createCommand(configCommand);
creater.createCommand(SubscriberCommand.createCommand());
creater.createCommand(SubscriberCommand.connectCommand());
program.parse(process.argv);
