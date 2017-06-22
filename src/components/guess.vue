<template>
  <div>
    <von-header theme="positive" class="xp-header">
      <button class="button button-icon ion-ios-arrow-back" slot="left"></button>
      <span slot="title">x-Plane</span>
      <button class="button button-icon ion-navicon" slot="right"></button>
    </von-header>
    <div class="xp-grid">
      <div class="xp-cellContainer">
        <div v-bind:style="{height: cellSize}" v-for="i in option.grid[0]" class="xp-col">
          <div v-bind:style="{height: cellSize, width: cellSize, lineHeight: cellSize}" v-for="j in option.grid[1]"
               :id="'g-'+i+'-'+j" @click="cellTouched(i, j)">
            <i v-show="isShowMap[i-1][j-1]" v-if="planeMap[i-1][j-1]===0" class="ion-ios-close-empty"></i>
            <i v-show="isShowMap[i-1][j-1]" v-else-if="planeMap[i-1][j-1]===1" class="ion-android-radio-button-off"></i>
            <!--<i v-else="planeMap[i-1][j-1]===2" class="ion-plane"></i>-->
            <i v-show="isShowMap[i-1][j-1]" v-else="planeMap[i-1][j-1]===2" class="ion-android-radio-button-on"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="xp-information">
      <von-input
        type="text"
        v-model="player"
        placeholder="输入名字"
        label="攻击方：">
      </von-input>
      <list class="list-ios">
        <item>
          防守方：&nbsp;&nbsp; {{author}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <i class="ion-plane"></i>: {{option.planeNum}}
        </item>
      </list>
    </div>
  </div>

</template>
<script>
  import PlaneMap from 'PlaneMap';
  let b = new PlaneMap();

  var temp2 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  let getScore = function (step, n) {
    const Highest = 2 * n;
    const Lowest = 10 * n;
    if (step < Highest) {
      return 100;
    }
    if (step > Lowest) {
      return n * n;
    }
    if (step >= Highest && step <= Lowest) {
      let res = n * n + (100 - n * n) * (Lowest - step) / (Lowest - Highest);
      return parseInt(res);
    }
  };

  export default {
    data() {
      let noPFunction = function(dialogTitle) {
        $dialog.confirm({
          theme: 'scale',
          title: dialogTitle,
          okTheme: 'positive',
          // 取消按钮文本
          cancelText: '随便来一局',
          // 确定按钮文本
          okText: '布个阵给朋友'
        }).then(function (res) {
          console.log('confirm result: ', res);
          if (res) {
            $router.forward('/place');
          }
        })
      };
      let pKey = this.$route.query.q;
      let planeStack = PlaneMap.key2plane(pKey);
      if (pKey && planeStack) {
        for (let i = 0; i < planeStack.length; i++) {
          if(!b.pushPlane(planeStack[i])){
            noPFunction('你可能是收到了一个假的飞机阵链接，请选择攻击一个随机飞机阵或给朋友布一个飞机阵。');
          }
        }
      }
      else {
//        $router.forward('/about');
        noPFunction('你可能是收到了一个假的飞机阵链接，请选择攻击一个随机飞机阵或给朋友布一个飞机阵。');
      }

      return {
        option: {
          grid: [10, 10],
          planeNum: planeStack.length,
          name: 'Peter'
        },
        cellSize: '2rem',
        planeMap: b.currentPlaneMap,
        finished: 0,
        step: 0,
        isShowMap: temp2,
        author: '毛一块',
        player: '毛衣毛',
        succeed: false
      }
    },
    methods: {
      cellTouched: function (i, j) {
        if (this.isShowMap[i - 1][j - 1] === 1) {
          return
        }
        this.step++;
        this.isShowMap[i - 1][j - 1] = 1;
        // 这里是为了解决直接用索引更新数组 视图不会变化的问题
        this.$set(this.isShowMap, i - 1, this.isShowMap[i - 1]);
        if (this.planeMap[i - 1][j - 1] == 2) {
          this.finished++;
        }
      },
      win: function () {
        $dialog.confirm({
          // 设置为ios样式
          theme: 'scale',
          // 标题
          title: getScore(this.step, this.option.planeNum) + '分！' + this.player + '用' + this.step + '发子弹把' + this.author + '的' + this.option.planeNum + '级飞机阵歼灭',
          okTheme: 'positive',
          // 取消按钮文本
          cancelText: '复盘',
          // 确定按钮文本
          okText: '重玩'
        }).then(function (res) {
          console.log('confirm result: ', res);
          if (res) {
            window.location.reload();
          }
        })
      },
      winReload: function () {
        window.location.reload();
      }
    },
    watch: {
      finished: function (val) {
        if (val === this.option.planeNum) {
          this.win();
        }
      }
    }
  }
</script>
<style>
  body {
    height: 100%;
    width: 100%;
  }
  .xp-grid {
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .xp-cellContainer {
    display: inline-block;
    width: auto;
    height: auto;
    border-bottom: solid #4d4d4d 1px;
    border-right: solid #4d4d4d 1px;
  }

  .xp-cellContainer div>div {
    font-size: 1rem;
    float: left;
    vertical-align: middle;
    border-top: solid #4d4d4d 1px;
    border-left: solid #4d4d4d 1px;
  }

  .xp-col {
    width: 100%;
  }

  .xp-information {
    position: fixed;
    bottom: 0px;
    width: 100%;
  }

  .lever {
    position: fixed;
    bottom : 150px;
    left: 30px;
  }

  .lever .button {
    position: absolute;
  }

  .arrow-up {
    top: 0;
    left: 40px;
  }

  .arrow-right {
    top: 40px;
    left: 80px;
  }

  .arrow-down {
    top: 80px;
    left: 40px;
  }

  .arrow-left {
    top: 40px;
    left: 0;
  }
</style>
