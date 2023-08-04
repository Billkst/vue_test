<!-- 作为后台管理系统主体结构体进行构建，后续的相关菜单展示均在主体结构中添加菜单项及正文内容 -->
<template>
    <el-container class="background">
        <!-- 左侧菜单栏 -->
        <el-aside width="200px" class="tac">
            <el-menu router class="el-menu-vertical" default-active="1">
                <el-menu-item v-for="menu in menuList" :key="menu.path" :index="menu.path">

                    <i :class="menu.icon"></i>
                    <span slot="title">{{ menu.menuNameC }}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-container>
            <!-- 右侧顶部 Header -->
            <el-header style="text-align: right; font-size: 12px">
                <el-row>
                    <el-col :span="22" class="span_title">欢迎来到后台管理系统</el-col>
                    <el-col :span="1"><span>{{ user_name }}</span></el-col>
                    <el-col :span="1"><el-button type="info" class="btn_logout" @click="logout()">注销 </el-button></el-col>
                </el-row>
            </el-header>

            <!-- 右侧下方正文部分 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>

import {
    menu,
    user
} from '../../common/constants.js'
import {
    userUrl
} from '../../common/api.js'
export default {
    name: 'BackgroundView',
    data() {
        return {
            menuList: [],
            user_name: ""
        }
    },
    mounted() {
        var menuList = localStorage.getItem(menu.list)
        console.log(menuList)
        if (menuList != null) {
            this.menuList = JSON.parse(menuList)
        }

        this.user_name = localStorage.getItem(user.username)
    },
    methods: {
        logout() {
            this.axios.get(userUrl.logout)
                .then(r => {
                    if (r.status) {
                        this.$message({
                            message: '注销成功！',
                            type: 'success'
                        });

                        localStorage.clear()
                        this.$router.push('/')
                    }
                })
                .catch(error => {
                    // 处理错误情况
                    alert('网络异常')
                    console.log(error);
                });
        }
    }
}
</script>

<style>
.tac {
    background-color: #eaecee;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-col.span_title {
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
}


.el-col.span_name {
    font-weight: bold;
    text-align: center;
    font-size: 1rem;
}

.btn_logout {
    font-size: 1rem;
    float: right;
    margin-top: 10px;
    border: none;
    background-color: #00000000;
    color: red;
}

.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 780px;
    /* line-height: 650px; */
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>