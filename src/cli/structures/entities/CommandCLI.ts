import CLI from "../..";

export interface OptionsCommand {
    name: string;
    aliases?: string[];
    description?: any;
}

export abstract class CommandCLI {
    constructor(id: string, options?: OptionsCommand) {
        this.id = id;
        this.options = options;
    }

    id: string;
    options: OptionsCommand;
    
    abstract exec(args: string[], client: CLI, commandUsage: string): any;
}