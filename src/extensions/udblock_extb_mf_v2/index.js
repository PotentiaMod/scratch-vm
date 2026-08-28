const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const carBlocks = require('../../myBlocks/car');
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const { extb_mf } = require('../../util/extb-definitions');

// 方块图标链接
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAD8lJREFUaEPtWQl0FFW6/qqrl3S6O51OOhuEJBBIAiEJLmA0MQQjECCAQAQJu8LAPPWJOorKOCgqZBy28PQhM2wDsgpB2UUW2UEWSWfBAIEshGyd7s7W+/L+WwkQFY+ch+dxfMc6uaeqblWq/u9fvv+71Rx+5xv3O7cffwB40BH8IwJ/ROA+PfBHCt2nA+/73/9fR8BXvlAek5aSllLhqBDhhggFm4t08+Le1o0cN04dHh7utWDBvCatVovJk//kk5+fb/fy8tL26NEjkNzK6fX6Zr2+qrRLl84xUqk0ymy25UskXPi4cc/uX7jwn6qQkBBJVtYow+uvv6F85JFHpMcPHWs6eOyAbZH506czx44O1bl1iHBH2Pe8mbvdfgw36Zn6u4XrrhGQ8RjMi/Ff2mGBwRuW7vc603CSM94wYfHyefYZoZPskyc9z0d07iya/fab7uSkZAwclCE6e+aEx9Rs4UdljuHZiwoLdG6zpcnZM7aH2EvuzTc1Gp1SmTc/fGiGbWnOJ6JOYRHcS/8xzTXymZGipJRU7uyZ0+7N27Z69vgckh2YfUKU2/QFHvMk4vlnBlibrtmrLWZ3lgM4/VMQdwMgigz1zn9+RGS0oYPDmNvBojU5mgATYD9jR0rjo8jJ+RR+/lq8/earGDkqE737PI5j3x4ExDIMHjIMHMeh+IdCVN4oQ1r//hCJRHA5nbDabMh6biw+zs5GaFgE3pr1F6QkJ6Nf2gDodBfx2l9eR3FSGfwTtGj0NCJU7uOeUR5YXl9lC/vXlivXaoyOBAJgbg/iNgCPx8O9//773JIlS3wejpJWZaZHGhQyz5wV1tJ/5Tks4B0iqPRKvBL3IoYMzkBgUBAWfDwPg9IHIzYuARfOnca5C+fQtVtXiHkeRqMeX+buxpixY2C3WQVQNrsDq1atwfp16xEYHIJFCz9Gnz59yAGJuFl5A4tzluCA6ls44ITN48DQAH/bQO+gjHqjY+uSfxeomx3irjU1pusEwEPP8zAgAgAyXmG2Ot+iU63VbJbu3/vFpPgoP8+NmzVNy5Yv11worsTDCTFwOl14vPdTGD9+IurqamCo14NSgebphVYLPvzgXVwryYfbDTgcbrigQEpid0gkUnQM0WDr7jNISUnF1BdeoLeKUK+vha9Gw94PlUpNz81CYIgKvFiKC98XIj2lj+eNN2Ya7Ha7pqikQfRkav+vNBpNswjYLpOJt7UHEEAn39GIaB+e66Vl5LHPcfjQfrhdVsFIH5U3YqPCYSVvMq+KJEp43B6IeBFKy2+gID+f/MAJRoH+FN4S4T6JhKf/8SAhPg5+ZDRzndPhgISzwUGOcdMzDh89jQ4dwyjlePj6BWP0mOfw3JiRIHL4aep/RM/8668CKK+oxIaNW3Hq2DfQyOtRXWNCctoY+PgosZDC77A7yWOd4O2tEIxsi6ZgvJvCIOS+y0nXRODpmMVcJOKEc3bdbDbDZdPD11cN3m3AxSI9nn6yB1xuDgptPNXTcIwcMeR/D6CCAGzcnIsDX38FnopKV3gVKygiqan9MO+juTi4/ys0W8XkUV9IxLwQBZZmLNcZHIXCG3a7FRKpFDzRGgPMwsKLRWhpsaGxsRFKWQuCQ8Kg4Ouw+9BlRHWLgKmhBY8+loZBg4fdP4BNm7eToV/CYirEhYI6rPr3BnTv3gOfr1uDk0f3osXuJXjcwdJBIhGiwLzLNrFYLOzZtVvH7F5WM+yc51ixVMFil6BDkBKXS2oQ27MHjHVl6NV7EJL7pt8bgNraWqXDyS2qrdU/0dTSEmqzWn0o/FxNTS1OnjiBK8V5UPGlOHK6DEnJKQj098H5iwW4UXETAUEhsFrtZLSdAMhac1VIEZdQvJQwVDvNNCURUogx1K1rCjmPR7p7o7yGQ3igGQdO1SIuPh6GmhJ07PIEQkK7IS0tTUg7l8vFUrVOo/Et0Qb6L+gQ5H+niNk7d+48593Q4BQfPLqx+4nDu45qtcFSLy858bmOCpg8yFPoOZdAeQpRHQIC1OAkgbh+rRi7D+oEQmPelUjEeObpKFTWNqODvxfqmzmc/r4cZosFCrkMQ/p1g6HBAj8VD5vbC0ZKF7csAlMmT0FQUCC2rZuLPQeLkPVMLDbsKMHTA4ahqPCiwHgPPZLcb9z0lwr08G+e0q+ztX0R+zmcnn2Un2Ful1tkMNRrPUS116+XYe3aDcjP+w6TJk+kFwQLnL7qn0tg0peijpobL5YIEWBFzOqYFW5YRz/YiEbl1NKpHFBVYySmcQp1wq45nG46psjQNYIBqU8EhmZkEI2Ox/ED6/Hnl97CgIHpiIx+jGTKeEhlrZHV+PoaRTzvogAvlPB89q+yECviTayI932J/3z1VfIwY0gOp/YuRrPFg6PnKvFD8eVWGqUw32GhNtZjUyxv2vV7lvtOBytmQO7tjR4xnRHYMQaZmaMEEAuz34G+9Bs0iRMxMH3ovdUAhf6ufYAByN2+C9/sy8WEiZOIo0NhMBjx30uzIZKqcfNGKa5caQWgJMZxUfFarVYBaGsttO3bQLDTLpFdUV5WRoXsgFzuDX9/f8TERKFXr55obGjCvr27IBHZ8OTTWUhOSbt/ANtyd+Kbr7cjKqQBpmYnCopN1LCqkJoYiaKSJsrNSmtTi0NGqUN6AdecDnesAOAnxrfhsXh5SXRWm+NRETUDtY/CGRyklXSNjAB1WAoWKd6iy8jLK8C4CdPQt9+AewagJeedIQ92afOZsLt69VpbDZyF2H4ZZy7eJE6Xw00WWszNUPuo8FisLG//iap4pUr+A1X6nNqqhi3tn9E+EhKeK4mM7pBZeq3miNpbLI8I09Z06RIderP6JjpFdEdjiwdiZzUaDdchD0jF40l9MW3qxNuNrF1gP6TO/u7tIG/Z4uF79aqMa2ho8r1ccilgxWdL12v8tBLW0s+fPU1NiMPo0aPw2PipxNtuhJKsmDZ1EmprqmEy1lPqsObEu3kR12i3OX1vvehnQACXr8bHQO/RUtpxrNGlJPVCQ4MJUTE9KcJEv+Zy6gcV6Pd4BHYfqULG0EzSV8XU9IwkLSZPeuKJlFJfX9XVsLAAtkZoDXR1tUdhteqX0JMfamluDmlsNIXwIp6rqq7CsWNHYdRXIya6A4x/XYyq03nIiQ7AhKxMlF4roRRqBaBQKoRasFjMd2qg7Q1CLbcRQExMDEpKSqhD24nXvaEmGWEyGDCwf6JQA1K5CvsPHMXQYaOh8e+AIRnDBCZgksRX41+m9vG5oVH7LY6IaNcHWBHT838m5srLK7Bx4zYcPrATfeIU6DT57xAT9yXwDkzMGiMY63DYBQC3vMGMbe3Dd8qApVwrAqJN1uToUCrlGzV+vuXdo0N7VlTUUXGHQ19TSV2ZWO709xgxajzSB2Xg2czhP9NCRIT3Lua2bdtBRUxSwpiP0xeq8NnylQjuEIKsMZnoFhUleKa8vFzouDKvVr4WlCidGw31Au12i4pGUxN5l3Vm0sKsV5COFXRSeERn1FCk5SQIW1paCJgU+Todxk2chqfSBt5zEf8ijQp9gAAcPXpI4PSFi3LgQ2F/9ZWX8dRTaZQGrFsXw0lAYmN7UqOzkajjBVG3e9cOQfOMoVVYVVUVAgMDCXCrSmXAWlqasHv3LmGO6kfQSAw4kw2ZoydiEK3u7lmNktPaUugOB5aVlWP1mvU4efxbnDl1CCP6hUFXYkZcpC9O6aqRlBAodGK9oRF5V5vwcDcFpYcItSYbTI12hAV7CxG5XNGCQI0USm+mjdworTIjPFguSGwnGd/Q4oZWLSylUWu049L1egxIH4URI0fRemAEZLIfrwfulkKKhibrbOJmbYvZLNu7c/u4hBgNr6+rxgd/X478wmIQBWLPvEh8stuCGene+HBTI94Zo8bm4w6MSJQiO9eO2ZkSGOwamEwmlNXY0ClQDqXUilNXpegZ0kzL0BCouDp8XeCF9FgjCmqD0UNbjUJjF8QHG5jvcfiSDNlrvicprsKTyUn48N2XYLaLUFLeSOr0qb1qtS+JJ/cXKpVMoOu7Lep9e8eqq1/OijHzHLfnbFH9uM+2XCHvybHno844f51DQic7PthiwzujVVj8pRkvD1Nifq4Trw4hqewW42QxsZLUBY6XIEBhwZU6JboHmhAeJIHIY8cOnR8yYmuwtygYGT2rUaCPEDQSsSzO6crw8edFQs2/MfVhZ7iWW9FgdU9evKZQVllnZ32qtD093w2A+OEYn+qZE2KULg9/6VxBba+VuSUkvsR4f/pDkIvt9HARVu+rxp+HdySxRvKBRNnmIyYMf1yNS+UWBPl5o7m5GX17kuanos09A/SKcCHYX4muj45AXL8XYajU4cDq6RRZN4qqFXhn8deCHJ8/61lUWTti1luzERkZSVK8xXV45yfc1Bf/ZicAYWR83a8BAKXq3IQYv5fVKoniu/x6ksJUXIxm2m9tvC7Mtokfji0b6esGpaIQWxlb4BDtMH3EZLaI4xHTvQd38sx5EVvkhIcGuRkVx/d6iDty9BR382Yl+qYkeb47+z1noN5QWJBHq7IMYV3x/JSJm1evWfcneltzO6b+5V9oqGzCaA0S1MrezEhSvj+m97umIN3P7rsF9jZoIhhaUUBNo0utXv83EnGq116buTJncc75NWvXjpgwYUL/vXv3FmYMHrxzwIABPmfPnnUZjUblvv37U/v379/55MmTa5KSkmazOqfRKmd/oQZ+5Ojf8ISBoc8RiDty5MhHKSkpSbTfkZqauvzq1avZlC5xc+bMWTZ37twddI+BhpJGeF5e3qz4+PjoTZs2LRs7duw/aO4GDUra/3sA7I0KGt3I0EnvvffeTGqA16Ojoz9qaGj4hPoCHxoa+gItb8/TPew7qM+sWbOGzZ8//x82m83eu3fvaQUFBcdonmmgBwaArfpD6YNwYmVl5RqetunTp69asWLFtKKiooLY2NjX6HoBDTPNJyxYsGCrUqkMyMnJWTtz5szVNF/YFh3Xg4oAcRK0NBJ0Ot2iuLi4nufPn79OX6c7r1y5ct3UqVM/pWtlM2bMCMvOzt6sVqsjduzYcWz48OGraP4ijWs07q2If8Pc/+mjVDQRs2zZslfI0HHsItNOycnJL1KhHp8yZYp86dKlzPOh9HnGU1xcXOHn5+eWyWRGWvSk0+3GB5lCzF6m+MISExPTyOBlTBNRLVTS7w3TmIdXrVrVl0As/ylq0kkW+u4UR/OVNIQvEmx7EL/QMJplbbcbje401DSqaFyiwYqXpRibD6fBRJCtzeultL/aBsDyIAEwpzHDGAimgtkx/QAhdFjmWZZi7FceBox92mPLCwaCPuIIPYDtHxgL3XIcK2ZmnJQGO2aNiRnFpDCLEJtv3xDZPLt+a9xetT6IFLoF4jfZ/+4B/A+jFwSah6u+dAAAAABJRU5ErkJggg=='

