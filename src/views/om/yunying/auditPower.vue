<template>
  <div class="userpower_Wrapper">
        <div class="topshow">
            <!-- <ul class="clearfix" v-hasPermi="['member:prerogative:page']">
                <li>已赠送Candy<span style="color:red;">{{topperDataInfos.giveTotalWhalePeas}}</span></li>
                <li>已赠送荣耀值<span style="color:red;">{{topperDataInfos.giveTotalDedicateWorth}}</span></li>
                <li>已赠送阅读值<span style="color:red;">{{topperDataInfos.giveTotalReadWorth}}</span></li>
                <li>已赠送基础活跃值<span style="color:red;">{{topperDataInfos.giveTotalActiveWorth}}</span></li>
                <li>已赠送推广活跃值<span style="color:red;">{{topperDataInfos.giveTotalActivePromoteWorth}}</span></li>
            </ul> -->

            <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="true" class="mytopformstyle" style="padding-bottom: 20px;">
            <el-form-item label="手机号" prop="phone">
                <el-input maxlength="11" v-model="queryParams.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="queryParams.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="" style="border:none;">
                <el-button v-hasPermi="['agora:member:prerogative:page']" :loading="loading" type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
                <!-- <el-button v-hasPermi="['member:prerogative:save']" type="primary" @click="addAuditPowerClick">添加用户/特权</el-button> -->
            </el-form-item>
            </el-form>
        </div>
        <!--table-->
        <el-table
        :data="tableData"
        v-loading="loading"
        class="userpowerbox"
        @selection-change="handleSelectionChange"
        style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
                prop="memberId"
                align="center"
                label="ID">
            </el-table-column>
            <el-table-column
                align="center"
                width="120"
                prop="userName"
                label="用户真实姓名">
            </el-table-column>
            <el-table-column
                prop="phone"
                align="center"
                width="110"
                label="用户手机号">
            </el-table-column>
            <el-table-column
                prop="email"
                align="center"
                width="110"
                label="用户邮箱">
            </el-table-column>
            <el-table-column
                prop="modifyAt"
                align="center"
                width="160"
                label="特权变更时间">
                <template slot-scope="{row}">
                  {{row.modifyAt ? $dayjs(row.modifyAt).format('YYYY-MM-DD HH:mm:ss') : '-'}}
                </template>
            </el-table-column>
            <el-table-column label="用户特权设置" align="center">
                <el-table-column
                    prop="prerogativeType"
                    label="特权编码"
                    align="center"
                    class-name="powerColumnStyle">
                    <template scope="scope">
                      <div class="innershow" v-for="(item, index) in scope.row.memberPrerogativeListResults"
                      :key="index"
                      :value="item.prerogativeType">
                        <p>{{item.prerogativeType}}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="prerogativeName"
                    align="center"
                    width="200"
                    label="特权类型"
                    show-overflow-tooltip
                    class-name="powerColumnStyle">
                    <template scope="scope">
                      <div class="innershow" v-for="(item, index) in scope.row.memberPrerogativeListResults"
                      :key="index"
                      :value="item.prerogativeName">
                        <p>{{item.prerogativeName}}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="260"
                    label="专属特权"
                    show-overflow-tooltip
                    class-name="powerColumnStyle">
                    <template scope="scope">
                      <div
                      class="innershow"
                      v-for="(item, index) in scope.row.memberPrerogativeListResults"
                      :key="index"
                      :value="item.prerogativeName">
                        <p v-if="item.prerogativeType === 8 || item.prerogativeType === 3 || item.prerogativeType === 9 || item.prerogativeType === 10">{{item.prerogativeName}}{<span style="color:red;">{{Math.trunc(item.prerogativeValue*100)}}%</span>}</p>
                        <p v-else>{{item.prerogativeName}}{<span style="color:red;">{{item.prerogativeValue}}</span>}</p>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                  class-name="powerColumnStyle"
                    prop="remark"
                    align="center"
                    show-overflow-tooltip
                    label="备注说明">
                    <template scope="scope">
                      <div
                      class="innershow"
                      v-for="(item, index) in scope.row.memberPrerogativeListResults"
                      :key="index"
                      :value="item.remark">
                        <p>{{item.remark}}</p>
                      </div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column
                prop="executor"
                align="center"
                label="操作人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              width="250"
              label="操作">
              <template scope="scope">
                <el-button v-hasPermi="['agora:member:prerogative:update']" :disabled="scope.row.statusType === 1" type="primary" size="mini" @click="editAuditPowerClick(scope.row)">编辑</el-button>
                <el-button v-hasPermi="['agora:member:prerogative:audit']" :disabled="scope.row.statusType === 1" type="primary" size="mini" @click="auditBatchClick(scope.row)">{{scope.row.statusType === 1 ? '已审核' : '审核'}}</el-button>
                <el-button v-hasPermi="['agora:member:prerogative:delete:batch']" :disabled="scope.row.statusType === 1" type="primary" size="mini" @click="deletBatchClick(scope.row)">移除特权</el-button>
              </template>
            </el-table-column>
        </el-table>
        <!--table-->
        <div style="padding: 20px 0;display:inline-block;">
          <el-button v-hasPermi="['agora:member:prerogative:audit']" :disabled="multipleSelection.length <= 0 || hadValidedUser_STATUS" @click="toggleSelectionAudit()">批量审核</el-button>
          <el-button v-hasPermi="['agora:member:prerogative:delete:batch']" :disabled="multipleSelection.length <= 0 || hadValidedUser_STATUS" @click="toggleSelectionDelet()">批量移除</el-button>
        </div>
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
        <!--权益设置新增Dialog-->
        <el-dialog width="85%" title="权益设置新增" :visible.sync="auditSettingVisible">
          <el-form :model="auditSettingform_for_ADD" ref="addAuditPowerForm">
            
            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" @change="handleChangePosition" class="mypostionBox">
              <el-radio-button label="plus">赠送</el-radio-button>
              <el-radio-button label="reduce">削减</el-radio-button>
            </el-radio-group>

            <el-form-item label="用户名" :label-width="formLabelWidth" class="customStyle usernameItem">
              <span class="fl">用户账号：</span>
              <!-- <el-input maxlength="11" class="fl" v-model.trim="auditSettingform_for_ADD.phone" autocomplete="off"></el-input>
              <el-button :disabled="!/^1[3456789]\d{9}$/.test(auditSettingform_for_ADD.phone)" type="primary" :loading="loadingSearchPhone" icon="el-icon-search" style="margin-left:10px;" @click="searchUserByPhoneClick">搜索</el-button> -->
              <el-input class="fl" v-model.trim="auditSettingform_for_ADD.phone" autocomplete="off"></el-input>
              <el-button type="primary" :loading="loadingSearchPhone" icon="el-icon-search" style="margin-left:10px;" @click="searchUserByPhoneClick">搜索</el-button>
            </el-form-item>

            <el-form-item label="确定用户" :label-width="formLabelWidth" class="customStyle">
              <div class="confirmUserList">
                <el-tag
                  v-for="user in auditSettingform_for_ADD.confirmUsers"
                  :key="user.name"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(user)"
                  :type="user.type">
                  {{user.name}}
                </el-tag>
              </div>
            </el-form-item>

            <el-form-item label="特权类型" :label-width="formLabelWidth" class="customStyle">
              <div class="auditTypeMap">
                <el-checkbox-group
                  v-model="auditSettingform_for_ADD.checkedAudit"
                  :min="0"
                  :max="20">
                  <!--add:true[赠送]-->
                  <el-checkbox v-show="tabPosition === 'plus' && markEachAuditReduceOrPlus[audit]" @change="handleCheckedAuditsChange" v-for="(audit, index) in auditTypeMap" :label="audit" :key="index + Math.random()">{{audit}}</el-checkbox>
                  <!--add:false[削减]-->
                  <el-checkbox v-show="tabPosition === 'reduce' && !markEachAuditReduceOrPlus[audit]" @change="handleCheckedAuditsChange" v-for="(audit, index) in auditTypeMap" :label="audit" :key="index + Math.random()">{{audit}}</el-checkbox>
                </el-checkbox-group>

              </div>
            </el-form-item>

            <el-form-item label="专属特权配置" :label-width="formLabelWidth" class="notP customStyle">
              <div class="myAuditSetting">
                <ul>

                  <!--add:true[赠送]-->
                  <li class="clearfix" v-for="(item, index) in auditTypeMapData" :key="index + 'plus'" v-show="item.visible && tabPosition === 'plus' && markEachAuditReduceOrPlus[item.msg]">
                    <div class="codeLeft fl">
                      <div class="txtC">特权编码<span>{{item.type}}</span></div>
                    </div>
                    <div class="auditCenter fl" style="padding-left:10px;" v-if="item.type !== 7">
                      <span style="padding-right:10px;">{{item.msg}}<span>:</span></span>

                      <el-input-number step-strictly v-if="item.type === 3" :step="1" :min="0" :max="50" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 4" :step="1" :min="0.01" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number step-strictly v-else-if="item.type === 5" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 6" :step="1" :min="0.001" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number step-strictly v-else-if="item.type === 8 || item.type === 9 || item.type === 10" :step="1" :min="0" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else :min="0.000001" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>

                      <span class="unit" style="padding-left:10px;">{{item.percent ? `%` : `个`}}</span>
                    </div>
                    <div class="auditCenter fl" style="padding-left:10px;" v-if="item.type === 7">
                      <span style="padding-right:10px;">{{item.msg}}<span>:</span></span>
                      <el-select @change="handleChange" v-model="auditSettingform_for_ADD[`num_${index}`]" placeholder="请选择">
                        <el-option
                          label="请选择"
                          value="">
                        </el-option>
                        <el-option
                          v-for="item in taskCouponlist"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="auditRight fl">
                      <span class="fl" style="padding-right:10px;"> 显示说明<span>:</span></span>
                      
                      <el-input
                        type="textarea"
                        @input="handleChange"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="auditSettingform_for_ADD[`memo_${index}`]"
                        maxlength="20"
                        show-word-limit
                      >
                      </el-input>
                    </div>
                  </li>
                  <!--add:false[削减]-->
                  <li class="clearfix" v-for="(item, index) in auditTypeMapData" :key="index + 'reduce'" v-show="item.visible && tabPosition === 'reduce' && !markEachAuditReduceOrPlus[item.msg]">
                    <div class="codeLeft fl">
                      <div class="txtC">特权编码<span>{{item.type}}</span></div>
                    </div>
                    <div class="auditCenter fl" style="padding-left:10px;" v-if="item.type !== 7">
                      <span style="padding-right:10px;">{{item.msg}}<span>:</span></span>

                      <el-input-number step-strictly v-if="item.type === 3" :step="1" :min="0" :max="50" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 4" :step="1" :min="0.01" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number step-strictly v-else-if="item.type === 5" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 6" :step="1" :min="0.001" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number step-strictly v-else-if="item.type === 8 || item.type === 9 || item.type === 10" :step="1" :min="0" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else :min="0.000001" :precision="item.decimalScale" v-model="auditSettingform_for_ADD[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>

                      <span class="unit" style="padding-left:10px;">{{item.percent ? `%` : `个`}}</span>
                    </div>
                    <div class="auditCenter fl" style="padding-left:10px;" v-if="item.type === 7">
                      <span style="padding-right:10px;">{{item.msg}}<span>:</span></span>
                      <el-select @change="handleChange" v-model="auditSettingform_for_ADD[`num_${index}`]" placeholder="请选择">
                        <el-option
                          label="请选择"
                          value="">
                        </el-option>
                        <el-option
                          v-for="item in taskCouponlist"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="auditRight fl">
                      <span class="fl" style="padding-right:10px;"> 显示说明<span>:</span></span>
                      
                      <el-input
                        type="textarea"
                        @input="handleChange"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="auditSettingform_for_ADD[`memo_${index}`]"
                        maxlength="20"
                        show-word-limit
                      >
                      </el-input>
                    </div>
                  </li>
                  
                </ul>
              </div>
            </el-form-item>
              <el-form-item style="text-align:right;">
              <el-button @click="cancelAuditPower('addAuditPowerForm')">取 消</el-button>
              <el-button type="primary" @click="saveAuditPower">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <!--权益设置编辑Dialog-->
        <el-dialog width="85%" title="权益设置修改" :visible.sync="auditSettingVisible_edit">
          <el-form :model="auditSettingform_for_edit" ref="editAuditPowerForm">

            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" @change="handleChangePosition" class="mypostionBox">
              <el-radio-button label="plus">赠送</el-radio-button>
              <el-radio-button label="reduce">削减</el-radio-button>
            </el-radio-group>

            <el-form-item label="用户名" :label-width="formLabelWidth" class="customStyle usernameItem">
              <span class="fl">用户手机号：</span>
              <el-input :disabled="true" maxlength="11" class="fl" v-model.trim="auditSettingform_for_edit.phone" autocomplete="off"></el-input>
              <el-button :disabled="!/^1[3456789]\d{9}$/.test(auditSettingform_for_edit.phone)" type="primary" :loading="loadingSearchPhone" icon="el-icon-search" style="margin-left:10px;" @click="searchUserByPhoneClick">搜索</el-button>
            </el-form-item>

            <el-form-item label="确定用户" :label-width="formLabelWidth" class="customStyle">
              <div class="confirmUserList">
                <el-tag
                  v-for="user in auditSettingform_for_edit.confirmUsers"
                  :key="user.name"
                  :closable="false"
                  :disable-transitions="false"
                  @close="handleClose(user)"
                  :type="user.type">
                  {{user.name}}
                </el-tag>
              </div>
            </el-form-item>

            <el-form-item label="特权类型" :label-width="formLabelWidth" class="customStyle">
              <div class="auditTypeMap">
                <el-checkbox-group
                  v-model="auditSettingform_for_edit.checkedAudit"
                  :min="0"
                  :max="20">
                  <!--add:true[赠送]-->
                  <el-checkbox v-show="tabPosition === 'plus' && markEachAuditReduceOrPlus[audit]" @change="handleCheckedAuditsChange" v-for="(audit, index) in auditTypeMap" :label="audit" :key="index + Math.random()">{{audit}}</el-checkbox>
                  <!--add:false[削减]-->
                  <el-checkbox v-show="tabPosition === 'reduce' && !markEachAuditReduceOrPlus[audit]" @change="handleCheckedAuditsChange" v-for="(audit, index) in auditTypeMap" :label="audit" :key="index + Math.random()">{{audit}}</el-checkbox>
                </el-checkbox-group>

                <!-- <el-checkbox-group v-model="checkList" @change="rolesChange">
                <el-checkbox :label="item.value" v-for="(item, index) in rolelist" :key="item.value" class="item" @change="rolesChangeItem">{{item.label}}</el-checkbox>
              </el-checkbox-group> -->

              </div>
            </el-form-item>

            <el-form-item label="专属特权配置" :label-width="formLabelWidth" class="notP customStyle">
              <div class="myAuditSetting">
                <ul>

                  <!--add:true[赠送]-->
                  <li class="clearfix" v-for="(item, index) in auditTypeMapData" :key="index + 'plus'" v-show="item.visible && tabPosition === 'plus' && markEachAuditReduceOrPlus[item.msg]">
                    <div class="codeLeft fl">
                      <div class="txtC">特权编码<span>{{item.type}}</span></div>
                    </div>
                    <div class="auditCenter fl" style="padding-left:10px;" v-if="item.type !== 7">
                      <span style="padding-right:10px;">{{item.msg}}<span>:</span></span>

                      <el-input-number step-strictly v-if="item.type === 3" :step="1" :min="0" :max="50" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 4" :step="1" :min="0.01" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number step-strictly v-else-if="item.type === 5" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 6" :step="1" :min="0.001" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number step-strictly v-else-if="item.type === 8 || item.type === 9 || item.type === 10" :step="1" :min="0" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 17" :disabled="!item.editable" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 18" :disabled="!item.editable" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 19" :disabled="!item.editable" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 20" :disabled="!item.editable" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 21" :disabled="!item.editable" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else :min="0.000001" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>

                      <span class="unit" style="padding-left:10px;">{{item.percent ? `%` : `个`}}</span>
                    </div>
                    <div class="auditCenter fl" style="padding-left:10px;" v-if="item.type === 7">
                      <span style="padding-right:10px;">{{item.msg}}<span>:</span></span>
                      <el-select @change="handleChange" v-model="auditSettingform_for_edit[`num_${index}`]" placeholder="请选择">
                        <el-option
                          v-for="item in taskCouponlist"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="auditRight fl">
                      <span class="fl" style="padding-right:10px;"> 显示说明<span>:</span></span>
                      
                      <el-input
                        type="textarea"
                        @input="handleChange"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="auditSettingform_for_edit[`memo_${index}`]"
                        maxlength="20"
                        show-word-limit
                      >
                      </el-input>
                    </div>
                  </li>
                  <!--add:false[削减]-->
                  <li class="clearfix" v-for="(item, index) in auditTypeMapData" :key="index + 'reduce'" v-show="item.visible && tabPosition === 'reduce' && !markEachAuditReduceOrPlus[item.msg]">
                    <div class="codeLeft fl">
                      <div class="txtC">特权编码<span>{{item.type}}</span></div>
                    </div>
                    <div class="auditCenter fl" style="padding-left:10px;" v-if="item.type !== 7">
                      <span style="padding-right:10px;">{{item.msg}}<span>:</span></span>

                      <el-input-number step-strictly v-if="item.type === 3" :step="1" :min="0" :max="50" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 4" :step="1" :min="0.01" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number step-strictly v-else-if="item.type === 5" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 6" :step="1" :min="0.001" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number step-strictly v-else-if="item.type === 8 || item.type === 9 || item.type === 10" :step="1" :min="0" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <!--新增：削减的5个类型的特权st-->
                      <!--此处可设计成：最小默认值，根据precision精度位数来自动设置-->
                      <el-input-number v-else-if="item.type === 11 || item.type === 12" :step="1" :min="0.000001" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 14" :step="1" :min="0.01" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 15" :step="1" :min="1" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <el-input-number v-else-if="item.type === 16" :step="1" :min="0.001" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>
                      <!--新增：削减的5个类型的特权ed-->
                      <el-input-number v-else :min="0.000001" :precision="item.decimalScale" v-model="auditSettingform_for_edit[`num_${index}`]" controls-position="right" @change="handleChange" @blur="((ev)=>{handleBlur(ev, index)})"></el-input-number>

                      <span class="unit" style="padding-left:10px;">{{item.percent ? `%` : `个`}}</span>
                    </div>
                    <div class="auditCenter fl" style="padding-left:10px;" v-if="item.type === 7">
                      <span style="padding-right:10px;">{{item.msg}}<span>:</span></span>
                      <el-select @change="handleChange" v-model="auditSettingform_for_edit[`num_${index}`]" placeholder="请选择">
                        <el-option
                          v-for="item in taskCouponlist"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="auditRight fl">
                      <span class="fl" style="padding-right:10px;"> 显示说明<span>:</span></span>
                      
                      <el-input
                        type="textarea"
                        @input="handleChange"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="auditSettingform_for_edit[`memo_${index}`]"
                        maxlength="20"
                        show-word-limit
                      >
                      </el-input>
                    </div>
                  </li>
                  
                </ul>
              </div>
            </el-form-item>
              <el-form-item style="text-align:right;">
              <el-button @click="cancelAuditPower_edit('editAuditPowerForm')">取 消</el-button>
              <el-button type="primary" :loading="btnloading" @click="saveAuditPower_edit">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
  </div>
