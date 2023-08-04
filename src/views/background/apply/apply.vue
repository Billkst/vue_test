<template>
	<div class="apply">

		<el-form :model="searchForm" ref="searchForm" label-width="100px" class="demo-searchForm" :inline="true">
			<el-form-item label="申请时间">
				<el-form-item prop="applyDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="searchForm.applyDate"
						value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
				</el-form-item>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="initApplyList()">查询</el-button>
				<el-button type="success"
					@click="addType = 1; add.dialogFormVisible = true;  add.form.applyDate = null; add.form.applyDay = 1; add.form.reason = ''">新增</el-button>
			</el-form-item>
		</el-form>

		<el-dialog :title="add.dialogFormTitle" :visible.sync="add.dialogFormVisible">
			<el-form :model="add.form" ref="addForm">
				<el-form-item label="申请" :label-width="formLabelWidth" hidden>
					<el-input v-model="add.form.id" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="申请时间" :label-width="formLabelWidth" required="">
					<el-date-picker type="date" placeholder="选择日期" v-model="add.form.applyDate"
						value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="申请天数" :label-width="formLabelWidth" required>
					<el-input type="number" v-model="add.form.applyDay" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="申请理由" :label-width="formLabelWidth" required>
					<el-input v-model="add.form.reason" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="add.dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addApply('addForm')">确 定</el-button>
			</div>
		</el-dialog>


		<el-table :data="applies" height="650" border style="width: 100%">
			<el-table-column prop="number" label="申请编号">
			</el-table-column>
			<el-table-column prop="applyStudentNumber" label="学生学号">
			</el-table-column>
			<el-table-column prop="applyStudentName" label="学生姓名">
			</el-table-column>
			<el-table-column prop="applyDate" label="申请时间">
			</el-table-column>
			<el-table-column prop="applyDay" label="申请天数">
			</el-table-column>
			<el-table-column prop="reason" label="申请理由">
			</el-table-column>
			<el-table-column prop="status" label="申请状态">
				<template slot-scope="scope">
					<el-tag :type="
						scope.row.status == 0 ? 'info' :
						scope.row.status == 1 ? '' :
						scope.row.status == 2 ? 'success' :
						scope.row.status == 3 ? 'danger' :
												'warning'
					">
						{{
							scope.row.status == 0 ? '未提交' :
							scope.row.status == 1 ? '未审核' :
							scope.row.status == 2 ? '通过' :
							scope.row.status == 3 ? '驳回' :
													'已撤回'
						}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="applyExamineDate" label="审核时间">
			</el-table-column>
			<el-table-column prop="applyExamineContent" label="审核意见">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="220">
				<template slot-scope="scope">
					<template v-if="userType==1">
						<el-button v-if="scope.row.status == 0 || scope.row.status == 3 || scope.row.status == 4 "
							@click="deleteApply(scope.row.id)" type="danger" size="small" round>删除</el-button>
						<el-button v-if="scope.row.status == 0 || scope.row.status == 4 "
							@click="submitApply(1,scope.row.id)" type="primary" size="small" round>提交</el-button>
						<el-button v-if="scope.row.status == 1" @click="submitApply(4, scope.row.id)" type="warning"
							size="small" round>撤回</el-button>
						<el-button v-if="scope.row.status == 0 || scope.row.status == 4 " size="small"
							@click="addType = 2; add.dialogFormVisible = true; add.form.id = scope.row.id; add.form.applyDate = scope.row.applyDate; add.form.applyDay = scope.row.applyDay; add.form.reason = scope.row.reason"
							round>编辑</el-button>
					</template>

					<template v-if="userType == 2">
						<el-button v-if="scope.row.status == 1" @click="showExamine(scope.row)" type="primary"
							size="small" round>审核</el-button>
					</template>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog :title="examine.dialogFormTitle" :visible.sync="examine.dialogFormVisible">
			<el-form :model="examine.form" ref="examineForm">
				<el-form-item label="申请" :label-width="formLabelWidth" hidden>
					<el-input v-model="examine.form.id"></el-input>
				</el-form-item>
				<el-form-item label="申请" :label-width="formLabelWidth" hidden>
					<el-input v-model="examine.form.applyExamineTeacher"></el-input>
				</el-form-item>

				<el-form-item label="学生学号" :label-width="formLabelWidth" required>
					<el-input v-model="examine.form.applyStudentNumber" disabled></el-input>
				</el-form-item>
				<el-form-item label="学生姓名" :label-width="formLabelWidth" required>
					<el-input v-model="examine.form.applyStudentName" disabled></el-input>
				</el-form-item>

				<el-form-item label="申请时间" :label-width="formLabelWidth" required="">
					<el-date-picker type="date" placeholder="选择日期" v-model="examine.form.applyDate" disabled
						value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="申请天数" :label-width="formLabelWidth" required>
					<el-input type="number" v-model="examine.form.applyDay" autocomplete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="申请理由" :label-width="formLabelWidth" required>
					<el-input v-model="examine.form.reason" autocomplete="off" disabled></el-input>
				</el-form-item>


				<el-form-item label="审核状态" :label-width="formLabelWidth" required>
					<el-select v-model="examine.form.status" placeholder="请选择审核状态" class="form_select_status">
						<el-option label="通过" value="2"></el-option>
						<el-option label="驳回" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核意见" :label-width="formLabelWidth" required>
					<el-input v-model="examine.form.applyExamineContent"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="examine.dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="examineApply('examineForm')">确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {
		applyUrl
	} from '../../../common/api.js'
	import {
		user
	} from '../../../common/constants.js'
	export default {
		name: 'ApplyView',
		data() {
			return {
				userType: localStorage.getItem(user.type),
				applies: [],
				searchForm: {
					applyDate: null
				},
				addType: 1, //1：新增;2：编辑
				add: {
					dialogFormVisible: false,
					dialogFormTitle: '新增申请',
					form: {
						id: 0,
						applyDate: null,
						applyDay: 1,
						reason: ''
					}
				},
				examine: {
					dialogFormVisible: false,
					dialogFormTitle: '审核申请',
					form: {
						id: 0,
						applyExamineTeacher: localStorage.getItem(user.id),
						applyStudentNumber: '',
						applyStudentName: '',
						applyDate: null,
						applyDay: 1,
						reason: '',
						status: '',
						applyExamineContent: ''
					}
				},
				formLabelWidth: '120px'

			}
		},
		watch: {
			addType: function(newValue) {
				this.add.dialogFormTitle = newValue == 1 ? '新增申请' : '编辑申请';
			}
		},
		mounted() {
			this.initApplyList();
		},
		methods: {
			initApplyList() {
				this.axios.get(this.userType == 1 ? applyUrl.listByStudent + localStorage.getItem(user.id) : applyUrl
						.list, {
							params: this.searchForm
						})
					.then(r => {
						if (r.status) {
							this.applies = r.data
						} else {
							alert('未获取到数据')
						}
					})
					.catch(error => {
						alert('网络异常')
						console.log(error);
					});

			},
			addApply(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.axios.post(this.addType == 1 ? applyUrl.addApply + localStorage.getItem(user.id) :
								applyUrl.updateApplyByStudent, this.add.form)
							.then(r => {
								if (r.status) {
									this.$alert(r.message, '提示', {
										confirmButtonText: '确定',
										callback: action => {
											console.log(action);
											this.$message({
												message: r.message,
												type: 'success'
											});

											this.add.dialogFormVisible = false;
											this.initApplyList();
										}
									});
								} else {
									this.$alert(r.message, '提示', {
										confirmButtonText: '确定',
										callback: action => {
											console.log(action);
											this.$message.error(r.message);
										}
									});
								}
							})
							.catch(error => {
								alert('网络异常')
								console.log(error);
							});
					} else {
						console.log('请先完成表单要求的内容');
						return false;
					}
				});
			},
			deleteApply(id) {
				this.$confirm('此操作将永久删除该申请, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.delete(applyUrl.deleteApplyById + id)
						.then(r => {
							if (r.status) {
								this.$message({
									type: 'success',
									message: '删除成功!'
								});
								this.initApplyList();
							} else {
								this.$message({
									type: 'info',
									message: '删除失败!'
								});
							}
						})
						.catch(error => {
							alert('网络异常')
							console.log(error);
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			submitApply(to_status, id) {
				//TODO 自行添加确认框进行提示
				this.axios.put(applyUrl.submitApplyByStudent + to_status + '/' + id)
					.then(r => {
						if (r.status) {
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.initApplyList();
						} else {
							this.$message({
								type: 'info',
								message: '提交失败!'
							});
						}
					})
					.catch(error => {
						alert('网络异常')
						console.log(error);
					});
			},
			showExamine(row) {
				this.examine.dialogFormVisible = true;
				this.examine.form.id = row.id;
				this.examine.form.applyStudentNumber = row.applyStudentNumber;
				this.examine.form.applyStudentName = row.applyStudentName;
				this.examine.form.applyDate = row.applyDate;
				this.examine.form.reason = row.reason;
			},
			examineApply(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.axios.put(applyUrl.examineApplyByTeacher, this.examine
								.form)
							.then(r => {
								if (r.status) {
									this.$alert(r.message, '提示', {
										confirmButtonText: '确定',
										callback: action => {
											console.log(action);
											this.$message({
												message: r.message,
												type: 'success'
											});

											this.examine.dialogFormVisible = false;
											this.initApplyList();
										}
									});
								} else {
									this.$alert(r.message, '提示', {
										confirmButtonText: '确定',
										callback: action => {
											console.log(action);
											this.$message.error(r.message);
										}
									});
								}
							})
							.catch(error => {
								alert('网络异常')
								console.log(error);
							});
					} else {
						console.log('请先完成表单要求的内容');
						return false;
					}
				});
			}
		}

	}
</script>

<style>
	.form_select_status {
		width: 100%;
	}
</style>