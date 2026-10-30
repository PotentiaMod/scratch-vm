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


//////////////////
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

// import * as tf from '@tensorflow/tfjs';
// import * as tfvis from '@tensorflow/tfjs-vis';

// import {BostonHousingDataset, featureDescriptions} from './data';
// import * as normalization from './normalization';
const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');
const Data = require('./data');
const normalization = require('./normalization');

// Some hyperparameters for model training.
// var NUM_EPOCHS = 200;
// var BATCH_SIZE = 40;
// var LEARNING_RATE = 0.01;

const bostonData = new Data.BostonHousingDataset();
const tensors = {};

// Convert loaded data into tensors and creates normalized versions of the
// features.
function arraysToTensors() {
  tensors.rawTrainFeatures = tf.tensor2d(bostonData.trainFeatures);
  tensors.trainTarget = tf.tensor2d(bostonData.trainTarget);
  tensors.rawTestFeatures = tf.tensor2d(bostonData.testFeatures);
  tensors.testTarget = tf.tensor2d(bostonData.testTarget);
  // Normalize mean and standard deviation of data.
  let {dataMean, dataStd} =
      normalization.determineMeanAndStddev(tensors.rawTrainFeatures);

  tensors.trainFeatures = normalization.normalizeTensor(
      tensors.rawTrainFeatures, dataMean, dataStd);
  tensors.testFeatures =
      normalization.normalizeTensor(tensors.rawTestFeatures, dataMean, dataStd);
};

/**
 * Builds and returns Linear Regression Model.
 *
 * @returns {tf.Sequential} The linear regression model.
 */
function linearRegressionModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({inputShape: [bostonData.numFeatures], units: 1}));

  //model.summary();
  return model;
};

/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 1 hidden layers, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression model.
 */
function multiLayerPerceptronRegressionModel1Hidden() {
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [bostonData.numFeatures],
    units: 50,
    activation: 'sigmoid',
    kernelInitializer: 'leCunNormal'
  }));
  model.add(tf.layers.dense({units: 1}));

//   model.summary();
   return model;
};

/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 2 hidden layers, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression mode  l.
 */
function multiLayerPerceptronRegressionModel2Hidden() {
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [bostonData.numFeatures],
    units: 50,
    activation: 'sigmoid',
    kernelInitializer: 'leCunNormal'
  }));
  model.add(tf.layers.dense(
      {units: 50, activation: 'sigmoid', kernelInitializer: 'leCunNormal'}));
  model.add(tf.layers.dense({units: 1}));

   //model.summary();
   return model;
};


/**
 * Describe the current linear weights for a human to read.
 *
 * @param {Array} kernel Array of floats of length 12.  One value per feature.
 * @returns {List} List of objects, each with a string feature name, and value
 *     feature weight.
 */
function describeKernelElements(kernel) {
  tf.util.assert(
      kernel.length == 12,
      `kernel must be a array of length 12, got ${kernel.length}`);
  const outList = [];
  for (let idx = 0; idx < kernel.length; idx++) {
    outList.push({description: Data.featureDescriptions[idx], value: kernel[idx]});
  }
  return outList;
}

/**
 * Compiles `model` and trains it using the train data and runs model against
 * test data. Issues a callback to update the UI after each epcoh.
 *
 * @param {tf.Sequential} model Model to be trained.
 * @param {boolean} weightsIllustration Whether to print info about the learned
 *  weights.
 */
async function run(model,NUM_EPOCHS,BATCH_SIZE,LEARNING_RATE) {

    
        
  model.compile(
      {optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError'});

  let trainLogs = [];
  //const container = document.querySelector(`#${modelName} .chart`);
  const container = { name: 'show.history', tab: 'Training' };

 
  await model.fit(tensors.trainFeatures, tensors.trainTarget, {
    batchSize: BATCH_SIZE,
    epochs: NUM_EPOCHS,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        trainLogs.push(logs);
        tfvis.show.history(container, trainLogs, ['loss', 'val_loss'])
      }
    }
  });

  const result = model.evaluate(
      tensors.testFeatures, tensors.testTarget, {batchSize: BATCH_SIZE});
//   const testLoss = result.dataSync()[0];

//   const trainLoss = trainLogs[trainLogs.length - 1].loss;
//   const valLoss = trainLogs[trainLogs.length - 1].val_loss;
//   await ui.updateModelStatus(
//       `Final train-set loss: ${trainLoss.toFixed(4)}\n` +
//           `Final validation-set loss: ${valLoss.toFixed(4)}\n` +
//           `Test-set loss: ${testLoss.toFixed(4)}`,
//       modelName);
};

