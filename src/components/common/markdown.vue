<template>
  <div>
    <mavon-editor
      :box-shadow="false"
      :transitio="false"
      placeholder=""
      :autofocus="false"
      :toolbars="config.toolbars"
      :value="text"
      ref="md"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
      @change="valChange"
    ></mavon-editor>
  </div>
</template>
<script>
export default {
  props: ['text'],
  data() {
    return {
      config: {
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true // 右对齐
        }
      }
    };
  },
  methods: {
    valChange(value, renderValue) {
      this.$emit('textChange', value, renderValue);
    },
    imgAdd(pos, $file) {
      var xhr;

      xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('POST', '/backend/api/v1/upload/image/tinymce');
      xhr.setRequestHeader('Authorization', 'Bearer ' + Utils.getLocal('token'));

      xhr.onload = () => {
        var json = JSON.parse(xhr.responseText);

        if (xhr.status !== 200) {
          HeyUI.$Message.warn('HTTP Error: ' + xhr.status);
          return;
        }

        this.$refs.md.$img2Url(pos, json.location);
      };

      var formdata = new FormData();
      formdata.append('file', $file);
      xhr.send(formdata);
    },
    imgDel(filename) {
      console.log(filename);
    }
  }
};
</script>
