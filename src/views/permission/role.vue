<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-button type="primary" @click="handleAddRole()">新增角色</el-button>
      </el-col>

      <el-col :span="8">
        <el-input v-model="searchText" placeholder="角色搜索" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search" />
        </el-input>
      </el-col>
    </el-row>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色" width="220">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="说明">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="listQuery.type"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改':'新增'">
      <el-form ref="roleForm" :key="role" :model="role" label-width="80px" :rules="confirmRules" label-position="left">
        <el-form-item label="角色" prop="role">
          <el-input v-model="role.role" placeholder="角色" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="说明"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole('roleForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as roleApi from '../../api/roleApi'
import { deepClone } from '@/utils'
import Pagination from '../../components/Pagination'

const defaultRole = {
  role: '',
  name: '',
  description: '',
  routes: []
}

export default {
  components: { Pagination },
  data() {
    var validate = (rule, value, callback) => {
      debugger
      if (value === '') {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      role: Object.assign({}, defaultRole),
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',

      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        type: [10, 15, 20, 25, 30]
      },
      confirmRules: {
        role: [{ validator: validate, trigger: 'blur' }],
        name: [{ validator: validate, trigger: 'blur' }]
      },
      searchText: '',
      searchValue: ''
    }
  },

  created() {
    this.getList()
  },
  methods: {
    search() {
      debugger
      this.searchValue = this.searchText.valueOf()
      this.listQuery.page = 1
      this.getList()
    },
    async getList() {
      await roleApi.pageQuery(this.listQuery.page, this.listQuery.limit, this.searchValue).then((res) => {
        this.rolesList = res.data
        this.total = res.total
      })
    },
    deleteRole(id) {
      roleApi.deleteRoleById(id).then((res) => {
        debugger
        if (this.rolesList.length === 1 && this.listQuery.page > 1) {
          this.listQuery.page -= 1
        }
        this.getList()
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('是否删除此角色?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await this.deleteRole(row.id)
        })
        .catch(err => {
          console.error(err)
        })
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    handleEdit(row) {
      this.role = deepClone(row)
      this.dialogType = 'edit'
      this.dialogVisible = true
    },

    confirmRole(formName) {
      debugger
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          const { description, role, name } = this.role
          if (isEdit) {
            roleApi.update(this.role).then((res) => {
              if (res.code === 200) {
                this.getList()
                this.dialogVisible = false
                this.$notify({
                  title: '修改成功',
                  dangerouslyUseHTMLString: true,
                  message: `
            <div>Role: ${role}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
                  type: 'success'
                })
              }
            })
          } else {
            roleApi.add(this.role).then((res) => {
              if (res.code === 200) {
                // 跳转到最后一页
                debugger
                this.listQuery.page = Math.ceil((this.total + 1) / this.listQuery.limit) // 向上取整
                this.getList()
                this.dialogVisible = false
                this.$notify({
                  title: '新增成功',
                  dangerouslyUseHTMLString: true,
                  message: `
            <div>Role: ${role}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
                  type: 'success'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '新增失败!'
                })
              }
            })
          }
        } else {
          debugger
          this.$message({
            type: 'error',
            message: '请补全账号密码信息！'
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }

    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