function computeBaseline() {
  const avgPrice = tensors.trainTarget.mean();
  console.log(`Average price: ${avgPrice.dataSync()}`);
  const baseline = tensors.testTarget.sub(avgPrice).square().mean();
  console.log(`Baseline loss: ${baseline.dataSync()}`);
//   const baselineMsg = `Baseline loss (meanSquaredError) is ${
//       baseline.dataSync()[0].toFixed(2)}`;
//   ui.updateBaselineStatus(baselineMsg);
};

// document.addEventListener('DOMContentLoaded', async () => {
//   await bostonData.loadData();
//   ui.updateStatus('Data loaded, converting to tensors');
//   arraysToTensors();
//   ui.updateStatus(
//       'Data is now available as tensors.\n' +
//       'Click a train button to begin.');
//   // TODO Explain what baseline loss is. How it is being computed in this
//   // Instance
//   ui.updateBaselineStatus('Estimating baseline loss');
   //computeBaseline();
//   await ui.setup();
// }, false);
async function prerun(NUM_EPOCHS,BATCH_SIZE,LEARNING_RATE,modeltype){
    await bostonData.loadData();
    arraysToTensors();
    computeBaseline();
    var model = linearRegressionModel();
    switch(modeltype){
      case 'linearRegressionModel':
        model = linearRegressionModel();
        break;
      case 'multiLayerPerceptronRegressionModel1Hidden':
        model = multiLayerPerceptronRegressionModel1Hidden();
        break;
      case 'multiLayerPerceptronRegressionModel2Hidden':
        model = multiLayerPerceptronRegressionModel2Hidden();
        break;
    }
    //const model = multiLayerPerceptronRegressionModel2Hidden();
    await run(model,NUM_EPOCHS,BATCH_SIZE,LEARNING_RATE);
}

//////////////////
let modelmenuArr = [
  'linearRegressionModel',
  'multiLayerPerceptronRegressionModel1Hidden',
  'multiLayerPerceptronRegressionModel2Hidden'  
]
let nummenuArr = [
  '100',
  '200',
  '300',
  '400',
  '500'  
]
let batchmenuArr = [
  '30',
  '40',
  '50',
  '60'  
]
let learningmenuArr = [
  '0.1',
  '0.3',
  '0.01',
  '0.03',
  '0.001',
  '0.003'  
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
            id: 'house',
            name: formatMessage({
                id: 'helloWorld.categoryName',
                default: 'house-price',
                description: 'Label for the hello world extension category'
            }),
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'test',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'helloWorld.say',
                        default: 'run [NUM_EPOCHS] [BATCH_SIZE][LEARNING_RATE][model]',
                        description: 'say something'
                    }),
                    arguments: {
                        NUM_EPOCHS: {
                            type: ArgumentType.STRING,
                            menu: 'num_menu',
                            defaultValue: 200
                        },
                        BATCH_SIZE: {
                            type: ArgumentType.STRING,
                            menu: 'batch_menu',
                            defaultValue: 40
                        },
                        LEARNING_RATE: {
                            type: ArgumentType.STRING,
                            menu: 'learning_menu',
                            defaultValue: 0.01
                        },
                        model: {
                          type: ArgumentType.STRING,
                          menu: 'model_menu',
                          defaultValue: "linearRegression"
                      }
                    }
                }
            ],
            menus: {
              model_menu: {
                acceptReporters: true,
                items: '_modelmenuArr'
              },
              num_menu: {
                acceptReporters: true,
                items: '_nummenuArr'
              },
              batch_menu: {
                acceptReporters: true,
                items: '_batchmenuArr'
              },
              learning_menu: {
                acceptReporters: true,
                items: '_learningmenuArr'
              }
            }
        };
    }
_modelmenuArr () {
  return modelmenuArr.map(item => item.toString())
}
_nummenuArr () {
  return nummenuArr.map(item => item.toString())
}
_batchmenuArr () {
  return batchmenuArr.map(item => item.toString())
}
_learningmenuArr () {
  return learningmenuArr.map(item => item.toString())
}
    
    
    test(args, util) {
        
        
        const NUM_EPOCHS = Number.parseInt(args.NUM_EPOCHS);
        const BATCH_SIZE = Number.parseInt(args.BATCH_SIZE);
        const LEARNING_RATE = Number.parseFloat(args.LEARNING_RATE);
        
        

        prerun(NUM_EPOCHS,BATCH_SIZE,LEARNING_RATE,args.model);
      
        
    }
}

module.exports = Scratch3HelloBlocks;