<template>
  <div>
    <von-header theme="calm" class="xp-header">
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
          <i class="ion-plane"></i>: 2
        </item>
      </list>
    </div>
  </div>

</template>
<script>
  var defaultOption = {
    grid: [10, 10],
    planeShape: [
      [0, 0, 2, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0]
    ],
    planeNum: 3,
    name: 'Peter'
  };

  var temp = [
    [
      [0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 2, 0],
      [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 2, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 2, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 2, 0],
      [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 2, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  ];

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


  export default {
    data() {
      return {
        option: defaultOption,
        cellSize: '2rem',
        planeMap: temp[Math.floor(Math.random() * 5)],
        planeStack: [[0, 2, 0], [9, 7, 1]],
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
          title: '哈哈哈哈哈哈哈哈！' + this.player + '用' + this.step + '发子弹把' + this.author + '的' + this.planeStack.length + '级飞机阵歼灭',
          okTheme: 'calm',
          // 取消按钮文本
          cancelText: '复盘',
          // 确定按钮文本
          okText: '重玩'
        }).then(function (res) {
          console.log('confirm result: ', res)
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
        if (val === this.planeStack.length) {
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
