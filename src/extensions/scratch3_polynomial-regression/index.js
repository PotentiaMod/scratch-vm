require('babel-polyfill');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
// const MathUtil = require('../../util/math-util');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==';
const menuIconURI = blockIconURI; 

// const qna = require('@tensorflow-models/qna');
const tf = require('@tensorflow/tfjs');

/////////////////////
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/**
 * Addition RNN example.
 *
 * Based on Python Keras example:
 *   https://github.com/keras-team/keras/blob/master/examples/addition_rnn.py
 */


const tfvis = require('@tensorflow/tfjs-vis');

class CharacterTable {
  /**
   * Constructor of CharacterTable.
   * @param chars A string that contains the characters that can appear
   *   in the input.
   */
  constructor(chars) {
    this.chars = chars;
    this.charIndices = {};
    this.indicesChar = {};
    this.size = this.chars.length;
    for (let i = 0; i < this.size; ++i) {
      const char = this.chars[i];
      if (this.charIndices[char] != null) {
        throw new Error(`Duplicate character '${char}'`);
      }
      this.charIndices[this.chars[i]] = i;
      this.indicesChar[i] = this.chars[i];
    }
  }

  /**
   * Convert a string into a one-hot encoded tensor.
   *
   * @param str The input string.
   * @param numRows Number of rows of the output tensor.
   * @returns The one-hot encoded 2D tensor.
   * @throws If `str` contains any characters outside the `CharacterTable`'s
   *   vocabulary.
   */
  encode(str, numRows) {
    const buf = tf.buffer([numRows, this.size]);
    for (let i = 0; i < str.length; ++i) {
      const char = str[i];
      if (this.charIndices[char] == null) {
        throw new Error(`Unknown character: '${char}'`);
      }
      buf.set(1, i, this.charIndices[char]);
    }
    return buf.toTensor().as2D(numRows, this.size);
  }

  encodeBatch(strings, numRows) {
    const numExamples = strings.length;
    const buf = tf.buffer([numExamples, numRows, this.size]);
    for (let n = 0; n < numExamples; ++n) {
      const str = strings[n];
      for (let i = 0; i < str.length; ++i) {
        const char = str[i];
        if (this.charIndices[char] == null) {
          throw new Error(`Unknown character: '${char}'`);
        }
        buf.set(1, n, i, this.charIndices[char]);
      }
    }
    return buf.toTensor().as3D(numExamples, numRows, this.size);
  }

  /**
   * Convert a 2D tensor into a string with the CharacterTable's vocabulary.
   *
   * @param x Input 2D tensor.
   * @param calcArgmax Whether to perform `argMax` operation on `x` before
   *   indexing into the `CharacterTable`'s vocabulary.
   * @returns The decoded string.
   */
  decode(x, calcArgmax = true) {
    return tf.tidy(() => {
      if (calcArgmax) {
        x = x.argMax(1);
      }
      const xData = x.dataSync();  // TODO(cais): Performance implication?
      let output = '';
      for (const index of Array.from(xData)) {
        output += this.indicesChar[index];
      }
      return output;
    });
  }
}

/**
 * Generate examples.
 *
 * Each example consists of a question, e.g., '123+456' and and an
 * answer, e.g., '579'.
 *
 * @param digits Maximum number of digits of each operand of the
 * @param numExamples Number of examples to generate.
 * @param invert Whether to invert the strings in the question.
 * @returns The generated examples.
 */
function generateData(digits, numExamples, invert) {
  const digitArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const arraySize = digitArray.length;

  const output = [];
  const maxLen = digits + 1 + digits;

  const f = () => {
    let str = '';
    while (str.length < digits) {
      const index = Math.floor(Math.random() * arraySize);
      str += digitArray[index];
    }
    return Number.parseInt(str);
  };

  const seen = new Set();
  while (output.length < numExamples) {
    const a = f();
    const b = f();
    const sorted = b > a ? [a, b] : [b, a];
    const key = sorted[0] + '`' + sorted[1];
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    // Pad the data with spaces such that it is always maxLen.
    const q = `${a}+${b}`;
    const query = q + ' '.repeat(maxLen - q.length);
    let ans = (a + b).toString();
    // Answer can be of maximum size `digits + 1`.
    ans += ' '.repeat(digits + 1 - ans.length);

    if (invert) {
      throw new Error('invert is not implemented yet');
    }
    output.push([query, ans]);
  }
  return output;
}

function convertDataToTensors(data, charTable, digits) {
  const maxLen = digits + 1 + digits;
  const questions = data.map(datum => datum[0]);
  const answers = data.map(datum => datum[1]);
  return [
    charTable.encodeBatch(questions, maxLen),
    charTable.encodeBatch(answers, digits + 1),
  ];
}

