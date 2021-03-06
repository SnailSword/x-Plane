/**
 * Created by Saniac on 2017/5/24.
 * 飞机阵类
 */
let PlaneMap = function () {
  this.currentPlaneMap = [
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0]
    ];
  this.planeShape = [
      [0, 0, 2, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0]
    ];
  this.lastStep = [];
  this.currentPlaneStack = [];
  this.pushPlane = function (planeArray) {
    // Deep Clone plane map, backup for roll back when push half plane
    let tempPlaneMap = [];
    for (let i = 0; i < 10; i++) {
      tempPlaneMap[i] = [];
      for (let j = 0; j < 10; j++) {
        tempPlaneMap[i][j] = this.currentPlaneMap[i][j];
      }
    }
    if (addOnePlane(planeArray)) {
      this.currentPlaneStack.push(planeArray);
      this.lastStep.push(tempPlaneMap);
      return true;
    }
    else {
      this.currentPlaneMap = tempPlaneMap;
      return false;
    }
  };
  this.popPlane = function () {
    if (this.currentPlaneStack.length === 0) {
      return false;
    }
    this.currentPlaneStack.pop();
    this.currentPlaneMap = this.lastStep.pop();
    return true;
  };
  let me = this;
  this.planeWidth = this.planeShape[0].length;
  this.planeHeight = this.planeShape.length;

  // todo 得到飞机头坐标的函数
  this.planeHead = [0, 2];
  // 飞机加入飞机阵
  // plane Array[a, b, c]
  // a,b为横纵坐标 c为飞机头方向
  // c=0 向上 c=1 向右 c=2 向下 c=3 向左
  // todo 把循环中的飞机长宽用变量代替
  let addOnePlane = function (plane) {
    // thePlane为旋转后的飞机矩阵
    let resultMap = me.currentPlaneMap;
    // resultMap.map(() => new Array(10));
    let thePlane = me.planeShape;
    let x = plane[0];
    let y = plane[1];
    switch (plane[2]) {
      case 0:
        for (let i = x, ci = 0; i < x + 4; i++) {
          if (i < 0 || i > 9) {
            console.log('plane placed error');
            return false;
          }
          let cj = 0;
          for (let j = y - 2; j < y + 3;j++) {
            if (j < 0 || j > 9 || thePlane[ci][cj] * resultMap[i][j]) {
              console.log('plane placed error');
              return false;
            }
            resultMap[i][j] += thePlane[ci][cj];
            cj++;
          }
          ci++;
        }
            break;
      case 1:
        for (let i = x - 2, ci = 0; i < x + 3; i++) {
          if (i < 0 || i > 9) {
            console.log('plane placed error');
            return false;
          }
          let cj = 0;
          for (let j = y;j > y - 4;j--) {
            if (j < 0 || j > 9 || resultMap[i][j] * thePlane[cj][ci]) {
              console.log('plane placed error');
              return false;
            }
            resultMap[i][j] += thePlane[cj][ci];
            cj++;
          }
          ci++;
        }
            break;
      case 2:
        for (let i = x, ci = 0; i > x - 4; i--) {
          if (i < 0 || i > 9) {
            console.log('plane placed error');
            return false;
          }
          let cj = 0;
          for (let j = y - 2; j < y + 3;j++) {
            if (j < 0 || j > 9 || resultMap[i][j] * thePlane[ci][cj]) {
              console.log('plane placed error');
              return false;
            }
            resultMap[i][j] += thePlane[ci][cj];
            cj++;
          }
          ci++;
        }
            break;
      case 3:
        for (let i = x - 2, ci = 0; i < x + 3; i++) {
          if (i < 0 || i > 9) {
            console.log('plane placed error');
            return false;
          }
          let cj = 0;
          for (let j = y;j < y + 4;j++) {
            if (j < 0 || j > 9 || thePlane[cj][ci] * resultMap[i][j]) {
              console.log('plane placed error');
              return false;
            }
            resultMap[i][j] += thePlane[cj][ci];
            cj++;
          }
          ci++;
        }
            break;
    }
    return true;
  }
  this.printCurrentMap = function () {
    // console.log(this.currentPlaneMap);
  }
};

// 编码解码函数
PlaneMap.plane2key = function (planeStack) {
  let planeAmount = planeStack.length;
  if (planeAmount === 0) {
    return false;
  }
  let key = '';
  for (let i = 0; i < planeAmount; i++) {
    for (let  j = 0; j < 3; j++) {
      key += planeStack[i][j];
    }
  }
  return btoa(key).split('').reverse().join('');
};
PlaneMap.key2plane = function (key) {
  if (!key) {
    return false;
  }
  let key1 = key.split('').reverse().join('');
  try {key1 = atob(key1).split('').map((x) => parseInt(x))}
  catch (err) {
    return false;
  }
  let res = [];
  while (key1.length) {
    res.push(key1.splice(0, 3));
  }
  return res.length ? res : false;
};

export default PlaneMap;
