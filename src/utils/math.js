import {add, subtract, multiply, divide} from 'mathjs'

export default {
  add: (x, y, z = 2) => Number(add(x, y).toFixed(z)),
  subtract: (x, y, z = 2) => Number(subtract(x, y).toFixed(z)),
  multiply: (x, y, z = 2) => Number(multiply(x, y).toFixed(z)),
  divide: (x, y, z = 2) => Number(divide(x, y).toFixed(z)),
}
