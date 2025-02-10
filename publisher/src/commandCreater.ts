import { Command } from "commander";

export class commandOption {
  constructor(
    public name: string,
    public description: string,
    public option: string,
    public action:  (this: Command, ...args: any[]) => void | Promise<void>
  ) {}
}

export class commandCreater {
  constructor(protected program: Command) {}
  createCommand(comand: commandOption) {
    const cmd = this.program.command(comand.name);
    if (comand.description) {
        cmd.description(comand.description);
    }
    if (comand.option) {
        cmd.option(comand.option);
    }
    if (comand.action) {
        cmd.action(comand.action);
    }
  }
}
