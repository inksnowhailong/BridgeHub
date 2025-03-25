import { Command } from "commander";

export class commandOption {
  command: Command | null = null;

  constructor(
    public name: string,
    public description?:
      | [str: string, argsDescription: Record<string, string>]
      | string,
    public option?:
      | [
          flags: string,
          description?: string,
          defaultValue?: string | boolean | string[]
        ]
      | string,
    public action?: (this: Command, ...args: any[]) => void | Promise<void>
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
      if (typeof comand.description === "string") {
        cmd.description(comand.description as string);
      } else {
        cmd.description(...comand.description);
      }
    }
    if (comand.option) {
      if (typeof comand.option === "string") {
        cmd.option(comand.option as string);
      } else {
        cmd.option(...comand.option);
      }
    }
    if (comand.action) {
      cmd.action(comand.action);
    }
  }
}
