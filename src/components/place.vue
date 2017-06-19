<template>
  <div>
    <von-header theme="calm" class="xp-header">
      <button class="button button-icon ion-ios-arrow-back" slot="left"></button>
      <span slot="title">x-Plane</span>
      <button class="button button-icon ion-navicon" slot="right"></button>
    </von-header>
    <div class="xp-grid">
      <div class="xp-cellContainer">
        <div v-bind:style="{height: cellSize}" v-for="i in 10" class="xp-col">
          <div v-bind:style="{height: cellSize, width: cellSize, lineHeight: cellSize}" v-for="j in 10"
               :id="'g-'+i+'-'+j" @click="placeCellTouched(i - 1, j - 1)">
            <i v-if="planeMap[i-1][j-1]===1" class="ion-android-radio-button-off"></i>
            <!--<i v-else="planeMap[i-1][j-1]===2" class="ion-plane"></i>-->
            <i v-else-if="planeMap[i-1][j-1]===2" class="ion-android-radio-button-on"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="lever">
      <md-button class="arrow-up button button-light button-fab" @click.native="confirmPlane(0)">
      <i class="icon ion-arrow-up-b"></i>
      </md-button>
      <md-button class="arrow-left button button-light button-fab" @click.native="confirmPlane(3)">
      <i class="icon ion-arrow-left-b"></i>
      </md-button>
      <md-button class="arrow-down button button-light button-fab" @click.native="confirmPlane(2)">
      <i class="icon ion-arrow-down-b"></i>
      </md-button>
      <md-button class="arrow-right button button-light button-fab" @click.native="confirmPlane(1)">
      <i class="icon ion-arrow-right-b"></i>
      </md-button>

      <!--<md-button class="button button-positive" @click.native="">-->
        <!--Click Me-->
      <!--</md-button>-->
      <!--<md-button class="button button-positive" @click.native="">-->
        <!--Click Me-->
      <!--</md-button>-->
    </div>
  </div>
</template>
<script>
  import PlaneMap from 'PlaneMap';
  let a = new PlaneMap();
//  a.pushPlane([0,4,0]);

  export default {
    data() {
      return {
        cellSize: '2rem',
        planeMap: a.currentPlaneMap,
        planeStack: a.planeStack,
        author: '毛一块',
        player: '毛衣毛',
        succeed: false,
        currentCell: {},
        model: true
      }
    },
    methods: {
      back() {
        $router.back('/')
      },
      placeCellTouched(i, j) {
        // 这里发现了一个问题
        // 虽然this.currentCell先发生了变化，但是watch中函数的内容会在整个placeCellTouched函数执行之后进行
        if (this.planeMap[i][j] === 0) {
        this.currentCell = {
            x: i,
            y: j
          };
//          console.log('语句执行了');
          this.planeMap[i][j] = 2;
          this.$set(this.planeMap, i ,this.planeMap[i]);
//          这里发现了一个奇怪的bug
//          console.log('i,j ' + i, j);
//          console.log(this.planeMap[i][j]);
//          console.log(this.planeMap[3]);

        }
      },
      confirmPlane(n) {
        let x = this.currentCell.x;
        let y = this.currentCell.y;
        console.log(x, y, n);
//        a.pushPlane([x, y, n]);
//        a.printCurrentMap();
//        a.pushPlane(x, y, n);
//        let me = this;
        this.planeMap[x][y] = 0;
        this.$set(this.planeMap, 1, this.planeMap[1]);
        if(a.pushPlane([x, y, n])) {
//          this.currentCell = {}
          this.$set(this.planeMap, 1 ,a.currentPlaneMap[1]);
          this.model = false;
        }
        else {
          for (let i = 0; i < 10; i++) {
            this.$set(this.planeMap, i ,a.currentPlaneMap[i]);
          }
//          console.log(this.planeMap)
          $toast.show('这里不可以放飞机', 1000);
          this.currentCell = {}
        }
      }
    },
    watch: {
      currentCell: {
        handler: function (val, oldVal) {
          if (oldVal.x) {
            if (this.model) {
              a.currentPlaneMap[oldVal.x][oldVal.y] = 0;
            }
            this.model = true;
//            a.currentPlaneMap[val.x][val.y] = 2;
          }
        },
        deep: true
      }
    }
  }
</script>
