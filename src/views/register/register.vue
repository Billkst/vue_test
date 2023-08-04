<template>
    <el-row class="register" :gutter="20">
        <div class="background">
            <img :src="imgSrc" alt="背景图" width="100%" height="100%" />
        </div>

        <el-col :span="8" :offset="8">
            <div class="grid-content">
                <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px" class="form_login">
                    <h3>新用户注册</h3>
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="registerForm.account"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="registerForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="username">
                        <el-input v-model="registerForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-select v-model="registerForm.gender" placeholder="请选择性别">
                            <el-option v-for="item in genderList" :key="item.code" :label="item.name"
                                :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input type="tel" v-model="registerForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input type="email" v-model="registerForm.email"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="register('registerForm')" class="form_register_btn">注册</el-button>
                    <el-button @click="toLogin()" class="form_login_btn">登录</el-button>
                </el-form>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import {
    dictionaryUrl,
    userUrl
} from "../../common/api.js"
export default {
    name: "RegisterView",
    components: {},
    data() {
        var validateAccountByRegister = (rule, value, callback) => {
            this.axios.get(userUrl.validateAccountByRegister + value)
                .then(response => {
                    // 处理成功情况
                    if (response.status) {
                        callback();
                    } else {
                        callback(new Error(response.message))
                    }
                    console.log(response);
                })
                .catch(error => {
                    console.error(error)
                    callback(new Error("网络异常，无法检测账号的有效性"))
                });
        };
        return {
            imgSrc: require("../../assets/loginbg.jpg"),
            genderList: [],
            registerForm: {
                account: '',
                password: '',
                name: '',
                gender: 0,
                phone: '',
                email: ''
            },
            rules: {
                account: [
                    {
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    },
                    {
                        validator: validateAccountByRegister,
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 4,
                        max: 20,
                        message: '请输入4到20位之间的密码',
                        trigger: 'blur'
                    }
                ],
                username: [{
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                },
                {
                    pattern: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
                    message: '手机号格式不正确',
                    trigger: 'blur'
                }
                ],
                email: [{
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                },
                {
                    pattern: /^\w+@(\w+\.){1,3}[a-zA-Z]{2,3}$/,
                    message: '邮箱格式不正确',
                    trigger: 'blur'
                }
                ],
            }
        }
    },
    mounted() {
        //在项目交互之前进行部分数据准备工作
        this.initGenderList();
    },
    methods: {
        //性别数据初始化函数
        initGenderList() {
            this.axios.get(dictionaryUrl.genderList)
                .then(response => {
                    // 处理成功情况
                    if (response.status) {
                        this.genderList = response.data
                    } else {
                        alert('网络异常，未获取到性别字典数据')
                    }
                })
                .catch(error => {
                    // 处理错误情况
                    alert('网络异常，未获取到性别字典数据')
                    console.log(error);
                });

        },
        register(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axios.post(userUrl.register, this.registerForm)
                        .then(response => {
                            // 处理成功情况
                            if (response.status) {
                                //注册成功
                                this.$alert('注册成功，可以去登录了！', '注册成功提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        console.log(action);
                                        this.$message({
                                            message: '注册成功，可以去登录了！',
                                            type: 'success'
                                        });

                                        this.$router.push("/")
                                    }
                                });
                            } else {
                                //注册失败
                                this.$alert(response.message, '注册失败提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        console.log(action);
                                        this.$message.error(response.message);
                                    }
                                });
                            }
                        })
                        .catch(error => {
                            // 处理错误情况
                            alert('网络异常，未获取到性别字典数据')
                            console.log(error);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        toLogin() {
            this.$router.push({
                path: '/'
            })
        }

    }
}
</script>

<style>
.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.bg-purple {
    background: #d3dce6;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
    margin-top: 30% !important;
}

.background {
    width: 100%;
    z-index: -1;
    position: absolute !important;
}

.form_login {
    width: 90%;
    padding: 20px;
    text-align: center;
    margin-top: 100px;
    background-color: #fefefe;
}

.form_register_btn {
    margin-right: 20px;
    height: 40px;
    width: 100px;
}

.form_login_btn {
    height: 2.5rem;
    width: 6rem;
}
</style>
