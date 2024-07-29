"use strict";

var _vueEsm = _interopRequireDefault(require("vue/dist/vue.esm.browser"));
var _index = require("./compiler/index");
var _directive = _interopRequireDefault(require("./demo/directive"));
var _App = _interopRequireDefault(require("./App"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var _compileToFunctions = (0, _index.compileToFunctions)(_directive["default"]),
  render = _compileToFunctions.render,
  staticRenderFns = _compileToFunctions.staticRenderFns;
new _vueEsm["default"]({
  // template,
  render: function render(h) {
    return h(_App["default"]);
  },
  staticRenderFns: staticRenderFns,
  data: function data() {
    return {
      // name:"吴家宝",
      // key:"style",
      // color:'red',
      // fontSize:"28px",
      // colors:['red','green','blue'],
      // visible:true,
      // visible1:false,
      // visible2:false,
      // url:"https://marketplace.canva.cn/NsFNI/MADwRLNsFNI/1/thumbnail_large/canva-MADwRLNsFNI.jpg",
      // dynamicKey:"src",
      // list:['🍎','🌰','🍌'],
      // fruits:['苹果','香蕉'],
      // fruit:"苹果",
      // selectValue:2
    };
  },
  methods: {
    handleClick: function handleClick(event) {
      console.log("点击", event);
    }
  }
}).$mount(document.getElementById('container'));