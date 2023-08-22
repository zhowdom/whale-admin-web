<template>
  <div class="blindBox">
    <!--列表s-->
    <el-form :inline="true">
      
      <!-- <el-form-item label="盲盒编号">
        <el-input
          v-model.trim="queryParams.code"
          placeholder=""
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item> -->
      <el-form-item label="盲盒系列">
        <el-input
          v-model.trim="queryParams.name"
          placeholder=""
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <!-- <el-form-item label="盲盒描述">
        <el-input
          v-model.trim="queryParams.describe"
          placeholder=""
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item> -->
    
      <el-form-item>
        <el-button v-hasPermi="['blindBox:product_template:page']" type="primary" :loading="loading" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['blindBox:product_template:save']" class="fr" :loading="loading" type="warning" icon="el-icon-plus" @click="addOrEditClick('add')">新增盲盒系列</el-button>
      </el-form-item>
    </el-form>

     <el-table
      :data="tableData"
      style="width: 100%"
      border>
      <el-table-column
        prop="id"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="盲盒系列">
      </el-table-column>
      <el-table-column
      prop="primaryImage"
      label="商品主图"
      align="center">
      <template scope="scope">
        <div>
         <img :src="scope.row.primaryImage" style="height:80px;width:80px;border-radius:10px;">
        </div>
      </template>
    </el-table-column>
      <el-table-column
        prop="describe"
        label="盲盒描述">
      </el-table-column>
     
      <el-table-column
        prop="initTotalNum"
        label="初始总份数">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="每份最小单位（USDT）">
      </el-table-column>
      <el-table-column
        prop="integral"
        label="每份最小单位(Candy)">
        <template scope="scope">
          <p>{{scope.row.integral || 0}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="singleCost"
        label="每份预估成本（USDT）">
      </el-table-column>
      <!-- <el-table-column
        prop="jfdk"
        label="Candy抵扣">
      </el-table-column> -->
      <el-table-column
        prop="itemsLen"
        label="盲盒实物">
        <template scope="scope">
          <el-button type="text" @click="seeLogClick(scope.row)">{{scope.row.itemsLen}}</el-button>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="referencesNum"
        label="被引用次数">
        <template scope="scope">
          <el-button v-hasPermi="['blindBox:product_template:reference']" type="text" @click="seeRefsClick(scope.row)">{{scope.row.referencesNum || 0}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
        <template slot-scope="{row}">
          <p>{{row.createTime ? $dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template scope="scope">
          <el-button type="text" @click="addOrEditClick('see', scope.row)">查看</el-button>
          <el-button v-hasPermi="['blindBox:product_template:update']" type="text" @click="addOrEditClick('edit', scope.row)">编辑</el-button>
          <el-button v-hasPermi="['blindBox:product_template:delete']" type="text" @click="delClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
  style="float:right;padding-top:20px;"
  @current-change="search"
  :page-sizes="[10, 20, 30]"
  @size-change="handleSizeChange"
  :current-page.sync="pageIndex"
  :page-size="pageSize"
  layout="total, sizes, prev, pager, next, jumper"
  :total="totalPage">
  </el-pagination>

    <!--列表d-->



    


    <!--新增｜编辑｜查看弹窗-->
    <el-dialog title="" :visible.sync="bbRulesOuterVisible" width="88%">

      <!--弹窗主要内容s-->
      <el-form :model="bbruleForm" v-loading="bbRulesOuterLoading" :rules="blindBoxrules" ref="bbruleFormRef" label-width="200px" label-position="right" class="demo-ruleForm">

      <div class="clearfix">
        <span class="fl bbTitle">盲盒描述</span>
        <!-- <el-button class="fr" type="warning" size="mini">引用盲盒系列</el-button> -->
      </div>

      <el-form-item label="盲盒系列:" prop="name" style="width:599px;">
        <el-input :disabled="addOrEditOrSeeStatus === 'see'" v-model.trim="bbruleForm.name" autocomplete="off" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="盲盒描述:" prop="describe" style="width:599px;">
        <el-input type="textarea" :rows="2" show-word-limit :disabled="addOrEditOrSeeStatus === 'see'" v-model.trim="bbruleForm.describe" autocomplete="off" :maxlength="60"></el-input>
        <span style="color:#C0C4CC;font-size:12px;">（请不要输入特殊字符）</span>
      </el-form-item>
      <el-form-item label="起初总份数:" prop="initTotalNum" style="width:300px;">
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.initTotalNum" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="每份最小单位:" prop="payWay">
        <template slot="label">
          <span>
            <span style="padding-right:3px">每份最小单位</span>
            <el-tooltip placement="top">
              <div slot="content">
                使用的Candy，均受“转赠规则”“须保持”规则的影响
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
        <div class="clearfix">
          <div class="fl bbradioBox rela">
            <el-radio-group :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.payWay">
              <el-radio :label="2">现金+Candy</el-radio>
              <el-radio :label="1">现金</el-radio>
              <el-radio :label="3">Candy</el-radio>
            </el-radio-group>
          </div>
          <div class="abso bbradioBoxAbs1"><el-input-number :disabled="addOrEditOrSeeStatus === 'see'" size="medium" v-model="bbruleForm.bbunit2.amount" :precision="2" :step="1" :min="0.01" controls-position="right"></el-input-number><i class="bbunit">USDT</i><span style="padding:0 10px;">+</span><el-input-number :disabled="addOrEditOrSeeStatus === 'see'" size="medium" v-model="bbruleForm.bbunit2.integral" :precision="2" :step="1" :min="0.01" controls-position="right"></el-input-number><i class="bbunit">Candy</i></div>
          <div class="abso bbradioBoxAbs2"><el-input-number :disabled="addOrEditOrSeeStatus === 'see'" size="medium" v-model="bbruleForm.bbunit1.amount" :precision="2" :step="1" :min="0.01" controls-position="right"></el-input-number><i class="bbunit">USDT</i></div>
          <div class="abso bbradioBoxAbs2"><el-input-number :disabled="addOrEditOrSeeStatus === 'see'" size="medium" v-model="bbruleForm.bbunit3.integral" :precision="2" :step="1" :min="0.01" controls-position="right"></el-input-number><i class="bbunit">Candy</i></div>
        </div>
      </el-form-item>
      <el-form-item label="每份预估成本:" prop="singleCost" style="width:500px;" v-show="+bbruleForm.payWay !== 3">
        <template slot="label">
          <span>
            <span style="padding-right:3px">每份预估成本</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、每份预估成本:作用主要用于统计用户抢购时，计算预估获得的"平台分佣"<br>
                   预估基础佣金 =  (每份最小单位(现金部份） - 每份预估成本)  *  抢购份数 * 鲸丽生活平台分配佣金比例 * 鲸丽生活返佣给用户比例<br>
                   预估平台分佣，在预估基础佣金之上，按[佣金- 等级分佣设置]进行分配<br><br>
                2、与实物商品的销售价无关<br><br>
                3、用户真实可获得"平台分佣" = [ 抢购总份数 * 抢购额现金部份 - 累计 (抢中盲盒实物*每个实物的销售价*数量) ]<br>
                   * 鲸丽生活平台分配佣金比例 * 鲸丽生活返佣给用户比例<br>
                   a) 在" 已结束（达标）" 这种状态时，可提现 ，小于等于0的，均无分佣<br>
                   b) 配置比例见"佣金-平台分佣设置->魔力盲盒"
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.singleCost" :precision="2" :step="1" :min="0.01"></el-input-number><i class="bbunit">USDT</i>
      </el-form-item>

      <el-form-item label="Candy抵扣:" prop="deductSetting" v-show="+bbruleForm.payWay !== 3">
        <template slot="label">
          <span>
            <span style="padding-right:3px">Candy抵扣</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、Candy抵扣，只有[每份最小单位]选择 "现金+Candy"或"现金"，在才勾选；<br>
                   [每份最小单位]选择 " Candy" 时，[Candy抵扣]禁用不可选<br><br>
                2、使用的Candy，均受“[转赠规则-“须保持”]规则的影响
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>

        <span style="padding: 5px 10px;background:#1890ff;border-radius:3px;color:#fff;">Candy抵扣现金</span>
        <span style="margin:0 10px;">请选择“鲸豆”最多抵扣金额:</span>
        <el-select :disabled="addOrEditOrSeeStatus === 'see'" clearable v-model="bbruleForm.deductSetting.id" placeholder="请选择">
        <el-option
          v-for="item in discoMoneyArray"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>

      <el-form-item label="盲盒前端展示样式:" prop="appDisplayStyle">
        <el-radio-group :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.appDisplayStyle">
          <el-radio :label="1">展示实物商品图片</el-radio>
          <el-radio :label="2" disabled>模版图片（展示盲盒样式，不展示盲盒实物）</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="盲盒实物（最多上传20张）:" prop="bbShiWu">
        <template slot="label">
          <span>
            <span style="padding-right:3px">盲盒实物</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、主物唯一的
                2、已存在主物，再次选择主物是，将之前的主物挤下
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
        <el-button :disabled="addOrEditOrSeeStatus === 'see' || bbruleForm.items.length >= 20" type="primary" icon="el-icon-plus" @click="addbbShiWu" size="mini">添加</el-button>
      </el-form-item>

      <!--盲盒实物展示区域-->
      <el-table :data="bbruleForm.items" border style="width:calc(100% - 200px);margin-left:200px;">
        <el-table-column label="序号" width="59">
          <template scope="scope">
            <p>{{scope.$index+1}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="itemNo" label="货号" width="180"></el-table-column>
        <el-table-column prop="name" label="实物名称"></el-table-column>
        <el-table-column prop="image" label="图片" width="69px"><template scope="scope"><img :src="scope.row.image" style="width:39px;height:39px;border-radius:100%" /></template></el-table-column>
        <el-table-column prop="costPrice" label="供货成本（USDT）"></el-table-column>
        <el-table-column prop="salePrice" label="销售价（USDT）"></el-table-column>
        <el-table-column prop="probability" label="抽中概率( ‱ )"></el-table-column>
        <el-table-column prop="sort" label="排序" width="89"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :disabled="addOrEditOrSeeStatus === 'see'" type="text" @click="editTableClick(scope.row, scope.$index)">编辑</el-button>
            <el-button :disabled="addOrEditOrSeeStatus === 'see'" type="text" @click="delTableClick(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--富文本-->
      <div class="ml120">
        <span style="padding:15px 10px;display:block;">盲盒详情：</span>
        <div style="width:calc(100% - 80px);margin-left:80px;">
          <qu-editor v-model="bbruleForm.detailUrl" ref="quEditorRef" :min-height="192" :is-handle-img="true"/>
        </div>
      </div>

      <!-- <div class="clearfix" style="margin-top:59px;margin-bottom:29px;">
        <span class="fl bbTitle">规则配置</span>
      </div> -->
      <!-- <el-form-item label="开始时间-startTime:" prop="startTime" style="width:300px;">
        <el-date-picker
          v-model="bbruleForm.startTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item> -->

      <!-- <el-form-item label="手动结束-timedEndSetting:" class="clearfix rela">
        <el-input-number class="mockSlotStyle customW juforDays fl thisW" :controls="false" :precision="0" v-model="bbruleForm.timedEndSetting.day" controls-position="right" @change="handleChange" :min="0" :max="300" @blur="((ev)=>{handleBlur(ev, 'd')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW HounrSet fl thisW" :controls="false" :precision="0" v-model="bbruleForm.timedEndSetting.hour" controls-position="right" @change="handleChange" :min="0" :max="23" @blur="((ev)=>{handleBlur(ev, 'h')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW minuteSet fl thisW" :controls="false" :precision="0" v-model="bbruleForm.timedEndSetting.min" controls-position="right" @change="handleChange" :min="0" :max="59" @blur="((ev)=>{handleBlur(ev, 'm')})"></el-input-number>
        <el-input-number class="mockSlotStyle customW secondSet fl thisW" :controls="false" :precision="0" v-model="bbruleForm.timedEndSetting.sec" controls-position="right" @change="handleChange" :min="0" :max="59" @blur="((ev)=>{handleBlur(ev, 's')})"></el-input-number>
      </el-form-item> -->

      <!-- <el-form-item label="最小抢购份数-minBuyNum:" prop="minBuyNum" style="width:300px;">
        <el-input-number v-model="bbruleForm.minBuyNum" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
      </el-form-item> -->
      <!-- <el-form-item label="最大抢购份数-maxBuyNum:" prop="maxBuyNum" style="width:300px;">
        <el-input-number v-model="bbruleForm.maxBuyNum" :step="1" :min="2" step-strictly controls-position="right"></el-input-number>
      </el-form-item> -->
      <!-- <el-form-item label="复投规则:" prop="bbReptyRule">
        <template slot="label">
          <span>
            <span style="padding-right:3px">复投规则</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、下一期复投 ：是指 第 n 期 抢购成功后，自动将[第 n 期抢购额（现金部分） + 盲盒收益余额]的总额作为第 n +1 期的抢购额（现金部分）。<br><br>
                2、 隔期复投 ：是指第 n 期 抢购成功后，自动将[第 n 期抢购额（现金部分） + 参与补贴]的总额作为第 n +2 期的抢购额（现金部分）。<br>
                （a）针对于隔期复投，倒数第4期有复投至倒数第2期的，按倒数第4期抢购额计算,不计算获得的参与补贴<br>
                （b）倒数第3期有复投至倒数第1期的， 按倒数第3期抢购额计算，不计算获得的参与补贴<br>
                （c）例:假设 第1期投入100，获得预估参与补贴为5 ；复投至第3期为105 ；轮回期为4，在第3期（倒数第1期）抢购失败；此时退回的抢购额（现金部分）为100 ，不加5<br>
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
        <el-radio-group v-model="bbruleForm.bbReptyRule">
          <el-radio :label="1">下一期复投</el-radio>
          <el-radio :label="2">隔期复投</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="轮回期-reborn:" prop="reborn" style="width:500px;">
        <template slot="label">
          <span>
            <span style="padding-right:3px">轮回期-reborn</span>
            <el-tooltip placement="top">
              <div slot="content">
                轮回期 : 是指只连续抢购期数达轮回期，超出轮回期的剩余期数，均获利出局；<br>
                抢购失败，在轮回期的所有参与者均可以获得相应的补偿。
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
        <el-input-number v-model="bbruleForm.reborn" :step="1" :min="1" :max="20" step-strictly controls-position="right"></el-input-number>
        <el-button :loading="rebornResultClickLoading" type="primary" size="small" @click="rebornResultClick" style="margin-left:10px;">确定</el-button>
      </el-form-item> -->

      <!-- <div class="clearfix">
        <span class="fl" style="padding:15px 10px;display:block;">返还规则-returnDetails:</span>
        <el-tooltip placement="top" style="margin-top:18px;">
            <div slot="content">
              1、返还规则:是指在轮回期内的参与者，本系列的盲盒抢购失败，获得的补偿；<br>
              2、默认倒数第1期返还全部抢购额（包括现金部分（现金 + Candy抵扣）和Candy部分）<br>
              3、[赠送盲盒奖励券的份数] = （1 -  [抢购额（现金部分）]的百分比 ）*参与抢购份数<br>
              4、 结果存在小数，向下取整，如果计算出[赠送盲盒奖励券的份数]为14.1 ，则视为15份<br>
              5、 可选择的[赠送盲盒奖励券] 在"运营->赠送任务券->盲盒奖励券"中配置<br>
              6、当[每份最小单位]选择[现金] ，赠 [抢购额(Candy部分)]此项禁用，不可选；<br>
              7、当[每份最小单位]选择[Candy] ，赠 [抢购额(现金部分)] 此项禁用，不可选；<br>
              8、例:<br>
                倒数第2期返还 70% 抢购额（现金部分），其中 现金部分包括支付现金和Candy抵扣部分<br>
                假设抢购额（现金部分）为100，其中支付现金 为97 USDT，Candy抵扣为3USDT，<br>
                则返还70% * 100 = 30 ,以100 计算<br>
                倒数第1期(抢购失败) ，支付什么退还什么，假设”支付97USDT+1Candy抵扣3USDT+20 Candy"，则退 还 "97USDT+1Candy+20 Candy"
            </div>
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
      </div> -->
      <!-- <div class="bbRebackRuleBox" style="width:calc(100% - 30px);margin-left:30px;max-height:300px;overflow-y:scroll;">
          <ul>
            <li class="clearfix eachRuleLinebox" v-for="(item, index) in bbruleForm.returnDetails" :key="index">
              <span class="fl"><span style="color:red;">*</span>倒数第{{index+1}}期返还:</span>
              <el-checkbox class="fl" v-model="item.giveAmountRate.give">抢购额（现金部分）</el-checkbox>
              <el-input-number @blur="((ev)=>{handleBlurForthis(ev, index, 'giveAmountRate', 'amountRate')})" class="fl" v-model="item.giveAmountRate.amountRate" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number>
              <i class="fl bbunit">%</i>

              <el-checkbox class="fl" v-model="item.giveIntegralRate.give">抢购额（Candy部分）</el-checkbox>
              <el-input-number @blur="((ev)=>{handleBlurForthis(ev, index, 'giveIntegralRate', 'integralRate')})" class="fl" v-model="item.giveIntegralRate.integralRate" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number>
              <i class="fl bbunit">%</i>

              <el-checkbox class="fl" v-model="item.giveProduct">盲盒实物</el-checkbox>
              <el-checkbox class="fl" v-model="item.taskTicket.give">赠送游戏奖励券</el-checkbox>
              <el-select class="fl gameCouponsStyle" v-model="item.taskTicket.id" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in gameCouponsArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

              <el-checkbox class="fl" v-model="item.lotteryTicket.give">体彩奖码</el-checkbox>
              <el-input-number @blur="((ev)=>{handleBlurForthis(ev, index, 'lotteryTicket', 'num')})" class="fl" v-model="item.lotteryTicket.num" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number>
              <i class="fl bbunit">注</i>
            </li>
          </ul>
        </div> -->

        <!-- <el-form-item label="下一期总份额比当期总份额多增长-nextGrowthRate:" prop="nextGrowthRate" style="width:439px;">
          <el-input-number v-model="bbruleForm.nextGrowthRate" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">%</i>
        </el-form-item> -->

        <!-- <el-form-item label="下一期开放方式-nextPublicityType:" prop="nextPublicityType">
          <template slot="label">
          <span>
            <span style="padding-right:3px">下一期开放方式-nextPublicityType</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、当期抢购结束后，此系列的盲盒的下一期(在APP端开放)<br><br>
                2、APP端直接展示，选择[自动开放]，直接在APP端展示，但显示"距开始" 的倒计时<br><br>
                3、选择[手动开放] ，在上一期结束后（在盲盒系列管理 ->  点击[开放],并在填入时间），即展示于APP端<br>
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
          <el-radio-group v-model="bbruleForm.nextPublicityType" class="nextAnnounceWayBox clearfix rela">
            <el-radio :label="2">手动开放 （只有手动提示开放后，才在APP端显示）</el-radio>
            <el-radio :label="1">自动开放（当期结束，下一期即开始）距开始:</el-radio>
          </el-radio-group>
          <div class="abs bbinnerBox" style="top:39px;left:263px;">
            <el-input-number v-model="bbruleForm.autoPublicityDelayMin" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number><i class="bbunit">分</i>
          </div>
        </el-form-item> -->

        <!-- <el-form-item label="重生方式:" prop="relifeWay">
          <el-radio-group v-model="bbruleForm.relifeWay" class="nextAnnounceWayBox clearfix rela">
            <el-radio :label="1">自动重生（当期结束，下一期开始）</el-radio>
            <el-radio :label="2">手动重生（只有手动提示公示后，才在APP端显示）</el-radio>
            <el-radio :label="3">定时重生（当期结束后，固定时间内公示）</el-radio>
          </el-radio-group>
          <div class="abs bbinnerBox">
            <el-input-number v-model="bbruleForm.relifeTime" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number><i class="bbunit">分</i>
          </div>
        </el-form-item> -->
        <!-- <el-form-item label="机器人抢购份数占比-robotShareRate:" prop="robotShareRate" style="width:800px;">
          <el-input-number v-model="bbruleForm.robotShareRate.startNum" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">%</i><span style="padding:0 10px;">-</span>
          <el-input-number v-model="bbruleForm.robotShareRate.endNum" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">%</i>
        </el-form-item> -->
        <!-- <el-form-item label="机器人介入期数-robotJoinPeriod:" prop="robotJoinPeriod" style="width:439px;">
          <template slot="label">
          <span>
            <span style="padding-right:3px">机器人介入期数-robotJoinPeriod</span>
            <el-tooltip placement="top">
              <div slot="content">
                机器人介入份数占总份数的占比 ，在某个范围随机
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
          <el-input-number v-model="bbruleForm.robotJoinPeriod" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">期</i>
        </el-form-item> -->
        <!-- <el-form-item label="最新2期同时展示于APP端的时间-latelyShowMin:" prop="latelyShowMin" style="width:439px;">
          <template slot="label">
          <span>
            <span style="padding-right:3px">最新2期同时展示于APP端的时间-latelyShowMin</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、倒数第1期和倒数第2期同时展示时间<br>
                2、当此时间结束后，APP端只展示最后1期<br>
                3、例:第1期:已结束（未达标）<br>
                    第2期:已结束（未达标）<br>
                    第3期:进行中上（距开始:12：09）<br>
                  是指第2期和第3期同时在APP端展示的时间，时间结束后，第2期则不在APP端展示
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
          <el-input-number v-model="bbruleForm.latelyShowMin" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">分</i>
        </el-form-item> -->
        <!-- <el-form-item label="基础销量:" prop="bbBaseSalle">
          <template slot="label">
          <span>
            <span style="padding-right:3px">基础销量</span>
            <el-tooltip placement="top">
              <div slot="content">
                1、基础销量 = 真实销量 * 配置的倍数,例: 假设配置1.5倍 ，真实销量为1<br>
                  那么基础销量 = 1* 1.5 =1.5 , （存在小数，向下加1）<br>
                  即基础销量为 = 2，在APP端展示的销量为 1+2 = 3<br><br>
                2、当"基础销量 + 真实销量" 大于"扣除机器人后的总份数"时，APP端显示 "[总份额]人付款 ，库存为 0 “
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
          <el-input-number v-model="bbruleForm.bbBaseSalle" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">份</i>
        </el-form-item> -->
        <!-- <el-form-item label="盲盒系列重生【已结束（未达标）】的次数上限:" prop="bbonTargetLimit">
          <el-input-number v-model="bbruleForm.bbonTargetLimit" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">期</i>
        </el-form-item> -->
        
        <!-- <el-form-item label="盲盒系列重生的达标次数赠送:" prop="bbPrizesNum">
          <el-radio-group v-model="bbruleForm.bbPrizesNum" class="nextAnnounceWayBox clearfix">
            <el-radio :label="1">VIP</el-radio>
            <el-radio :label="2">转赠“须保持”调整为（取最高阶进行中的最高次数）</el-radio>
          </el-radio-group>
          <div class="abs bbinnerBox2">
            <el-input-number v-model="bbruleForm.bbPrizesNumMounth" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number><i class="bbunit">月</i>
          </div>
        </el-form-item> -->

        <!-- <el-form-item label="排序-sort:" prop="sort" style="width:400px;">
          <el-input-number v-model="bbruleForm.sort" :step="1" step-strictly controls-position="right"></el-input-number>
        </el-form-item> -->

      </el-form>
      <!--弹窗主要内容d-->

      <!--嵌套Dialog-s-->
      <!--盲盒实物:编辑｜添加弹窗-->
      <el-dialog :visible.sync="bbRulesInnerVisible" append-to-body>
        <el-form :model="certifyform" :rules="certifyrules" ref="certifyRef">

          <el-form-item label="图片：" :label-width="formLabelWidth" prop="image">
            <el-upload
              class="avatar-uploader zUploderBox"
              action=""
              :disabled="bbRulesInnerReadOnly"
              :show-file-list="false"
              :http-request="handleAvatarSuccessRUN.bind(file, 'FRONT')">
              <img v-if="certifyform.image" :src="certifyform.image" class="avatar" style="width:120px;height:120px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="实物货号：" :label-width="formLabelWidth" prop="itemNo">
            <el-input :disabled="bbRulesInnerReadOnly" v-model.trim="certifyform.itemNo" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="实物名称：" :label-width="formLabelWidth" prop="name">
            <el-input :disabled="bbRulesInnerReadOnly" v-model.trim="certifyform.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="货物成本（USDT）：" :label-width="formLabelWidth" prop="costPrice">
            <!-- <el-input-number v-model="certifyform.costPrice" :precision="0" step-strictly controls-position="right" :min="0" :max="1000"></el-input-number> -->
            <el-input-number :disabled="bbRulesInnerReadOnly" v-model="certifyform.costPrice" controls-position="right" :min="0.01" :precision="2"></el-input-number>
          </el-form-item>
          <el-form-item label="销售价（USDT）：" :label-width="formLabelWidth" prop="salePrice">
            <el-input-number :disabled="bbRulesInnerReadOnly" v-model="certifyform.salePrice" controls-position="right" :min="0.01" :precision="2"></el-input-number>
          </el-form-item>
          <el-form-item label="抽中概率（‱）：" :label-width="formLabelWidth" prop="probability">
            <el-input-number :disabled="bbRulesInnerReadOnly" v-model="certifyform.probability" controls-position="right" :min="0" :max="10000"></el-input-number>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort">
            <el-input-number :disabled="bbRulesInnerReadOnly" v-model="certifyform.sort" :precision="0" step-strictly controls-position="right" :min="1"></el-input-number>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="bbRulesInnerVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveInnerDialog('certifyRef')">确 定</el-button>
        </div>
      </el-dialog>
      <!--嵌套Dialog-d-->


      <div slot="footer" class="dialog-footer">
        <el-button @click="bbRulesOuterVisible = false">{{addOrEditOrSeeStatus === 'see' ? '确 定' : '取 消'}}</el-button>
        <el-button v-show="addOrEditOrSeeStatus !== 'see'" type="primary" :loading="sumbitLoading" @click="saveOuterDialog('bbruleFormRef')">提 交</el-button>
      </div>



    </el-dialog>

    <!--引用次数弹窗-->
    <el-dialog title="引用次数" :visible.sync="reeVisible">
      <el-table :data="tableDataRee">
        <el-table-column property="code" label="被引用盲盒编号">
          <template scope="scope">
            <p @click="jumpToEachissuePage(scope.row)" style="text-decoration:underline;cursor:pointer;color:#1890ff">{{scope.row.code}}</p>
          </template>
        </el-table-column>
        <el-table-column property="name" label="盲盒系列"></el-table-column>
        <el-table-column property="describe" label="盲盒描述"></el-table-column>
        <el-table-column property="refTime" label="引用时间">
          <template slot-scope="{row}">
            {{row.refTime ? $dayjs(row.refTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="padding-top:10px;"
        @current-change="searchRee"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChangeRee"
        :current-page.sync="pageIndexRee"
        :page-size="pageSizeRee"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPageRee">
        </el-pagination>
    </el-dialog>

    <!--查看实物-->
    <el-dialog title="查看实物" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="id" label="序号" width="150"></el-table-column>
        <el-table-column property="itemNo" label="货号" width="200"></el-table-column>
        <el-table-column property="name" label="实物名称"></el-table-column>
        <el-table-column property="image" label="图片">
          <template scope="scope">
            <img :src="scope.row.image" style="width:80px;height:80px;">
          </template>
        </el-table-column>
        <el-table-column property="costPrice" label="供货成本（USDT）"></el-table-column>
        <el-table-column property="probability" label="抽中概率(‰)"></el-table-column>
        <el-table-column property="sort" label="排序"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">确定</el-button>
      </div>
    </el-dialog>


      
      
      
    
    

  </div>
</template>

<script>
import filterXSS from 'xss';
import {getCertificate as getCertificate_oss, upload as upload_oss} from '@/api/oss';
import { getCertificate, upload,  } from "@/api/system/userlist";
import { blindBoxTemplateAdd, blindBoxTemplateEdit, blindBoxTemplateDel, blindBoxTemplateRef, blindBoxTemplateListPage, blindBoxRuleQueryReturn, blindBoxRulePagesQuery, blindBoxRuleAddCoupons, blindBoxRuleAdd, blindBoxRuleEdit, gameDesk, gameRuleAdd, gameRuleUpdate, gameRuleStatusChange, gameRuleDel } from "@/api/games";
import { whalePeanSetQueryList } from "@/api/presents";
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import _html from '@/utils/stHtml';
import {descHtml} from '@/api/goods/index';

  export default {
    name: 'blindBoxTemplate',
    props: ['sendTochildBridgeData'],
    components: {
      QuEditor: () => import('@/components/Editor')
    },
    data () {
      var validateName = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入盲盒系列'))
        }
        callback()
      }
      var validateDescribe = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入盲盒描述'))
        }
        callback()
      }
      var validateInitTotalNum = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入起初总份数'))
        }
        callback()
      }
      var validatePayWay = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请选择支付方式'))
        }
        if (+this.bbruleForm.payWay === 1 && (this.bbruleForm.bbunit1.amount === undefined || this.bbruleForm.bbunit1.amount === null || this.bbruleForm.bbunit1.amount === '')) {
          return callback(new Error('请输入现金值'))
        }
        if (+this.bbruleForm.payWay === 2 && (this.bbruleForm.bbunit2.amount === undefined || this.bbruleForm.bbunit2.amount === null || this.bbruleForm.bbunit2.amount === '') || (this.bbruleForm.bbunit2.integral === undefined || this.bbruleForm.bbunit2.integral === null || this.bbruleForm.bbunit2.integral === '')) {
          return callback(new Error('请输入现金值和Candy值'))
        }
        if (+this.bbruleForm.payWay === 3 && (this.bbruleForm.bbunit3.integral === undefined || this.bbruleForm.bbunit3.integral === null || this.bbruleForm.bbunit3.integral === '')) {
          return callback(new Error('请输入Candy值'))
        }
        callback()
      }
      var validateSingleCost = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入每份预估成本'))
        }
        callback()
      }
      var validateAppDisplayStyle = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请选择盲盒前端展示样式'))
        }
        callback()
      }
      var validateStartTime = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请选择开始时间'))
        }
        callback()
      }
      var validateMinBuyNum = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入最小抢购份数'))
        }
        callback()
      }
      var validateMaxBuyNum = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入最大抢购份数'))
        }
        if (this.bbruleForm.maxBuyNum < this.bbruleForm.minBuyNum) {
          return callback(new Error('最大抢购份数不能小于最小抢购份数'))
        }
        callback()
      }
      var validateReborn = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入轮回期'))
        }
        callback()
      }
      var validateNextGrowthRate = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入下一期总份额比当期总份额多增长'))
        }
        callback()
      }
      var validateNextPublicityType = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请选择下一期开放方式'))
        }
        callback()
      }
      var validateRobotShareRate = (rule, value, callback) => {
        if (this.bbruleForm.robotShareRate.endNum === '' || this.bbruleForm.robotShareRate.endNum === undefined || this.bbruleForm.robotShareRate.endNum === null || this.bbruleForm.robotShareRate.startNum === '' || this.bbruleForm.robotShareRate.startNum === undefined || this.bbruleForm.robotShareRate.startNum === null) {
          return callback(new Error('请输入机器人抢购份数占比'))
        }
        if (this.bbruleForm.robotShareRate.endNum < this.bbruleForm.robotShareRate.startNum) {
          return callback(new Error('请输入正确的机器人抢购份数占比'))
        }
        callback()
      }
      var validateRobotJoinPeriod = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入机器人介入期数'))
        }
        callback()
      }
      var validateLatelyShowMin = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入最新2期同时展示于APP端的时间'))
        }
        callback()
      }
      var validateSort = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入排序'))
        }
        callback()
      }
      let imgValidator = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('请上传图片'))
        } else {
          callback()
        }
      }
      var validateNotEmpty = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          return callback(new Error('不能为空'))
        }
        callback()
      }
      return {
        gridData: [],
        dialogTableVisible: false,
        idRee: null,
        pageIndexRee: 1,
        pageSizeRee: 10,
        totalPageRee: 0,
        tableDataRee: [],
        reeVisible: false,
        whileEditID: null,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        // 盲盒
        rebornResultClickLoading: false,
        tableData: [],
        loading: false,
        queryParams: {
          code: '',
          name: '',
          describe: ''
        },
        gameCouponsArr: [],
        formLabelWidth: '139px',
        file: {},
        bbruleForm: {
          appDisplayStyle: 1,
          deductSetting: {
            id: ''
          },
          describe: '',
          detailUrl: '', // 富文本
          initTotalNum: 0,
          items: [],
          name: '',
          payWay: 1,
          singleCost: 0.01,
          bbunit1: {
            amount: ''
          },
          bbunit2: {
            amount: '',
            integral: ''
          },
          bbunit3: {
            integral: ''
          },
          // returnDetails: [
          //   {
          //     giveAmountRate: {
          //       amountRate: 0,
          //       give: true
          //     },
          //     giveIntegralRate: {
          //       give: true,
          //       integralRate: 0
          //     },
          //     giveProduct: true,
          //     lotteryTicket: {
          //       give: true,
          //       num: 0
          //     },
          //     taskTicket: {
          //       give: true,
          //       id: null
          //     }
          //   }
          // ],
          // startTime: new Date(),
          // timedEndSetting: {
          //   day: 0,
          //   hour: 0,
          //   min: 0,
          //   sec: 1
          // },
          // minBuyNum: 0,
          // maxBuyNum: 0,
          // bbReptyRule: '',
          // reborn: 4,
          // nextPublicityType: 2,
          // nextGrowthRate: '',
          // autoPublicityDelayMin: '',
          // relifeWay: '',
          // relifeTime: 1,
          // robotShareRate: {
          //   endNum: '',
          //   startNum: ''
          // },
          // robotJoinPeriod: '',
          // latelyShowMin: '',
          // bbBaseSalle: '',
          // bbonTargetLimit: '',
          // bbPrizesNum: '',
          // bbPrizesNumMounth: '',
          // sort: '',
        },
        discoMoneyArray: [],
        blindBoxrules: {
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          describe: [
            { validator: validateDescribe, trigger: 'blur' }
          ],
          initTotalNum: [
            { validator: validateInitTotalNum, trigger: 'blur' }
          ],
          payWay: [
            { validator: validatePayWay, trigger: 'blur' }
          ],
          singleCost: [
            { validator: validateSingleCost, trigger: 'blur' }
          ],
          appDisplayStyle: [
            { validator: validateAppDisplayStyle, trigger: 'blur' }
          ],
          startTime: [
            { validator: validateStartTime, trigger: 'blur' }
          ],
          minBuyNum: [
            { validator: validateMinBuyNum, trigger: 'blur' }
          ],
          maxBuyNum: [
            { validator: validateMaxBuyNum, trigger: 'blur' }
          ],
          reborn: [
            { validator: validateReborn, trigger: 'blur' }
          ],
          nextGrowthRate: [
            { validator: validateNextGrowthRate, trigger: 'blur' }
          ],
          nextPublicityType: [
            { validator: validateNextPublicityType, trigger: 'blur' }
          ],
          robotShareRate: [
            { validator: validateRobotShareRate, trigger: 'blur' }
          ],
          robotJoinPeriod: [
            { validator: validateRobotJoinPeriod, trigger: 'blur' }
          ],
          latelyShowMin: [
            { validator: validateLatelyShowMin, trigger: 'blur' }
          ],
          sort: [
            { validator: validateSort, trigger: 'blur' }
          ],
          
        },
        bbRulesInnerReadOnly: false,
        certifyform: {
          image: '',
          itemNo: '',
          name: '',
          costPrice: '',
          salePrice: '',
          probability: '',
          sort: '',
          enable: true
        },
        certifyrules: {
          image: [
            { validator: imgValidator, trigger: 'change' }
          ],
          itemNo: [
            { validator: validateNotEmpty, trigger: 'blur' }
          ],
          name: [
            { validator: validateNotEmpty, trigger: 'blur' }
          ],
          costPrice: [
            { validator: validateNotEmpty, trigger: 'blur' }
          ],
          salePrice: [
            { validator: validateNotEmpty, trigger: 'blur' }
          ],
          probability: [
            { validator: validateNotEmpty, trigger: 'blur' }
          ],
          sort: [
            { validator: validateNotEmpty, trigger: 'blur' }
          ],
        },
        bbRulesInnerVisible: false,
        bbRulesOuterVisible: false,
        addOrEditOrSeeStatus: null,
        saveInnerDialogType: '',
        saveInnerModifiedKey: null,
        sumbitLoading: false,
        bbRulesOuterLoading: false
        // 盲盒d
      }
    },
    created () {
      this.getCertificateRun()
      this.whalePeanSetQueryListRun()
      this.search()
    },
    mounted () {
      this.blindBoxRuleAddCouponsRun()
    },
    watch: {},
    methods: {
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      handleSizeChangeRee (val) {
        this.pageSizeRee = val
        this.pageIndexRee = 1
        this.searchRee()
      },
      // 获取descHtml内容
      async descHtmlReq (url) {
        try {
          const {data} = await descHtml(url);
          return data;
        } catch (error) {
          console.error(error);
        }
      },
      search (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          pageSize: this.pageSize,
          currentPage: this.pageIndex,
          ...this.queryParams
        }
        this.loading = true
        blindBoxTemplateListPage(_params).then(response => {
          if (+response.code === 200) {
            this.tableData = response.data.list.map(v => {
              let {items, deductSetting, ...a} = v
              let jfdk = null
              if (deductSetting === null) {
                jfdk = ''
              } else {
                if (deductSetting.id !== null) {
                  let _res = this.discoMoneyArray.find(items => items.value === deductSetting.id)
                  jfdk = _res ? _res.label : ''
                } else {
                  jfdk = ''
                }
              }
              return {
                itemsLen: items.length || 0,
                deductSetting,
                jfdk,
                items,
                ...a
              }
            })
            this.totalPage = response.data.total
          } else {
            this.tableData = []
            this.totalPage = 0
            this.pageSize = 10
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      },
      searchRee (pgi) {
        if (pgi) this.pageIndexRee = pgi
        let _params = {
          pageSize: this.pageSizeRee,
          currentPage: this.pageIndexRee,
          id: this.idRee
        }
        blindBoxTemplateRef(_params).then(response => {
          if (+response.code === 200) {
            this.tableDataRee = response.data.list
            this.totalPageRee = response.data.total
          } else {
            this.tableDataRee = []
            this.totalPageRee = 0
            this.pageSizeRee = 10
          }
        }).catch(e => {

        })
      },
      rebornResultClick () {
        this.rebornResultClickLoading = true
        blindBoxRuleQueryReturn({
          count: this.bbruleForm.reborn
        }).then(response => {
          this.rebornResultClickLoading = false
          if (+response.code === 200) {
            this.bbruleForm.returnDetails = response.data || []
            if (this.addOrEditOrSeeStatus === 'add') {
              // 新增的时候，默认选中第一个下拉项
              this.bbruleForm.returnDetails = this.bbruleForm.returnDetails.map(v => {
                let {taskTicket, ...a} = v
                return {
                  taskTicket: {
                    give: taskTicket.give,
                    id: taskTicket.id || this.gameCouponsArr[0].value
                  },
                  ...a
                }
              })
            }
          } else {
            this.bbruleForm.returnDetails = []
          }
        }).catch(e => {
          this.rebornResultClickLoading = false
        })
      },
      // 赠送盲盒奖励券下拉数据
      blindBoxRuleAddCouponsRun () {
        blindBoxRuleAddCoupons({
          currentPage: 1,
          pageSize: 30,
          statusType: 1,
          taskType: 8
        }).then(response => {
          if (+response.code === 200) {
            this.gameCouponsArr = (response.data.list || []).map(v => {
              let {id, taskName} = v
              return {
                value: id,
                label: taskName
              }
            })
          } else {
            this.gameCouponsArr = []
          }
        }).catch(e => {
          console.log(e)
        })
      },
      alterSortClick () {},
      shelfClick () {},
      seeLogClick (row) {
        this.dialogTableVisible = true
        this.gridData = row.items || []
      },
      seeRefsClick (row) {
        this.idRee = row.id
        this.reeVisible = true
        this.searchRee(1)
      },
      delClick (row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _params = {}
          _params.id = row.id
          blindBoxTemplateDel(_params).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                'duration': 1000,
                onClose: () => {
                  this.search(1)
                }
              })
            } else {
              this.$message.error(response.message)
            }
          }).catch(({ error }) => {
            if (error) this.$message.error(error.message)
          })
        }).catch(() => {})
      },
      async addOrEditClick (type, row) {
        this.addOrEditOrSeeStatus = type
        this.bbRulesOuterVisible = true
        this.bbRulesOuterLoading = true
        this.$nextTick(() => {
          this.$refs['bbruleFormRef'].clearValidate()
          // 禁用富文本
          if (type === 'see' && this.$refs.quEditorRef) {
            this.$refs.quEditorRef.Quill.enable(false)
          } else {
            this.$refs.quEditorRef.Quill.enable(true)
          }
        })
        if (type === 'add') {
          // 盲盒模板不需要‘返还规则’
          // this.rebornResultClick()
          this.bbruleForm = {
            appDisplayStyle: 1,
            deductSetting: {
              id: ''
            },
            describe: '',
            detailUrl: '', // 富文本
            initTotalNum: 0,
            items: [],
            name: '',
            payWay: 1,
            bbunit1: {
              amount: ''
            },
            bbunit2: {
              amount: '',
              integral: ''
            },
            bbunit3: {
              integral: ''
            },
            singleCost: 0.01,
            // returnDetails: [
            //   {
            //     giveAmountRate: {
            //       amountRate: 0,
            //       give: true
            //     },
            //     giveIntegralRate: {
            //       give: true,
            //       integralRate: 0
            //     },
            //     giveProduct: true,
            //     lotteryTicket: {
            //       give: true,
            //       num: 0
            //     },
            //     taskTicket: {
            //       give: true,
            //       id: null
            //     }
            //   }
            // ],
            // startTime: new Date(),
            // timedEndSetting: {
            //   day: 0,
            //   hour: 0,
            //   min: 0,
            //   sec: 1
            // },
            // minBuyNum: 0,
            // maxBuyNum: 0,
            // bbReptyRule: '',
            // reborn: 4,
            // nextPublicityType: 2,
            // nextGrowthRate: '',
            // autoPublicityDelayMin: '',
            // relifeWay: '',
            // relifeTime: 1,
            // robotShareRate: {
            //   endNum: '',
            //   startNum: ''
            // },
            // robotJoinPeriod: '',
            // latelyShowMin: '',
            // bbBaseSalle: '',
            // bbonTargetLimit: '',
            // bbPrizesNum: '',
            // bbPrizesNumMounth: '',
            // sort: '',
          }
        } else {
          let _row = JSON.parse(JSON.stringify(row))
          let {top, bottom,start,end} = _html;
          let _descHtml
          try {
            _descHtml = await this.descHtmlReq(_row.detailUrl);
            _descHtml = _descHtml.replace(top, '').replace(bottom, '');
            let subStart = _descHtml.indexOf(start)
            let subEnd = _descHtml.lastIndexOf(end);
            if(subStart != -1 && subEnd != -1){
              _descHtml = _descHtml.substring(subStart+start.length,subEnd)
            }
          } catch (e) {
            console.log(e, '富文本内容获取超时')
            _descHtml = ''
          }
          this.bbruleForm = {
            appDisplayStyle: _row.appDisplayStyle,
            deductSetting: {
              // id: _row.deductSetting.id, // payWay=3为Candy支付时，deductSetting后台会返回{}空对象，因此需要兼容
              id: +_row.payWay !== 3 ? (_row.deductSetting && _row.deductSetting.id ? _row.deductSetting.id : '') : '',
            },
            describe: _row.describe,
            detailUrl: _descHtml, // 富文本
            initTotalNum: _row.initTotalNum,
            items: _row.items,
            name: _row.name,
            payWay: _row.payWay,
            bbunit1: {
              amount: +_row.payWay === 1 ? _row.amount : 0
            },
            bbunit2: {
              amount: +_row.payWay === 2 ? _row.amount : 0,
              integral: +_row.payWay === 2 ? _row.integral : 0
            },
            bbunit3: {
              integral: +_row.payWay === 3 ? _row.integral : 0
            },
            singleCost: _row.singleCost,
            // returnDetails: row.returnDetails || [],
            // startTime: row.startTime,
            // timedEndSetting: row.timedEndSetting,
            // minBuyNum: row.minBuyNum,
            // maxBuyNum: row.maxBuyNum,
            // bbReptyRule: row.bbReptyRule,
            // reborn: row.reborn,
            // nextPublicityType: row.nextPublicityType,
            // nextGrowthRate: row.nextGrowthRate,
            // autoPublicityDelayMin: row.autoPublicityDelayMin,
            // relifeWay: row.relifeWay,
            // relifeTime: row.relifeTime,
            // robotShareRate: row.robotShareRate,
            // robotJoinPeriod: row.robotJoinPeriod,
            // latelyShowMin: row.latelyShowMin,
            // bbBaseSalle: '',
            // bbonTargetLimit: '',
            // bbPrizesNum: '',
            // bbPrizesNumMounth: '',
            // sort: row.sort,
          }
          this.whileEditID = _row.id
        }
        setTimeout(() => { this.bbRulesOuterLoading = false }, 500)
      },
      // 商品描述内容上传
      async handleDescription () {
        const {top, bottom} = _html;
        const _xssDesc = filterXSS(this.bbruleForm.detailUrl); // xss 转化
        const description = top + _xssDesc + bottom;

        const certificates = await this.getCertificateRequest();
        const {res: {status, statusCode, requestUrls}} = await upload_oss(certificates, description, 'content');
        if (status == 200 && statusCode == 200) {
          return requestUrls[0];
        } else {
          this.$message.error('商品描述转化url错误');
        };
      },
      // 向您搭建的STS服务获取临时访问凭证。
      getCertificateRun () {
        return new Promise((resolve, reject) => {
          getCertificate().then(response => {
            this.certificateInfos = response.data
            resolve(this.certificateInfos)
          })
        })
      },
      // 向您搭建的STS服务获取临时访问凭证
      async getCertificateRequest () {
        try {
          const {code, data, message} = await getCertificate_oss('blindBox');
          if (code == 200) {
            return data;
          } else {
            this.$message.error(message);
          };
        } catch (error) {
          // ...
        }
      },
      
      async handleAvatarSuccessRUN (type, file) { // the order of the parameters here must be reversed.
        let _valid = this.beforeAvatarUpload(file.file)
        if (!_valid) await this.put(file.file, type)
      },
      beforeAvatarUpload(file) {
        const isNOtJPGPNG = file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
        const isGt2M = file.size / 1024 / 1024 > 5
        if (isNOtJPGPNG) {
          this.$message.error('请上传是 jpg、png、jpeg 格式的图片!')
        }
        if (isGt2M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        return isNOtJPGPNG || isGt2M
      },
      async put (file, type) {
        try {
          let _res = await upload(this.certificateInfos, file)
          let ossFileUrl = _res.res.requestUrls[0]
          //如果CDN域名不为空，则替换成CDN域名
          if(this.certificateInfos.bucketCdnUrl){
            ossFileUrl = replaceUnitlPrefixStr(ossFileUrl, this.certificateInfos.endpoint, this.certificateInfos.bucketCdnUrl);
          }
          switch(type) {
            case 'BACK':
              this.certifyform.imageUrlSuccessBACK = ossFileUrl
              this.$refs['certifyRef'].clearValidate('imageUrlSuccessBACK')
              break;
            case 'FRONT':
              this.certifyform.image = ossFileUrl
              this.$refs['certifyRef'].clearValidate('image')
              break;
            case 'HAND':
              this.certifyform.imageUrlSuccessHAND = ossFileUrl
              this.$refs['certifyRef'].clearValidate('imageUrlSuccessHAND')
              break;
          }
        } catch (e) {
          console.log(e)
        }
      },
      // 盲盒实物-s
      delTableClick (row, index) {
        this.bbruleForm.items.splice(index, 1)
      },
      editTableClick (row, index) {
        this.saveInnerDialogType = 'edit'
        this.bbRulesInnerVisible = true
        this.saveInnerModifiedKey = index
        this.$nextTick(() => {
          this.$refs['certifyRef'].clearValidate()
        })
        this.certifyform = Object.assign({}, row)
        // this.bbruleForm.items[index] = row
      },
      addbbShiWu () {
        this.bbRulesInnerVisible = true
        this.bbRulesInnerReadOnly = false
        this.saveInnerDialogType = 'add'
        this.$nextTick(() => {
          this.$refs['certifyRef'].clearValidate()
          this.certifyform = {
            image: '',
            itemNo: '',
            name: '',
            costPrice: '',
            salePrice: '',
            probability: '',
            sort: '',
            enable: true
          }
        })
      },
      saveInnerDialog (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.saveInnerDialogType === 'add') {
              this.bbruleForm.items.push({...this.certifyform})
            } else {
              this.bbruleForm.items.splice(this.saveInnerModifiedKey, 1, {...this.certifyform})
            }
            this.bbRulesInnerVisible = false
          }
        })
      },
      // 盲盒实物-d
      whalePeanSetQueryListRun () {
        whalePeanSetQueryList().then(response => {
          if (response.code === 200) {
            this.discoMoneyArray = (response.data.list || []).map(val => {
              let {deductionWorth, id, whalePeas} = val
              return {
                value: id,
                label: deductionWorth + 'USDT',
                whalePeas
              }
            })
          } else {
            this.discoMoneyArray = []
            this.$message.error(response.message)
          }
        })
      },
      // 加载loading
      loadLoading () {
        const loadinger = this.$loading({
          lock: true,
          text: '更新中...',
          fullscreen: true,
          spinner: 'el-icon-sunny',
          customClass: 'custom-loading',
        });

        return loadinger;
      },
      async saveOuterDialog (formName) {
        // const loadinger = this.loadLoading();
        try {
          const _description = await this.handleDescription();
          // let _bbruleForm = JSON.parse(JSON.stringify(this.bbruleForm)) // JSON.parse(JSON.stringify()) ->值为undefind时候，会直接把该整个key:value移除掉的(to be confirmed)
          let _bbruleForm = Object.assign({}, this.bbruleForm)
          _bbruleForm.detailUrl = _description // 富文本提交数据内容
          // 支付方式对应的amount｜integral小转换一下
          _bbruleForm.amount = _bbruleForm[`bbunit${_bbruleForm.payWay}`].amount || 0
          _bbruleForm.integral = _bbruleForm[`bbunit${_bbruleForm.payWay}`].integral || 0
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // 其他的一些额外的校验判断处理
              // 返还规则returnDetails，每一项都是必填，且每一项里面，至少有一个选项是勾选(带值的话就必填值)
              // let _flag = []
              // _bbruleForm.returnDetails.forEach((vs, index) => {
              //   // 如果有任意一行中，每一个都没有勾选，则不行
              //   if (!vs['giveAmountRate'].give && !vs['giveIntegralRate'].give && !vs['giveProduct'] && !vs['taskTicket'].give && !vs['lotteryTicket'].give) {
              //     _flag.push('empty')
              //   }
              // })
              // if (_flag.some(v => v === 'empty')) {
              //   this.$message.error('请填写完整返还规则')
              //   return false
              // } 
              if (+_bbruleForm.appDisplayStyle === 1 && _bbruleForm.items.length <= 0) {
                this.$message.error('盲盒实物至少添加1个')
                return false
              } else if (_bbruleForm.returnDetails) {
                // _bbruleForm.returnDetails
              }
              let _api = this.addOrEditOrSeeStatus === 'add' ? blindBoxTemplateAdd : blindBoxTemplateEdit
              if (this.addOrEditOrSeeStatus === 'edit') {
                _bbruleForm.id = this.whileEditID
              }
              this.sumbitLoading = true
              _api(_bbruleForm).then(response => {
                if (+response.code === 200) {
                  this.$message.success(response.message)
                  this.bbRulesOuterVisible = false
                  this.search(1)
                } else {
                  this.$message.error(response.message)
                }
                this.sumbitLoading = false
              }).catch(e => {
                this.sumbitLoading = false
              })
            }
          })
        } catch(e){
          // loadinger.close();
          console.error(e);
        }
        
      },
      handleBlur (ev, key) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          ev.target.value = ev.target.ariaValueMin
          this.bbruleForm.timedEndSetting[key] = ev.target.ariaValueMin
        }
      },
      handleBlurForthis (ev, key, keyParent, keyChild) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          ev.target.value = ev.target.ariaValueMin
          this.bbruleForm.returnDetails[key][keyParent][keyChild] = ev.target.ariaValueMin
        }
      },
      handleChange(value) {
        this.$forceUpdate()
      },
      jumpToEachissuePage (row) {
        // 进入盲盒详情统计页面，盲盒编号必传
        this.$router.push({ path: "/games/blindBoxEachIssueInfos", query: {blindBoxNo: row.code, blindBoxType: row.blindBoxType}})
      },
    }
  }
