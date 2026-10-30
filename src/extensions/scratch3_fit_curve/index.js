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
//const speechCommands = require('@tensorflow-models/speech-commands');
const deeplab = require('@tensorflow-models/deeplab');
//const qna = require('@tensorflow-models/qna');
//////////////////
//import {generateData} from './data';
//import {plotData, plotDataAndPredictions, renderCoefficients} from './ui';
const data =require('./data');
const ui = require('./ui');

var test = 111;
/**
 * We want to learn the coefficients that give correct solutions to the
 * following cubic equation:
 *      y = a * x^3 + b * x^2 + c * x + d
 * In other words we want to learn values for:
 *      a
 *      b
 *      c
 *      d
 * Such that this function produces 'desired outputs' for y when provided
 * with x. We will provide some examples of 'xs' and 'ys' to allow this model
 * to learn what we mean by desired outputs and then use it to produce new
 * values of y that fit the curve implied by our example.
 */

// Step 1. Set up variables, these are the things we want the model
// to learn in order to do prediction accurately. We will initialize
// them with random values.
const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));
const d = tf.variable(tf.scalar(Math.random()));


// Step 2. Create an optimizer, we will use this later. You can play
// with some of these values to see how the model performs.
const numIterations = 75;
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

// Step 3. Write our training process functions.

/*
 * This function represents our 'model'. Given an input 'x' it will try and
 * predict the appropriate output 'y'.
 *
 * It is also sometimes referred to as the 'forward' step of our training
 * process. Though we will use the same function for predictions later.
 *
 * @return number predicted y value
 */
function predict(x) {
  // y = a * x ^ 3 + b * x ^ 2 + c * x + d
  return tf.tidy(() => {
    return a.mul(x.pow(tf.scalar(3, 'int32')))
      .add(b.mul(x.square()))
      .add(c.mul(x))
      .add(d);
  });
}

/*
 * This will tell us how good the 'prediction' is given what we actually
 * expected.
 *
 * prediction is a tensor with our predicted y values.
 * labels is a tensor with the y values the model should have predicted.
 */
function loss(prediction, labels) {
  // Having a good error function is key for training a machine learning model
  const error = prediction.sub(labels).square().mean();
  return error;
}

/*
 * This will iteratively train our model.
 *
 * xs - training data x values
 * ys — training data y values
 */
 async function train(xs, ys, numIterations) {
    
  for (let iter = 0; iter < numIterations; iter++) {
    // optimizer.minimize is where the training happens.

    // The function it takes must return a numerical estimate (i.e. loss)
    // of how well we are doing using the current state of
    // the variables we created at the start.

    // This optimizer does the 'backward' step of our training process
    // updating variables defined previously in order to minimize the
    // loss.
    optimizer.minimize(() => {
      // Feed the examples into the model
      const pred = predict(xs);
      return loss(pred, ys);
      test = 222;
    });

    // Use tf.nextFrame to not block the browser.
    await tf.nextFrame();
  }
}

async function learnCoefficients() {
  const trueCoefficients = {a: -.8, b: -.2, c: .9, d: .5};
  const trainingData = data.generateData(100, trueCoefficients);

  // Plot original data
  ui.renderCoefficients('#data .coeff', trueCoefficients);
  await ui.plotData('#data .plot', trainingData.xs, trainingData.ys)

  // See what the predictions look like with random coefficients
  ui.renderCoefficients('#random .coeff', {
    a: a.dataSync()[0],
    b: b.dataSync()[0],
    c: c.dataSync()[0],
    d: d.dataSync()[0],
  });
  const predictionsBefore = predict(trainingData.xs);
  await ui.plotDataAndPredictions(
      '#random .plot', trainingData.xs, trainingData.ys, predictionsBefore);

  // Train the model!
  await train(trainingData.xs, trainingData.ys, numIterations);

  // See what the final results predictions are after training.
  ui.renderCoefficients('#trained .coeff', {
    a: a.dataSync()[0],
    b: b.dataSync()[0],
    c: c.dataSync()[0],
    d: d.dataSync()[0],
  });
  const predictionsAfter = predict(trainingData.xs);
  await plotDataAndPredictions(
      '#trained .plot', trainingData.xs, trainingData.ys, predictionsAfter);

  predictionsBefore.dispose();
  predictionsAfter.dispose();
}



/////////////////




let LrArr = [
    '0.00001',
    '0.0001',
    '0.001',
    '0.003',
    '0.01',
    '0.03',
    '0.1',
    '0.3',
    '1',
    '3',
    '10'
]
let ActArr = [
    'ReLU',
    'Tanh',
    'Sigmoid',
    'Linear' 
]
let RegArr = [
    'None',
    'L1',
    'L2'
]
let RrArr = [
    '0',
    '0.001',
    '0.003',
    '0.01',
    '0.03',
    '0.1',
    '0.3',
    '1',
    '3',
    '10'
]
let ProArr = [
    'Classification',
    'Regression'   
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
            id: 'fitcurve',
            name: 'fit_curve',
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'Neural_Network',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'Neural Network',
                        default: 'Neural Network [Learning_rate] [Activation] [Regularization] [Regularization_rate] [Problem_type]',
                        description: 'Neural Network'
                    }),
                    arguments: {
                        Learning_rate: {
                            type: ArgumentType.STRING,
                            menu: 'Lr_menu',
                            defaultValue: "0.03"
                        },
                        Activation: {
                            type: ArgumentType.STRING,
                            menu: 'Act_menu',
                            defaultValue: "Tanh"
                        },
                        Regularization: {
                            type: ArgumentType.STRING,
                            menu: 'Reg_menu',
                            defaultValue: "None"
                        },
                        Regularization_rate: {
                            type: ArgumentType.STRING,
                            menu: 'Rr_menu',
                            defaultValue: "0"
                        },
                        Problem_type: {
                            type: ArgumentType.STRING,
                            menu: 'Pro_menu',
                            defaultValue: "Classification"
                        }
                    }
                }
            ],
            menus: {
                Lr_menu: {
                    acceptReporters: true,
                    items: '_LrArr'
                },
                Act_menu: {
                    acceptReporters: true,
                    items: '_ActArr'
                },
                Reg_menu: {
                    acceptReporters: true,
                    items: '_RegArr'
                },
                Rr_menu: {
                    acceptReporters: true,
                    items: '_RrArr'
                },
                Pro_menu: {
                    acceptReporters: true,
                    items: '_ProArr'
                }
            }
        };
    }

    _LrArr () {
        return LrArr.map(item => item.toString())
    }
    _ActArr () {
        return ActArr.map(item => item.toString())
    }
    _RegArr () {
        return RegArr.map(item => item.toString())
    }
    _RrArr () {
        return RrArr.map(item => item.toString())
    }
    _ProArr () {
        return ProArr.map(item => item.toString())
    }

    Neural_Network(args, util) {
        
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

    learnCoefficients();
    const trueCoefficients = {a: -.8, b: -.2, c: .9, d: .5};
    const trainingData = data.generateData(100, trueCoefficients);
    train(trainingData.xs, trainingData.ys, numIterations);
    console.log(test);
  
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(d);
   
}

}

module.exports = Scratch3HelloBlocks;