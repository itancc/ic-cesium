export interface CommandType {}

export class CommandHelper {
  private _commands: CommandType[] = [];
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
}
