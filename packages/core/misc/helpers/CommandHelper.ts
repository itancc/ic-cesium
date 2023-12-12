export abstract class Command {
  public abstract name: string;
  public abstract do(): void;
  public abstract undo(): void;

  public dispose(): void {}
  // # NOTE 命令合并功能暂时不实现
  public union(): void {}
  public canUnion(): boolean {
    return false;
  }
}

export class CommandHelper {
  private _commands: Command[] = [];
  private _maxSize = 1000;

  public get count() {
    return this._commands.length;
  }
  public getMaxSize() {
    return this._maxSize;
  }
  public setMaxSize(maxSize: number) {
    this._maxSize = maxSize;
  }

  public addCommand(command: Command) {
    if (this._commands.length === this._maxSize) {
      this._commands.shift();
    }
    this._commands.push(command);
  }
  public removeCommand(command: Command) {
    const index = this._commands.indexOf(command);
    if (index !== -1) {
      this._commands[index].dispose?.();
      this._commands.splice(index, 1);
    }
  }
  public removeCommandByName(name: string) {
    const index = this._commands.findIndex((c) => c.name === name);
    if (index !== -1) {
      this._commands[index].dispose?.();
      this._commands.splice(index, 1);
    }
  }

  public clear() {
    for (const command of this._commands) {
      command.dispose?.();
    }
    this._commands.length = 0;
  }

  /** 回滚最近操作的一条命令 */
  public undo() {
    if (this._commands.length > 0) {
      const command = this._commands.pop();
      command.undo();
    }
  }
}