function createAndCompileModel(
    layers, hiddenSize, rnnType, digits, vocabularySize) {
  const maxLen = digits + 1 + digits;

  const model = tf.sequential();
  switch (rnnType) {
    case 'SimpleRNN':
      model.add(tf.layers.simpleRNN({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        inputShape: [maxLen, vocabularySize]
      }));
      break;
    case 'GRU':
      model.add(tf.layers.gru({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        inputShape: [maxLen, vocabularySize]
      }));
      break;
    case 'LSTM':
      model.add(tf.layers.lstm({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        inputShape: [maxLen, vocabularySize]
      }));
      break;
    default:
      throw new Error(`Unsupported RNN type: '${rnnType}'`);
  }
  model.add(tf.layers.repeatVector({n: digits + 1}));
  switch (rnnType) {
    case 'SimpleRNN':
      model.add(tf.layers.simpleRNN({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        returnSequences: true
      }));
      break;
    case 'GRU':
      model.add(tf.layers.gru({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        returnSequences: true
      }));
      break;
    case 'LSTM':
      model.add(tf.layers.lstm({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        returnSequences: true
      }));
      break;
    default:
      throw new Error(`Unsupported RNN type: '${rnnType}'`);
  }
  model.add(tf.layers.timeDistributed(
      {layer: tf.layers.dense({units: vocabularySize})}));
  model.add(tf.layers.activation({activation: 'softmax'}));
  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: 'adam',
    metrics: ['accuracy']
  });
  return model;
}

class AdditionRNNDemo {
  constructor(digits, trainingSize, rnnType, layers, hiddenSize) {
    // Prepare training data.
    const chars = '0123456789+ ';
    this.charTable = new CharacterTable(chars);
    console.log('Generating training data');
    const data = generateData(digits, trainingSize, false);
    const split = Math.floor(trainingSize * 0.9);
    this.trainData = data.slice(0, split);
    this.testData = data.slice(split);
    [this.trainXs, this.trainYs] =
        convertDataToTensors(this.trainData, this.charTable, digits);
    [this.testXs, this.testYs] =
        convertDataToTensors(this.testData, this.charTable, digits);
    this.model = createAndCompileModel(
        layers, hiddenSize, rnnType, digits, chars.length);
  }

  async train(iterations, batchSize, numTestExamples) {
    const lossValues = [[], []];
    const accuracyValues = [[], []];
    for (let i = 0; i < iterations; ++i) {
      const beginMs = performance.now();
      const history = await this.model.fit(this.trainXs, this.trainYs, {
        epochs: 1,
        batchSize,
        validationData: [this.testXs, this.testYs],
        yieldEvery: 'epoch'
      });

      const elapsedMs = performance.now() - beginMs;
      const modelFitTime = elapsedMs / 1000;

      const trainLoss = history.history['loss'][0];
      const trainAccuracy = history.history['acc'][0];
      const valLoss = history.history['val_loss'][0];
      const valAccuracy = history.history['val_acc'][0];

      lossValues[0].push({'x': i, 'y': trainLoss});
      lossValues[1].push({'x': i, 'y': valLoss});

      accuracyValues[0].push({'x': i, 'y': trainAccuracy});
      accuracyValues[1].push({'x': i, 'y': valAccuracy});

    //   document.getElementById('trainStatus').textContent =
    //       `Iteration ${i + 1} of ${iterations}: ` +
    //       `Time per iteration: ${modelFitTime.toFixed(3)} (seconds)`;
    //   const lossContainer = document.getElementById('lossChart');
      tfvis.render.linechart(
          'lossChart', {values: lossValues, series: ['train', 'validation']},
          {
            width: 420,
            height: 300,
            xLabel: 'epoch',
            yLabel: 'loss',
          });

    //   const accuracyContainer = document.getElementById('accuracyChart');
      tfvis.render.linechart(
          'accuracyChart',
          {values: accuracyValues, series: ['train', 'validation']}, {
            width: 420,
            height: 300,
            xLabel: 'epoch',
            yLabel: 'accuracy',
          });

      if (this.testXsForDisplay == null ||
          this.testXsForDisplay.shape[0] !== numTestExamples) {
        if (this.textXsForDisplay) {
          this.textXsForDisplay.dispose();
        }
        this.testXsForDisplay = this.testXs.slice(
            [0, 0, 0],
            [numTestExamples, this.testXs.shape[1], this.testXs.shape[2]]);
      }

      const examples = [];
      const isCorrect = [];
      tf.tidy(() => {
        const predictOut = this.model.predict(this.testXsForDisplay);
        for (let k = 0; k < numTestExamples; ++k) {
          const scores =
              predictOut
                  .slice(
                      [k, 0, 0], [1, predictOut.shape[1], predictOut.shape[2]])
                  .as2D(predictOut.shape[1], predictOut.shape[2]);
          const decoded = this.charTable.decode(scores);
          examples.push(this.testData[k][0] + ' = ' + decoded);
          isCorrect.push(this.testData[k][1].trim() === decoded.trim());
        }
      });

    //   const examplesDiv = document.getElementById('testExamples');
      const examplesContent = examples.map(
          (example, i) =>
              `<div class="${
                  isCorrect[i] ? 'answer-correct' : 'answer-wrong'}">` +
              `${example}` +
              `</div>`);

      //examplesDiv.innerHTML = examplesContent.join('\n');
    }
  }
}

