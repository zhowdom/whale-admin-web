<template>
  <div class="blindBox">
    <!--列表s-->
    <el-form :inline="true">

      <el-form-item label="盲盒编号">
        <el-input
          v-model.trim="queryParams.code"
          placeholder=""
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="盲盒系列">
        <el-input
          v-model.trim="queryParams.name"
          placeholder=""
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="盲盒描述">
        <el-input
          v-model.trim="queryParams.describe"
          placeholder=""
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="queryParams.blindBoxType" clearable placeholder="请选择">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="魔力盲盒专场" :value="1"></el-option>
          <el-option label="Candy销毁专场" :value="2"></el-option>
          <el-option label="魔力小盲盒" :value="3"></el-option>
        </el-select>
    </el-form-item>

      <el-form-item>
        <el-button v-hasPermi="['blindBox:product_rule:page']" type="primary" :loading="loadingList" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button v-hasPermi="['blindBox:product_rule:save']" class="fr" :loading="loading" type="warning" icon="el-icon-plus" @click="addOrEditClick('add')">新增</el-button>
      </el-form-item>
    </el-form>

     <el-table
      :data="tableData"
      v-loading="loadingList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column property="blindBoxType" label="类型">
        <template scope="scope">
          <p v-if="+scope.row.blindBoxType === 1">魔力盲盒专场</p>
          <p v-else-if="+scope.row.blindBoxType === 2">Candy销毁专场</p>
          <p v-else-if="+scope.row.blindBoxType === 3">魔力小盲盒</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="盲盒编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="盲盒系列">
      </el-table-column>
      <el-table-column
        prop="primaryImage"
        label="盲盒主物" width="120px">
        <template scope="scope">
          <img :src="scope.row.primaryImage" style="width:80px;height:80px;">
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
        prop="integral"
        label="每份最小单位(Candy)">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="每份最小单位（USDT）">
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
        prop="minBuyNum"
        label="最小抢购份数">
      </el-table-column>
      <el-table-column
        prop="maxBuyNum"
        label="最大抢购份数">
      </el-table-column>
      <el-table-column
        prop="reborn"
        label="轮回期">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="初始时间">
        <template slot-scope="{row}">
          {{row.startTime ? $dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="固定结束时间">
        <template slot-scope="{row}">
          {{row.endTime ? $dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="nextGrowthRate"
        label="总份额增长比例">
        <template scope="scope">
          <p v-if="scope.row.nextGrowthRate !== null || scope.row.nextGrowthRate !== ''">{{scope.row.nextGrowthRate}}%</p>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="nextPublicityType"
        label="下一期公示方式">
        <template scope="scope">
          <p v-if="+scope.row.nextPublicityType === 1">自动开放</p>
          <p v-else-if="+scope.row.nextPublicityType === 2">手动开放</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间">
        <template slot-scope="{row}">
          {{row.updateTime ? $dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="upDownState"
        label="状态">
        <template scope="scope">
          <p v-if="+scope.row.upDownState === 1">待上架</p>
          <p v-else-if="+scope.row.upDownState === 2">已上架</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="盲盒当前状态">
        <template scope="scope">
          <p v-if="+scope.row.status === 1">新建</p>
          <p v-else-if="+scope.row.status === 2">进行中</p>
          <p v-else-if="+scope.row.status === 3">抢购失败</p>
          <p v-else-if="+scope.row.status === 4">已结束(未达标)</p>
          <p v-else-if="+scope.row.status === 5">已结束(已达标)</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作日志">
        <template scope="scope">
          <!-- <el-button type="text" @click="seeLogClick(scope.row)">查看日志</el-button> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        width="300px"
        label="操作">
        <template scope="scope">
          <el-button type="text" @click="addOrEditClick('see', scope.row)">查看</el-button>
          <el-button v-hasPermi="['blindBox:product_rule:update']" v-if="+scope.row.upDownState === 1" type="text" @click="addOrEditClick('edit', scope.row)">编辑</el-button>
          <el-button v-hasPermi="['blindBox:product_rule:sortChange']" v-if="+scope.row.upDownState === 2" type="text" @click="changeSortGameRule(scope.row)">修改排序</el-button>
          <el-button v-hasPermi="['blindBox:product_rule:down']" v-if="+scope.row.upDownState === 2 && +scope.row.status !== 1" type="text" @click="downStoreClick(scope.row)">下架</el-button>

          <div v-if="+scope.row.status !== 3">
            <el-button v-hasPermi="['blindBox:product_rule:up']" v-if="+scope.row.upDownState === 1" type="text" @click="upStoreClick(scope.row)">上架</el-button>
          </div>

          <el-button v-hasPermi="['blindBox:product_rule:delete']" v-if="+scope.row.status === 3 && +scope.row.upDownState === 1" type="text" @click="removeGameRule(scope.row)">删除</el-button>
          <el-button v-hasPermi="['blindBox:product_series_virtual:get', 'blindBox:product_series_virtual:set']" v-if="(+scope.row.blindBoxType === 3) && +scope.row.status === 1 || +scope.row.status === 2 || +scope.row.upDownState === 1" type="text" @click="addSaleNumber(scope.row)">增加销量</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      class="fr"
      style="margin-top:10px;"
      @current-change="search"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChangeList"
      :current-page.sync="pageIndexList"
      :page-size="pageSizeList"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPageList">
    </el-pagination>

    <!--列表d-->






    <!--新增｜编辑｜查看弹窗-->
    <el-dialog :title="bbRulesOuterVisibleTitle" :visible.sync="bbRulesOuterVisible" width="95%">

      <!--弹窗主要内容s-->
      <el-form :model="bbruleForm" v-loading="bbRulesOuterLoading" :rules="blindBoxrules" ref="bbruleFormRef" label-width="200px" label-position="right" class="demo-ruleForm">
        <el-form-item label="类型:" prop="blindBoxType" style="width:619px;">
        <el-radio-group @change="handleRadio" :disabled="addOrEditOrSeeStatus === 'see' || addOrEditOrSeeStatus === 'edit'" v-model="bbruleForm.blindBoxType">
          <el-radio :label="1">魔力盲盒专场</el-radio>
          <el-radio :label="2">Candy销毁专场</el-radio>
          <el-radio :label="3">魔力小盲盒</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--类型切换展示区域-s-->
      <div v-show="+bbruleForm.blindBoxType === 1">
        <el-form-item v-show="false" label="复投规则:" prop="repeatRule" style="width:619px;">
          <template slot="label">
            <span>
              <span style="padding-right:3px">复投规则</span>
              <el-tooltip placement="top">
                <div slot="content">
                  1. 下一期复投 ：是指 第 n 期 抢购成功后，自动将[第 n 期抢购额（现金部分） + 盲盒收益余额]的总额作为第 n +1 期的抢购额（现金部分）。<br>
                  2. 隔期复投 ：是指第 n 期 抢购成功后，自动将[第 n 期抢购额（现金部分） + 参与补贴]的总额作为第 n +2 期的抢购额（现金部分）。<br>
                  （1）针对于隔期复投，倒数第4期有复投至倒数第2期的，按倒数第4期抢购额计算,不计算获得的参与补贴<br>
                  （2）倒数第3期有复投至倒数第1期的， 按倒数第3期抢购额计算，不计算获得的参与补贴<br>
                  （3）例:假设 第1期投入100，获得预估参与补贴为5；复投至第3期为105 ；轮回期为4，在第3期（倒数第1期）抢购失败；此时退回的抢购额（现金部分）为100 ，不加5
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <span style="padding:0 3px">:</span>
            </span>
          </template>
          <el-radio-group :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.repeatRule">
            <el-radio :label="1">下一期复投</el-radio>
            <el-radio :label="2">隔期复投</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="每份管制分:" prop="singleControlScore" style="width:600px;">
          <template slot="label">
            <span>
              <span style="padding-right:3px">每份管制分</span>
              <el-tooltip placement="top">
                <div slot="content">
                  1.管制是指用户参与的盲盒在"已结束（抢购失败）"的状态下，已参与的期数-状态为 "已结束（未达标）“即称为管制 <br>
                  2.管制分 =  [每份的管制分] * 补管制状态下抢购份数
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <span style="padding:0 3px">:</span>
            </span>
          </template>
          <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.singleControlScore" :step="1" :min="0" :precision="2" controls-position="right" class="fl"></el-input-number><i class="bbunit fl">分</i>
        </el-form-item>
        <el-form-item label="每份可参与:" prop="singleUsableIntegral" style="width:600px;">
            <template slot="label">
            <span>
              <span style="padding-right:3px">每份可参与</span>
              <el-tooltip placement="top">
                <div slot="content">
                  1. 针对在管制期数内，抢购的份额进行计算<br>
                  2.可参与上限 = 累计[  期数状态为：已结束（未达标）的抢购份额* 每份可参与（Candy）]
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <span style="padding:0 3px">:</span>
            </span>
          </template>
            <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.singleUsableIntegral" :precision="2" :step="1" :min="0" controls-position="right" class="fl"></el-input-number><i class="bbunit fl">Candy</i>
          </el-form-item>
      </div>

        <div v-show="+bbruleForm.blindBoxType === 2">
          <p style="text-indent:196px;">温馨提示: Candy销毁专场使用的Candy受"转赠[须保持]逻辑"影响，</p>
          <p style="text-indent:196px;">需要荣耀值和手续费；但手续费不作分红统计。</p>
          <el-form-item label="达标盲盒实物卖了换钱每份单价:" prop="completedProductPrice" style="width:600px;">
            <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.completedProductPrice" :step="1" :min="0.01" :precision="2" controls-position="right" class="fl"></el-input-number><i class="bbunit fl">USDT</i>
          </el-form-item>
          <el-form-item label="未达标盲盒实物卖了换钱每份单价:" prop="overProductPrice" style="width:600px;">
            <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.overProductPrice" :step="1" :min="0.01" :precision="2" controls-position="right" class="fl"></el-input-number><i class="bbunit fl">USDT</i>
          </el-form-item>
        </div>

        <div v-show="+bbruleForm.blindBoxType === 3">
          <el-form-item label="每份补贴:" prop="singleSubsidy	" style="width:600px;">
            <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.singleSubsidy	" :step="1" :min="0" :precision="2" controls-position="right" class="fl"></el-input-number><i class="bbunit fl">USDT</i>
          </el-form-item>
        </div>
      <!--类型切换展示区域-d-->

      <div class="clearfix" style="margin-bottom:20px;padding:10px 10px 10px 0;background:#f2f2f2;border-radius:3px;">
        <span class="fl bbTitle">盲盒描述</span>
        <el-button class="fr" type="warning" size="mini" v-show="addOrEditOrSeeStatus === 'add' || addOrEditOrSeeStatus === 'edit'"  @click="refsGoodsClick">引用盲盒系列</el-button>
      </div>

      <el-form-item label="盲盒系列:" prop="name" style="width:619px;">
        <el-input :disabled="addOrEditOrSeeStatus === 'see'" v-model.trim="bbruleForm.name" autocomplete="off" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="盲盒描述:" prop="describe" style="width:619px;">
        <el-input type="textarea" :rows="3" show-word-limit :disabled="addOrEditOrSeeStatus === 'see'" v-model.trim="bbruleForm.describe" autocomplete="off" :maxlength="60"></el-input>
        <span style="color:#C0C4CC;font-size:12px;">（请不要输入特殊字符）</span>
      </el-form-item>
      <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="起初总份数:" prop="initTotalNum" style="width:300px;">
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" v-model="bbruleForm.initTotalNum" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="每份最小单位:" prop="payWay" :class="{ 'animate__animated animate__shakeTada':+bbruleForm.blindBoxType === 2 && itemNeedAnimate }" style="width:829px;">
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
            <el-radio-group :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" v-model="bbruleForm.payWay">
              <el-radio :label="2" :disabled="+bbruleForm.blindBoxType === 2">USDT+Candy</el-radio>
              <el-radio :label="1" :disabled="+bbruleForm.blindBoxType === 2 || +bbruleForm.blindBoxType === 3">USDT</el-radio>
              <el-radio :label="3" :disabled="+bbruleForm.blindBoxType === 3">Candy</el-radio>
            </el-radio-group>
          </div>
          <div class="abso bbradioBoxAbs1"><el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" size="medium" v-model="bbruleForm.bbunit2.amount" :precision="2" :step="1" :min="0.01" controls-position="right"></el-input-number><i class="bbunit">USDT</i><span style="padding:0 10px;">+</span><el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" size="medium" v-model="bbruleForm.bbunit2.integral" :precision="2" :step="1" :min="0.01" controls-position="right"></el-input-number><i class="bbunit">Candy</i></div>
          <div class="abso bbradioBoxAbs2"><el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" size="medium" v-model="bbruleForm.bbunit1.amount" :precision="2" :step="1" :min="0.01" controls-position="right"></el-input-number><i class="bbunit">USDT</i></div>
          <div class="abso bbradioBoxAbs2"><el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" size="medium" v-model="bbruleForm.bbunit3.integral" :precision="2" :step="1" :min="0.01" controls-position="right"></el-input-number><i class="bbunit">Candy</i></div>
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
          <qu-editor v-model="bbruleForm.detailUrl" :min-height="192" ref="quEditorRef" :is-handle-img="true"/>
        </div>
      </div>

      <div class="clearfix" style="margin-top:59px;margin-bottom:29px;padding:10px 10px 10px 0;background:#f2f2f2;border-radius:3px;">
        <span class="fl bbTitle">规则配置</span>
        <el-button type="primary" @click="jumpToTemplate" :disabled="addOrEditOrSeeStatus === 'see'" size="mini" style="margin-left:10px;" class="fr">赠送代币模板</el-button>
      </div>
      <el-form-item label="开始时间:" prop="startTime" style="width:300px;">
        <el-date-picker
          :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit"
          v-model="bbruleForm.startTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="定时结束:" class="clearfix rela">
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" class="mockSlotStyle customW juforDays fl thisW" :controls="false" :precision="0" v-model="bbruleForm.timedEndSetting.day" controls-position="right" @change="handleChange" :min="0" :max="300" @blur="((ev)=>{handleBlur(ev, 'd')})"></el-input-number>
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" class="mockSlotStyle customW HounrSet fl thisW" :controls="false" :precision="0" v-model="bbruleForm.timedEndSetting.hour" controls-position="right" @change="handleChange" :min="0" :max="23" @blur="((ev)=>{handleBlur(ev, 'h')})"></el-input-number>
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" class="mockSlotStyle customW minuteSet fl thisW" :controls="false" :precision="0" v-model="bbruleForm.timedEndSetting.min" controls-position="right" @change="handleChange" :min="0" :max="59" @blur="((ev)=>{handleBlur(ev, 'm')})"></el-input-number>
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" class="mockSlotStyle customW secondSet fl thisW" :controls="false" :precision="0" v-model="bbruleForm.timedEndSetting.sec" controls-position="right" @change="handleChange" :min="0" :max="59" @blur="((ev)=>{handleBlur(ev, 's')})"></el-input-number>
      </el-form-item>

      <el-form-item label="最小抢购份数:" prop="minBuyNum" style="width:300px;">
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.minBuyNum" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="最大抢购份数:" prop="maxBuyNum" style="width:409px;">
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.maxBuyNum" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
      </el-form-item>
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
      <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="轮回期:" prop="reborn" style="width:700px;">
        <template slot="label">
          <span>
            <span style="padding-right:3px">轮回期</span>
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
        <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" v-model="bbruleForm.reborn" :step="1" :min="1" :max="10" step-strictly controls-position="right"></el-input-number>
        <el-button :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" :loading="rebornResultClickLoading" type="primary" size="small" @click="rebornResultClick" style="margin-left:10px;">确定</el-button>
      
      </el-form-item>

      <div v-show="+bbruleForm.blindBoxType !== 3" class="clearfix">
        <span class="fl" style="padding:15px 10px;display:block;">返还规则</span>
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
          <span style="color:#C0C4CC;padding-left:30px;">对于"Candy销毁专场"，只对配置"盲盒实物“生效，无论其他配置如何均不生效对于"魔力盲盒专场"，均按配置生效。</span>
      </div>
      <div v-show="+bbruleForm.blindBoxType !== 3" class="bbRebackRuleBox" style="width:calc(100% - 30px);margin-left:30px;max-height:300px;overflow-y:scroll;margin-bottom:19px;">
          <ul class="eachRuleLineboxUl" v-loading="rebornResultClickLoading">
            <li class="clearfix eachRuleLinebox" v-for="(item, index) in bbruleForm.returnDetails" :key="index">
              <span class="fl"><span style="color:red;">*</span>倒数第{{index+1}}期返还:</span>
              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl" v-model="item.giveAmountRate.give">抢购额(现金部分)</el-checkbox>
              <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit  || +bbruleForm.blindBoxType === 2" @blur="((ev)=>{handleBlurForthis(ev, index, 'giveAmountRate', 'amountRate')})" class="fl" v-model="item.giveAmountRate.amountRate" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number>
              <i class="fl bbunit">%</i>

              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2 || (index != 0 && +bbruleForm.blindBoxType === 1 && +bbruleForm.payWay === 2)" class="fl" v-model="item.giveIntegralRate.give">抢购额(Candy部分)</el-checkbox>
              <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2 || (index != 0 && +bbruleForm.blindBoxType === 1 && +bbruleForm.payWay === 2)" @blur="((ev)=>{handleBlurForthis(ev, index, 'giveIntegralRate', 'integralRate')})" class="fl" v-model="item.giveIntegralRate.integralRate" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number>
              <i class="fl bbunit">%</i>

              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" class="fl" v-model="item.giveProduct">盲盒实物</el-checkbox>

              <!-- <el-checkbox :disabled="addOrEditOrSeeStatus === 'see'" class="fl" v-model="item.taskTicket.give">赠送游戏奖励券</el-checkbox> -->
              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl" v-model="item.taskTicket.give"></el-checkbox>
              <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" @blur="((ev)=>{handleBlurForthis(ev, index, 'taskTicket', 'num')})" class="fl" v-model="item.taskTicket.num" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number>
              <el-select :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl gameCouponsStyle" v-model="item.taskTicket.id" placeholder="请选择" size="mini" style="margin-left:6px;">
                <el-option
                  v-for="item in gameCouponsArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

              <!-- <el-checkbox :disabled="addOrEditOrSeeStatus === 'see'" class="fl" v-model="item.giveVip.give">赠送游戏奖励券</el-checkbox> -->
              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl" v-model="item.giveVip.give"></el-checkbox>
              <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" @blur="((ev)=>{handleBlurForthis(ev, index, 'giveVip', 'num')})" class="fl" v-model="item.giveVip.num" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number>
              <el-select :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl gameCouponsStyle" v-model="item.giveVip.id" placeholder="请选择" size="mini" style="margin-left:6px;">
                <el-option
                  v-for="item in gameCouponsArrGive"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl" v-model="item.lotteryTicket.give">体彩奖码</el-checkbox>
              <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" @blur="((ev)=>{handleBlurForthis(ev, index, 'lotteryTicket', 'num')})" class="fl" v-model="item.lotteryTicket.num" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number>
              <i class="fl bbunit">注</i>

              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl" v-model="item.giveContributionValue.give">荣耀值</el-checkbox>
              <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" @blur="((ev)=>{handleBlurForthis(ev, index, 'giveContributionValue', 'value')})" class="fl" v-model="item.giveContributionValue.value" :step="1" :min="0.000001" :precision="6" controls-position="right" size="mini" style="width:100px!important;"></el-input-number>
              
              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl" v-model="item.giveLockPizza.give">Pizza</el-checkbox>
              <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" @blur="((ev)=>{handleBlurForthis(ev, index, 'giveLockPizza', 'value')})" class="fl" v-model="item.giveLockPizza.value" :step="1" :min="0" :max="1000000" :precision="6" controls-position="right" size="mini" style="width:100px!important;"></el-input-number>

              <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl" v-model="item.giveCoin.give">赠送代币</el-checkbox>
              <el-select :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl gameCouponsStyle" v-model="item.giveCoin.id" placeholder="请选择" size="mini" style="margin-left:6px;">
                <el-option
                  v-for="item in daiCoinArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

            </li>
          </ul>
        </div>

        <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="下一期总份额比当期总份额多增长:" prop="nextGrowthRate" style="width:439px;">
          <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.nextGrowthRate" :step="1" :min="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">%</i>
        </el-form-item>

        <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="下一期开放方式:" prop="nextPublicityType">
          <template slot="label">
          <span>
            <span style="padding-right:3px">下一期开放方式</span>
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
          <el-radio-group :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" v-model="bbruleForm.nextPublicityType" class="nextAnnounceWayBox clearfix rela">
            <el-radio :label="2">手动开放 （只有手动提示开放后，才在APP端显示）</el-radio>
            <el-radio :label="1">自动开放（当期结束，下一期即开始）距开始:</el-radio>
          </el-radio-group>
          <div class="abs bbinnerBox" style="top:39px;left:263px;">
            <el-input-number :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" v-model="bbruleForm.autoPublicityDelayMin" :step="1" :min="1" step-strictly controls-position="right" size="mini"></el-input-number><i class="bbunit">分</i>
          </div>
        </el-form-item>

        <el-form-item v-show="+bbruleForm.nextPublicityType === 1" label="当天(自动开放)期数上限:" prop="autoPublicityLimit" style="width:600px;">
          <template slot="label">
            <span>
              <span style="padding-right:3px">当天(自动开放)期数上限</span>
              <el-tooltip placement="top">
                <div slot="content">
                  1. 统计"自动开放“期数，<br>
                  （1）如果下架，自动开放2期后，将"自动开放" 下架后改为"手动开放" <br>
                  （3期） ，再调整为 “自动开放” ，则从0 期开始统计"自动开放“
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <span style="padding:0 3px">:</span>
            </span>
          </template>
          <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.autoPublicityLimit" :step="1" :min="1" step-strictly controls-position="right" class="fl"></el-input-number><i class="fl" style="padding-left:5px;font-style:normal;">期</i>
        </el-form-item>
        <el-form-item v-show="+bbruleForm.nextPublicityType === 1" label="次日开放时间:" prop="tomorrowPublicityTimeStr" style="width:400px;">
           <el-time-picker
            :disabled="addOrEditOrSeeStatus === 'see'"
            v-model="bbruleForm.tomorrowPublicityTimeStr"
            format="HH:mm:ss"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            placeholder="">
          </el-time-picker>
        </el-form-item>

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
        <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="机器人抢购份数占比:" prop="robotShareRate" style="width:800px;">
          <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.robotShareRate.startNum" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">%</i><span style="padding:0 10px;">-</span>
          <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.robotShareRate.endNum" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">%</i>
        </el-form-item>
        <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="机器人介入期数:" prop="robotJoinPeriod" style="width:439px;">
          <template slot="label">
          <span>
            <span style="padding-right:3px">机器人介入期数</span>
            <el-tooltip placement="top">
              <div slot="content">
                机器人介入份数占总份数的占比 ，在某个范围随机
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <span style="padding:0 3px">:</span>
          </span>
        </template>
          <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.robotJoinPeriod" :step="1" :max="10000" step-strictly controls-position="right"></el-input-number><i class="bbunit">期</i>
        </el-form-item>
        <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="最新2期同时展示于APP端的时间:" prop="latelyShowMin" style="width:439px;">
          <template slot="label">
          <span>
            <span style="padding-right:3px">最新2期同时展示于APP端的时间</span>
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
          <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.latelyShowMin" :step="1" step-strictly controls-position="right"></el-input-number><i class="bbunit">分</i>
        </el-form-item>

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

        <el-form-item label="排序:" prop="sort" style="width:400px;">
          <el-input-number :disabled="addOrEditOrSeeStatus === 'see'" v-model="bbruleForm.sort" :step="1" :min="1" step-strictly controls-position="right"></el-input-number>
        </el-form-item>

        <el-form-item v-show="+bbruleForm.blindBoxType !== 3" label="已结束（达标）赠送奖励:" style="width:800px;">

          <template slot="label">
            <span>
              <span style="padding-right:3px">已结束（达标）赠送奖励</span>
              <el-tooltip placement="top">
                <div slot="content">
                  1. 针对  "已结束（达标）"的期数，对于赠送规则的配置
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <span style="padding:0 3px">:</span>
            </span>
          </template>
          <!--1-->
          <div class="clearfix" style="margin-bottom:10px;">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveAmountRate.give" class="fl">抢购额（现金部分）</el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'giveAmountRate', 'amountRate')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveAmountRate.amountRate" :step="1" :min="1" step-strictly controls-position="right" class="fl"></el-input-number><i class="fl" style="padding-left:5px;">%</i>
            <span class="fl">（包括“实付现金”和“Candy抵扣”）</span>
          </div>

          <!--2-->
          <div class="clearfix">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveIntegralRate.give" class="fl">抢购额（Candy部分）</el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'giveIntegralRate', 'integralRate')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveIntegralRate.integralRate" :step="1" :min="1" step-strictly controls-position="right" class="fl"></el-input-number><i class="fl" style="padding-left:5px;">%</i>
          </div>

          <!--3-->
          <div class="clearfix">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" v-model="bbruleForm.standardAward.giveProduct" class="fl">盲盒实物</el-checkbox>
          </div>
          <!--4-->
          <div class="clearfix">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveSubsidy.give" class="fl" style="margin-right:10px;">参与补贴</el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'giveSubsidy', 'value')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveSubsidy.value" :step="1" :min="0" step-strictly controls-position="right" class="fl"></el-input-number><i class="fl" style="padding-left:5px;">‱</i>
          </div>
          <!--5-->
          <div class="clearfix" style="margin-bottom:10px;margin-top:10px;">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveBondIncome.give" class="fl" style="margin-right:10px;">持券收益</el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'giveBondIncome', 'value')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveBondIncome.value" :step="1" :min="0" step-strictly controls-position="right" class="fl"></el-input-number><i class="fl" style="padding-left:5px;">‱</i>
          </div>
          <!--6-->
          <div class="clearfix">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveServiceIncome.give" class="fl" style="margin-right:10px;">服务商收益</el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'giveServiceIncome', 'value')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveServiceIncome.value" :step="1" :min="0" step-strictly controls-position="right" class="fl"></el-input-number><i class="fl" style="padding-left:5px;">‱</i>
          </div>
          <!--7-->
          <div class="clearfix">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit" v-model="bbruleForm.standardAward.platformCommission" class="fl">平台分佣</el-checkbox>
          </div>
          <!--8-->
          <div class="clearfix" style="margin-bottom:10px;">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.taskTicket.give" class="fl" style="margin-right:10px;"></el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'taskTicket', 'num')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.taskTicket.num" :step="1" :min="1" step-strictly controls-position="right" class="fl"></el-input-number>
            <el-select :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl gameCouponsStyle" v-model="bbruleForm.standardAward.taskTicket.id" placeholder="请选择" size="mini" style="margin-left:6px;">
              <el-option
                v-for="item in gameCouponsArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <!--9-->
          <div class="clearfix">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveVip.give" class="fl" style="margin-right:10px;"></el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'giveVip', 'num')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveVip.num" :step="1" :min="1" step-strictly controls-position="right" class="fl"></el-input-number>
            <el-select :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl gameCouponsStyle" v-model="bbruleForm.standardAward.giveVip.id" placeholder="请选择" size="mini" style="margin-left:6px;">
              <el-option
                v-for="item in gameCouponsArrGive"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!--10-->
          <div class="clearfix" style="margin-top:10px;">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveContributionValue.give" class="fl">荣耀值</el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'giveContributionValue', 'value')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveContributionValue.value" :step="1" :min="1" :precision="6" controls-position="right" class="fl" style="margin-left:10px;"></el-input-number>
          </div>
          <!--11-->
          <div class="clearfix" style="margin-top:10px;">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveLockPizza.give" class="fl" style="padding-right:10px;">Pizza</el-checkbox>
            <el-input-number @blur="((ev)=>{handleBlurForthisNew(ev, 'giveLockPizza', 'value')})" :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveLockPizza.value" :step="1" :min="0" :max="1000000" :precision="6" controls-position="right" class="fl"></el-input-number>
            <span class="fl" style="font-size:12px;">（说明：可以输入小数，默认为 0，精度为 6，最大1000000）</span>
          </div>
          <!--12-->
          <div class="clearfix" style="margin-top:10px;">
            <el-checkbox :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" v-model="bbruleForm.standardAward.giveCoin.give" class="fl" style="padding-right:10px;">赠送代币</el-checkbox>
            <el-select :disabled="addOrEditOrSeeStatus === 'see' || !curEditOrAdd_Type.fullEdit || +bbruleForm.blindBoxType === 2" class="fl gameCouponsStyle" v-model="bbruleForm.standardAward.giveCoin.id" placeholder="请选择" size="mini" style="margin-left:6px;">
              <el-option
                v-for="item in daiCoinArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

          </div>
        </el-form-item>

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

      <!--盲盒：引用盲盒系列-模版-->
      <el-dialog
        width="69%"
        title="引用盲盒"
        :visible.sync="refsGoodsVisible"
        show-close
        append-to-body>

        <el-table v-loading="loading" highlight-current-row :data="refsGoodsData" ref="singleTable" @current-change="handleCurrentChange" class="myJewelTableCustom">

          <el-table-column property="id" label="编号" align="left">
            <template scope="scope">
              <i class="el-icon-success" v-if="scope.row.id == clickRowData.productTemplateId"></i>
              <span style="margin-left:30px;">{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column property="name" label="盲盒系列"></el-table-column>
          <el-table-column property="describe" label="盲盒实物"></el-table-column>
          <el-table-column property="describe" label="盲盒描述"></el-table-column>
          <el-table-column property="initTotalNum" label="起始总份数"></el-table-column>
          <el-table-column property="amount" label="每份最小单位（USDT）"></el-table-column>
          <el-table-column property="integral" label="每份最小单位（Candy）"></el-table-column>
          <el-table-column property="singleCost" label="每份预估成本"></el-table-column>
          <el-table-column prop="jfdk" label="Candy抵扣"></el-table-column>
          </el-table>
        <div class="clearfix">
          <el-pagination
          style="padding-top:20px;float:left;"
          @current-change="searchRefGoods"
          :page-sizes="[10, 20, 30]"
          @size-change="handleSizeChange"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
          </el-pagination>
          <el-button type="primary" style="margin-top:20px;float:right;" :loading="loadingBlindBoxTemplateRefs" @click="handleCurrentChangeSave">确定</el-button>
        </div>

      </el-dialog>
      <!--嵌套Dialog-d-->


      <div slot="footer" class="dialog-footer">
         <el-button @click="bbRulesOuterVisible = false">{{addOrEditOrSeeStatus === 'see' ? '确 定' : '取 消'}}</el-button>
        <el-button v-show="addOrEditOrSeeStatus !== 'see'" type="primary" :loading="sumbitLoading" @click="saveOuterDialog('bbruleFormRef')">提 交</el-button>
      </div>

    </el-dialog>

    <!--修改排序、上下架、删除弹窗-->
    <el-dialog
    title="下架"
    :visible.sync="dialogVisibleDown"
    class="dialogVisibleDownStyle"
    width="49%">
    <span style="font-size:15px;">确定要下架此系列魔力盲盒系列？</span>
    <p style="padding:12px 0;font-size:14px;">请选择下架后，当前期状态的变动</p>
    <el-radio-group v-model="downState">
      <el-radio :label="1">下架，保持当前状态不变，APP端展示<br><span class="tips">(需要及时上架)</span></el-radio><br>
      <el-radio :label="2">下架，当期抢购失败，不在APP端显示<br><span class="tips">（只针对"进行中"的状态）</span></el-radio><br>
      <el-radio :label="3">下架，保持状态不变，不在APP端显示<br><span class="tips">（对于"进行中"  " 已结束（未达标）"，需及时上架，对于"已结束（抢购失败）直接下架，没有"上架"入口"）</span></el-radio>
    </el-radio-group>
    <p style="color:red;">
      *下架后，编辑再重新上架,变更后的内容，从下一期开始起作用
    </p>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleDown = false">取 消</el-button>
      <el-button :disabled="downState === '' || downState === undefined" type="primary" @click="downStoreClickRun">确 定</el-button>
    </span>
  </el-dialog>



    <!--增加销量弹窗-->
    <el-dialog
      title=""
      :visible.sync="dialogVisibleAddSale"
      width="45%">
      <div class="clearfix">
        <span class="fl" style="padding-top:9px;padding-right:10px;">虚拟销量</span>
        <el-input-number class="fl" v-model="saleNum1" :min="0" :step="1" step-strictly></el-input-number>
        <span class="fl" style="padding-top:9px;padding-right:10px;padding-left:10px;">-</span>
        <el-input-number class="fl" v-model="saleNum2" :min="0" :step="1" step-strictly></el-input-number>
        <span class="fl" style="padding-top:9px;padding-left:10px;">份</span>
      </div>

      <p>
        注:<br><br>
        1、只能写正整数或0，最小为0;<br><br>
        2、以“小时”计算，每小时结束后，在新的节点加虚拟销量;<br><br>
        3、APP端显示 = 真实销量 + 虚拟销量<br><br>
        4、虚拟销量左右区间值不相等，则在区间范围内随机;<br><br>
        5、虚拟销量左右区间值相等且为0，则不使用虚拟销量;<br><br>
        6、虚拟销量左右区间值相等且不为0，则不使用随机值而使用固定值;<br>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddSale = false">取 消</el-button>
        <el-button type="primary" @click="saveSaleNumber">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import filterXSS from 'xss';
import {getCertificate as getCertificate_oss, upload as upload_oss} from '@/api/oss';
import { getCertificate, upload,  } from "@/api/system/userlist";
import { miniBlindBox_saleQuery, miniBlindBox_saleSet, blindBoxRulesDel, blindBoxUpShlef, blindBoxDownShlef, blindBoxSortAlter, blindBoxTemplateListPage, blindBoxRuleQueryReturn, blindBoxRulePagesQuery, blindBoxRuleAddCoupons, blindBoxRuleAddCouponsGive, blindBoxRuleAdd, blindBoxRuleEdit, gameDesk, gameRuleAdd, gameRuleUpdate, gameRuleStatusChange, gameRuleDel } from "@/api/games";
import { whalePeanSetQueryList } from "@/api/presents";
import {giveDaiCoinSelect_page} from '@/api/pointsMgmt/starTasks';
import {compareVersion, replaceUnitlPrefixStr} from '@/utils/index';
import _html from '@/utils/stHtml';
import {descHtml} from '@/api/goods/index';

  export default {
    name: 'blindBoxRules',
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
        // 2Candy销毁专场
        if (+this.bbruleForm.blindBoxType === 2) {
          if (+this.bbruleForm.payWay !== 3) {
            // 如果是Candy销毁专场，但支付方式不是3，则
            this.itemNeedAnimate = true
            setTimeout(() => {
              this.itemNeedAnimate = false
            }, 1000)
            this.$message.error('支付方式请选择Candy方式')
            return callback(new Error('支付方式请选择Candy方式'))
          } else {
            if (+this.bbruleForm.payWay === 3 && (this.bbruleForm.bbunit3.integral === undefined || this.bbruleForm.bbunit3.integral === null || this.bbruleForm.bbunit3.integral === '')) {
              this.itemNeedAnimate = true
              setTimeout(() => {
                this.itemNeedAnimate = false
              }, 1000)
              return callback(new Error('请输入Candy值'))
            } else {
              this.itemNeedAnimate = false
            }
          }
        } else { // 1魔力盲盒专场
          this.itemNeedAnimate = false
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
      var validateAutoPublicityLimit = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入当天"自动开放"期数上限'))
        }
        callback()
      }
      var validateLatelyShowMin = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          return callback(new Error('请输入最新2期同时展示于APP端的时间'))
        }
        callback()
      }
      var validateSingleUsableIntegral = (rule, value, callback) => {
        if (+this.bbruleForm.blindBoxType === 1 && (value === '' || value === undefined || value === null)) {
          return callback(new Error('请输入可参与Candy'))
        }
        callback()
      }
      var validateSingleControlScore = (rule, value, callback) => {
        if (+this.bbruleForm.blindBoxType === 1 && (value === '' || value === undefined || value === null)) {
          return callback(new Error('请输入每份管制分'))
        }
        callback()
      }
      var validateCompletedProductPrice = (rule, value, callback) => {
        if (+this.bbruleForm.blindBoxType === 2 && (value === '' || value === undefined || value === null)) {
          return callback(new Error('请输入达标盲盒实物卖了换钱每份单价'))
        }
        callback()
      }
      var validateOverProductPrice = (rule, value, callback) => {
        if (+this.bbruleForm.blindBoxType === 2 && (value === '' || value === undefined || value === null)) {
          return callback(new Error('请输入未达标盲盒实物卖了换钱每份单价'))
        }
        callback()
      }
      var validateSingleSubsidy	 = (rule, value, callback) => {
        if (+this.bbruleForm.blindBoxType === 3 && (value === '' || value === undefined || value === null)) {
          return callback(new Error('请输入每份补贴'))
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
        // 盲盒模版引用
        loadingBlindBoxTemplateRefs: false,
        blindBoxRefsTemplateOBJ: {},
        clickRowData: {},
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        refsGoodsVisible: false,
        refsGoodsData: [],
        // 盲盒
        rebornResultClickLoading: false,
        tableData: [],
        loading: false,
        queryParams: {
          code: '',
          name: '',
          describe: '',
          blindBoxType: ''
        },
        gameCouponsArr: [],
        gameCouponsArrGive: [],
        formLabelWidth: '139px',
        file: {},
        bbruleForm: {
          productTemplateId: '', // 引用盲盒系列带入字段-s
          productTemplateId_cachedVal: '',
          name: '',
          initTotalNum: 0,
          describe: '',
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
          deductSetting: {
            id: ''
          },
          appDisplayStyle: 1,
          detailUrl: '', // 富文本
          items: [], // 引用盲盒系列带入字段-d
          blindBoxType: 1,
          repeatRule: 1,
          singleControlScore: '',
          completedProductPrice: '',
          overProductPrice: '',
          singleSubsidy: '',
          returnDetails: [
            {
              giveAmountRate: {
                amountRate: 0,
                give: true
              },
              giveLockPizza: {
                value: 0,
                give: true
              },
              giveCoin: {
                give: true,
                id: null,
              },
              giveIntegralRate: {
                give: true,
                integralRate: 0
              },
              giveProduct: true,
              lotteryTicket: {
                give: true,
                num: 0
              },
              taskTicket: {
                num: 1,
                give: true,
                id: null
              },
              giveVip: {
                num: 1,
                give: true,
                id: null
              },
              giveContributionValue: {
                give: true,
                value: 0.000001
              },
            }
          ],
          startTime: new Date(),
          timedEndSetting: {
            day: 0,
            hour: 0,
            min: 0,
            sec: 1
          },
          minBuyNum: 0,
          maxBuyNum: 0,
          bbReptyRule: '',
          reborn: 4,
          nextPublicityType: 2,
          nextGrowthRate: '',
          autoPublicityDelayMin: '',
          relifeWay: '',
          relifeTime: 1,
          robotShareRate: {
            endNum: '',
            startNum: ''
          },
          robotJoinPeriod: 1,
          autoPublicityLimit: 1,
          tomorrowPublicityTimeStr: '',
          latelyShowMin: '',
          singleUsableIntegral: '',
          // bbBaseSalle: '',
          // bbonTargetLimit: '',
          // bbPrizesNum: '',
          // bbPrizesNumMounth: '',
          sort: '',
          standardAward: {
            // 现金部分抢购额
            giveAmountRate: {
              give: false,
              amountRate: ''
            },
            giveLockPizza: {
              give: false,
              value: 0,
            },
            giveCoin: {
              give: true,
              id: null,
            },
            // Candy部分抢购额
            giveIntegralRate: {
              give: false,
              integralRate: ''
            },
            // 盲盒实物
            giveProduct: false,
            // 参与补贴
            giveSubsidy: {
              give: false,
              value: 0,
            },
            // 持券收益
            giveBondIncome: {
              give: false,
              value: 0,
            },
            // 服务商收益
            giveServiceIncome: {
              give: false,
              value: 0,
            },
            // 平台分佣
            platformCommission: false,
            // 游戏奖励券
            taskTicket: {
              give: false,
              id: '',
              num: ''
            },
            giveVip: {
              give: false,
              id: '',
              num: ''
            },
            giveContributionValue: {
              give: false,
              value: 0.000001
            }
          },
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
            // { validator: validateRobotShareRate, trigger: 'blur' }
          ],
          robotJoinPeriod: [
            // { validator: validateRobotJoinPeriod, trigger: 'blur' }
          ],
          autoPublicityLimit: [
            // { validator: validateAutoPublicityLimit, trigger: 'blur' }
          ],
          latelyShowMin: [
            { validator: validateLatelyShowMin, trigger: 'blur' }
          ],
          singleUsableIntegral: [
            // { validator: validateSingleUsableIntegral, trigger: 'blur' }
          ],
          singleControlScore: [
            // { validator: validateSingleControlScore, trigger: 'blur' }
          ],
          completedProductPrice: [
            { validator: validateCompletedProductPrice, trigger: 'blur' }
          ],
          overProductPrice: [
            { validator: validateOverProductPrice, trigger: 'blur' }
          ],
          singleSubsidy	: [
            { validator: validateSingleSubsidy	, trigger: 'blur' }
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
        sumbitLoading: false,
        saveInnerDialogType: '',
        saveInnerModifiedKey: null,
        bbRulesOuterVisibleTitle: '',
        bbRulesOuterLoading: false,
        pageIndexList: 1,
        pageSizeList: 10,
        totalPageList: 0,
        loadingList: false,
        dialogVisibleDown: false,
        downState: '',
        blindBoxDownId: '',
        curEditOrAdd_Type: {},
        itemNeedAnimate: false,
        // 盲盒d
        saleNum1: 0,
        saleNum2: 0,
        dialogVisibleAddSale: false,
        curRowSaleId: null,
        daiCoinArr: [],
      }
    },
    created () {
      /**
       * Last vesion done
       * AT:12.15
       */
      this.getCertificateRun()
      this.whalePeanSetQueryListRun()
      giveDaiCoinSelect_page().then(response => {
        if (response.code == 200) {
          this.daiCoinArr = response.data.list
        } else {
          this.daiCoinArr = []
        }
      })
      this.search()
    },
    mounted () {
      this.blindBoxRuleAddCouponsRun()
      this.blindBoxRuleAddCouponsRunGive()
    },
    watch: {},
    methods: {
      // 盲盒模板引用-s
      refsGoodsClick () {
        this.refsGoodsVisible = true
        this.searchRefGoods(1)
      },
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      async handleCurrentChangeSave () {
        this.loadingBlindBoxTemplateRefs = true
        // ‘引用盲盒’勾选其中某一项后，回显
        this.bbruleForm.productTemplateId_cachedVal = this.blindBoxRefsTemplateOBJ.id
        this.bbruleForm.productTemplateId = this.bbruleForm.productTemplateId_cachedVal
        this.bbruleForm.name = this.blindBoxRefsTemplateOBJ.name
        this.bbruleForm.initTotalNum = this.blindBoxRefsTemplateOBJ.initTotalNum
        this.bbruleForm.describe = this.blindBoxRefsTemplateOBJ.describe
        this.bbruleForm.payWay = this.blindBoxRefsTemplateOBJ.payWay
        if (+this.blindBoxRefsTemplateOBJ.payWay === 1) {
          this.bbruleForm.bbunit1.amount = this.blindBoxRefsTemplateOBJ.amount
        } else if (+this.blindBoxRefsTemplateOBJ.payWay === 2) {
          this.bbruleForm.bbunit2.amount = this.blindBoxRefsTemplateOBJ.amount
          this.bbruleForm.bbunit2.integral = this.blindBoxRefsTemplateOBJ.integral
        } else if (+this.blindBoxRefsTemplateOBJ.payWay === 3) {
          this.bbruleForm.bbunit3.integral = this.blindBoxRefsTemplateOBJ.integral
        }
        this.bbruleForm.singleCost = this.blindBoxRefsTemplateOBJ.singleCost
        this.bbruleForm.deductSetting = {
          // id: this.blindBoxRefsTemplateOBJ.deductSetting.id || '' // payWay=3为Candy支付时，deductSetting后台会返回{}空对象，因此需要兼容
          id: +this.blindBoxRefsTemplateOBJ.payWay !== 3 ? (this.blindBoxRefsTemplateOBJ.deductSetting && this.blindBoxRefsTemplateOBJ.deductSetting.id ? this.blindBoxRefsTemplateOBJ.deductSetting.id : '') : '',
        }
        this.bbruleForm.appDisplayStyle = this.blindBoxRefsTemplateOBJ.appDisplayStyle

        let {top, bottom, start, end} = _html;
        let _descHtml
        try {
          _descHtml = await this.descHtmlReq(this.blindBoxRefsTemplateOBJ.detailUrl);
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
        this.bbruleForm.detailUrl = _descHtml
        this.bbruleForm.items = this.blindBoxRefsTemplateOBJ.items
        setTimeout(() => {
          this.loadingBlindBoxTemplateRefs = false
          this.refsGoodsVisible = false
        }, 500)
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
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.searchRefGoods()
      },
      handleSizeChangeList (val) {
        this.pageSizeList = val
        this.pageIndexList = 1
        this.search()
      },
      searchRefGoods (pgi) {
        if (pgi) this.pageIndex = pgi
        let _params = {
          describe: '',
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
        }
        this.loading = true
        blindBoxTemplateListPage(_params).then(response => {
          if (response.code === 200) {
            this.refsGoodsData = response.data.list.map(v => {
              let {deductSetting, ...a} = v
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
                deductSetting,
                jfdk,
                ...v
              }
            })
            this.totalPage = response.data.total
            this.loading = false
            /**
             * 引用商品的默认选中状态:
             * 0查看1新增2修改(查看时，不需要显示引用商品界面)
             */
            if (this.addOrEditOrSeeStatus === 'add') {
              this.setCurrent()
            } else if (this.addOrEditOrSeeStatus === 'edit') {
              this.setCurrent(this.refsGoodsData.find(v => v.id === this.clickRowData.productTemplateId))
            }
          } else {
            this.refsGoodsData = []
            this.totalPage = 0
            this.pageSize = 10
            this.loading = false
            this.$message.error(response.message)
          }
        }).catch(e => {
          this.loading = false
        })
      },
      handleCurrentChange (val) {
        if (val) {
          this.blindBoxRefsTemplateOBJ = val
        }
      },
      // 盲盒模板引用-d
      search (pgi) {
        if (pgi) this.pageIndexList = pgi
        let _params = {
          pageSize: this.pageSizeList,
          currentPage: this.pageIndexList,
          ...this.queryParams
        }
        this.loadingList = true
        blindBoxRulePagesQuery(_params).then(response => {
          if (+response.code === 200) {
            this.tableData = response.data.list.map(v => {
              let {deductSetting, ...a} = v
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
                deductSetting,
                jfdk,
                ...v
              }
            })
            this.totalPageList = response.data.total
          } else {
            this.tableData = []
            this.totalPageList = 0
            this.pageSizeList = 10
          }
          this.loadingList = false
        }).catch(e => {
          this.loadingList = false
        })
      },
      /**
       * 处理：返还规则配置中：el-select组件类型下拉类型的数据，如果
       * 接口返回的是null或空，则默认处理成：填充为1或者选中第一项
       * Tips：属于el-input-number组件的类型，此处不需要额外处理，
       * 因为已经针对该组件特殊处理优化过该问题
       */
      handleSelectDefaultChoosedFirst () {
        this.bbruleForm.returnDetails = (this.bbruleForm.returnDetails || []).map(v => {
          let {taskTicket, giveVip, giveCoin, ...a} = v
          return {
            taskTicket: {
              give: taskTicket.give,
              num: taskTicket.num, // -> 无需兼容优化处理
              id: taskTicket.id || (this.gameCouponsArr.length > 0 ?  this.gameCouponsArr[0].value : '')
            },
            giveVip: {
              give: giveVip.give,
              num: giveVip.num, // -> 无需兼容优化处理
              id: giveVip.id || (this.gameCouponsArrGive.length > 0 ? this.gameCouponsArrGive[0].value : '')
            },
            giveCoin: {
              give: giveCoin.give,
              id: giveCoin.id || (this.daiCoinArr.length > 0 ? this.daiCoinArr[0].value : '')
            },
            ...a
          }
        })
      },
      rebornResultClick () {
        this.rebornResultClickLoading = true
        blindBoxRuleQueryReturn({
          count: this.bbruleForm.reborn,
          type: this.bbruleForm.blindBoxType || 1
        }).then(response => {
          this.rebornResultClickLoading = false
          if (+response.code === 200) {
            this.bbruleForm.returnDetails = response.data || []
            // 新增|编辑的时候，默认选中第一个下拉项项
            this.handleSelectDefaultChoosedFirst()
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
      // [give:赠送VIP权益]下拉数据
      blindBoxRuleAddCouponsRunGive () {
        blindBoxRuleAddCouponsGive({
          statusType: 1,
          itemType: 3 // 赠送VIP权益
        }).then(response => {
          if (+response.code === 200) {
            this.gameCouponsArrGive = (response.data.list || []).map(v => {
              let {id, signTime, signUnit} = v
              let _unitDes = ''
              switch (signUnit)
              {
                case 'd':
                  _unitDes = '天'
                  break;
                case 'M':
                  _unitDes = '月'
                  break;
                case 'y':
                  _unitDes = '年'
                  break;
              }
              return {
                value: id,
                label: signTime + _unitDes
              }
            })
          } else {
            this.gameCouponsArrGive = []
          }
        }).catch(e => {
          console.log(e)
        })
      },
      seeLogClick () {},
      async addOrEditClick (type, row) {
        this.addOrEditOrSeeStatus = type
        this.bbRulesOuterVisible = true
        this.bbRulesOuterLoading = true
        this.curEditOrAdd_Type = {
          fullEdit: row ? row.fullEdit : '',
          type,
          id: row ? row.id : ''
        }
        if (type === 'add') {
          this.curEditOrAdd_Type.fullEdit = true
        }
        switch (type)
        {
          case 'add':
            this.bbRulesOuterVisibleTitle = '盲盒规则新增'
            break;
          case 'edit':
            this.bbRulesOuterVisibleTitle = '盲盒规则编辑'
            break;
          case 'see':
            this.bbRulesOuterVisibleTitle = '盲盒规则查看'
            break;
        }
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
          this.clickRowData.productTemplateId = ''
          this.bbruleForm = {
            productTemplateId: '', // 引用盲盒系列带入字段-s
            productTemplateId_cachedVal: '',
            name: '',
            initTotalNum: 0,
            describe: '',
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
            deductSetting: {
              id: ''
            },
            appDisplayStyle: 1,
            detailUrl: '', // 富文本
            items: [], // 引用盲盒系列带入字段-d
            blindBoxType: 1,
            repeatRule: 1,
            singleControlScore: '',
            completedProductPrice: '',
            overProductPrice: '',
            singleSubsidy: '',
            returnDetails: [
              {
                giveAmountRate: {
                  amountRate: 0,
                  give: true
                },
                giveLockPizza: {
                  value: 0,
                  give: true
                },
                giveCoin: {
                  give: true,
                  id: null,
                },
                giveIntegralRate: {
                  give: true,
                  integralRate: 0
                },
                giveProduct: true,
                lotteryTicket: {
                  give: true,
                  num: 0
                },
                taskTicket: {
                  num: 1,
                  give: true,
                  id: null
                },
                giveVip: {
                  num: 1,
                  give: true,
                  id: null
                },
                giveContributionValue: {
                  give: true,
                  value: 0.000001
                },
              }
            ],
            startTime: new Date(),
            timedEndSetting: {
              day: 0,
              hour: 0,
              min: 0,
              sec: 1
            },
            minBuyNum: 0,
            maxBuyNum: 0,
            bbReptyRule: '',
            reborn: 4,
            nextPublicityType: 2,
            nextGrowthRate: '',
            autoPublicityDelayMin: '',
            relifeWay: '',
            relifeTime: 1,
            robotShareRate: {
              endNum: undefined, // -> 这里null、空都可以，只是设置undefined的时候，默认是不显示数据的效果而已
              startNum: undefined
            },
            robotJoinPeriod: undefined,
            autoPublicityLimit: undefined,
            tomorrowPublicityTimeStr: '',
            latelyShowMin: '',
            singleUsableIntegral: '',
            // bbBaseSalle: '',
            // bbonTargetLimit: '',
            // bbPrizesNum: '',
            // bbPrizesNumMounth: '',
            sort: '',
            standardAward: {
              // 现金部分抢购额
              giveAmountRate: {
                give: false,
                amountRate: 1
              },
              giveLockPizza: {
                value: 0,
                give: false
              },
              giveCoin: {
                give: false,
                id: this.daiCoinArr.length > 0 ? this.daiCoinArr[0].value : '',
              },
              // Candy部分抢购额
              giveIntegralRate: {
                give: false,
                integralRate: 1
              },
              // 盲盒实物
              giveProduct: false,
              // 参与补贴
              giveSubsidy: {
                give: false,
                value: 0,
              },
              // 持券收益
              giveBondIncome: {
                give: false,
                value: 0,
              },
              // 服务商收益
              giveServiceIncome: {
                give: false,
                value: 0,
              },
              // 平台分佣
              platformCommission: false,
              // 游戏奖励券
              taskTicket: {
                give: false,
                id: this.gameCouponsArr.length > 0 ? this.gameCouponsArr[0].value : '',
                num: 1
              },
              giveVip: {
                give: false,
                id: this.gameCouponsArrGive.length > 0 ? this.gameCouponsArrGive[0].value : '',
                num: 1
              },
              giveContributionValue: {
                give: false,
                value: 0.000001
              }
            }
          },
          this.rebornResultClick()
        } else {
          row && (this.clickRowData = Object.assign({}, row))
          let {top, bottom,start,end} = _html;
          let _descHtml
          try {
            _descHtml = await this.descHtmlReq(this.clickRowData.detailUrl);
            _descHtml = _descHtml.replace(top, '').replace(bottom, '');
            let subStart = _descHtml.indexOf(start)
            let subEnd = _descHtml.lastIndexOf(end);
            if(subStart != -1 && subEnd != -1){
              _descHtml = _descHtml.substring(subStart+start.length,subEnd)
            }
          } catch(e) {
            console.log(e, '富文本内容获取超时')
            _descHtml = ''
          }
          //防止giveLockPizza不存在，导致报错
          this.clickRowData.returnDetails && this.clickRowData.returnDetails.forEach((item)=>{
            if(item.giveLockPizza == null || item.giveLockPizza == undefined){
              item.giveLockPizza = {
                "give": false,
                "value":0,
              }
            }
            if(item.giveCoin == null || item.giveCoin == undefined){
              item.giveCoin = {
                "give": false,
                "id": this.daiCoinArr.length > 0 ? this.daiCoinArr[0].value : ''
              }
            }
          })
          this.bbruleForm = {
            productTemplateId: this.clickRowData.productTemplateId, // 引用盲盒系列带入字段-s
            productTemplateId_cachedVal: this.clickRowData.productTemplateId,
            name: this.clickRowData.name,
            initTotalNum: this.clickRowData.initTotalNum,
            describe: this.clickRowData.describe,
            payWay: this.clickRowData.payWay,
            bbunit1: {
              amount: +this.clickRowData.payWay === 1 ? this.clickRowData.amount : ''
            },
            bbunit2: {
              amount: +this.clickRowData.payWay === 2 ? this.clickRowData.amount : '',
              integral: +this.clickRowData.payWay === 2 ? this.clickRowData.integral : ''
            },
            bbunit3: {
              integral: +this.clickRowData.payWay === 3 ? this.clickRowData.integral : ''
            },
            singleCost: this.clickRowData.singleCost,
            deductSetting: {
              // payWay=3为Candy支付时，deductSetting后台会返回{}空对象，因此需要兼容
              id: +this.clickRowData.payWay !== 3 ? (this.clickRowData.deductSetting && this.clickRowData.deductSetting.id ? this.clickRowData.deductSetting.id : '') : '',
            },
            appDisplayStyle: this.clickRowData.appDisplayStyle,
            detailUrl: _descHtml, // 富文本
            items: this.clickRowData.items, // 引用盲盒系列带入字段-d
            blindBoxType: this.clickRowData.blindBoxType,
            repeatRule: this.clickRowData.repeatRule,
            singleControlScore: this.clickRowData.singleControlScore === null ? undefined : this.clickRowData.singleControlScore,
            completedProductPrice: this.clickRowData.completedProductPrice,
            overProductPrice: this.clickRowData.overProductPrice,
            singleSubsidy: this.clickRowData.singleSubsidy,
            returnDetails: this.clickRowData.returnDetails,
            startTime: this.clickRowData.startTime,
            timedEndSetting: {
              day: this.clickRowData.timedEndSetting.day,
              hour: this.clickRowData.timedEndSetting.hour,
              min: this.clickRowData.timedEndSetting.min,
              sec: this.clickRowData.timedEndSetting.sec,
            },
            minBuyNum: this.clickRowData.minBuyNum,
            maxBuyNum: this.clickRowData.maxBuyNum,
            bbReptyRule: this.clickRowData.bbReptyRule,
            reborn: this.clickRowData.reborn,
            nextPublicityType: this.clickRowData.nextPublicityType,
            nextGrowthRate: this.clickRowData.nextGrowthRate,
            autoPublicityDelayMin: this.clickRowData.autoPublicityDelayMin,
            relifeWay: this.clickRowData.relifeWay,
            relifeTime: this.clickRowData.relifeTime,
            robotShareRate: {
              endNum: this.clickRowData.robotShareRate.endNum === null ? undefined : this.clickRowData.robotShareRate.endNum,
              startNum: this.clickRowData.robotShareRate.startNum === null ? undefined : this.clickRowData.robotShareRate.startNum,
            },
            robotJoinPeriod: this.clickRowData.robotJoinPeriod === null ? undefined : this.clickRowData.robotJoinPeriod,
            autoPublicityLimit: this.clickRowData.autoPublicityLimit === null ? undefined : this.clickRowData.autoPublicityLimit,
            latelyShowMin: this.clickRowData.latelyShowMin,
            singleUsableIntegral: this.clickRowData.singleUsableIntegral === null ? undefined : this.clickRowData.singleUsableIntegral,
            // bbBaseSalle: '',
            // bbonTargetLimit: '',
            // bbPrizesNum: '',
            // bbPrizesNumMounth: '',
            sort: this.clickRowData.sort,
            standardAward: {
              // 现金部分抢购额
              giveAmountRate: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveAmountRate ? this.clickRowData.standardAward.giveAmountRate.give : false,
                amountRate: this.clickRowData.standardAward && this.clickRowData.standardAward.giveAmountRate ? this.clickRowData.standardAward.giveAmountRate.amountRate : 1
              },
              // Pizza
              giveLockPizza: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveLockPizza ? this.clickRowData.standardAward.giveLockPizza.give : false,
                value: this.clickRowData.standardAward && this.clickRowData.standardAward.giveLockPizza ? this.clickRowData.standardAward.giveLockPizza.value : 0
              },
              // 赠送代币
              giveCoin: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveCoin ? this.clickRowData.standardAward.giveCoin.give : false,
                id: this.clickRowData.standardAward && this.clickRowData.standardAward.giveCoin ? this.clickRowData.standardAward.giveCoin.id : (this.daiCoinArr.length > 0 ? this.daiCoinArr[0].value : '')
              },
              // Candy部分抢购额
              giveIntegralRate: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveIntegralRate ? this.clickRowData.standardAward.giveIntegralRate.give : false,
                integralRate: this.clickRowData.standardAward && this.clickRowData.standardAward.giveIntegralRate ? this.clickRowData.standardAward.giveIntegralRate.integralRate : 1
              },
              // 盲盒实物
              giveProduct: this.clickRowData.standardAward ? this.clickRowData.standardAward.giveProduct : false,
              // 参与补贴
              giveSubsidy: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveSubsidy ? this.clickRowData.standardAward.giveSubsidy.give : false,
                value: this.clickRowData.standardAward && this.clickRowData.standardAward.giveSubsidy ? this.clickRowData.standardAward.giveSubsidy.value : 0,
              },
              // 持券收益
              giveBondIncome: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveBondIncome ? this.clickRowData.standardAward.giveBondIncome.give : false,
                value: this.clickRowData.standardAward && this.clickRowData.standardAward.giveBondIncome ? this.clickRowData.standardAward.giveBondIncome.value : 0,
              },
              // 服务商收益
              giveServiceIncome: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveServiceIncome ? this.clickRowData.standardAward.giveServiceIncome.give : false,
                value: this.clickRowData.standardAward && this.clickRowData.standardAward.giveServiceIncome ? this.clickRowData.standardAward.giveServiceIncome.value : 0,
              },
              // 平台分佣
              platformCommission: this.clickRowData.standardAward ? this.clickRowData.standardAward.platformCommission : false,
              // 游戏奖励券
              taskTicket: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.taskTicket ? this.clickRowData.standardAward.taskTicket.give : false,
                id: this.clickRowData.standardAward && this.clickRowData.standardAward.taskTicket ? this.clickRowData.standardAward.taskTicket.id : (this.gameCouponsArr.length > 0 ? this.gameCouponsArr[0].value : ''),
                num: this.clickRowData.standardAward && this.clickRowData.standardAward.taskTicket ? this.clickRowData.standardAward.taskTicket.num : 1,
              },
              giveVip: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveVip ? this.clickRowData.standardAward.giveVip.give : false,
                id: this.clickRowData.standardAward && this.clickRowData.standardAward.giveVip ? this.clickRowData.standardAward.giveVip.id : (this.gameCouponsArrGive.length > 0 ? this.gameCouponsArrGive[0].value : ''),
                num: this.clickRowData.standardAward && this.clickRowData.standardAward.giveVip ? this.clickRowData.standardAward.giveVip.num : 1,
              },
              giveContributionValue: {
                give: this.clickRowData.standardAward && this.clickRowData.standardAward.giveContributionValue ? this.clickRowData.standardAward.giveContributionValue.give : false,
                value: this.clickRowData.standardAward && this.clickRowData.standardAward.giveContributionValue ? this.clickRowData.standardAward.giveContributionValue.value : 0.000001
              }
            }
          }
          let _yy, _mth, _dd, _hh, _mm, _ss
          if (this.clickRowData.tomorrowPublicityTimeStr) {
            _yy = Number(new Date().getFullYear())
            _mth = Number(new Date().getMonth() + 1)
            _dd = Number(new Date().getDate())
            _hh = Number(this.clickRowData.tomorrowPublicityTimeStr.split(':')[0])
            _mm = Number(this.clickRowData.tomorrowPublicityTimeStr.split(':')[1])
            _ss = Number(this.clickRowData.tomorrowPublicityTimeStr.split(':')[2])
            console.log(_yy, _mth, _dd, _hh, _mm, _ss)
            this.bbruleForm.tomorrowPublicityTimeStr = new Date(_yy, _mth, _dd, _hh, _mm, _ss)
          } else {
            this.bbruleForm.tomorrowPublicityTimeStr = this.clickRowData.tomorrowPublicityTimeStr
          }
          this.handleSelectDefaultChoosedFirst()
          // this.rebornResultClick()
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
            console.log(response.data, 'esponse.data')
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
              let _flag = []
              _bbruleForm.returnDetails.forEach((vs, index) => {
                // 如果有任意一行中，每一个都没有勾选，则不行
                if (!vs['giveAmountRate'].give && !vs['giveLockPizza'].give && !vs['giveIntegralRate'].give && !vs['giveProduct'] && !vs['taskTicket'].give && !vs['giveVip'].give && !vs['lotteryTicket'].give && !vs['giveContributionValue'].give && !vs['giveCoin'].give) {
                  _flag.push('empty')
                }
              })
              if (+_bbruleForm.blindBoxType !== 3 && _flag.some(v => v === 'empty')) {
                this.$message.error('请填写完整返还规则')
                return false
              }
              if (+_bbruleForm.appDisplayStyle === 1 && _bbruleForm.items.length <= 0) {
                this.$message.error('盲盒实物至少添加1个')
                return false
              }
              if (this.bbruleForm.nextPublicityType == 1 && (this.bbruleForm.autoPublicityLimit == '' || this.bbruleForm.autoPublicityLimit == undefined)) {
                this.$message.error('请填写“当天(自动开放)期数上限”期数')
                return false
              }
              // 已结束（达标）赠送奖励项目如果一个都没有勾选,且fullEdit：true时候，则提示
              if (+_bbruleForm.blindBoxType !== 3 &&
                  this.curEditOrAdd_Type.fullEdit &&
                  !_bbruleForm.standardAward.giveAmountRate.give &&
                  !_bbruleForm.standardAward.giveLockPizza.give &&
                  !_bbruleForm.standardAward.giveCoin.give &&
                  !_bbruleForm.standardAward.giveIntegralRate.give &&
                  !_bbruleForm.standardAward.giveProduct &&
                  !_bbruleForm.standardAward.giveSubsidy.give &&
                  !_bbruleForm.standardAward.giveBondIncome.give &&
                  !_bbruleForm.standardAward.giveServiceIncome.give &&
                  !_bbruleForm.standardAward.platformCommission &&
                  !_bbruleForm.standardAward.taskTicket.give &&
                  !_bbruleForm.standardAward.giveVip.give &&
                  !_bbruleForm.standardAward.giveContributionValue.give) {
                this.$message.error('已结束（达标）赠送奖励至少添加1个')
                return false
              }
              // 当：下一期开放方式是：自动开放，且：a.当天(自动开放)期数上限和b.次日开放时间，如果a和b有一个是没有填写，且另一个又填写了，则不允许。(要么同时为空，要么都填写)
              if (+_bbruleForm.nextPublicityType === 1) {
                if ((!_bbruleForm.autoPublicityLimit && _bbruleForm.tomorrowPublicityTimeStr) || (_bbruleForm.autoPublicityLimit && !_bbruleForm.tomorrowPublicityTimeStr)) {
                  this.$message.error('请当天(自动开放)期数上限、次日开放时间填写完整')
                  return false
                }
              }
              if (_bbruleForm.tomorrowPublicityTimeStr) {
                // 提交上去的：次日开放时间，转成字符串
                _bbruleForm.tomorrowPublicityTimeStr = this.$dayjs(_bbruleForm.tomorrowPublicityTimeStr).format('HH:mm:ss')
              } else {
                _bbruleForm.tomorrowPublicityTimeStr = ''
              }
              // 根据类型：[魔力盲盒1｜Candy销毁2]来删除对应该删除的参数，因为不删除，后端会抛出错误！
              if (+_bbruleForm.blindBoxType === 1) {
                Reflect.deleteProperty(_bbruleForm, 'completedProductPrice')
                Reflect.deleteProperty(_bbruleForm, 'overProductPrice')
                Reflect.deleteProperty(_bbruleForm, 'singleSubsidy')
              } else if (+_bbruleForm.blindBoxType === 2) {
                Reflect.deleteProperty(_bbruleForm, 'singleControlScore')
                Reflect.deleteProperty(_bbruleForm, 'singleUsableIntegral')
                Reflect.deleteProperty(_bbruleForm, 'singleSubsidy')
              } else if (+_bbruleForm.blindBoxType === 3) {
                Reflect.deleteProperty(_bbruleForm, 'completedProductPrice')
                Reflect.deleteProperty(_bbruleForm, 'overProductPrice')
                Reflect.deleteProperty(_bbruleForm, 'singleControlScore')
                Reflect.deleteProperty(_bbruleForm, 'singleUsableIntegral')
              }
              if (+_bbruleForm.blindBoxType === 3 && +_bbruleForm.payWay !== 2) {
                this.$message.error('支付方式请选择Candy+现金！')
                return false
              }
              this.sumbitLoading = true
              let _api
              if (this.curEditOrAdd_Type.type === 'add') {
                _api = blindBoxRuleAdd
              } else {
                _api = blindBoxRuleEdit
                _bbruleForm.id = this.curEditOrAdd_Type.id
              }
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
      handleBlurForthisNew (ev, keyParent, keyChild) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') {
          ev.target.value = ev.target.ariaValueMin
          this.bbruleForm.standardAward[keyParent][keyChild] = ev.target.ariaValueMin
        }
      },
      handleChange(value) {
        this.$forceUpdate()
      },
      changeSortGameRule (row) {
        this.$prompt('请输入排序', '提示', {
          inputValue: row.sort,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(0|\+?[1-9][0-9]*)$/,
          inputErrorMessage: '请输入正确的排序'
        }).then(({ value }) => {
          blindBoxSortAlter({
            id: row.id,
            sort: value
          }).then(response => {
          if (+response.code === 200) {
            this.$message.success(response.message)
            this.search()
          } else {
            this.$message.error(response.message)
          }
        })
        }).catch(() => {})
      },
      upStoreClick (row) {
        this.$confirm('确认要执行此操作吗？', {
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          blindBoxUpShlef({
            id: row.id
          }).then(response => {
            if (+response.code === 200) this.search()
            this.$message.success(response.message)
          })
        }).catch((e) => {})
      },
      downStoreClick (row) {
        this.dialogVisibleDown = true
        this.downState = ''
        this.blindBoxDownId = row.id
      },
      downStoreClickRun () {
        blindBoxDownShlef({
          id: this.blindBoxDownId,
          state: this.downState
        }).then(response => {
          if (+response.code === 200) this.search()
          this.$message.success(response.message)
          this.dialogVisibleDown = false
        })
      },
      // 切换类型时候，处理的事件
      handleRadio (val) {
        if (+this.bbruleForm.blindBoxType === 2 && +this.bbruleForm.payWay !== 3) {
          this.itemNeedAnimate = true
          setTimeout(() => {
            this.itemNeedAnimate = false
          }, 1000)
        }
      },
      removeGameRule (row) {
        this.$confirm(`确认要执行此操作吗？`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          blindBoxRulesDel({
            id: row.id
          }).then((response) => {
            if (+response.code === 200) {
              this.$message({type: 'success', message: '操作成功'})
              this.search()
            } else {
              this.$message.error(response.message)
            }
          })
        }).catch((e) => {})
      },
      saveSaleNumber () {
        if (this.saleNum1 > this.saleNum2) return this.$message.error('虚拟销量左区间值应小于等于右区间值');
        miniBlindBox_saleSet({
          id: this.curRowSaleId,
          virtualInfo: {
            maxSales: this.saleNum2,
            minSales: this.saleNum1
          }
        }).then(response => {
          if (+response.code === 200 && response.data.result) {
            this.search(1)
            this.$message({type: 'success', message: '操作成功'})
            this.dialogVisibleAddSale = false
            this.saleNum1 = 0
            this.saleNum2 = 0
          }
        })
      },
      addSaleNumber (row) {
        this.dialogVisibleAddSale = true
        this.curRowSaleId = row.id
        miniBlindBox_saleQuery({
          id: row.id,
        }).then(({code, data}) => {
          if (code === 200) {
            this.saleNum1 = data?.minSales || 0;
            this.saleNum2 = data?.maxSales || 0;
          }
        })
      },
      jumpToTemplate () {
        this.$router.push({ path: '/setting/giveDaiCoinTemp', query: {}})
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
  .eachRuleLineboxUl{
    overflow-x: scroll;
    min-width:2100px;
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
.dialogVisibleDownStyle label{
  margin-bottom:10px;
}
.dialogVisibleDownStyle .tips{
  margin-left:18px;
  font-size: 12px;
  margin-top:10px;
}
@-webkit-keyframes shakeTada {
  0% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1)
  }

  10%,20% {
    -webkit-transform: scale3d(.9,.9,.9) rotate(-3deg);
    transform: scale3d(.9,.9,.9) rotate(-3deg)
  }

  30%,50%,70%,90% {
    -webkit-transform: scale3d(1.1,1.1,1.1) rotate(3deg);
    transform: scale3d(1.1,1.1,1.1) rotate(3deg)
  }

  40%,60%,80% {
    -webkit-transform: scale3d(1.1,1.1,1.1) rotate(-3deg);
    transform: scale3d(1.1,1.1,1.1) rotate(-3deg)
  }

  to {
    -webkit-transform: scaleX(1);
    transform: scaleX(1)
  }
}