</script>

<style lang="scss">
$myColor: #8b939c;
.blindBox {
  width:100%;
  margin: 29px auto 0 auto;
  .bbradioBox{
    .el-radio-group{
      width:109px;
      padding-top: 10px;
      label{
        padding-bottom: 26px;
      }
    }
  }
  .bbTitle{
    position: relative;
    margin-left:30px;
  }
  .bbTitle::before{
    position: absolute;
    top: 4px;
    left: -10px;
    content: "";
    display: inline-block;
    background: red;
    height: 15px;
    width: 3px;
    border-radius: 12px;
  }
  .bbradioBoxAbs1,.bbradioBoxAbs2{
    padding-bottom: 4px;
  }
  i.bbunit{
    font-style: normal;
    padding-left: 5px;
  }
  .nextAnnounceWayBox{
    width:400px;
    label{
      float: left;
      padding-top: 10px;
      padding-bottom: 16px;
    }
  }
  .bbinnerBox{
    left:287px;
    top:84px;
  }
  .bbinnerBox2{
    left:57px;
    top:-2px;
  }
  .eachRuleLinebox{
    line-height: 28px;
    border: 1px solid rgba(204,204,204,.3);
    background: rgba(204,204,204,.3);
    border-radius: 3px;
    font-size: 12px;
    padding:8px 3px;
    margin-bottom: 10px;
    span{
      font-size: 12px;
    }
  }
  .warnTipsSet{
    padding-left: 30px;
    color: #909399;
    font-size: 13px;
  }
  .errMsg{
    position: absolute;
    top:27px;
    left: 0;
    font-style: normal;
    font-size: 12px;
    color: red;
  }
  .thisW{
    width:66px!important;
  }
  ul {
    padding: 0;
  }
  p{
    color: #909399;
    font-size:13px;
  }
  li{
    position: relative;
    margin-bottom: 19px;
    & .cliBtn {
      margin-left: 20px;
    }
    & :first-child .cliBtn{
      margin-left: 20px;
    }
    .cliBtnBox{
      position: absolute;
      top:0;
      right: 0;
    }
  }
  .separator {
    font-style: normal;
    padding: 0 39px;
    vertical-align: middle;
  }
  & .enterVal {
    padding: 29px 67px 0 67px;
  }
  & .customW {
    width:139px;
    & .el-input::after{
      right:-55px;
      content: '天'!important;
      text-align: center;
    }
  }
  & .HounrSet {
    margin-left:20px;
    & .el-input::after{
      content: '时'!important;
    }
  }
  & .minuteSet {
    margin-left:20px;
    & .el-input::after{
      content: '分'!important;
    }
  }
  & .secondSet {
    margin-left:20px;
    & .el-input::after{
      content: '秒'!important;
    }
  }
  .el-form-item__error{
    width:100%;
    text-align: center;
    padding-top: 10px;
  }
}
</style>
<style>
.blindBox .avatar-uploader{
  height: 120px;
  width:120px;
  border: 1px solid #ccc;
}
.blindBox .avatar-uploader .el-icon-plus{
  margin-left: 49px;
  margin-top: 49px;
}
.blindBox .el-input-number--mini{
  width:92px!important;
}
.blindBox .el-input-number.is-controls-right .el-input__inner{
  padding-right: 29px!important;
}
.blindBox .gameCouponsStyle{
  width:130px;
}
.blindBox .bbRebackRuleBox i{
  padding-left: 3px;
  font-style: normal;
}
.blindBox .eachRuleLinebox label{
  margin-right:10px;
  margin-left: 10px;
}
.zUploderBox{
  height: 120px;
  width: 120px;
  border-radius:3px;
  border: 1px solid #ccc;
  overflow: hidden;
}
.zUploderBox .el-icon-plus{
  margin-top:50px;
  margin-left: 50px;
}
</style>