class UDblockEXTBMFV2 {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [
            {
                type: "custom_seperator",
                text: '★ 触摸按键',
            },
            {
                opcode: 'readTouchValue',
                blockType: BlockType.REPORTER,
                text: '读取触摸按键[BTN]数值',
                arguments: {
                    BTN: {
                        type: ArgumentType.STRING,
                        menu: "touchMenu"
                    }
                }
            },
            {
                opcode: 'readTouchPressed',
                blockType: BlockType.BOOLEAN,
                text: '检测触摸按键[BTN]按下',
                arguments: {
                    BTN: {
                        type: ArgumentType.STRING,
                        menu: "touchMenu"
                    }
                }
            },
        ].concat(
            sensorBlocks,
            actionBlocks(),
            cameraBlocks,
        )
    }

    getInfo() {
        return {
            id: "udblockEXTBMFV2",
            name: "多功能拓展板V2",
            blockIconURI: blockIconURI,
            blocks: this.customBlocks,
            menus: {
                ...GenerateRJMenuAll('extb_mf'),
                touchMenu: {
                    acceptReporters: true,
                    items: EXTB_LIST.extb_mf.touch
                },
                servoMenu: {
                    acceptReporters: true,
                    items: [
                        {text:"一", value:EXTB_LIST.extb_mf.servo_v2[0].value},
                        {text:"二", value:EXTB_LIST.extb_mf.servo_v2[1].value},
                        {text:"三", value:EXTB_LIST.extb_mf.servo_v2[2].value},
                        {text:"四", value:EXTB_LIST.extb_mf.servo_v2[3].value},
                    ]
                },
                motorMenu: {
                    acceptReporters: true,
                    items: [
                        {text:"一", value:EXTB_LIST.extb_mf.motor_v2[0].value.join(",")},
                        {text:"二", value:EXTB_LIST.extb_mf.motor_v2[1].value.join(",")},
                    ]
                },
                ...miscMenuBlocks
            }
        }
    }

    readTouchValue(){

    }
}

module.exports = UDblockEXTBMFV2;