<template>
    <el-row class="login" :gutter="20">
        <div class="background">
            <img :src="imgSrc" alt="背景图" width="100%" height="100%" />
        </div>

        <el-col :span="8" :offset="8">
            <div class="grid-content">
                <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="form_login">
                    <h3>欢迎登录虚拟仿真实训教学管理及资源共享云平台管理系统</h3>
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="loginForm.account"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="loginForm.password"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="login('loginForm')" class="form_login_btn">登录</el-button>
                    <el-button @click="toRegister()" class="form_login_btn">注册</el-button>
                </el-form>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import {
    userUrl
} from "../../common/api.js"
import {
    user,
    menu
} from "../../common/constants.js"
export default {
    name: "LoginView",
    components: {},
    data() {
        var validateAccountByLogin = (rule, value, callback) => {
            this.axios.get(userUrl.validateAccountByLogin + value)
                .then(response => {
                    // 处理成功情况
                    if (response.status) {
                        callback();
                    } else {
                        callback(new Error(response.message))
                    }
                })
                .catch(error => {
                    console.error(error)
                    callback(new Error("网络异常，无法检测账号的有效性"))
                });
        };
        return {
            imgSrc: require("../../assets/loginbg.jpg"),
            loginForm: {
                account: '',
                password: ''
            },
            rules: {
                account: [
                    {
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    },
                    {
                        validator: validateAccountByLogin,
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
                ]
            }
        }
    },
    methods: {
        login(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axios.post(userUrl.login, this.loginForm)
                        .then(response => {
                            // 处理成功情况
                            if (response.status) {
                                //登录成功
                                this.$alert('登录成功！', '登录成功提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        console.log(action);
                                        this.$message({
                                            message: '登录成功！',
                                            type: 'success'
                                        });

                                        localStorage.setItem(user.id, response.data.user.userId)
                                        localStorage.setItem(user.username, response.data.user.username)
                                        localStorage.setItem(user.token, response.data.token)

                                        localStorage.setItem(menu.list, JSON.stringify(response.data.menus))

                                        //TODO 登录成功后，去往后台首页
                                        //this.$router.push("/home")

                                        //动态添加路由，并切换渲染
                                        response.data.menus.forEach(
                                            (item) => {
                                                if (item.path != null && item.view !=
                                                    null) {
                                                    const menu = {
                                                        path: item.path,
                                                        name: item.menuNameE,
                                                        component: () => import(
                                                            '../../views/background/' +
                                                            item.view
                                                        )
                                                    }
                                                    this.$router.addRoute('background', menu)
                                                }
                                            }
                                        )
                                        this.$router.push('/home')
                                    }
                                });

                                //Vue 中建议数据存储与于 Vuex 组件
                                //此处直接放置在 LocalStorage 中
                            } else {
                                //登录失败
                                this.$alert(response.message, '登录失败提示', {
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
        toRegister() {
            this.$router.push({
                path: '/register'
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
    margin-top: 50% !important;
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

.form_login_btn {
    margin-right: 20px;
    height: 40px;
    width: 100px;
}
</style>
