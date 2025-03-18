import type { Command } from 'commander';
declare module './commandCreater.ts'{
    export interface commandOption {
        Command: Command | null;
    }
}
