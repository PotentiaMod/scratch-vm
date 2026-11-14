const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Variable = require("../../engine/variable");
const uid = require("../../util/uid");
const formatMessage = require("format-message");

class Scratch3ProjectDevices {
  constructor(runtime) {
    this.runtime = runtime;
  }

  get EXTENSION_ID() {
    return "projectDevices";
  }

  getInfo() {
    return [
      {
        id: "projectDevices",
        name: formatMessage({
          id: "project.devices.name",
          default: "Project & Devices",
          description: "Utility blocks for project and sprites",
        }),
        color1: "#0bb4ff",
        blocks: [
          {
            opcode: "createVariableWithValue",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "project.createVar",
              default: "create variable [NAME] with value [VALUE]",
              description: "Create a scalar variable with initial value",
            }),
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "score" },
              VALUE: { type: ArgumentType.STRING, defaultValue: "0" },
            },
          },
          {
            opcode: "createListAndAdd",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "project.createListAdd",
              default: "create list [NAME] and add [ITEM]",
              description: "Create list then add first item",
            }),
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "items" },
              ITEM: { type: ArgumentType.STRING, defaultValue: "apple" },
            },
          },
          {
            opcode: "setSpritePosition",
            blockType: BlockType.COMMAND,
            text: formatMessage({
              id: "project.setPos",
              default: "set sprite position x:[X] y:[Y]",
              description: "Position the current sprite",
            }),
            arguments: {
              X: { type: ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
        ],
      },
    ];
  }

  createVariableWithValue(args, util) {
    const name = String(args.NAME || "var");
    const value = args.VALUE;
    const target = util && util.target ? util.target : this.runtime.getEditingTarget();
    if (!target) return;
    const id = uid();
    target.createVariable(id, name, Variable.SCALAR_TYPE, false);
    const variable = target.lookupVariableById(id);
    if (variable) variable.value = value;
  }

  createListAndAdd(args, util) {
    const name = String(args.NAME || "list");
    const item = args.ITEM;
    const target = util && util.target ? util.target : this.runtime.getEditingTarget();
    if (!target) return;
    const id = uid();
    const list = target.lookupOrCreateList(id, name);
    if (Array.isArray(list.value)) {
      list.value.push(item);
    }
  }

  setSpritePosition(args, util) {
    const x = Number(args.X || 0);
    const y = Number(args.Y || 0);
    const target = util && util.target ? util.target : this.runtime.getEditingTarget();
    if (!target || typeof target.setXY !== "function") return;
    target.setXY(x, y);
  }
}

module.exports = Scratch3ProjectDevices;


