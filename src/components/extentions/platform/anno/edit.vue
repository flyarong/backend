<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">编辑</span>
      <div class="h-panel-right">
        <Button color="primary" @click="create">保存</Button>
        <Button @click="$emit('close')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <Form mode="block" ref="form" :validOnChange="true" :showErrorTip="true" :rules="rules" :model="form">
        <Row :space="10">
          <Cell :width="24">
            <FormItem label="标题" prop="title">
              <input type="text" v-model="form.title" placeholder="标题" />
            </FormItem>
          </Cell>
          <Cell :width="24">
            <FormItem label="内容" prop="content">
              <tinymce-editor v-model="form.content"></tinymce-editor>
            </FormItem>
          </Cell>
        </Row>
      </Form>
    </div>
  </div>
</template>
<script>
import TinymceEditor from '@/components/common/tinymce';

export default {
  props: ['id'],
  components: {
    TinymceEditor
  },
  data() {
    return {
      form: {
        title: '',
        content: ''
      },
      rules: {
        required: ['title', 'content']
      }
    };
  },
  mounted() {
    R.Extentions.Platform.Anno.Edit(this.id).then(resp => {
      this.form = resp.data;
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
