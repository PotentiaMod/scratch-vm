// create by scratch3-extension generator
const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;

const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0My43MjkyNSIgaGVpZ2h0PSI1My45MTQzMyIgdmlld0JveD0iMCwwLDQzLjcyOTI1LDUzLjkxNDMzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjE4LjEzNTM5LC0xNTMuMDQyODQpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTI0MC43NzMwOSwxNTMuMTU3MTdjNi44LC0xLjEgMTMuOSw2LjEgMTMuOSw2LjFjMCwwIDQsMC40IDUuMSwyLjRjMS4xLDIgMS41LDUuMyAyLDEwLjNjMS4yLDEzLjcgLTkuNiwzNC40IC0yMC40LDM1Yy03LjIsLTcgLTkuNSwtMC4yIC0xMS45LC0zLjZjLTUsLTcuMiAtOCwtMTEuMyAtOS45LC0yMC40Yy0xLjYsLTguMSAtMi41LC0xMi41IDAuOCwtMTkuMmMzLjMsLTYuOCAxMC41LC02LjcgMTAuNSwtNi43bC0yLjksLTEuN2MwLDAgNi40LC0xLjUgOSwtMS4zYzIuMiwwLjEgNi4yLDEuNSA2LjIsMS41eiIgZmlsbD0iI2ZiZDA0NiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyNy45NzMwNywxODguMTU3MTRjMC44LDIuNCAwLjMsNC43IC0xLDUuMWMtMS40LDAuNSAtMy4yLC0xIC00LC0zLjRjLTAuOCwtMi40IC0wLjMsLTQuNyAxLC01LjFjMS40LC0wLjUgMy4yLDEuMSA0LDMuNHoiIGZpbGw9IiNjY2ExNjgiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTkuNDczMDcsMTg1Ljk1NzE0YzAsMTIuOCAtNy45LDE5LjYgLTE0LjcsMTkuOWMtMTEuOCwwLjIgLTE5LjQsLTkuNSAtMTkuNCwtMjIuM2MwLC0xMi44IDIuMiwtMjIuNCAxNy4yLC0yMy4xYzExLjQsLTAuNiAxOC44ODM0LDExLjUgMTYuODgzNCwyNS4yeiIgZmlsbD0iI2Q1YWU4MiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI0Ny44NzMwNywxOTguNjU3MTRjMCwwLjcgLTIsMi4yIC0zLjcsMi4yYy0xLjcsMCAtMy41LC0xLjkgLTMuNSwtMi43YzAsLTAuNyAyLjIsMCA0LDBjMS44LDAgMy4yLC0wLjIgMy4yLDAuNXoiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjYuNTczMDcsMTcwLjY1NzE0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNC4zOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIyMS4zNzMwNywxNzguNDE0MzRjMCwwIC0yLjgxNDMsLTI5LjA3MTUgMjcuNSwtMjEuMDU3MmM2LjksMS45IDExLjQsNy44IDExLjksMTEuN2MwLjQ2NDYsMy42OTA1IC0xLjEwNDgsMTAuMDY0OCAtMS4xMDQ4LDEwLjA2NDhsLTYuMzk1MiwtNy45NjQ4YzAsMCAtNSwyLjYgLTguMiwzLjRjLTQuOSwxLjMgLTEyLjUsMiAtMTIuNSwybDAuOSwtNWwtOC4wNTQ4LDEzLjQ5NWwtMC42ODgsLTguNzk1eiIgZmlsbD0iI2ZiZDA0NiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI0Ny4yNzMwNywxOTEuMjU3MTRjMCwwIC0wLjMsMSAtMi4yLDFjLTEuNCwwIC0yLjIsLTAuOCAtMi4yLC0wLjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjI3NzUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxnPjxwYXRoIGQ9Ik0yMzMuNzczMDcsMTc5LjQ1NzE0YzAsMCAyLjksLTAuOCA0LjQsLTAuOGMxLjcsLTAuMSAzLjcsMC44IDMuNywwLjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjQ2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48Zz48cGF0aCBkPSJNMjMzLjY3MzA3LDE4My4wNTcxNGMwLDAgMi4yLC0xLjIgNC41LC0xYzIuNSwwLjIgMi45LDEuMSAyLjksMS4xIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMS40NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIzNi45NzMwNywxODQuNTU3MTRjMCwtMS4yIDAuOSwtMi4yIDIuMSwtMi4yYzEuMiwwIDIuMSwxIDIuMSwyLjJjMCwxLjIgLTAuOSwyLjIgLTIuMSwyLjJjLTEuMSwwIC0yLjEsLTEgLTIuMSwtMi4yeiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PC9nPjwvZz48Zz48cGF0aCBkPSJNMjQ5LjE3MzA3LDE3OS4zNTcxNGMwLDAgMi4zLC0wLjggNCwtMC44YzEuNSwwLjEgMy4yLDAuNSAzLjIsMC41IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMS40NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGc+PHBhdGggZD0iTTI0OS4xNzMwNywxODMuMzU3MTRjMCwwIDEsLTEuMSAyLjksLTEuM2MyLjMsLTAuMiA0LjUsMC40IDQuNSwwLjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjQ2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjU0LjA3MzA3LDE4Ni40NTcxNGMtMS4yLDAgLTIuMSwtMSAtMi4xLC0yLjJjMCwtMS4yIDAuOSwtMi4yIDIuMSwtMi4yYzEuMiwwIDIuMSwxIDIuMSwyLjJjMC4xLDEuMiAtMC45LDIuMiAtMi4xLDIuMnoiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=";
const blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAKZJREFUaEPt2LENgDAQBMF3AfRfqAuAjJwNHKAhBiHGqwtYe/Y9B65rrgNvmVk+KDo7oQgnuQg3kotykotwkqtwkqtyVi7KSS7CWbkKJ7kqZ+WinOQinJWrcJKrclYuyv0vuZk58ud0z47m3x5bPugb2Hu3E4pwkotwI7koJ7kIJ7kKJ7kqZ+WinOQinJWrcJKrclYuykkuwlm5Cie5KmflotzvknsAHsqZXUjrpfoAAAAASUVORK5CYIIA";

class testExt{
  constructor (runtime){
    this.runtime = runtime;
    // communication related
    this.comm = runtime.ioDevices.comm;
    this.session = null;
    this.runtime.registerPeripheralExtension('testExt', this);
    // session callbacks
    this.reporter = null;
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.write = this.write.bind(this);
    // string op
    this.decoder = new TextDecoder();
    this.lineBuffer = '';
  }

  onclose (){
    this.session = null;
  }

  write (data, parser = null){
    if (this.session){
      return new Promise(resolve => {
        if (parser){
          this.reporter = {
            parser,
            resolve
          }
        }
        this.session.write(data);
      })
    }
  }

  onmessage (data){
    const dataStr = this.decoder.decode(data);
    this.lineBuffer += dataStr;
    if (this.lineBuffer.indexOf('\n') !== -1){
      const lines = this.lineBuffer.split('\n');
      this.lineBuffer = lines.pop();
      for (const l of lines){
        if (this.reporter){
          const {parser, resolve} = this.reporter;
          resolve(parser(l));
        };
      }
    }
  }

  scan (){
    this.comm.getDeviceList().then(result => {
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
    });
  }

  getInfo (){
    return {
      id: 'testExt',
      name: 'Test',
      color1: '#ff8100',
      color2: '#0DA57A',
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'h',
          blockType: BlockType.COMMAND,
          text: ''
        }
      ]
    }
  }

h (args, util){

  return this.write(`M0 \n`);
}

}

module.exports = testExt;