</template>

<script>
import { searchUserPowerList, searchUserByPhone, searchAuditTypes, searchTaskCouponList, addAuditPower, editAuditPower, auditingBatch, deletBatch, totalDataInfos } from "@/api/om/power";
  export default {
    components: {},
    data () {
      var validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value)) && value !== '') {
          return callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
      return {
          markEachAuditReduceOrPlus: {},
          tabPosition: 'plus', // 变动之前，就是’加‘类型
          rules: {
            phone: [
              { validator: validatePhone, trigger: 'blur' }
            ]
          },
          auditSettingform_for_edit: {
            confirmUsers: [],
            phone: '',
            checkedAudit: []
          },
          auditSettingform_for_ADD: {
            confirmUsers: [],
            phone: '',
            checkedAudit: []
          },
          auditTypeMapData_original: [],
          auditTypeMapData: [],
          auditTypeMap: [], // 特权类型集合(交互展示用)
          taskCouponlist: [], // 任务券列表集合
          auditSettingVisible: false,
          auditSettingVisible_edit: false,
          formLabelWidth: '120px', // 新增修改ed
          loading: false,
          btnloading: false,
          loadingSearchPhone: false,
           pageIndex: 1,
           pageSize: 10,
           totalPage: 0,
           input: '',
           queryParams: {
             phone: '',
             email: '',
           },
           tableData: [],
           curClickedUserId: '',
           current_dialog_type: 'add',
           finallyCheckedIndexList: [], // 存储每次最终勾选了的特权名称，与原始特权集合，匹配到了的位置索引的集合
           multipleSelection: [],
           ids: [],
           topperDataInfos: {
             giveTotalActivePromoteWorth: 0,
            giveTotalActiveWorth: 0,
            giveTotalDedicateWorth: 0,
            giveTotalReadWorth: 0,
            giveTotalWhalePeas: 0
          },
          cachePoor: {},
          hadValidedUser_STATUS: false
      }
    },
    created () {
      this.searchAuditTypesRun()
    },
    mounted () {
      this.search()
      this.searchTaskCouponListRun()
    },
    watch: {},
    methods: {
      handleChangePosition (val) {
        this.tabPosition = val
      },
      totalDataInfosRun () {
        auditingBatch().then(response => {
          if (response.code === 200) {
            this.topperDataInfos = response.data
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleSelectionChange (val) {
        // statusType：0 未审核
        this.multipleSelection = val
        this.hadValidedUser_STATUS = val.some(val => val.statusType)
        if (this.hadValidedUser_STATUS) {
          this.$message({
            type: 'warning',
            message: '已审核的用户不可操作更改'
          })
          return false
        }
      },
      toggleSelectionAudit_runner () {
        this.collect_ids()
        let _params = {
          datas: this.ids
        }
        auditingBatch(_params).then(response => {
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
        })
      },
      toggleSelectionAudit () {
        this.$confirm(`确认要执行此操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.toggleSelectionAudit_runner()
        }).catch(() => {})
      },
      toggleSelectionDelet_runner () {
        this.collect_ids()
        let _params = {
          datas: this.ids
        }
        deletBatch(_params).then(response => {
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
        })
      },
      toggleSelectionDelet () {
        this.$confirm(`确认要执行此操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.toggleSelectionDelet_runner()
        }).catch(() => {})
      },
      collect_ids () {
        this.ids = this.multipleSelection.map(v => v.id)
      },
      auditBatchClick_runner (row) {
        let _params = {
          datas: [row.id]
        }
        auditingBatch(_params).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search()
              }
            })
            this.$router.push("/om/userPower")
          } else {
            this.$message.error(response.message)
          }
        })
      },
      // 单个删除
      auditBatchClick (row) {
        this.$confirm(`确认要执行此操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.auditBatchClick_runner(row)
        }).catch(() => {})
      },
      deletBatchClick_runner (row) {
        let _params = {
          datas: [row.id]
        }
        deletBatch(_params).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search()
              }
            })
          } else {
            this.$message.error(response.message)
          }
        })
      },
      // 单个删除
      deletBatchClick (row) {
        this.$confirm(`确认要执行此操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletBatchClick_runner(row)
        }).catch(() => {})
      },
      // 权益设置修改-保存
      saveAuditPower_edit () {
        let _params = {}
        _params.id = this.curClickedUserId // 该条数据的ID，非该条用户的ID
        let _memberPrerogativeListRequests = []
        _memberPrerogativeListRequests = this.finallyCheckedIndexList.map((v, i, a) => {
          let _items = {}
          if (this.auditTypeMapData_original[v].percent && this.auditTypeMapData_original[v].decimalScale === 0) {
            // 如果是百分比数据，先除以100，有一种特殊情况，若此时精度是0，则此时数据是0.02，则，toFixed(0)后，就变成0了，所以此处需要特殊判断下该情况
            _items.prerogativeValue = (this.auditSettingform_for_edit[`num_${v}`] / 100).toString()
          } else {
            // 编辑时：如果没有选择赠送任务券
            if (this.auditTypeMapData_original[v].type === 7 && !this.auditSettingform_for_edit[`num_${v}`]) {
              _items.prerogativeValue = 'illegal value'
            } else if ((this.auditTypeMapData_original[v].type === 17 || this.auditTypeMapData_original[v].type === 18 || this.auditTypeMapData_original[v].type === 21) && !this.auditTypeMapData_original[v].editable) {
              // 特权类型type：17、18、21时候，且editable = false , 不可编辑，默认传值1
              _items.prerogativeValue = 1
            } else {
              _items.prerogativeValue = this.auditTypeMapData_original[v].percent ? (+this.auditSettingform_for_edit[`num_${v}`] / 100).toFixed(this.auditTypeMapData_original[v].decimalScale).toString() : (+this.auditSettingform_for_edit[`num_${v}`]).toFixed(this.auditTypeMapData_original[v].decimalScale).toString()
            }
          }
          _items.prerogativeType = this.auditTypeMapData_original[v].type
          _items.remark = this.auditSettingform_for_edit[`memo_${v}`]
          return _items
        })
        _params.memberPrerogativeListRequests = _memberPrerogativeListRequests
        if (this.finallyCheckedIndexList.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请至少勾选一个特权类型'
          })
          return false
        }
        let _resIndex = _params.memberPrerogativeListRequests.findIndex((val, index, arr) => {
          return val.prerogativeType === 7 && val.prerogativeValue === 'illegal value'
        })
        if (_resIndex !== -1) {
          this.$message({
            type: 'warning',
            message: '请选择赠送任务券'
          })
          return false
        }
        console.log('edit sumbit params:', _params)
        this.btnloading = true
        editAuditPower(_params).then(response => {
          this.btnloading = false
          if (response.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search()
              }
            })
          } else {
            this.$message.error(response.message)
          }
          this.auditSettingVisible_edit = false
        }).catch(({ error }) => {
          this.btnloading = false
          this.auditSettingVisible_edit = false
          if (error) this.$message.error(error.message)
        })
      },
      editAuditPowerClick (row) {
        this.resetOrLoopSetPropertyKey('edit')
        this.current_dialog_type = 'edit'
        // 记录当前点击编辑的用户id
        this.curClickedUserId = row.id
        this.auditSettingform_for_edit.confirmUsers = [{ // 编辑的时候，确定用户不可更改
          name: row.userName,
          phone: row.phone,
          email: row.email,
          memberId: row.memberId,
          type: 'warning'
        }]
        // 特权下面的回显
        this.handle_editAuditPower_reshow(row.memberPrerogativeListResults || [])
        this.handleTabPositionStatus(row.memberPrerogativeListResults || [])
        this.auditSettingVisible_edit = true
      },
      // 优化交互体验：编辑时候，Tab切换栏的默认选中变量tabPosition状态处理。
      handleTabPositionStatus (prerogativeArray) {
        this.tabPosition = prerogativeArray.find(val => val.add) ? 'plus' : 'reduce'
      },
      cancelAuditPower_edit (formName) {
        this.auditSettingVisible_edit = false
        this.$refs[formName].resetFields()
      },
      cancelAuditPower (formName) {
        this.auditSettingVisible = false
        this.$refs[formName].resetFields()
      },
      // 权益设置新增-保存
      saveAuditPower () {
        let _params = {}
        _params.memberIds = this.auditSettingform_for_ADD.confirmUsers.map(v => v.memberId)
        let _memberPrerogativeListRequests = []
        _memberPrerogativeListRequests = this.finallyCheckedIndexList.map((v, i, a) => {
          let _items = {}
          if (this.auditTypeMapData_original[v].percent && this.auditTypeMapData_original[v].decimalScale === 0) {
            // 如果是百分比数据，先除以100，有一种特殊情况，若此时精度是0，则此时数据是0.02，则，toFixed(0)后，就变成0了，所以此处需要特殊判断下该情况
            _items.prerogativeValue = (this.auditSettingform_for_ADD[`num_${v}`] / 100).toString()
          } else {
            // 如果没有选择赠送任务券
            if (this.auditTypeMapData_original[v].type === 7 && !this.auditSettingform_for_ADD[`num_${v}`]) {
              _items.prerogativeValue = 'illegal value'
            } else {
              _items.prerogativeValue = this.auditTypeMapData_original[v].percent ? (+this.auditSettingform_for_ADD[`num_${v}`] / 100).toFixed(this.auditTypeMapData_original[v].decimalScale).toString() : (+this.auditSettingform_for_ADD[`num_${v}`]).toFixed(this.auditTypeMapData_original[v].decimalScale).toString()
            }
          }
          _items.prerogativeType = this.auditTypeMapData_original[v].type
          _items.remark = this.auditSettingform_for_ADD[`memo_${v}`]
          return _items
        })
        _params.memberPrerogativeListRequests = _memberPrerogativeListRequests
        if (this.finallyCheckedIndexList.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请至少勾选一个特权类型'
          })
          return false
        }
        if (_params.memberIds.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请添加用户'
          })
          return false
        }
        let _resIndex = _params.memberPrerogativeListRequests.findIndex((val, index, arr) => {
          return val.prerogativeType === 7 && val.prerogativeValue === 'illegal value'
        })
        if (_resIndex !== -1) {
          this.$message({
            type: 'warning',
            message: '请选择赠送任务券'
          })
          return false
        }
        console.log('add sumbit params:', _params)
        this.btnloading = true
        addAuditPower(_params).then(response => {
          this.btnloading = false
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              'duration': 1000,
              onClose: () => {
                this.search()
              }
            })
            this.$router.push("/om/auditpower")
          } else {
            this.$message.error(response.message)
          }
          this.auditSettingVisible = false
        }).catch(({ error }) => {
          this.btnloading = false
          this.auditSettingVisible = false
          if (error) this.$message.error(error.message)
        })
      },
      // 处理编辑时候，专属特权配置的回显
      handle_editAuditPower_reshow (arr) {
        // 拿：['荣耀值', '阅读值', '基础活跃值']这种数组去匹配，再回调checkboxComponentClick_vshow
        let _reshowAudit_arr = []
        _reshowAudit_arr = arr.map(v => v.prerogativeName)
        this.checkboxComponentClick_vshow(_reshowAudit_arr)
        this.auditSettingform_for_edit.checkedAudit = _reshowAudit_arr // 映射勾选状态
        // 里面的值、备注，对应项回显：此时，finallyCheckedIndexList 状态已同步更新好
        for (let [k, s] of Object.entries(this.finallyCheckedIndexList || [])) {
          // 修改时，若是百分比类型需乘以100后显示(...)
          this.auditSettingform_for_edit[`num_${s}`] = arr[k].prerogativeType === 3 || arr[k].prerogativeType === 8 || arr[k].prerogativeType === 9 || arr[k].prerogativeType === 10 ? Number(arr[k].prerogativeValue || 0) * 100 : Number(arr[k].prerogativeValue || 0)
          this.auditSettingform_for_edit[`memo_${s}`] = arr[k].remark
          if (arr[k].prerogativeType === 3 || arr[k].prerogativeType === 8 || arr[k].prerogativeType === 9 || arr[k].prerogativeType === 10) {
            console.log(Number(arr[k].prerogativeValue || 0), 'before val')
            console.log(Number(arr[k].prerogativeValue || 0) * 100, 'after * 100 val')
          }
          if (arr[k].prerogativeType === 7) { // 匹配赠送任务券的选中状态项
            this.auditSettingform_for_edit[`num_${s}`] = Number(arr[k].prerogativeValue)
          }
        }
      },
      // 上面勾选，下面实时显示对应的权限
      checkboxComponentClick_vshow (checked_arr = []) {
        let _originalMapList = [...this.auditTypeMapData]
        this.finallyCheckedIndexList = []
        for (let [k, s] of Object.entries(checked_arr)) {
           _originalMapList.findIndex((val, index, arr) => {
            if (val.msg === s) {
              this.finallyCheckedIndexList.push(index)
            }
          })
        }
        for (let [ks, vs] of Object.entries(_originalMapList)) { vs.visible = false }
        this.finallyCheckedIndexList.map((val, index, arr) => {
          _originalMapList[val].visible = true
        })
        this.auditTypeMapData = _originalMapList // final checked status
        console.log(this.auditTypeMapData, 'final checked status')
      },
      handleBlur (ev, index) {
        // blur后若输入内容为空，处理为显示对应特权类型的最小默认值
        if (ev.target.ariaValueNow === 'undefined') this.auditSettingform_for_edit[`num_${index}`] = ev.target.value = ev.target.ariaValueMin
      },
      handleChange (value) {
        this.$forceUpdate()
        // console.log(`current modified value:${value}`)
      },
      handleCheckedAuditsChange () {
        if (this.current_dialog_type === 'edit') {
          this.checkboxComponentClick_vshow(this.auditSettingform_for_edit.checkedAudit)
        } else {
          this.checkboxComponentClick_vshow(this.auditSettingform_for_ADD.checkedAudit)
        }
      },
      searchAuditTypesRunBefore (isBoolean) {
        // add: 增加true｜减少false
        return new Promise((resovle, reject) => {
          searchAuditTypes({
            add: isBoolean
          }).then(response => {
            if (response.code === 200) {
              resovle(response.data.list)
            } else {
                resovle([])
                this.$message.error(response.message)
              }
          }).catch(({ error }) => {
            resovle([])
            if (error) this.$message.error(error.message)
          })
        })
      },
      async searchAuditTypesRun () {
        let arrP = [this.searchAuditTypesRunBefore(true), this.searchAuditTypesRunBefore(false)]
        let receiverContainer = []
        for await(let s of arrP) {
          receiverContainer.push(s)
        }
        let _resAudit = receiverContainer.flat(Infinity)
        if (_resAudit.length > 0) {
          this.auditTypeMapData_original = [..._resAudit]
          this.auditTypeMapData = _resAudit
          this.auditTypeMap = _resAudit.map((item, index, arr) => {
            this.auditSettingform_for_ADD[`num_${index}`] = 0
            this.auditSettingform_for_edit[`num_${index}`] = 0
            this.auditSettingform_for_ADD[`memo_${index}`] = ''
            this.auditSettingform_for_edit[`memo_${index}`] = ''
            if (index === 6) {
              this.auditSettingform_for_ADD[`num_${index}`] = ''
              this.auditSettingform_for_edit[`num_${index}`] = ''
            }
            this.markEachAuditReduceOrPlus[item.msg] = item.add // 记录每一个特权类型的增减类型，存到对象中，如：{ '赠送Candy': true, '扣减荣耀值': false }这种数据,key是特权name,value是boolean，true增加、false减少类型。
            return item.msg
          })
        } else {
          this.auditTypeMap = []
          this.auditTypeMapData = []
        }

        // [增加：赠送、削减2特权类型Tab切换|Modified Time:21.7.7]需求变更改动之前。。。
        // searchAuditTypes().then(response => {
        //   if (response.code === 200) {
        //     this.auditTypeMapData_original = [...response.data.list]
        //     this.auditTypeMapData = response.data.list
        //     this.auditTypeMap = response.data.list.map((item, index, arr) => {
        //       this.auditSettingform_for_ADD[`num_${index}`] = 0
        //       this.auditSettingform_for_edit[`num_${index}`] = 0
        //       this.auditSettingform_for_ADD[`memo_${index}`] = ''
        //       this.auditSettingform_for_edit[`memo_${index}`] = ''
        //       if (index === 6) {
        //         this.auditSettingform_for_ADD[`num_${index}`] = ''
        //         this.auditSettingform_for_edit[`num_${index}`] = ''
        //       }
        //       return item.msg
        //     })
        //   } else {
        //     this.auditTypeMap = []
        //     this.auditTypeMapData = []
        //     this.$message.error(response.message)
        //     }
        // }).catch(({ error }) => {
        //   if (error) this.$message.error(error.message)
        // })
      },
      handleClose (tag) {
        if (this.current_dialog_type === 'edit') {
          this.auditSettingform_for_edit.confirmUsers.splice(this.auditSettingform_for_edit.confirmUsers.indexOf(tag), 1)
        } else {
          this.auditSettingform_for_ADD.confirmUsers.splice(this.auditSettingform_for_ADD.confirmUsers.indexOf(tag), 1)
        }
        Reflect.deleteProperty(this.cachePoor, [`sid${tag.memberId}`])
      },
      // 查询任务券类型列表
      searchTaskCouponListRun () {
        searchTaskCouponList({ pageSize: 10000, taskType: 4 }).then(response => {
          if (response.code === 200) {
            this.taskCouponlist = (response.data.list || []).map((val, index, arr) => {
              let _json = {}
              _json.value = val.id
              _json.label = val.taskName
              return _json
            })
          } else {
            this.taskCouponlist = []
            this.$message.error(response.message)
            }
        }).catch(({ error }) => {
          if (error) this.$message.error(error.message)
        })
      },
      addAuditPowerClick () {
        // clear cachePoor
        this.cachePoor = {}
        this.auditSettingVisible = true
        this.current_dialog_type = 'add'
        this.finallyCheckedIndexList = []
        // reset visibile
        let _originalMapList = [...this.auditTypeMapData]
        for (let [ks, vs] of Object.entries(_originalMapList)) { vs.visible = false }
        this.resetOrLoopSetPropertyKey('add')
      },
      resetOrLoopSetPropertyKey (type) {
        let _type = type === 'add' ? 'ADD' : 'edit'
        this[`auditSettingform_for_${_type}`].confirmUsers = []
        this[`auditSettingform_for_${_type}`].phone = ''
        this[`auditSettingform_for_${_type}`].email = ''
        this[`auditSettingform_for_${_type}`].checkedAudit = []
        for (let [k, s] of Object.entries(this[`auditSettingform_for_${_type}`])) {
          if (/num_(?=\d)/g.test(k)) {
            this.$set(this[`auditSettingform_for_${_type}`], k, 0)
          }
          if (/memo_(?=\d)/g.test(k) || /num_(?=6)/g.test(k)) {
            this.$set(this[`auditSettingform_for_${_type}`], k, '')
          }
        }
      },
      searchUserByPhoneClick () {
        // here will emit the search method
        let phone
        if (this.current_dialog_type === 'edit') {
          phone = this.auditSettingform_for_edit.phone
        } else {
          phone = this.auditSettingform_for_ADD.phone // 18820476343
        }
        this.loadingSearchPhone = true
        searchUserByPhone({ phone }).then(response => {
            if (response.code === 200) {
            this.loadingSearchPhone = false
            if (this.current_dialog_type === 'edit') {
              this.auditSettingform_for_edit.confirmUsers = [{ // 此处其实按钮已经禁止点击查询了
                name: response.data.userName,
                phone: response.data.phone,
                memberId: response.data.memberId,
                type: 'warning'
              }]
            } else {
              if (this.auditSettingform_for_ADD.confirmUsers.length < 14) {
                if (this.cachePoor[`sid${response.data.memberId}`]) {
                  console.log('Do not add user repeatedly.')
                } else {
                  this.cachePoor[`sid${response.data.memberId}`] = response.data.memberId
                  this.auditSettingform_for_ADD.confirmUsers.push({
                    name: response.data.userName,
                    phone: response.data.phone,
                    memberId: response.data.memberId,
                    type: 'warning'
                  })
                }
              } else if (this.auditSettingform_for_ADD.confirmUsers.length >= 14){
                this.auditSettingform_for_ADD.confirmUsers.length = 14
                this.$message({
                  type: 'warning',
                  message: '亲，最多允许添加14个用户哦'
                })
                return false
              }
            }
            } else {
            this.loadingSearchPhone = false
            this.$message.error(response.message)
            }
        }).catch(({ error }) => {
          this.loadingSearchPhone = false
          if (error) this.$message.error(error.message)
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.search()
      },
      search (pgi) {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            if (pgi) this.pageIndex = pgi
            let _params = {
              currentPage: this.pageIndex,
              pageSize: this.pageSize,
              phone: this.queryParams.phone || '',
              email: this.queryParams.email || '',
              statusType: 0 // -1全部 0未审核 1已审核
            }
            this.loading = true
            searchUserPowerList(_params).then(response => {
                if (response.code === 200) {
                this.tableData = JSON.parse(JSON.stringify(response.data.list))
                this.totalPage = response.data.total
                this.loading = false
                } else {
                this.tableData = []
                this.totalPage = 0
                this.pageSize = 10
                this.loading = false
                this.$message.error(response.message)
                }
            }).catch( e => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>

<style>
.userpower_Wrapper{
    padding: 20px;
}
 .userpower_Wrapper .topshow ul{
     margin-left: -36px;
 }
 .userpower_Wrapper .topshow li{
    padding: 5px;
    float: left;
    list-style: none;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius:3px;
    margin-bottom: 10px;
    font-size: 13px;
 }
  .powerColumnStyle .cell,.powerColumnStyle{
    padding:0!important;
  }
 .powerColumnStyle .innershow{
   border-bottom: 1px solid #dfe6ec;
   height: 38px;
 }
 .powerColumnStyle .innershow:last-child{
   border-bottom: none;
 }
 .customStyle  .el-input{
   width:200px;
 }
 .userpower_Wrapper .codeLeft, .userpower_Wrapper .auditCenter, .userpower_Wrapper .auditRight{
   height: 80px;
 }
  .userpower_Wrapper .codeLeft{
    width:200px;
    padding-top: 20px;
    border-right:1px solid #ccc;
  }
  .userpower_Wrapper .auditRight{
    width:305px;
    padding-top: 10px;
  }
  .userpower_Wrapper .auditRight .el-textarea{
    width:229px;
    float: left;
  }
 .userpower_Wrapper .auditCenter{
   width:calc(100% - 539px);
   padding-top: 20px;
 }
 .userpower_Wrapper .el-form-item{
   margin-bottom: 0!important;
   border: 1px solid #ccc;
   border-bottom: none;
 }
 .userpower_Wrapper .el-form-item:last-child{
   border-bottom: 1px solid #ccc;
 }
 .customStyle .el-form-item__content{
   border-left: 1px solid #ccc;
 }
 .myAuditSetting ul{
   padding: 0!important;
   margin:0!important;
 }
  .myAuditSetting ul li:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
 .userpower_Wrapper .el-form-item__label,.userpower_Wrapper .el-form-item__content{
   padding: 10px!important;
 }
 .userpower_Wrapper .notP .el-form-item__content{
   padding: 0!important;
 }
 .txtC {
   text-align:center;
 }
 .mytopformstyle .el-form-item{
   border: none;
 }
 .confirmUserList .el-tag{
   margin-right:9px;
 }
 .mypostionBox{
   margin: 0 auto;
   margin-left: calc(50% - 70px);
 }
</style>