async function runAdditionRNNDemo(digits,trainingSize,rnnType,layers,hiddenSize,batchSize,trainIterations,numTestExamples) {
  
    
    // if (digits < 1 || digits > 5) {
    //   status.textContent = 'digits must be >= 1 and <= 5';
    //   return;
    // }
    // const trainingSizeLimit = Math.pow(Math.pow(10, digits), 2);
    // if (trainingSize > trainingSizeLimit) {
    //   status.textContent =
    //       `With digits = ${digits}, you cannot have more than ` +
    //       `${trainingSizeLimit} examples`;
    //   return;
    // }
    const trainingSizeLimit = Math.pow(Math.pow(10, digits), 2);
    const demo =
        new AdditionRNNDemo(digits, trainingSize, rnnType, layers, hiddenSize);
    await demo.train(trainIterations, batchSize, numTestExamples);

}



/////////////////////

let rnnTypeArr = [
    'SinpleRNN',
    'GRU',
    'LSTM'  
]


class Scratch3HelloBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }


    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.helloWorld';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'addrnn',
            name: 'addition rnn',
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'addition_rnn',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'addition rnn',
                        default: 'addition-rnn [digits] [trainingSize] [rnnType] [rnnLayers] [rnnLayerSize] [batchSize] [trainIterations] [numTestExamples]',
                        description: 'addition rnn'
                    }),
                    arguments: {
                        digits: {
                            type: ArgumentType.STRING,
                            
                            defaultValue: "2"
                        },
                        trainingSize: {
                            type: ArgumentType.STRING,
                           
                            defaultValue: "5000"
                        },
                        rnnType: {
                            type: ArgumentType.STRING,
                            menu: 'rnnType_menu',
                            defaultValue: "SimpleRNN"
                        },
                        rnnLayers: {
                            type: ArgumentType.STRING,
                            
                            defaultValue: "1"
                        },
                        rnnLayerSize: {
                            type: ArgumentType.STRING,
                            
                            defaultValue: "128"
                        },
                        batchSize: {
                            type: ArgumentType.STRING,
                            
                            defaultValue: "128"
                        },
                        trainIterations: {
                            type: ArgumentType.STRING,
                            
                            defaultValue: "100"
                        },
                        numTestExamples: {
                            type: ArgumentType.STRING,
                            
                            defaultValue: "20"
                        }
                    }
                }
            ],
            menus: {
                rnnType_menu: {
                    acceptReporters: true,
                    items: '_rnnTypeArr'
                }           
            }
        };
    }

    _rnnTypeArr () {
        return rnnTypeArr.map(item => item.toString())
    }
    

    addition_rnn(args, util) {
        
        // const a = tf.Tensor;
        // const b = 1;
        // console.log('hello');
        // // console.log(answers);
        // //const base = 'pascal';        // set to your preferred model, out of `pascal`,
        //                         // `cityscapes` and `ade20k`
        // const quantizationBytes = 2;  // either 1, 2 or 4
        // // use the getURL utility function to get the URL to the pre-trained weights
        // const modelUrl = deeplab.getURL(base, quantizationBytes);
        // //const model =   qna.load();
        // //const answers =  model.findAnswers(question, passage);

        //定义一个线性回归模型。
        const model = tf.sequential();
        model.add(tf.layers.dense({units: 1, inputShape: [1]}));

        model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

        // 为训练生成一些合成数据
        const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
        const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

        // 使用数据训练模型
        model.fit(xs, ys, {epochs: 10}).then(() => {
        // 在该模型从未看到过的数据点上使用模型进行推理
        model.predict(tf.tensor2d([5], [1, 1])).print();
        console.log('hello');
    });
    
    
    //runAdditionRNNDemo(digits,trainingSize,args.rnnType,rnnLayers,rnnLayerSize,batchSize,trainIterations,numExamples);
    
}

}

module.exports = Scratch3HelloBlocks;