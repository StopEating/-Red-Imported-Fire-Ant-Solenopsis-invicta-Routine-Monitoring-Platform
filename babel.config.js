module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  
'env': {
  'development': {
    "sourceMaps": true, // 关键是这两行
    "retainLines": true, // 关键是这两行
  }
}

}
