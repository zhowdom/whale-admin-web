<template>
  <div class="previewBox" style="padding-top:39px;">
    
    <div class="mgc clearfix">
      <div class="left fl">
        <div class="pdImg mgc"><img :src="renderStoreData.primaryImage"></div>
        <p style="text-align:center;">{{renderStoreData.name}}</p>

        <ul class="pdPricebox">
          <li class="mgc"><span>划线价格</span><span>销售价格</span></li>
          <li class="mgc" style="border-bottom: 1px solid #ccc;color:#767474;"><span>USDT{{renderStoreData.previewMarketPrice}}</span><span>USDT{{renderStoreData.previewPrice}}</span></li>
        </ul>

        <div class="mgc" style="width:427px;font-size:13px;color:#767474;padding:20px 0;">
          <p>保障：<span style="border:1px solid #ccc;border-radius:3px;padding:4px;font-size:12px;margin-right:10px;display:inline-block;margin-bottom:10px;" v-for="(item, index) in renderStoreData.services" :key="index">{{item}}</span></p>
          <p>运费：<span v-if="renderStoreData.freight" style="border:1px solid #ccc;border-radius:3px;padding:4px;font-size:12px;margin-right:10px;">{{renderStoreData.freight}}</span></p>
        </div>

        <div class="previSkubox mgc">
          <h3 class="title">SKU</h3>
          <div class="bigEach" v-for="(item, index) in keyArr" :key="index">
              <ul class="clearfix">
                <p style="text-align:left;">{{item}}</p>
                <li class="fl" v-for="(val, key) in valueMap[`${item}`]" :key="key">{{val}}</li>
              </ul>
          </div>
          
        </div>
        
        <h3 style="text-align: center;font-weight: 400;">商品详情</h3>
        <div style="width:700px;font-size:13px;color:#767474;margin-left:129px">
          <ul>
            <li v-for="(item, index) in renderStoreData.argsKeys" :key="index">
              <span style="font-weight:500">{{item}}:</span>
              <p>{{renderStoreData.args[item]}}</p>
            </li>
          </ul>
        </div>
        <iframe class="mgc" :src="renderStoreData.description" style="width:700px;height:1000px;border:none;margin-left:100px;"></iframe>

      </div>
      <div class="right fl">
        <p style="text-align: center;font-weight: 400;border-bottom:1px solid #ccc;padding-bottom:11px;">商品图片</p>
        <ul class="lbtu li">
          <li style="padding-bottom:10px;" class="mgc" v-for="(item, index) in renderStoreData.images" :key="index"><img :src="item"></li>
        </ul>
      </div>
      
    </div>

    <el-button style="margin:20px 0 30px 389px;" type="primary" @click="goBack">返回</el-button>


      
  </div>
</template>

<script>
  export default {
    components: {},
    data () {
      return {
        renderStoreData: {},
        keyArr: [],
        valueMap: {}
      }
    },
    filters: {},
    watch: {},
    computed: {},
    mounted () {
      // this.query()
      this.renderStoreData = {
        name: this.$store.getters.previewRow.name,
        primaryImage: this.$store.getters.previewRow.primaryImage,
        previewMarketPrice: this.$store.getters.previewRow.previewMarketPrice,
        previewPrice: this.$store.getters.previewRow.previewPrice,
        images: this.$store.getters.previewRow.images,
        description: this.$store.getters.previewRow.description,
        items: this.$store.getters.previewRow.items,
        freight: this.$store.getters.previewRow.freight, // 运费
        args: this.$store.getters.previewRow.args, // 参数
        argsKeys: Object.keys(this.$store.getters.previewRow.args || {}), // 参数Keys
        services: this.$store.getters.previewRow.services // 保障
      }
      if (this.renderStoreData.items.length > 0) {
        this.keyArr = this.renderStoreData.items[0].props.map(val => {
          let {name, ...a} = val
          return name
        })
        this.keyArr.forEach(item => {
          this.valueMap[item] = []
        })
        this.renderStoreData.items.map((v, k) => {
          v.props.forEach(vs => {
            this.valueMap[vs['name']].push(vs.value)
            this.valueMap[vs['name']] = [...new Set(this.valueMap[vs['name']])]
          })
        })
      }
    },
    methods: {
      addChild () {
         // let oDiv = document.createElement('div')
        // oDiv.className = 'row_zd'
        // oDiv.innerHTML = 'hello'
        // _oifream.appendChild(oDiv)
      },
      goBack () {
        this.$router.push({ path: "/goods/goodslist"})
      }
    }
  }
</script>

<style lang="scss" scoped>
.previewBox{
  img{
    border-radius: 3px;
  }
  .mgc{
    margin: 0 auto;
  }
  .pdImg {
    width:500px;
    height: 400px;
    padding-top: 20px;
    & img{
      width:100%;
      height: 100%;
    }
  }
  .pdPricebox {
    li{
      width:202px;
      border-top: 1px solid #ccc;
      border-left: 1px solid #ccc;
      box-sizing: border-box;
      span{
        width:100px;
        padding: 8px;
        border-right: 1px solid #ccc;
        display: inline-block;
        text-align: center;
      }
    }
  }
  .previSkubox{
    width:600px;
    border-top:1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 20px 0;
    margin: 20px auto;
    .title{
      text-align: center;
      font-weight: 400;
    }
    ul{
      display: inline-block;
      p{
        font-size: 14px;
      }
      li {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius:5px;
        margin-right: 10px;
        color: #767474;
        font-size: 13px;
      }
    }
  }
}
</style>
<style>
.previewBox ul, .previewBox li{margin: 0;padding: 0;list-style: none;}
.previewBox .right{
  width:200px;
  border: 1px solid #ccc;
  border-radius:3px;
}
.right .lbtu li{
  width:190px;
  height: 190px;
}
.right .lbtu li img{
  width:100%;
  height:100%;
}
.previewBox .left{
  border: 1px solid #ccc;
  border-radius:3px;
  /* width:calc(100% - 230px); */
  width:900px;
  margin-right: 20px;
}
</style>

