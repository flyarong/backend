<template>
  <div class="h-panel w-1000">
    <div class="h-panel-bar">
      <span class="h-panel-title">添加机构</span>
      <div class="h-panel-right">
        <Button color="primary" @click="create">添加</Button>
        <Button @click="$emit('close')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <Form mode="block" ref="form" :validOnChange="true" :showErrorTip="true" :rules="rules" :model="form">
        <Row :space="10">
          <Cell :width="24">
            <FormItem label="机构名" prop="name">
              <input type="text" v-model="form.name" placeholder="请输入机构名" />
            </FormItem>
          </Cell>
          <Cell :width="24">
            <FormItem label="机构简介" prop="desc">
              <textarea v-model="form.desc" placeholder="请输入简介"></textarea>
            </FormItem>
          </Cell>
        </Row>

        <Row :space="10">
          <Cell :width="8">
            <FormItem label="管理员邮箱" prop="email">
              <input type="text" v-model="form.email" placeholder="请输入邮箱，用于管理员登录" />
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem label="管理员密码" prop="password">
              <input type="text" v-model="form.password" placeholder="请输入管理员密码" />
            </FormItem>
          </Cell>
        </Row>

        <Row :space="10">
          <Cell :width="8">
            <FormItem prop="vod_service" label="点播服务">
              <Select v-model="form.vod_service" :datas="options.vodServices" :filterable="true" keyName="value" titleName="name"></Select>
            </FormItem>
          </Cell>
          <Cell :width="8">
            <FormItem prop="live_service" label="直播服务">
              <Select v-model="form.live_service" :datas="options.liveServices" :filterable="true" keyName="value" titleName="name"></Select>
            </FormItem>
          </Cell>
        </Row>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: '',
        desc: '',
        email: '',
        password: '',
        vod_service: '',
        live_service: ''
      },
      options: {
        vodServices: [
          {
            name: '阿里云',
            value: 'aliyun'
          },
          {
            name: '腾讯云',
            value: 'tencent'
          }
        ],
        liveServices: [
          {
            name: '阿里云',
            value: 'aliyun'
          },
          {
            name: '腾讯云',
            value: 'tencent'
          }
        ]
      },
      rules: {
        required: ['name', 'desc', 'email', 'password', 'vod_service', 'live_service']
      }
    };
  },
  methods: {
    create() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$emit('success', this.form);
      }
    }
  }
};
</script>
