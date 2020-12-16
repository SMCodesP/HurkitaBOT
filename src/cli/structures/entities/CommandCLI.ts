export interface OptionsCommand {
    id: string;
    name: string;
    aliases?: string[];
}

export abstract class CommandCLI {
    constructor(id: string, options?: OptionsCommand) {
        this.id = id;
        this.options = options;
    }

    id: string;
    options: OptionsCommand;
    
    abstract exec(args: string[]): any;
}