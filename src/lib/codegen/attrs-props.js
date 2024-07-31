"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genProps = genProps;
function genProps(props) {
  var staticProps = "";
  var dynamicProps = "";
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    var value = prop.value;
    if (prop.dynamic) {
      dynamicProps += "".concat(prop.name, ",").concat(value, ",");
    } else {
      staticProps += "\"".concat(prop.name, "\":").concat(prop.value, ",");
    }
  }
  staticProps = "{".concat(staticProps.slice(0, -1), "}");
  if (dynamicProps) {
    return "_d(".concat(staticProps, ",[").concat(dynamicProps.slice(0, -1), "])");
  } else {
    return staticProps;
  }
}