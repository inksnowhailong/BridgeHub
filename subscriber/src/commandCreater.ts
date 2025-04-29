import { Command } from "commander";

export class commandOption {
  constructor(
    public name: string,
    public description: string,
    public options: string | string[],
    public action: (...args: any[]) => Promise<void>
  ) {}
}

export class commandCreater {
  constructor(protected program: Command) {}
  createCommand(comand: commandOption) {
    const cmd = this.program.command(comand.name);
    // 注入commander实例
    const commandPrototype = Object.getPrototypeOf(comand);
    commandPrototype.Command = this.program;

    if (comand.description) {
      cmd.description(comand.description);
    }
    if (comand.options) {
      if (typeof comand.options === "string") {
        cmd.option(comand.options);
      } else {
        comand.options.forEach((option) => {
          cmd.option(option);
        });
      }
    }
    if (comand.action) {
      cmd.action(comand.action);
    }
  }
}