@keyframes shakeTada {
  0% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1)
  }

  10%,20% {
    -webkit-transform: scale3d(.9,.9,.9) rotate(-3deg);
    transform: scale3d(.9,.9,.9) rotate(-3deg)
  }

  30%,50%,70%,90% {
    -webkit-transform: scale3d(1.1,1.1,1.1) rotate(3deg);
    transform: scale3d(1.1,1.1,1.1) rotate(3deg)
  }

  40%,60%,80% {
    -webkit-transform: scale3d(1.1,1.1,1.1) rotate(-3deg);
    transform: scale3d(1.1,1.1,1.1) rotate(-3deg)
  }

  to {
    -webkit-transform: scaleX(1);
    transform: scaleX(1)
  }
}

.animate__shakeTada {
  -webkit-animation-name: shakeTada;
  animation-name: shakeTada
}
.animate__animated {
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-duration: var(--animate-duration);
	animation-duration: var(--animate-duration);
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both
}
:root {
	--animate-duration: 1s;
	--animate-delay: 1s;
	--animate-repeat: 1
}
.animate__lightSpeedInLeft {
	-webkit-animation-name: lightSpeedInLeft;
	animation-name: lightSpeedInLeft;
	-webkit-animation-timing-function: ease-out;
	animation-timing-function: ease-out
}
@-webkit-keyframes lightSpeedInLeft {
	0% {
		opacity: 0;
		-webkit-transform: translate3d(-100%,0,0) skewX(30deg);
		transform: translate3d(-100%,0,0) skewX(30deg)
	}

	60% {
		opacity: 1;
		-webkit-transform: skewX(-20deg);
		transform: skewX(-20deg)
	}

	80% {
		-webkit-transform: skewX(5deg);
		transform: skewX(5deg)
	}

	to {
		-webkit-transform: translateZ(0);
		transform: translateZ(0)
	}
}

@keyframes lightSpeedInLeft {
	0% {
		opacity: 0;
		-webkit-transform: translate3d(-100%,0,0) skewX(30deg);
		transform: translate3d(-100%,0,0) skewX(30deg)
	}

	60% {
		opacity: 1;
		-webkit-transform: skewX(-20deg);
		transform: skewX(-20deg)
	}

	80% {
		-webkit-transform: skewX(5deg);
		transform: skewX(5deg)
	}

	to {
		-webkit-transform: translateZ(0);
		transform: translateZ(0)
	}
}
.bbradioBox .el-radio__label{
  font-size: 13px;
}
</style>

