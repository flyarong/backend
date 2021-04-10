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
          <Cell :width="6">
            <FormItem label="存储额度(MB)" prop="storage_size">
              <input type="text" v-model="form.storage_size" placeholder="包括视频，图片等等，单位：MB" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="视频流量额度(MB)" prop="vod_flow_size">
              <input type="text" v-model="form.vod_flow_size" placeholder="视频流量额度，单位：MB" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="视频转码时长(分钟)" prop="transcode_seconds">
              <input type="text" v-model="form.transcode_seconds" placeholder="视频转码时长，单位：分钟" />
            </FormItem>
          </Cell>
          <Cell :width="6">
            <FormItem label="直播流量额度(MB)" prop="live_flow_size">
              <input type="text" v-model="form.live_flow_size" placeholder="直播流量额度，单位：MB" />
            </FormItem>
          </Cell>
        </Row>

        <Row :space="10">
          <Cell :width="8">
            <FormItem prop="func" label="开通功能">
              <Select v-model="form.func" :datas="func" keyName="key" titleName="name" :multiple="true"></Select>
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
        vod_service: 'tencent',
        live_service: 'tencent',
        func: [],
        storage_size: null,
        vod_flow_size: null,
        transcode_seconds: null,
        live_flow_size: null
      },
      rules: {
        required: ['name', 'desc', 'email', 'password', 'storage_size', 'vod_flow_size', 'transcode_seconds', 'live_flow_size']
      },
      func: []
    };
  },
  mounted() {
    R.Extentions.Platform.Company.Create().then(resp => {
      this.func = resp.data.func;
    });
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
